
import PropTypes from 'prop-types'
import { useState } from 'react'
import './PrimaryLayout.css'


function PrimaryLayout({ children }) {
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>incomeTaxNL</h1>
        <nav className="app-header__nav">
          <button
            type="button"
            className="app-header__icon-button"
            onClick={() => setShowInfo(true)}
            aria-label="Learn about incomeTaxNL"
            aria-haspopup="dialog"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm1.5 11.25h-3v-2h1v-3h-1v-2h2a1 1 0 0 1 1 1v4h1v2Z"/>
            </svg>
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
      <div className="app-notice">
        Built with ❤️ for privacy — <button onClick={() => setShowPrivacy(true)} className="app-notice__link">your data never leaves your device</button>
      </div>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <small>Only for educational & informational purposes. Consult Belastingdienst or qualified consultant for official advice.</small>
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
      {showInfo && (
        <div className="info-modal__backdrop" onClick={() => setShowInfo(false)}>
          <div
            className="info-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-incometaxnl-title"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="info-modal__close"
              onClick={() => setShowInfo(false)}
              aria-label="Close about dialog"
            >
              ×
            </button>
            <h2 id="about-incometaxnl-title">About incomeTaxNL</h2>
            <p>
              incomeTaxNL helps you estimate Dutch Box 1 salary tax and Box 3 wealth tax with a
              privacy-first approach. All calculations run locally, so your data never leaves your
              browser.
            </p>
            <section className="info-modal__section">
              <h3>How to use</h3>
              <ol>
                <li>Select Box 1 or Box 3 using the toggle at the top of the calculator.</li>
                <li>Enter your income, savings, investments, and debts in the left-side forms.</li>
                <li>Open the settings gear to tweak thresholds, return assumptions, or tax year.</li>
                <li>Review the results panel for a breakdown of taxable bases and estimated taxes.</li>
              </ol>
            </section>
            <section className="info-modal__section">
              <h3>Origin story</h3>
              <p>
                Navigating Dutch taxes used to be confusing for me. I built an elaborate
                spreadsheet to make sense of the rules, but it was too complex for friends and
                colleagues. This app is the friendlier version—same clarity, with explanations that
                anyone can follow.
              </p>
            </section>
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
