import { useState } from 'react'
import './Logo2Demo.css'

const variants = [
  {
    id: 1,
    name: 'Вариант 1: Компактный (Малый)',
    description: 'Логотип 120px, минималистичный дизайн',
    className: 'variant-1',
    logoHeight: '40px'
  },
  {
    id: 2,
    name: 'Вариант 2: Стандартный',
    description: 'Логотип 160px, сбалансированный размер',
    className: 'variant-2',
    logoHeight: '50px'
  },
  {
    id: 3,
    name: 'Вариант 3: Средний+',
    description: 'Логотип 200px, акцент на бренде',
    className: 'variant-3',
    logoHeight: '60px'
  },
  {
    id: 4,
    name: 'Вариант 4: Крупный',
    description: 'Логотип 240px, премиум стиль',
    className: 'variant-4',
    logoHeight: '70px'
  },
  {
    id: 5,
    name: 'Вариант 5: Максимум',
    description: 'Логотип 280px, максимальная видимость',
    className: 'variant-5',
    logoHeight: '80px'
  }
]

function Logo2Demo() {
  const [selected, setSelected] = useState(null)
  const [searchOpen, setSearchOpen] = useState({})

  const toggleSearch = (variantId) => {
    setSearchOpen(prev => ({
      ...prev,
      [variantId]: !prev[variantId]
    }))
  }

  return (
    <div className="logo2-demo-page">
      <div className="demo-header">
        <h1>Демо: Логотип с навигацией</h1>
        <p>5 вариантов размеров + Поиск, Телефон, Email</p>
      </div>

      <div className="variants-container">
        {variants.map(variant => (
          <div
            key={variant.id}
            className={`variant-card-2 ${selected === variant.id ? 'selected' : ''}`}
            onClick={() => setSelected(variant.id)}
          >
            <div className="variant-info">
              <h3>{variant.name}</h3>
              <p>{variant.description}</p>
            </div>

            <div className={`header-demo ${variant.className}`}>
              {/* Логотип слева */}
              <div className="logo-section">
                <img
                  src="/images/logo2-dutystom.png"
                  alt="DUTYSTOM"
                  className="demo-logo-2"
                  style={{ height: variant.logoHeight }}
                />
              </div>

              {/* Навигация справа */}
              <div className="nav-section">
                {/* Поисковая строка */}
                <div className={`search-container ${searchOpen[variant.id] ? 'open' : ''}`}>
                  <button
                    className="search-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSearch(variant.id)
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </button>
                  {searchOpen[variant.id] && (
                    <input
                      type="text"
                      placeholder="Поиск товаров..."
                      className="search-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>

                {/* Телефон */}
                <a href="tel:+79309508887" className="nav-icon phone-icon" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span className="nav-text">+7 930-950-88-87</span>
                </a>

                {/* Email */}
                <a href="mailto:info@dutystom.ru" className="nav-icon email-icon" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span className="nav-text">info@dutystom.ru</span>
                </a>

                {/* Корзина */}
                <button className="nav-icon cart-icon" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  <span className="cart-badge">3</span>
                </button>
              </div>
            </div>

            {selected === variant.id && (
              <div className="selected-indicator">✓ Выбран</div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="action-panel">
          <button className="btn-apply-variant" onClick={() => alert(`Применяю вариант ${selected}!`)}>
            Применить вариант {selected}
          </button>
          <button className="btn-cancel" onClick={() => setSelected(null)}>
            Отмена
          </button>
        </div>
      )}
    </div>
  )
}

export default Logo2Demo
