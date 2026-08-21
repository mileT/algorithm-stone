import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, problems } from '../data/problems'
import { useStore } from '../store'
import type { Difficulty } from '../types'

export function ProblemsPage() {
  const { progress } = useStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState<'All' | Difficulty>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'todo' | 'attempted' | 'solved'>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return problems.filter((p) => {
      if (category !== 'All' && p.category !== category) return false
      if (difficulty !== 'All' && p.difficulty !== difficulty) return false
      const status = progress.statuses[p.id] ?? 'todo'
      if (statusFilter !== 'All' && status !== statusFilter) return false
      if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, category, difficulty, statusFilter, progress.statuses])

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>NeetCode 250</h2>
          <p>Browse all {problems.length} problems. Filter by topic, difficulty, or your progress.</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search problems…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search problems"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
          aria-label="Difficulty"
        >
          <option value="All">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          aria-label="Status"
        >
          <option value="All">All statuses</option>
          <option value="todo">To do</option>
          <option value="attempted">Attempted</option>
          <option value="solved">Solved</option>
        </select>
      </div>

      <div className="panel" style={{ padding: '0.35rem 0.5rem' }}>
        <p style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Showing {filtered.length} problem{filtered.length === 1 ? '' : 's'}
        </p>
        <div className="problem-list">
          {filtered.map((p) => {
            const status = progress.statuses[p.id] ?? 'todo'
            return (
              <Link key={p.id} to={`/problems/${p.id}`} className="problem-list-item">
                <span className={`status-dot ${status}`} title={status} />
                <div>
                  <div className="name">{p.name}</div>
                  <div className="sub">
                    {p.category} · {p.difficulty}
                  </div>
                </div>
                <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
              </Link>
            )
          })}
          {filtered.length === 0 && <p className="empty">No problems match these filters.</p>}
        </div>
      </div>
    </section>
  )
}
