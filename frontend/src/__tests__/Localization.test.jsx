import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import PrimaryLayout from '../layouts/PrimaryLayout'

// Initialize a test instance of i18n
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          layout: {
            header: {
              title: "incomeTaxNL",
              icon_label: "Learn about incomeTaxNL",
              help_label: "Contact me on X (Twitter)",
              help_title: "Need help? Message me on X",
              github_label: "View on GitHub"
            },
            privacy: {
              notice: "Built with ❤️ for privacy — ",
              link: "your data never leaves your device"
            },
            footer: {
              disclaimer: "Disclaimer: This tool is provided...",
              view_on_github: "View on GitHub",
              report_issue: "Report an Issue",
              credits: "Credits",
              terms: "Terms of Use"
            }
          }
        }
      },
      nl: {
        translation: {
          layout: {
            header: {
              title: "incomeTaxNL",
              icon_label: "Meer over incomeTaxNL",
              help_label: "Neem contact met mij op via X (Twitter)",
              help_title: "Hulp nodig? Stuur me een bericht op X",
              github_label: "Bekijk op GitHub"
            },
            privacy: {
              notice: "Gebouwd met ❤️ voor privacy — ",
              link: "uw gegevens verlaten uw apparaat nooit"
            },
            footer: {
              disclaimer: "Disclaimer: Deze tool is...",
              view_on_github: "Bekijk op GitHub",
              report_issue: "Meld een probleem",
              credits: "Credits",
              terms: "Gebruiksvoorwaarden"
            }
          }
        }
      }
    }
  })

describe('Localization', () => {
  beforeEach(() => {
    i18n.changeLanguage('en')
  })

  it('renders in English by default', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <PrimaryLayout>
          <div data-testid="child-content">Child content</div>
        </PrimaryLayout>
      </I18nextProvider>
    )

    // Check for English header text
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('incomeTaxNL')
    
    // Check for English footer link
    expect(screen.getByText('View on GitHub')).toBeInTheDocument()
    
    // Check current language toggle button (should show 'NL' as option to switch TO, or 'EN' as current?)
    // In PrimaryLayout: {i18n.language.startsWith('en') ? 'NL' : 'EN'}
    // If current is EN, it shows NL.
    expect(screen.getByText('NL')).toBeInTheDocument()
  })

  it('switches to Dutch when toggle is clicked', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <PrimaryLayout>
          <div data-testid="child-content">Child content</div>
        </PrimaryLayout>
      </I18nextProvider>
    )

    // Current language is EN, button shows "NL" (switch to NL)
    const toggleButton = screen.getByText('NL')
    fireEvent.click(toggleButton)

    // Wait for language change
    await waitFor(() => {
        expect(i18n.language).toBe('nl')
    })

    // Check for Dutch footer link
    expect(screen.getByText('Bekijk op GitHub')).toBeInTheDocument()
    
    // Button should now say EN (switch to EN)
    expect(screen.getByText('EN')).toBeInTheDocument()
  })
})