import { problems } from './problems'
import { lessonForCategory } from './pythonLessons'
import type { Problem, PythonLesson } from '../types'

export interface TopicHints {
  category: string
  pattern: string
  summary: string
  concepts: string[]
  tip: string
}

export interface DailyEmailDigest {
  dateKey: string
  problem: Problem
  lesson: PythonLesson | undefined
  hints: TopicHints
  subject: string
  preheader: string
  html: string
  text: string
}

const MS_PER_DAY = 86_400_000

/** UTC YYYY-MM-DD so the cron and the app agree on "today". */
export function utcDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function parseUtcDateKey(dateKey: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey)
  if (!match) {
    throw new Error(`Invalid date key: ${dateKey}`)
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  return new Date(Date.UTC(year, month - 1, day))
}

/** One NeetCode 250 problem per UTC day, cycling through the list. */
export function getDailyEmailProblem(date = new Date()): Problem {
  const key = utcDateKey(date)
  const day = parseUtcDateKey(key)
  const epochDay = Math.floor(day.getTime() / MS_PER_DAY)
  const index = ((epochDay % problems.length) + problems.length) % problems.length
  return problems[index]
}

export function topicHintsFor(problem: Problem): TopicHints {
  const lesson = lessonForCategory(problem.category)
  return {
    category: problem.category,
    pattern: lesson?.title ?? `${problem.category} patterns`,
    summary: lesson?.summary ?? `Practice the core ${problem.category} techniques on this problem.`,
    concepts: lesson?.concepts ?? [problem.category],
    tip: lesson?.tip ?? 'Name the pattern before you code — the data structure usually follows.',
  }
}

export function buildDailyEmail(date = new Date()): DailyEmailDigest {
  const dateKey = utcDateKey(date)
  const problem = getDailyEmailProblem(date)
  const lesson = lessonForCategory(problem.category)
  const hints = topicHintsFor(problem)
  const subject = `NeetDaily · ${problem.name}`
  const preheader = `${problem.difficulty} · ${problem.category} · ${hints.pattern}`
  return {
    dateKey,
    problem,
    lesson,
    hints,
    subject,
    preheader,
    html: renderEmailHtml({ dateKey, problem, hints, subject, preheader }),
    text: renderEmailText({ dateKey, problem, hints }),
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function formatDisplayDate(dateKey: string): string {
  return parseUtcDateKey(dateKey).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function renderEmailHtml(input: {
  dateKey: string
  problem: Problem
  hints: TopicHints
  subject: string
  preheader: string
}): string {
  const { dateKey, problem, hints, preheader } = input
  const name = escapeHtml(problem.name)
  const category = escapeHtml(problem.category)
  const difficulty = escapeHtml(problem.difficulty)
  const pattern = escapeHtml(hints.pattern)
  const summary = escapeHtml(hints.summary)
  const tip = escapeHtml(hints.tip)
  const concepts = hints.concepts.map((c) => escapeHtml(c)).join(' · ')
  const when = escapeHtml(formatDisplayDate(dateKey))
  const diffColor = problem.difficulty === 'Easy' ? '#5ee4a8' : problem.difficulty === 'Medium' ? '#f2c14e' : '#e07a5f'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(input.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#071a17;color:#e8dcc8;font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#071a17;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding:8px 4px 20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#5ee4a8;">
              NeetDaily
            </td>
          </tr>
          <tr>
            <td style="padding:28px;border:1px solid rgba(232,220,200,0.18);border-radius:16px;background:#0c2f2a;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#f2c14e;">
                Today&rsquo;s question · ${when}
              </p>
              <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#f4ede0;">${name}</h1>
              <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#e8dcc8;">
                <span style="display:inline-block;padding:3px 8px;border-radius:999px;background:${diffColor};color:#071a17;font-weight:700;font-size:11px;letter-spacing:0.04em;text-transform:uppercase;">${difficulty}</span>
                &nbsp;${category}
              </p>
              <h2 style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#5ee4a8;">
                Topic hints
              </h2>
              <p style="margin:0 0 8px;font-size:16px;line-height:1.45;">
                <strong>Pattern:</strong> ${pattern}
              </p>
              <p style="margin:0 0 8px;font-size:15px;line-height:1.55;color:#e8dcc8;">${summary}</p>
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#f2c14e;">
                <strong>Python tools:</strong> ${concepts}
              </p>
              <p style="margin:0 0 22px;padding:10px 0 0 12px;border-left:3px solid #5ee4a8;font-size:15px;line-height:1.55;color:#e8dcc8;">
                <strong>Hint:</strong> ${tip}
              </p>
              <p style="margin:0;">
                <a href="${escapeHtml(problem.leetcodeUrl)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;border-radius:999px;background:#5ee4a8;color:#071a17;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:14px;">Open on LeetCode</a>
                <a href="${escapeHtml(problem.neetcodeUrl)}" style="display:inline-block;margin:0 0 8px;padding:10px 16px;border-radius:999px;border:1px solid rgba(232,220,200,0.35);color:#e8dcc8;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:14px;">Watch on NeetCode</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:rgba(232,220,200,0.68);">
              One NeetCode 250 question a day. No solution in this email — just the prompt and a topic nudge.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function renderEmailText(input: { dateKey: string; problem: Problem; hints: TopicHints }): string {
  const { dateKey, problem, hints } = input
  return [
    `NeetDaily — ${formatDisplayDate(dateKey)}`,
    '',
    `Today's question: ${problem.name}`,
    `Difficulty: ${problem.difficulty}`,
    `Topic: ${problem.category}`,
    '',
    'Topic hints',
    `Pattern: ${hints.pattern}`,
    hints.summary,
    `Python tools: ${hints.concepts.join(', ')}`,
    `Hint: ${hints.tip}`,
    '',
    `LeetCode: ${problem.leetcodeUrl}`,
    `NeetCode: ${problem.neetcodeUrl}`,
    '',
    'One question a day. No solution included.',
  ].join('\n')
}
