import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import './EducationDropdown.css'

function EducationDropdown({ isOpen, onClose, anchorRef }) {
  const { language, t } = useLanguage()
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      fetchEducation()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          anchorRef?.current && !anchorRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, anchorRef])

  const fetchEducation = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings/education')
      if (response.ok) {
        const data = await response.json()
        setEducation(data)
      }
    } catch (error) {
      console.error('Error fetching education:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="education-dropdown" ref={dropdownRef}>
      <div className="education-dropdown-header">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
        <span>{language === 'en' ? 'Education' : 'Обучение'}</span>
      </div>

      <div className="education-dropdown-content">
        {loading ? (
          <div className="education-loading">{t('common.loading')}</div>
        ) : education.length === 0 ? (
          <div className="education-empty">{language === 'en' ? 'Materials coming soon' : 'Материалы скоро появятся'}</div>
        ) : (
          <ul className="education-list">
            {education.map((item) => (
              <li key={item.id} className="education-item">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="education-link"
                  onClick={onClose}
                >
                  <div className="education-item-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
                    </svg>
                  </div>
                  <div className="education-item-content">
                    <span className="education-title">{item.title}</span>
                    {item.description && (
                      <span className="education-description">{item.description}</span>
                    )}
                  </div>
                  <svg className="education-arrow" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default EducationDropdown
