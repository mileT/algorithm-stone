import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Nav } from './components/Nav'
import { StoreProvider } from './store'
import { DailyPage } from './pages/DailyPage'
import { ProblemsPage } from './pages/ProblemsPage'
import { ProblemDetailPage } from './pages/ProblemDetailPage'
import { LearnPage } from './pages/LearnPage'
import { NotesPage } from './pages/NotesPage'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Nav />
          <main>
            <Routes>
              <Route path="/" element={<DailyPage />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/problems/:id" element={<ProblemDetailPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </StoreProvider>
  )
}
