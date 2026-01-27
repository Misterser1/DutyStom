import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import './InfoBar.css'

const educationItems = {
  ru: [
    { label: 'Вебинары', href: '/education/webinars' },
    { label: 'Курсы', href: '/education/courses' },
    { label: 'Мастер-классы', href: '/education/masterclass' },
    { label: 'Статьи', href: '/education/articles' }
  ],
  en: [
    { label: 'Webinars', href: '/education/webinars' },
    { label: 'Courses', href: '/education/courses' },
    { label: 'Masterclasses', href: '/education/masterclass' },
    { label: 'Articles', href: '/education/articles' }
  ]
}

function InfoBar() {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="info-bar">
      <div className="info-bar-content">
        <div className="info-bar-item education-dropdown" ref={dropdownRef}>
          <button
            className={`education-btn ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="education-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </span>
            <span className="education-label">{language === 'en' ? 'Education & Webinars' : 'Обучения и вебинары'}</span>
            <span className={`arrow ${isOpen ? 'open' : ''}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </span>
          </button>

          {isOpen && (
            <div className="dropdown-menu">
              {educationItems[language].map((item, idx) => (
                <a key={idx} href={item.href} className="dropdown-item">
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoBar
