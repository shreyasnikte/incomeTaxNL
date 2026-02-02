import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { LanguageProvider, DEFAULT_LANGUAGE } from './context/LanguageContext.jsx'
import './styles/global.css'
import App from './app/App.jsx'

function AppWithLanguage() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/:lang/*" element={<AppWithLanguage />} />
        <Route path="*" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />} />
      </Routes>
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
)
