import { Link } from 'react-router-dom'
import { getDailyProblems, TOTAL_PROBLEMS, todayKey } from '../data/problems'
import { buildDailyEmail } from '../data/dailyEmail'
import { useStore } from '../store'
import { ProblemCard } from '../components/ProblemCard'
import { HeroArt } from '../components/HeroArt'
import { useMemo } from 'react'

export function DailyPage() {
  const { solvedIds, progress, checkedInToday, checkIn, markDailySolved, setStatus, stats } = useStore()

  const daily = useMemo(() => getDailyProblems(new Date(), solvedIds), [solvedIds])
  const emailed = useMemo(() => buildDailyEmail(new Date()), [])
  const todayDone = progress.dailyCompleted[todayKey()] ?? []

  const allDailySolved = daily.every((p) => solvedIds.has(p.id) || todayDone.includes(p.id))

  return (
    <>
      <section className="hero">
        <HeroArt />
        <p className="sr-only">NeetDaily</p>
        <h1 className="hero-brand">NeetDaily</h1>
        <p className="hero-headline">One check-in. Two NeetCode 250 problems. Steady Python intuition.</p>
        <p className="hero-sub">
          Pull from the full NeetCode 250 list, practice in Python, and keep notes beside every question you review.
        </p>
        <div className="hero-actions">
          {!checkedInToday ? (
            <button type="button" className="btn btn-primary" onClick={() => checkIn(daily.map((p) => p.id))}>
              Start today&apos;s check-in
            </button>
          ) : (
            <span className="btn btn-primary" style={{ cursor: 'default', opacity: allDailySolved ? 0.85 : 1 }}>
              {allDailySolved ? 'Check-in complete' : 'Checked in — keep solving'}
            </span>
          )}
          <Link className="btn btn-ghost" to="/learn">
            Learn Python patterns
          </Link>
          <Link className="btn btn-ghost" to="/email">
            Daily email
          </Link>
          <span className="streak-pill">
            Streak <strong>{progress.streak}</strong> day{progress.streak === 1 ? '' : 's'}
          </span>
        </div>
        <div className="stats-strip">
          <div>
            <strong>
              {stats.solved}/{TOTAL_PROBLEMS}
            </strong>
            solved
          </div>
          <div>
            <strong>{stats.attempted}</strong>
            attempted
          </div>
          <div>
            <strong>{progress.checkIns.length}</strong>
            check-ins
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Today&apos;s practice</h2>
            <p>Focused picks from NeetCode 250. Same category when possible so patterns stick.</p>
          </div>
        </div>
        <div className="email-callout panel">
          <div>
            <p className="email-kicker">In today&apos;s email</p>
            <h3>
              <Link to="/email">{emailed.problem.name}</Link>
            </h3>
            <p>
              {emailed.problem.difficulty} · {emailed.hints.pattern}. {emailed.hints.concepts.slice(0, 3).join(', ')}.
            </p>
          </div>
          <Link className="btn btn-ghost btn-sm" to="/email">
            Topic hints
          </Link>
        </div>

        <div className="daily-grid">
          {daily.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              status={progress.statuses[problem.id]}
              onAttempt={() => setStatus(problem.id, 'attempted')}
              onSolve={() => markDailySolved(problem.id)}
            />
          ))}
        </div>
      </section>
    </>
  )
}
