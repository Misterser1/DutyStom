import { useLanguage } from '../../contexts/LanguageContext'
import './LanguageSwitcher.css'

function LanguageSwitcher({ className = '' }) {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      className={`language-switcher ${className}`}
      onClick={toggleLanguage}
      title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
    >
      <span className={`lang-option ${language === 'ru' ? 'active' : ''}`}>RU</span>
      <span className="lang-divider">/</span>
      <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
    </button>
  )
}

export default LanguageSwitcher
