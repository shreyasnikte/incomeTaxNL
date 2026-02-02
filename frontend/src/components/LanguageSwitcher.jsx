import { useLanguage } from '../context/LanguageContext.jsx'
import './LanguageSwitcher.css'

function LanguageSwitcher() {
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <button
      type="button"
      className="language-switcher"
      onClick={toggleLanguage}
      aria-label={t('language.switchTo')}
      title={t('language.switchTo')}
    >
      <span className="language-switcher__flag" aria-hidden="true">
        {language === 'en' ? '🇳🇱' : '🇬🇧'}
      </span>
      <span className="language-switcher__label">
        {language === 'en' ? 'NL' : 'EN'}
      </span>
    </button>
  )
}

export default LanguageSwitcher
