
import PropTypes from 'prop-types'
import { useState } from 'react'
import './PrimaryLayout.css'


function PrimaryLayout({ children }) {
  const [showPrivacy, setShowPrivacy] = useState(false)
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>incomeTaxNL</h1>
        <nav className="app-header__nav">
          <button
            className="app-header__privacy-link"
            onClick={() => setShowPrivacy(true)}
            aria-label="Show privacy information"
          >
            Privacy by design
          </button>
          <a 
            href="https://github.com/shreyasnikte/Dutch_Tax" 
            target="_blank" 
            rel="noopener noreferrer"
            className="app-header__github-link"
            aria-label="View on GitHub"
          >
            <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
        </nav>
      </header>
      {/* Banner removed as requested */}
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <small>Educational use only — not official advice.</small>
      </footer>
      {showPrivacy && (
        <div className="privacy-modal__backdrop" onClick={() => setShowPrivacy(false)}>
          <div className="privacy-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Privacy Information">
            <button className="privacy-modal__close" onClick={() => setShowPrivacy(false)} aria-label="Close privacy information">×</button>
            <h2>Privacy-first by design</h2>
            <p><strong>Your financial data is your business.</strong> incomeTaxNL is a privacy-focused free and open source tool to estimate Dutch Box 1 and Box 3 taxes. Any data you enter is only stored locally in your browser. All calculations run 100% locally in your browser — your personal financial data is never sent, stored, or collected by this app for any reason.</p>
            <ul>
              <li>No risk of leaks, hacks, or misuse: your sensitive information never leaves your device.</li>
              <li>No tracking, no uploads, no analytics: you stay in control of your data.</li>
              <li>Use incomeTaxNL with confidence for salary and capital gains calculations, knowing your privacy is protected.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

PrimaryLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PrimaryLayout
