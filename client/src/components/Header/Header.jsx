import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Logo from '../Logo/Logo'
import './Header.css'

const searchOptions = [
  { value: 'everywhere', label: 'Везде' },
  { value: 'title', label: 'В названии' },
  { value: 'catalog', label: 'В каталогах' },
  { value: 'description', label: 'В описании' },
  { value: 'article', label: 'По артикулу' },
  { value: 'manufacturer', label: 'По производителю' },
  { value: 'model', label: 'По модели' }
]

const socialNetworks = [
  { id: 'vk', name: 'ВКонтакте', icon: '📱', url: 'https://vk.com/dutystom' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', url: 'https://t.me/dutystom' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', url: 'https://wa.me/79309508887' },
  { id: 'instagram', name: 'Instagram', icon: '📷', url: 'https://instagram.com/dutystom' }
]

const phone = '+7 930-950-88-87'
const email = 'info@dutystom.ru'

function Header() {
  const { itemCount } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('Везде')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [socialDropdownOpen, setSocialDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [copiedText, setCopiedText] = useState('')

  // Refs для отслеживания кликов вне элементов
  const searchDropdownRef = useRef(null)
  const socialDropdownRef = useRef(null)

  // Отслеживание скролла для эффекта прозрачности
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Закрытие дропдаунов при клике вне или Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
      if (socialDropdownRef.current && !socialDropdownRef.current.contains(event.target)) {
        setSocialDropdownOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false)
        setSocialDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  // Копирование в буфер обмена
  const copyToClipboard = (text, e) => {
    e.preventDefault()
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(''), 2000)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Поиск:', searchQuery, 'Тип:', searchType)
      // Здесь будет логика поиска с учетом типа
    }
  }

  const handleSearchTypeSelect = (label) => {
    setSearchType(label)
    setDropdownOpen(false)
  }

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-content">
        {/* Логотип слева */}
        <Link to="/" className="logo-new">
          <Logo size="medium" />
        </Link>

        {/* Поисковая строка по центру с dropdown */}
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-dropdown-wrapper" ref={searchDropdownRef}>
            <button
              type="button"
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {searchType} ▼
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {searchOptions.map(opt => (
                  <div
                    key={opt.value}
                    className="dropdown-item"
                    onClick={() => handleSearchTypeSelect(opt.label)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            className="search-input-main"
            placeholder="Поиск товаров, имплантатов, компонентов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn-main">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        {/* Контакты и действия справа */}
        <div className="header-actions">
          {/* Контакты в виде бейджей (десктоп) */}
          <div className="contact-badges-desktop">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="contact-badge" onClick={(e) => copyToClipboard(phone, e)}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>{phone}</span>
              <svg className="copy-icon" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </a>
            <a href={`mailto:${email}`} className="contact-badge" onClick={(e) => copyToClipboard(email, e)}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>{email}</span>
              <svg className="copy-icon" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </a>
          </div>

          {/* Мы в соцсетях dropdown */}
          <div className="social-section-header" ref={socialDropdownRef}>
            <button
              className="social-btn-header"
              onClick={() => setSocialDropdownOpen(!socialDropdownOpen)}
            >
              Мы в соцсетях ▼
            </button>
            {socialDropdownOpen && (
              <div className="dropdown-social-header">
                {socialNetworks.map(social => (
                  <a
                    key={social.id}
                    href={social.url}
                    className="social-link-header"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="social-icon-header">{social.icon}</span>
                    <span className="social-name-header">{social.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Иконки контактов (только мобильная версия) */}
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="action-icon phone-action mobile-only" title="Позвонить">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </a>

          <a href={`mailto:${email}`} className="action-icon email-action mobile-only" title="Написать">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>

          <Link to="/cart" className="action-icon cart-action" title="Корзина">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            {itemCount > 0 && <span className="cart-badge-new">{itemCount}</span>}
          </Link>
        </div>
      </div>

      {/* Уведомление о копировании */}
      {copiedText && (
        <div className="copy-notification">
          Скопировано: {copiedText}
        </div>
      )}
    </header>
  )
}

export default Header
