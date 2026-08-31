import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { buildDailyEmail } from '../data/dailyEmail'
import { ProblemCard } from '../components/ProblemCard'
import { useStore } from '../store'

export function EmailPage() {
  const { progress, setStatus } = useStore()
  const digest = useMemo(() => buildDailyEmail(new Date()), [])

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>Daily question email</h2>
          <p>
            One NeetCode 250 problem lands in your inbox each day, with topic hints — pattern, Python tools, and a
            nudge — not the solution.
          </p>
        </div>
      </div>

      <div className="email-layout">
        <div className="panel email-today">
          <p className="email-kicker">Today · {digest.dateKey} (UTC)</p>
          <ProblemCard
            problem={digest.problem}
            status={progress.statuses[digest.problem.id]}
            onAttempt={() => setStatus(digest.problem.id, 'attempted')}
            onSolve={() => setStatus(digest.problem.id, 'solved')}
          />
          <div className="hint-block">
            <h3>Topic hints</h3>
            <p>
              <strong>Pattern.</strong> {digest.hints.pattern}
            </p>
            <p>{digest.hints.summary}</p>
            <div className="concept-row">
              {digest.hints.concepts.map((concept) => (
                <span key={concept} className="concept">
                  {concept}
                </span>
              ))}
            </div>
            <p className="tip">
              <strong>Hint.</strong> {digest.hints.tip}
            </p>
          </div>
          <p className="email-subject">
            Subject line: <code>{digest.subject}</code>
          </p>
        </div>

        <aside className="panel email-setup">
          <h3>How sending works</h3>
          <p>
            A GitHub Action runs daily at 12:00 UTC and emails today&apos;s question. Preview locally anytime:
          </p>
          <pre className="code-block">{`npm run email:preview
npm run email:send`}</pre>
          <p>Configure secrets on the repo (or a local <code>.env</code>):</p>
          <ul className="setup-list">
            <li>
              <code>DAILY_EMAIL_TO</code> — recipient(s), comma-separated
            </li>
            <li>
              <code>DAILY_EMAIL_FROM</code> — from address
            </li>
            <li>
              <code>RESEND_API_KEY</code> — or SMTP host / user / password
            </li>
          </ul>
          <p>
            Manual send: Actions → Daily question email → Run workflow. See the README for the full list of
            variables.
          </p>
          <Link className="btn btn-ghost btn-sm" to="/" style={{ width: 'fit-content' }}>
            Back to today&apos;s check-in
          </Link>
        </aside>
      </div>
    </section>
  )
}
