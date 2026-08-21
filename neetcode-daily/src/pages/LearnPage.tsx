import { pythonLessons } from '../data/pythonLessons'
import { Link } from 'react-router-dom'
import { getProblemsByCategory } from '../data/problems'

export function LearnPage() {
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>Learn Python for interviews</h2>
          <p>
            Pattern-first lessons aligned to NeetCode 250 categories — idioms you will reuse across dozens of
            problems.
          </p>
        </div>
      </div>

      <div className="lesson-grid">
        {pythonLessons.map((lesson) => {
          const sample = getProblemsByCategory(lesson.category)[0]
          return (
            <article key={lesson.id} className="lesson">
              <span className="badge badge-cat">{lesson.category}</span>
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
              {sample && (
                <Link className="btn btn-ghost btn-sm" to={`/problems/${sample.id}`} style={{ width: 'fit-content' }}>
                  Practice: {sample.name}
                </Link>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
