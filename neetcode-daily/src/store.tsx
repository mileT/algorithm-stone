import { createContext, useContext, type ReactNode } from 'react'
import { useNotes, useProgress } from './hooks/useStore'

type Store = ReturnType<typeof useProgress> & ReturnType<typeof useNotes>

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const progress = useProgress()
  const notes = useNotes()
  return <StoreContext.Provider value={{ ...progress, ...notes }}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
