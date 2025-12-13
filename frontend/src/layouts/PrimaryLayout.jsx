
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import './PrimaryLayout.css'


function PrimaryLayout({ children }) {
  const { t } = useTranslation()
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showCredits, setShowCredits] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <nav className="app-header__nav">
          <button
            type="button"
            className="app-header__icon-button"
            onClick={() => setShowInfo(true)}
            aria-label={t('layout.header.infoLabel')}
            aria-haspopup="dialog"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm1.5 11.25h-3v-2h1v-3h-1v-2h2a1 1 0 0 1 1 1v4h1v2Z" />
            </svg>
          </button>
          <a
            href="https://twitter.com/messages/compose?recipient_id=718363377798615041"
            target="_blank"
            rel="noopener noreferrer"
            className="app-header__helpdesk-link"
            aria-label={t('layout.header.helpdeskLabel')}
            title={t('layout.header.helpdeskTitle')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M12 2C6.48 2 2 5.58 2 10c0 2.03 1.01 3.87 2.64 5.24-.17 1.89-1.05 3.47-1.07 3.5a.5.5 0 0 0 .42.76c2.31 0 4.13-1.06 5.24-1.88.57.1 1.16.16 1.77.16 5.52 0 10-3.58 10-8S17.52 2 12 2Zm-3 9.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm3 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm3 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
            </svg>
          </a>
          <a
            href="https://github.com/shreyasnikte/Dutch_Tax"
            target="_blank"
            rel="noopener noreferrer"
            className="app-header__github-link"
            aria-label={t('layout.header.githubLabel')}
          >
            <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </nav>
        <LanguageSwitcher />
      </header>
      <div className="app-notice">
        {t('layout.notice.builtWith')} <button onClick={() => setShowPrivacy(true)} className="app-notice__link">{t('layout.notice.link')}</button>
      </div>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <div className="app-footer__disclaimer">
          <p>
            <Trans i18nKey="layout.footer.disclaimer">
              <strong>Disclaimer:</strong> This tool is provided for educational and informational purposes only.
              Tax calculations are estimates and may not reflect your actual tax liability.
              For official advice, always consult the <a href="https://www.belastingdienst.nl" target="_blank" rel="noopener noreferrer">Belastingdienst</a> or a qualified tax consultant.
            </Trans>
          </p>
        </div>
        <div className="app-footer__links">
          <a href="https://github.com/shreyasnikte/Dutch_Tax" target="_blank" rel="noopener noreferrer">
            <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {t('layout.footer.viewOnGithub')}
          </a>
          <span className="app-footer__separator">•</span>
          <a href="https://github.com/shreyasnikte/Dutch_Tax/issues" target="_blank" rel="noopener noreferrer">
            {t('layout.footer.reportIssue')}
          </a>
          <span className="app-footer__separator">•</span>
          <button onClick={() => setShowCredits(true)} className="app-footer__link-button">
            {t('layout.footer.credits')}
          </button>
          <span className="app-footer__separator">•</span>
          <button onClick={() => setShowTerms(true)} className="app-footer__link-button">
            {t('layout.footer.terms')}
          </button>
        </div>
      </footer>
      {showPrivacy && (
        <div className="privacy-modal__backdrop" onClick={() => setShowPrivacy(false)}>
          <div className="privacy-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Privacy Information">
            <button className="privacy-modal__close" onClick={() => setShowPrivacy(false)} aria-label="Close privacy information">×</button>
            <Trans i18nKey="layout.modals.privacy.title" defaults="<h2>Privacy-first by design</h2>" />
            <p><Trans i18nKey="layout.modals.privacy.description"><strong>Your financial data is your business.</strong> incomeTaxNL is a privacy-focused free and open source tool to estimate Dutch Box 1 and Box 3 taxes. Any data you enter is only stored locally in your browser. All calculations run 100% locally in your browser — your personal financial data is never sent, stored, or collected by this app for any reason.</Trans></p>
            <ul>
              <li>{t('layout.modals.privacy.list.item1')}</li>
              <li>{t('layout.modals.privacy.list.item2')}</li>
              <li>{t('layout.modals.privacy.list.item3')}</li>
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
              aria-label={t('layout.modals.info.closeLabel')}
            >
              ×
            </button>
            <h2 id="about-incometaxnl-title">{t('layout.modals.info.title')}</h2>
            <p>
              {t('layout.modals.info.description')}
            </p>
            <section className="info-modal__section">
              <h3>{t('layout.modals.info.howToUse.title')}</h3>
              <ol>
                <li>{t('layout.modals.info.howToUse.step1')}</li>
                <li>{t('layout.modals.info.howToUse.step2')}</li>
                <li>{t('layout.modals.info.howToUse.step3')}</li>
                <li>{t('layout.modals.info.howToUse.step4')}</li>
              </ol>
            </section>
            <section className="info-modal__section">
              <h3>{t('layout.modals.info.origin.title')}</h3>
              <p>
                {t('layout.modals.info.origin.description')}
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
              aria-label={t('layout.modals.credits.closeLabel')}
            >
              ×
            </button>
            <h2 id="credits-modal-title">{t('layout.modals.credits.title')}</h2>
            <p>
              <Trans i18nKey="layout.modals.credits.description">
                incomeTaxNL is an open-source project created by <a href="https://github.com/shreyasnikte" target="_blank" rel="noopener noreferrer">@shreyasnikte</a> to help people understand Dutch taxes.
              </Trans>
            </p>
            <section className="credits-modal__section">
              <h3>{t('layout.modals.credits.specialThanks.title')}</h3>
              <p>
                <Trans i18nKey="layout.modals.credits.specialThanks.item1">
                  Salary calculations powered by the <a href="https://github.com/stevermeister/dutch-tax-income-calculator-npm" target="_blank" rel="noopener noreferrer">dutch-tax-income-calculator</a> library — <a href="https://buymeacoffee.com/stevermeister" target="_blank" rel="noopener noreferrer">by Stepan Suvorov</a>
                </Trans>
              </p>
              <p>
                {t('layout.modals.credits.specialThanks.item2')}
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
              aria-label={t('layout.modals.terms.closeLabel')}
            >
              ×
            </button>
            <h2 id="terms-modal-title">{t('layout.modals.terms.title')}</h2>
            <p><Trans i18nKey="layout.modals.terms.effectiveDate"><strong>Effective Date:</strong> December 13, 2025</Trans></p>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <section key={num} className="terms-modal__section">
                <h3>{t(`layout.modals.terms.sections.${num}.title`)}</h3>
                <p>
                  <Trans
                    i18nKey={`layout.modals.terms.sections.${num}.content`}
                    components={{ a: <a target="_blank" rel="noopener noreferrer" /> }}
                  >
                    {/* Content will be populated from translation files */}
                    Content for section {num}
                  </Trans>
                </p>
              </section>
            ))}
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
