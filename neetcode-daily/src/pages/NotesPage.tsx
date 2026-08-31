import { Link } from 'react-router-dom'
import { getProblemById } from '../data/problems'
import { useStore } from '../store'

export function NotesPage() {
  const { notesList, deleteNote } = useStore()

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>Review notes</h2>
          <p>Revisit the questions you annotated. Spaced review beats re-solving from scratch every time.</p>
        </div>
      </div>

      <div className="panel">
        {notesList.length === 0 ? (
          <p className="empty">
            No notes yet. Open any problem and leave a note while the solution is fresh.
            <br />
            <Link to="/problems" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Browse problems
            </Link>
          </p>
        ) : (
          notesList.map((note) => {
            const problem = getProblemById(note.problemId)
            if (!problem) return null
            return (
              <article key={note.problemId} className="note-card">
                <div className="problem-meta">
                  <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                  <span className="badge badge-cat">{problem.category}</span>
                </div>
                <h3 className="problem-title" style={{ fontSize: '1.1rem' }}>
                  <Link to={`/problems/${problem.id}`}>{problem.name}</Link>
                </h3>
                <p className="excerpt">{note.content}</p>
                <time dateTime={note.updatedAt}>Updated {new Date(note.updatedAt).toLocaleString()}</time>
                <div className="problem-actions">
                  <Link className="btn btn-primary btn-sm" to={`/problems/${problem.id}`}>
                    Review
                  </Link>
                  <a className="btn btn-ghost btn-sm" href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
                    Re-solve
                  </a>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => deleteNote(note.problemId)}>
                    Delete
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
