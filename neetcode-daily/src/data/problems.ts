import problemsData from './problems.json'
import type { Problem } from '../types'

export const problems: Problem[] = problemsData.problems as Problem[]
export const TOTAL_PROBLEMS = problems.length

export const CATEGORIES = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Heap / Priority Queue',
  'Backtracking',
  'Tries',
  'Graphs',
  'Advanced Graphs',
  '1-D Dynamic Programming',
  '2-D Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Geometry',
  'Bit Manipulation',
] as const

export function getProblemById(id: number): Problem | undefined {
  return problems.find((p) => p.id === id)
}

export function getProblemsByCategory(category: string): Problem[] {
  return problems.filter((p) => p.category === category)
}

/** Deterministic daily pick: 2 problems based on day-of-year + streak progress. */
export function getDailyProblems(date = new Date(), solvedIds: Set<number> = new Set()): Problem[] {
  const start = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000)
  const seed = dayOfYear * 17 + date.getFullYear()

  const unsolved = problems.filter((p) => !solvedIds.has(p.id))
  const pool = unsolved.length >= 2 ? unsolved : problems

  const first = pool[seed % pool.length]
  let second = pool[(seed * 7 + 3) % pool.length]
  if (second.id === first.id) {
    second = pool[(seed * 7 + 4) % pool.length]
  }

  // Prefer same category when possible for focused practice
  const sameCat = pool.filter((p) => p.category === first.category && p.id !== first.id)
  if (sameCat.length) {
    second = sameCat[seed % sameCat.length]
  }

  return [first, second]
}

export function todayKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
