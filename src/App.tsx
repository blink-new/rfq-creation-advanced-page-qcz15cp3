import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import NewRFQPage from './pages/NewRFQPage'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NewRFQPage />
      <Toaster />
    </div>
  )
}

export default App