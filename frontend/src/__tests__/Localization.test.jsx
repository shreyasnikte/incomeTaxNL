import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18next from 'i18next'
import PrimaryLayout from '../layouts/PrimaryLayout'

// Test i18n resources
const resources = {
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

// Helper to create a fresh i18n instance for each test
function createTestI18n(lng = 'en') {
  const instance = i18next.createInstance()
  instance
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      resources,
    })
  return instance
}

describe('Localization', () => {
  let i18n

  beforeEach(() => {
    i18n = createTestI18n('en')
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
    
    // Check current language toggle button (should show 'NL' as option to switch TO)
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

    // Wait for the language to change and the UI to update by looking for a translated string.
    // `findByText` is an async query that waits for the element to appear, which is
    // preferred over waiting for an internal state change like `i18n.language`.
    await screen.findByText('Bekijk op GitHub')
    
    // Button should now say EN (switch to EN)
    expect(screen.getByText('EN')).toBeInTheDocument()
  })
})