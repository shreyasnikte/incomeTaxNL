
import PropTypes from 'prop-types'
import { useState } from 'react'
import './PrimaryLayout.css'


function PrimaryLayout({ children }) {
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showCredits, setShowCredits] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
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
            href="https://twitter.com/messages/compose?recipient_id=718363377798615041"
            target="_blank"
            rel="noopener noreferrer"
            className="app-header__helpdesk-link"
            aria-label="Contact me on X (Twitter)"
            title="Need help? Message me on X"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M12 2C6.48 2 2 5.58 2 10c0 2.03 1.01 3.87 2.64 5.24-.17 1.89-1.05 3.47-1.07 3.5a.5.5 0 0 0 .42.76c2.31 0 4.13-1.06 5.24-1.88.57.1 1.16.16 1.77.16 5.52 0 10-3.58 10-8S17.52 2 12 2Zm-3 9.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm3 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm3 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"/>
            </svg>
          </a>
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
        <div className="app-footer__disclaimer">
          <p>
            <strong>Disclaimer:</strong> This tool is provided for educational and informational purposes only. 
            Tax calculations are estimates and may not reflect your actual tax liability. 
            For official advice, always consult the <a href="https://www.belastingdienst.nl" target="_blank" rel="noopener noreferrer">Belastingdienst</a> or a qualified tax consultant.
          </p>
        </div>
        <div className="app-footer__links">
          <a href="https://github.com/shreyasnikte/Dutch_Tax" target="_blank" rel="noopener noreferrer">
            <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View on GitHub
          </a>
          <span className="app-footer__separator">•</span>
          <a href="https://github.com/shreyasnikte/Dutch_Tax/issues" target="_blank" rel="noopener noreferrer">
            Report an Issue
          </a>
          <span className="app-footer__separator">•</span>
          <button onClick={() => setShowCredits(true)} className="app-footer__link-button">
            Credits
          </button>
          <span className="app-footer__separator">•</span>
          <button onClick={() => setShowTerms(true)} className="app-footer__link-button">
            Terms of Use
          </button>
        </div>
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
      {showCredits && (
        <div className="credits-modal__backdrop" onClick={() => setShowCredits(false)}>
          <div
            className="credits-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="credits-modal-title"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="credits-modal__close"
              onClick={() => setShowCredits(false)}
              aria-label="Close credits dialog"
            >
              ×
            </button>
            <h2 id="credits-modal-title">Credits</h2>
            <p>
              incomeTaxNL is an open-source project created by <a href="https://github.com/shreyasnikte" target="_blank" rel="noopener noreferrer">@shreyasnikte</a> to help people understand Dutch taxes.
            </p>
            <section className="credits-modal__section">
              <h3>Special thanks</h3>
              <p>
                Salary calculations powered by the <a href="https://github.com/stevermeister/dutch-tax-income-calculator-npm" target="_blank" rel="noopener noreferrer">dutch-tax-income-calculator</a> library — <a href="https://buymeacoffee.com/stevermeister" target="_blank" rel="noopener noreferrer">by Stepan Suvorov</a>
              </p>
              <p>
                Thanks to everyone who provided feedback to improve this tool.
              </p>
            </section>
          </div>
        </div>
      )}
      {showTerms && (
        <div className="terms-modal__backdrop" onClick={() => setShowTerms(false)}>
          <div
            className="terms-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="terms-modal__close"
              onClick={() => setShowTerms(false)}
              aria-label="Close terms of use dialog"
            >
              ×
            </button>
            <h2 id="terms-modal-title">Terms of Use</h2>
            <p><strong>Effective Date:</strong> December 13, 2025</p>
            
            <section className="terms-modal__section">
              <h3>1. Acceptance of Terms</h3>
              <p>
                By using incomeTaxNL, you agree to these Terms of Use. If you do not agree, 
                please discontinue use of this tool immediately.
              </p>
            </section>

            <section className="terms-modal__section">
              <h3>2. Educational Purpose Only</h3>
              <p>
                incomeTaxNL is provided solely for educational and informational purposes. 
                It is designed to help users understand and estimate Dutch income tax calculations. 
                This tool does NOT constitute professional tax advice, legal advice, or financial planning services.
              </p>
            </section>

            <section className="terms-modal__section">
              <h3>3. No Warranty or Guarantee</h3>
              <p>
                All calculations and information are provided "as is" without any warranty of accuracy, 
                completeness, or fitness for a particular purpose. Tax laws, rates, and regulations may 
                change, and this tool may not reflect the most current information. Users are responsible 
                for verifying all results with official sources.
              </p>
            </section>

            <section className="terms-modal__section">
              <h3>4. Limitation of Liability</h3>
              <p>
                The creator and contributors of incomeTaxNL shall not be liable for any damages, losses, 
                or tax liabilities arising from the use or misuse of this tool. Users assume all risks 
                associated with using the estimates provided.
              </p>
            </section>

            <section className="terms-modal__section">
              <h3>5. Professional Consultation Required</h3>
              <p>
                For official tax calculations, filing, or advice, users must consult the{' '}
                <a href="https://www.belastingdienst.nl" target="_blank" rel="noopener noreferrer">
                  Belastingdienst
                </a>{' '}
                (Dutch Tax and Customs Administration) or a qualified tax professional.
              </p>
            </section>

            <section className="terms-modal__section">
              <h3>6. Privacy and Data</h3>
              <p>
                All data entered into incomeTaxNL is stored locally in your browser and never transmitted 
                to any server. We do not collect, store, or share your personal or financial information. 
                See our Privacy Policy for more details.
              </p>
            </section>

            <section className="terms-modal__section">
              <h3>7. Open Source License</h3>
              <p>
                incomeTaxNL is open source software available on{' '}
                <a href="https://github.com/shreyasnikte/Dutch_Tax" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                . You may use, modify, and distribute it according to the terms of its license.
              </p>
            </section>

            <section className="terms-modal__section">
              <h3>8. Changes to Terms</h3>
              <p>
                These terms may be updated from time to time. Continued use of incomeTaxNL after 
                changes constitutes acceptance of the revised terms.
              </p>
            </section>

            <section className="terms-modal__section">
              <h3>9. Contact</h3>
              <p>
                For questions or concerns, please contact us via{' '}
                <a href="https://github.com/shreyasnikte/Dutch_Tax/issues" target="_blank" rel="noopener noreferrer">
                  GitHub Issues
                </a>{' '}
                or{' '}
                <a href="https://twitter.com/messages/compose?recipient_id=718363377798615041" target="_blank" rel="noopener noreferrer">
                  direct message on X
                </a>
                .
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
