import { useState } from 'react'
import './SocialMediaDemo.css'

const socialVariants = [
  {
    id: 1,
    name: 'Вариант 1: Компактная горизонтальная полоса',
    description: 'Тонкая полоса с иконками соцсетей, появляется при наведении',
    style: 'compact-horizontal'
  },
  {
    id: 2,
    name: 'Вариант 2: Плавающая панель справа',
    description: 'Вертикальная панель справа с анимацией появления',
    style: 'floating-side'
  },
  {
    id: 3,
    name: 'Вариант 3: Выпадающий блок под header',
    description: 'Полноценный блок с текстом и большими иконками',
    style: 'dropdown-full'
  },
  {
    id: 4,
    name: 'Вариант 4: Минималистичные кнопки',
    description: 'Простые круглые кнопки с эффектом glassmorphism',
    style: 'minimal-circles'
  },
  {
    id: 5,
    name: 'Вариант 5: Карточки соцсетей',
    description: 'Красивые карточки с названиями и градиентами',
    style: 'social-cards'
  }
]

function SocialMediaDemo() {
  const [selected, setSelected] = useState(null)
  const [isOpen, setIsOpen] = useState({})

  const toggleSocial = (id) => {
    setIsOpen(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="social-demo-page">
      <div className="demo-header">
        <h1>Демо: Соцсети под поиском</h1>
        <p>5 вариантов красивого отображения социальных сетей</p>
      </div>

      <div className="variants-container">
        {socialVariants.map(variant => (
          <div
            key={variant.id}
            className={`social-variant-card ${selected === variant.id ? 'selected' : ''}`}
            onClick={() => setSelected(variant.id)}
          >
            <div className="variant-info">
              <h3>{variant.name}</h3>
              <p>{variant.description}</p>
            </div>

            {/* Превью header с поиском */}
            <div className="preview-header-section">
              <div className="preview-logo">
                <img src="/images/logo2-dutystom.png" alt="DUTYSTOM" style={{ height: '70px' }} />
              </div>

              <div className="preview-search">
                <input type="text" placeholder="Поиск товаров..." readOnly />
                <button>🔍</button>
              </div>

              <div className="preview-actions-icons">
                <button>📞</button>
                <button>✉️</button>
                <button>🛒</button>
              </div>
            </div>

            {/* Кнопка для показа соцсетей */}
            <button
              className="toggle-social-btn"
              onClick={(e) => {
                e.stopPropagation()
                toggleSocial(variant.id)
              }}
            >
              {isOpen[variant.id] ? 'Скрыть соцсети' : 'Показать соцсети'}
            </button>

            {/* Превью соцсетей в зависимости от варианта */}
            {isOpen[variant.id] && (
              <div className={`social-preview ${variant.style}`}>
                {variant.style === 'compact-horizontal' && (
                  <div className="social-compact">
                    <span className="social-label">Мы в соц сетях:</span>
                    <div className="social-icons-row">
                      <a href="#" className="social-icon vk">VK</a>
                      <a href="#" className="social-icon telegram">TG</a>
                      <a href="#" className="social-icon whatsapp">WA</a>
                      <a href="#" className="social-icon instagram">IG</a>
                    </div>
                  </div>
                )}

                {variant.style === 'floating-side' && (
                  <div className="social-floating">
                    <div className="floating-title">Соцсети</div>
                    <a href="#" className="floating-item vk-bg">
                      <span className="icon">📱</span>
                      <span className="name">VK</span>
                    </a>
                    <a href="#" className="floating-item telegram-bg">
                      <span className="icon">✈️</span>
                      <span className="name">Telegram</span>
                    </a>
                    <a href="#" className="floating-item whatsapp-bg">
                      <span className="icon">💬</span>
                      <span className="name">WhatsApp</span>
                    </a>
                    <a href="#" className="floating-item instagram-bg">
                      <span className="icon">📷</span>
                      <span className="name">Instagram</span>
                    </a>
                  </div>
                )}

                {variant.style === 'dropdown-full' && (
                  <div className="social-dropdown">
                    <h4>Мы в социальных сетях</h4>
                    <p className="dropdown-subtitle">Следите за новинками и акциями</p>
                    <div className="social-grid">
                      <a href="#" className="social-card-item vk-card">
                        <div className="card-icon">📱</div>
                        <div className="card-name">ВКонтакте</div>
                      </a>
                      <a href="#" className="social-card-item telegram-card">
                        <div className="card-icon">✈️</div>
                        <div className="card-name">Telegram</div>
                      </a>
                      <a href="#" className="social-card-item whatsapp-card">
                        <div className="card-icon">💬</div>
                        <div className="card-name">WhatsApp</div>
                      </a>
                      <a href="#" className="social-card-item instagram-card">
                        <div className="card-icon">📷</div>
                        <div className="card-name">Instagram</div>
                      </a>
                    </div>
                  </div>
                )}

                {variant.style === 'minimal-circles' && (
                  <div className="social-minimal">
                    <span className="minimal-text">Мы в соц сетях</span>
                    <div className="minimal-circles">
                      <a href="#" className="circle-icon vk-circle">VK</a>
                      <a href="#" className="circle-icon tg-circle">TG</a>
                      <a href="#" className="circle-icon wa-circle">WA</a>
                      <a href="#" className="circle-icon ig-circle">IG</a>
                    </div>
                  </div>
                )}

                {variant.style === 'social-cards' && (
                  <div className="social-cards-grid">
                    <div className="social-big-card vk-gradient">
                      <div className="big-card-icon">📱</div>
                      <div className="big-card-title">ВКонтакте</div>
                      <div className="big-card-desc">Новости и акции</div>
                    </div>
                    <div className="social-big-card telegram-gradient">
                      <div className="big-card-icon">✈️</div>
                      <div className="big-card-title">Telegram</div>
                      <div className="big-card-desc">Быстрая связь</div>
                    </div>
                    <div className="social-big-card whatsapp-gradient">
                      <div className="big-card-icon">💬</div>
                      <div className="big-card-title">WhatsApp</div>
                      <div className="big-card-desc">Консультации</div>
                    </div>
                    <div className="social-big-card instagram-gradient">
                      <div className="big-card-icon">📷</div>
                      <div className="big-card-title">Instagram</div>
                      <div className="big-card-desc">Фото товаров</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selected === variant.id && (
              <div className="selected-indicator">✓ Выбран</div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="action-section">
          <button
            className="apply-btn"
            onClick={() => alert(`Применяю вариант ${selected}`)}
          >
            Применить вариант {selected}
          </button>
          <button className="reset-btn" onClick={() => setSelected(null)}>
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}

export default SocialMediaDemo
