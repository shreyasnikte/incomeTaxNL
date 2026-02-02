import { createContext, useContext, useMemo, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import en from '../locales/en.json'
import nl from '../locales/nl.json'

const translations = { en, nl }
const SUPPORTED_LANGUAGES = ['en', 'nl']
const DEFAULT_LANGUAGE = 'en'

const LanguageContext = createContext(null)

/**
 * Get nested value from object using dot notation
 * e.g., get(obj, 'box1Form.grossIncome')
 */
function get(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export function LanguageProvider({ children }) {
  const { lang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Validate language from URL, fallback to default
  const language = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE

  // Translation function
  const t = useCallback((key, fallback) => {
    const value = get(translations[language], key)
    if (value !== undefined) return value
    // Fallback to English if key not found in current language
    const fallbackValue = get(translations[DEFAULT_LANGUAGE], key)
    return fallbackValue ?? fallback ?? key
  }, [language])

  // Switch language and navigate to new URL
  const switchLanguage = useCallback((newLang) => {
    if (!SUPPORTED_LANGUAGES.includes(newLang)) return
    const pathWithoutLang = location.pathname.replace(/^\/(en|nl)/, '')
    navigate(`/${newLang}${pathWithoutLang || ''}`, { replace: true })
  }, [navigate, location.pathname])

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'nl' : 'en'
    switchLanguage(newLang)
  }, [language, switchLanguage])

  // Locale for number formatting (en-NL for English, nl-NL for Dutch)
  const locale = language === 'nl' ? 'nl-NL' : 'en-NL'

  const value = useMemo(() => ({
    language,
    locale,
    t,
    switchLanguage,
    toggleLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  }), [language, locale, t, switchLanguage, toggleLanguage])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE }
