export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type ProblemStatus = 'todo' | 'attempted' | 'solved'

export interface Problem {
  id: number
  name: string
  difficulty: Difficulty
  category: string
  slug: string
  leetcodeUrl: string
  neetcodeUrl: string
}

export interface ProblemNote {
  problemId: number
  content: string
  updatedAt: string
}

export interface ProgressState {
  statuses: Record<number, ProblemStatus>
  checkIns: string[] // YYYY-MM-DD
  lastCheckIn: string | null
  streak: number
  dailyCompleted: Record<string, number[]> // date -> problem ids
}

export interface PythonLesson {
  id: string
  category: string
  title: string
  summary: string
  concepts: string[]
  snippet: string
  tip: string
}
