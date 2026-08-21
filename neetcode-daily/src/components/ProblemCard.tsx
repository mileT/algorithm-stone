import type { Difficulty, Problem, ProblemStatus } from '../types'
import { Link } from 'react-router-dom'

const diffClass: Record<Difficulty, string> = {
  Easy: 'badge-easy',
  Medium: 'badge-medium',
  Hard: 'badge-hard',
}

interface Props {
  problem: Problem
  status?: ProblemStatus
  onSolve?: () => void
  onAttempt?: () => void
  compact?: boolean
}

export function ProblemCard({ problem, status, onSolve, onAttempt, compact }: Props) {
  return (
    <article className={`problem-row ${status === 'solved' ? 'solved' : ''}`}>
      <div className="problem-meta">
        <span className={`badge ${diffClass[problem.difficulty]}`}>{problem.difficulty}</span>
        <span className="badge badge-cat">{problem.category}</span>
        {status === 'solved' && <span className="badge badge-cat">Solved</span>}
      </div>
      <h3 className="problem-title">
        <Link to={`/problems/${problem.id}`}>{problem.name}</Link>
      </h3>
      {!compact && (
        <div className="problem-actions">
          <a className="btn btn-ghost btn-sm" href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
            LeetCode
          </a>
          <a className="btn btn-ghost btn-sm" href={problem.neetcodeUrl} target="_blank" rel="noreferrer">
            NeetCode
          </a>
          {onAttempt && status !== 'solved' && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onAttempt}>
              Attempted
            </button>
          )}
          {onSolve && status !== 'solved' && (
            <button type="button" className="btn btn-primary btn-sm" onClick={onSolve}>
              Mark solved
            </button>
          )}
          <Link className="btn btn-amber btn-sm" to={`/problems/${problem.id}`}>
            Notes
          </Link>
        </div>
      )}
    </article>
  )
}
