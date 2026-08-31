import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProblemById } from '../data/problems'
import { lessonForCategory } from '../data/pythonLessons'
import { useStore } from '../store'

export function ProblemDetailPage() {
  const { id } = useParams()
  const problemId = Number(id)
  const problem = getProblemById(problemId)
  const { progress, setStatus, markDailySolved, notes, saveNote, deleteNote } = useStore()
  const [draft, setDraft] = useState('')
  const lesson = useMemo(() => (problem ? lessonForCategory(problem.category) : undefined), [problem])

  useEffect(() => {
    setDraft(notes[problemId]?.content ?? '')
  }, [problemId, notes])

  if (!problem) {
    return (
      <section className="section">
        <p className="empty">Problem not found.</p>
        <Link className="btn btn-ghost" to="/problems">
          Back to list
        </Link>
      </section>
    )
  }

  const status = progress.statuses[problem.id] ?? 'todo'

  return (
    <>
      <section className="detail-hero">
        <Link to="/problems" className="btn btn-ghost btn-sm" style={{ width: 'fit-content' }}>
          ← All problems
        </Link>
        <div className="problem-meta">
          <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <span className="badge badge-cat">{problem.category}</span>
          <span className="badge badge-cat">{status}</span>
        </div>
        <h1>{problem.name}</h1>
        <div className="problem-actions">
          <a className="btn btn-primary" href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
            Open on LeetCode
          </a>
          <a className="btn btn-ghost" href={problem.neetcodeUrl} target="_blank" rel="noreferrer">
            NeetCode solution
          </a>
          {status !== 'solved' && (
            <>
              <button type="button" className="btn btn-ghost" onClick={() => setStatus(problem.id, 'attempted')}>
                Mark attempted
              </button>
              <button type="button" className="btn btn-amber" onClick={() => markDailySolved(problem.id)}>
                Mark solved
              </button>
            </>
          )}
        </div>
      </section>

      <section className="section notes-layout">
        <div className="panel" style={{ display: 'grid', gap: '0.85rem' }}>
          <h2 style={{ fontSize: '1.35rem' }}>Your notes</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Capture the approach, edge cases, and Python tricks you want to remember on review.
          </p>
          <textarea
            className="note-editor"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. Used a dict for O(1) lookups. Watch empty input. Reminder: Counter + enumerate…"
            aria-label="Problem notes"
          />
          <div className="problem-actions">
            <button type="button" className="btn btn-primary" onClick={() => saveNote(problem.id, draft)}>
              Save note
            </button>
            {notes[problem.id] && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  deleteNote(problem.id)
                  setDraft('')
                }}
              >
                Clear note
              </button>
            )}
          </div>
        </div>

        {lesson && (
          <div className="lesson">
            <span className="badge badge-cat">Python · {lesson.category}</span>
            <h3>{lesson.title}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{lesson.summary}</p>
            <div className="concept-row">
              {lesson.concepts.map((c) => (
                <span key={c} className="concept">
                  {c}
                </span>
              ))}
            </div>
            <pre className="code-block">{lesson.snippet}</pre>
            <p className="tip">{lesson.tip}</p>
            <Link className="btn btn-ghost btn-sm" to="/learn" style={{ width: 'fit-content' }}>
              More Python lessons
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
