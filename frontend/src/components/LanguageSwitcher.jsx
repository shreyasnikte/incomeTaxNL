import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-switcher">
            <button
                className={`language-switcher__button ${i18n.resolvedLanguage === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
                aria-label="Switch to English"
            >
                EN
            </button>
            <span className="language-switcher__separator">|</span>
            <button
                className={`language-switcher__button ${i18n.resolvedLanguage === 'nl' ? 'active' : ''}`}
                onClick={() => changeLanguage('nl')}
                aria-label="Switch to Dutch"
            >
                NL
            </button>
        </div>
    );
}

export default LanguageSwitcher;
