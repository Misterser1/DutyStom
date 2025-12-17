import { useState } from 'react'
import './LogoSizeDemo.css'

const logoVariants = [
  {
    id: 1,
    name: 'Вариант 1: Компактный - 45px',
    description: 'Минимальный размер, экономия пространства',
    logo1Height: '45px',
    logo2Height: '45px'
  },
  {
    id: 2,
    name: 'Вариант 2: Малый - 55px',
    description: 'Небольшой, но читаемый',
    logo1Height: '55px',
    logo2Height: '55px'
  },
  {
    id: 3,
    name: 'Вариант 3: Средний - 65px',
    description: 'Сбалансированный размер',
    logo1Height: '65px',
    logo2Height: '65px'
  },
  {
    id: 4,
    name: 'Вариант 4: Стандартный+ - 75px',
    description: 'Хорошая видимость',
    logo1Height: '75px',
    logo2Height: '75px'
  },
  {
    id: 5,
    name: 'Вариант 5: Крупный - 85px',
    description: 'Выразительный акцент на бренде',
    logo1Height: '85px',
    logo2Height: '85px'
  },
  {
    id: 6,
    name: 'Вариант 6: Большой - 95px',
    description: 'Максимальная узнаваемость',
    logo1Height: '95px',
    logo2Height: '95px'
  },
  {
    id: 7,
    name: 'Вариант 7: Очень большой - 110px',
    description: 'Премиум стиль, максимальная видимость',
    logo1Height: '110px',
    logo2Height: '110px'
  }
]

function LogoSizeDemo() {
  const [selected, setSelected] = useState(null)
  const [logoType, setLogoType] = useState('logo2') // 'logo1' or 'logo2'

  return (
    <div className="logo-size-demo-page">
      <div className="demo-header-section">
        <h1>Демо: Размеры логотипов</h1>
        <p>7 вариантов размеров для выбора оптимального</p>

        <div className="logo-type-selector">
          <button
            className={`type-btn ${logoType === 'logo1' ? 'active' : ''}`}
            onClick={() => setLogoType('logo1')}
          >
            Logo 1 (Круглый)
          </button>
          <button
            className={`type-btn ${logoType === 'logo2' ? 'active' : ''}`}
            onClick={() => setLogoType('logo2')}
          >
            Logo 2 (Горизонтальный)
          </button>
        </div>
      </div>

      <div className="variants-grid">
        {logoVariants.map(variant => (
          <div
            key={variant.id}
            className={`size-variant-card ${selected === variant.id ? 'selected' : ''}`}
            onClick={() => setSelected(variant.id)}
          >
            <div className="variant-header">
              <h3>{variant.name}</h3>
              <p>{variant.description}</p>
            </div>

            <div className="header-preview">
              {/* Логотип */}
              <div className="logo-preview-section">
                {logoType === 'logo1' ? (
                  <img
                    src="/images/logo-dutystom.png"
                    alt="DUTYSTOM Logo 1"
                    className="preview-logo"
                    style={{ height: variant.logo1Height }}
                  />
                ) : (
                  <img
                    src="/images/logo2-dutystom.png"
                    alt="DUTYSTOM Logo 2"
                    className="preview-logo"
                    style={{ height: variant.logo2Height }}
                  />
                )}
              </div>

              {/* Поисковая строка */}
              <form className="preview-search-form">
                <input
                  type="text"
                  className="preview-search-input"
                  placeholder="Поиск товаров, имплантатов..."
                  readOnly
                />
                <button type="button" className="preview-search-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </form>

              {/* Иконки действий */}
              <div className="preview-actions">
                <button className="preview-icon phone-preview">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </button>

                <button className="preview-icon email-preview">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </button>

                <button className="preview-icon cart-preview">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  <span className="preview-badge">3</span>
                </button>
              </div>
            </div>

            {selected === variant.id && (
              <div className="selected-badge">✓ Выбран</div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="action-buttons">
          <button
            className="btn-apply-size"
            onClick={() => alert(`Применяю вариант ${selected} с ${logoType === 'logo1' ? 'Logo 1 (Круглый)' : 'Logo 2 (Горизонтальный)'}`)}
          >
            Применить вариант {selected}
          </button>
          <button className="btn-reset" onClick={() => setSelected(null)}>
            Сбросить выбор
          </button>
        </div>
      )}
    </div>
  )
}

export default LogoSizeDemo
