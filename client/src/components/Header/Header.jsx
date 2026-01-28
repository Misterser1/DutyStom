import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../contexts/LanguageContext'
import Logo from '../Logo/Logo'
import EducationDropdown from '../EducationDropdown/EducationDropdown'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import './Header.css'

function Header() {
  const { itemCount } = useCart()
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showEducation, setShowEducation] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [contacts, setContacts] = useState({ phone: '+7 930-950-88-87', email: 'info@dutystom.ru' })
  const educationBtnRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetch('/api/settings/contacts')
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(err => console.error('Error loading contacts:', err))
  }, [])

  // Поиск подсказок с debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.slice(0, 8))
          setShowSuggestions(true)
        })
        .catch(err => console.error('Search error:', err))
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Закрытие по клику вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const goToProduct = (product) => {
    setShowSuggestions(false)
    setSearchQuery('')
    navigate(`/product/${product.id}`)
  }

  return (
    <>
      {/* Desktop Header */}
      <header className={`header header-desktop ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="header-content">
          {/* Логотип */}
          <Link to="/" className="logo-new">
            <Logo size="medium" />
          </Link>

          {/* Поиск */}
          <div className="search-wrapper" ref={searchRef}>
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                className="search-input-main"
                placeholder={t('header.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
              <button type="submit" className="search-btn-main">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(product => (
                  <div key={product.id} className="suggestion-item" onClick={() => goToProduct(product)}>
                    <img
                      src={product.image_url || '/images/placeholder.png'}
                      alt={product.name}
                      className="suggestion-img"
                      onError={(e) => e.target.src = '/images/placeholder.png'}
                    />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{product.name.split('\n')[0]}</span>
                      <span className="suggestion-brand">{product.brand}</span>
                    </div>
                    <span className="suggestion-price">{product.price_usd || Math.round(product.price / 80)} $</span>
                  </div>
                ))}
                <button
                  className="show-all-results"
                  onClick={() => {
                    setShowSuggestions(false)
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
                    setSearchQuery('')
                  }}
                >
                  {language === 'en' ? 'Show all results' : 'Показать все результаты'}
                </button>
              </div>
            )}
          </div>

          {/* Иконки */}
          <div className="header-actions">
            <a href={`tel:${(contacts.phone || '+7 930-950-88-87').replace(/\s/g, '')}`} className="action-icon" title={language === 'en' ? 'Phone' : 'Телефон'}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </a>

            <a href={`mailto:${contacts.email || 'info@dutystom.ru'}`} className="action-icon" title={language === 'en' ? 'Email' : 'Почта'}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>

            <a href="https://t.me/dutystom" target="_blank" rel="noopener noreferrer" className="action-icon" title={language === 'en' ? 'Social' : 'Соцсети'}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
            </a>

            <div className="education-wrapper">
              <button
                ref={educationBtnRef}
                className={`action-icon ${showEducation ? 'active' : ''}`}
                title={t('nav.education')}
                onClick={() => setShowEducation(!showEducation)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </button>
              <EducationDropdown
                isOpen={showEducation}
                onClose={() => setShowEducation(false)}
                anchorRef={educationBtnRef}
              />
            </div>

            <LanguageSwitcher className="compact" />

            <Link to="/cart" className="action-icon cart-action" title={t('header.cart')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {itemCount > 0 && <span className="cart-badge-new">{itemCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Header - Вариант 2: Компактный */}
      <header className={`header header-mobile ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="mobile-header-row">
          {/* Бургер меню слева */}
          <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(true)}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>

          {/* Логотип по центру */}
          <Link to="/" className="mobile-logo-center">
            <Logo size="small" />
          </Link>

          {/* Поиск + Корзина справа */}
          <div className="mobile-right-icons">
            <button className="mobile-icon-btn" onClick={() => setShowMobileSearch(true)}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
            <Link to="/cart" className="mobile-icon-btn mobile-cart-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {itemCount > 0 && <span className="mobile-cart-badge">{itemCount}</span>}
            </Link>
          </div>
        </div>

        {/* Мобильный поиск - overlay */}
        {showMobileSearch && (
          <div className="mobile-search-overlay">
            <form className="mobile-search-form" onSubmit={(e) => { handleSearch(e); setShowMobileSearch(false); }}>
              <input
                type="text"
                className="mobile-search-input"
                placeholder={t('header.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="button" className="mobile-search-close" onClick={() => setShowMobileSearch(false)}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </form>

            {/* Мобильные подсказки */}
            {suggestions.length > 0 && (
              <div className="mobile-search-suggestions">
                {suggestions.map(product => (
                  <div
                    key={product.id}
                    className="mobile-suggestion-item"
                    onClick={() => {
                      setShowMobileSearch(false)
                      goToProduct(product)
                    }}
                  >
                    <img
                      src={product.image_url || '/images/placeholder.png'}
                      alt={product.name}
                      className="mobile-suggestion-img"
                      onError={(e) => e.target.src = '/images/placeholder.png'}
                    />
                    <div className="mobile-suggestion-info">
                      <span className="mobile-suggestion-name">{product.name.split('\n')[0]}</span>
                      <span className="mobile-suggestion-brand">{product.brand}</span>
                    </div>
                    <span className="mobile-suggestion-price">{product.price_usd || Math.round(product.price / 80)} $</span>
                  </div>
                ))}
                <button
                  type="button"
                  className="mobile-show-all-results"
                  onClick={() => {
                    setShowMobileSearch(false)
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
                    setSearchQuery('')
                  }}
                >
                  {language === 'en' ? 'Show all results' : 'Показать все результаты'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Мобильное меню - drawer */}
        {showMobileMenu && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)} />
            <div className="mobile-menu-drawer">
              <div className="mobile-menu-header">
                <Logo size="small" />
                <button className="mobile-menu-close" onClick={() => setShowMobileMenu(false)}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
              <div className="mobile-menu-lang">
                <LanguageSwitcher />
              </div>
              <nav className="mobile-menu-nav">
                <Link to="/" className="mobile-menu-item" onClick={() => setShowMobileMenu(false)}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                  {language === 'en' ? 'Home' : 'Главная'}
                </Link>
                <Link to="/category/implantaty" className="mobile-menu-item" onClick={() => setShowMobileMenu(false)}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                  {t('nav.catalog')}
                </Link>
                <a href={`tel:${(contacts.phone || '+7 930-950-88-87').replace(/\s/g, '')}`} className="mobile-menu-item">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  {contacts.phone || '+7 930-950-88-87'}
                </a>
                <a href={`mailto:${contacts.email || 'info@dutystom.ru'}`} className="mobile-menu-item">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  {language === 'en' ? 'Email Us' : 'Написать'}
                </a>
                <a href="https://t.me/dutystom" target="_blank" rel="noopener noreferrer" className="mobile-menu-item">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
                  Telegram
                </a>
              </nav>
            </div>
          </>
        )}
      </header>
    </>
  )
}

export default Header
