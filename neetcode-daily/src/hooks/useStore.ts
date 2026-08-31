import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ProblemNote, ProblemStatus, ProgressState } from '../types'
import { todayKey } from '../data/problems'

const PROGRESS_KEY = 'neetdaily-progress-v1'
const NOTES_KEY = 'neetdaily-notes-v1'

const defaultProgress = (): ProgressState => ({
  statuses: {},
  checkIns: [],
  lastCheckIn: null,
  streak: 0,
  dailyCompleted: {},
})

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return defaultProgress()
    return { ...defaultProgress(), ...JSON.parse(raw) }
  } catch {
    return defaultProgress()
  }
}

function loadNotes(): Record<number, ProblemNote> {
  try {
    const raw = localStorage.getItem(NOTES_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function yesterdayKey(from = todayKey()): string {
  const [y, m, d] = from.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() - 1)
  return todayKey(dt)
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  }, [progress])

  const setStatus = useCallback((problemId: number, status: ProblemStatus) => {
    setProgress((prev) => ({
      ...prev,
      statuses: { ...prev.statuses, [problemId]: status },
    }))
  }, [])

  const checkIn = useCallback((problemIds: number[] = []) => {
    const today = todayKey()
    setProgress((prev) => {
      if (prev.checkIns.includes(today)) {
        const completed = new Set([...(prev.dailyCompleted[today] ?? []), ...problemIds])
        return {
          ...prev,
          dailyCompleted: { ...prev.dailyCompleted, [today]: [...completed] },
        }
      }
      const yest = yesterdayKey(today)
      const streak = prev.lastCheckIn === yest || prev.lastCheckIn === today ? prev.streak + 1 : 1
      return {
        ...prev,
        checkIns: [...prev.checkIns, today],
        lastCheckIn: today,
        streak,
        dailyCompleted: {
          ...prev.dailyCompleted,
          [today]: [...new Set([...(prev.dailyCompleted[today] ?? []), ...problemIds])],
        },
      }
    })
  }, [])

  const markDailySolved = useCallback((problemId: number) => {
    const today = todayKey()
    setProgress((prev) => {
      const statuses = { ...prev.statuses, [problemId]: 'solved' as const }
      const already = prev.checkIns.includes(today)
      const completed = [...new Set([...(prev.dailyCompleted[today] ?? []), problemId])]
      if (already) {
        return {
          ...prev,
          statuses,
          dailyCompleted: { ...prev.dailyCompleted, [today]: completed },
        }
      }
      const yest = yesterdayKey(today)
      const streak = prev.lastCheckIn === yest ? prev.streak + 1 : 1
      return {
        ...prev,
        statuses,
        checkIns: [...prev.checkIns, today],
        lastCheckIn: today,
        streak,
        dailyCompleted: { ...prev.dailyCompleted, [today]: completed },
      }
    })
  }, [])

  const solvedIds = useMemo(() => {
    return new Set(
      Object.entries(progress.statuses)
        .filter(([, s]) => s === 'solved')
        .map(([id]) => Number(id)),
    )
  }, [progress.statuses])

  const checkedInToday = progress.checkIns.includes(todayKey())

  const stats = useMemo(() => {
    const values = Object.values(progress.statuses)
    return {
      solved: values.filter((s) => s === 'solved').length,
      attempted: values.filter((s) => s === 'attempted').length,
      notesReady: 0,
    }
  }, [progress.statuses])

  return {
    progress,
    setStatus,
    checkIn,
    markDailySolved,
    solvedIds,
    checkedInToday,
    stats,
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Record<number, ProblemNote>>(() => loadNotes())

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  }, [notes])

  const saveNote = useCallback((problemId: number, content: string) => {
    setNotes((prev) => ({
      ...prev,
      [problemId]: {
        problemId,
        content,
        updatedAt: new Date().toISOString(),
      },
    }))
  }, [])

  const deleteNote = useCallback((problemId: number) => {
    setNotes((prev) => {
      const next = { ...prev }
      delete next[problemId]
      return next
    })
  }, [])

  const notesList = useMemo(
    () =>
      Object.values(notes)
        .filter((n) => n.content.trim().length > 0)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [notes],
  )

  return { notes, saveNote, deleteNote, notesList }
}
