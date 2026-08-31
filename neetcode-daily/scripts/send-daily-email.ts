import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { buildDailyEmail, parseUtcDateKey } from '../src/data/dailyEmail.ts'

/** Load `.env` from cwd if present. Existing env vars (CI secrets) win. */
function loadLocalEnv(): void {
  const envPath = resolve(process.cwd(), '.env')
  if (!existsSync(envPath)) return
  process.loadEnvFile(envPath)
}

interface CliOptions {
  preview: boolean
  date?: Date
  out?: string
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { preview: false }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = argv[i + 1]
    if (arg === '--preview') options.preview = true
    else if (arg.startsWith('--date=')) options.date = parseUtcDateKey(arg.slice('--date='.length))
    else if (arg === '--date' && next) {
      options.date = parseUtcDateKey(next)
      i += 1
    } else if (arg.startsWith('--out=')) options.out = arg.slice('--out='.length)
    else if (arg === '--out' && next) {
      options.out = next
      i += 1
    }
  }
  return options
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Missing required env var ${name}`)
  }
  return value
}

function recipientList(raw: string): string[] {
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

async function sendWithResend(input: {
  from: string
  to: string[]
  subject: string
  html: string
  text: string
  apiKey: string
}): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Resend failed (${response.status}): ${body}`)
  }
}

async function sendWithSmtp(input: {
  from: string
  to: string[]
  subject: string
  html: string
  text: string
}): Promise<void> {
  const nodemailer = await import('nodemailer')
  const port = Number(process.env.SMTP_PORT || '587')
  const transporter = nodemailer.createTransport({
    host: requiredEnv('SMTP_HOST'),
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  })
  await transporter.sendMail({
    from: input.from,
    to: input.to.join(', '),
    subject: input.subject,
    html: input.html,
    text: input.text,
  })
}

async function main(): Promise<void> {
  loadLocalEnv()
  const options = parseArgs(process.argv.slice(2))
  const digest = buildDailyEmail(options.date)

  if (options.preview) {
    const out = options.out ?? 'daily-email-preview.html'
    await writeFile(out, digest.html, 'utf8')
    console.log(`Preview subject: ${digest.subject}`)
    console.log(`Question: ${digest.problem.name} (${digest.problem.difficulty} · ${digest.problem.category})`)
    console.log(`Wrote ${out}`)
    return
  }

  const toRaw = process.env.DAILY_EMAIL_TO?.trim()
  if (!toRaw) {
    if (process.env.GITHUB_ACTIONS === 'true') {
      console.log('DAILY_EMAIL_TO is not set; skipping send.')
      return
    }
    throw new Error('DAILY_EMAIL_TO is required to send (comma-separated addresses).')
  }

  const to = recipientList(toRaw)
  const from = requiredEnv('DAILY_EMAIL_FROM')
  const payload = {
    from,
    to,
    subject: digest.subject,
    html: digest.html,
    text: digest.text,
  }

  if (process.env.RESEND_API_KEY) {
    await sendWithResend({ ...payload, apiKey: process.env.RESEND_API_KEY })
    console.log(`Sent via Resend to ${to.join(', ')}: ${digest.subject}`)
    return
  }

  if (process.env.SMTP_HOST) {
    await sendWithSmtp(payload)
    console.log(`Sent via SMTP to ${to.join(', ')}: ${digest.subject}`)
    return
  }

  throw new Error('Set RESEND_API_KEY or SMTP_HOST to send the daily email.')
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
