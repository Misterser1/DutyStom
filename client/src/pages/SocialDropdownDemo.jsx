import { useState } from 'react'
import './SocialDropdownDemo.css'

const socialNetworks = [
  { id: 'vk', name: 'ВКонтакте', icon: '📱', url: '#', color: '#4a76a8' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', url: '#', color: '#0088cc' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', url: '#', color: '#25d366' },
  { id: 'instagram', name: 'Instagram', icon: '📷', url: '#', color: '#e4405f' }
]

const variants = [
  {
    id: 1,
    name: 'Вариант 1: Кнопка с dropdown',
    description: 'Кнопка "Мы в соцсетях" с выпадающим меню',
    style: 'button-dropdown'
  },
  {
    id: 2,
    name: 'Вариант 2: Иконка + dropdown',
    description: 'Иконка соцсетей с выпадающим меню',
    style: 'icon-dropdown'
  },
  {
    id: 3,
    name: 'Вариант 3: Текст + стрелка',
    description: 'Компактный текст со стрелкой',
    style: 'text-arrow'
  },
  {
    id: 4,
    name: 'Вариант 4: Круглая кнопка',
    description: 'Круглая кнопка с иконкой сети',
    style: 'circle-button'
  },
  {
    id: 5,
    name: 'Вариант 5: Sliding панель',
    description: 'Кнопка с выдвижной панелью справа',
    style: 'sliding-panel'
  }
]

function SocialDropdownDemo() {
  const [selected, setSelected] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState({})

  const toggleDropdown = (variantId) => {
    setDropdownOpen(prev => ({ ...prev, [variantId]: !prev[variantId] }))
  }

  return (
    <div className="social-dropdown-demo-page">
      <div className="social-dropdown-header">
        <h1>Демо: "Мы в соцсетях" с dropdown</h1>
        <p>5 вариантов выпадающего списка соцсетей</p>
      </div>

      <div className="social-dropdown-variants">
        {variants.map(variant => (
          <div
            key={variant.id}
            className={`social-dropdown-card ${selected === variant.id ? 'selected' : ''}`}
            onClick={() => setSelected(variant.id)}
          >
            <div className="variant-description">
              <h3>{variant.name}</h3>
              <p>{variant.description}</p>
            </div>

            {/* Header Preview */}
            <div className="header-preview-social">
              <div className="logo-preview-social">
                <img src="/images/logo2-dutystom.png" alt="DUTYSTOM" />
              </div>

              <div className="search-preview-social">
                <input type="text" placeholder="Поиск..." readOnly />
                <button>🔍</button>
              </div>

              {/* Вариант 1: Button Dropdown */}
              {variant.style === 'button-dropdown' && (
                <div className="social-section-v1">
                  <button
                    className="social-btn-v1"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(variant.id)
                    }}
                  >
                    Мы в соцсетях ▼
                  </button>
                  {dropdownOpen[variant.id] && (
                    <div className="dropdown-social-v1">
                      {socialNetworks.map(social => (
                        <a
                          key={social.id}
                          href={social.url}
                          className="social-link-v1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="social-icon-v1">{social.icon}</span>
                          <span className="social-name-v1">{social.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Вариант 2: Icon Dropdown */}
              {variant.style === 'icon-dropdown' && (
                <div className="social-section-v2">
                  <button
                    className="social-icon-btn-v2"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(variant.id)
                    }}
                  >
                    🌐
                  </button>
                  {dropdownOpen[variant.id] && (
                    <div className="dropdown-social-v2">
                      <div className="dropdown-title-v2">Мы в соцсетях</div>
                      {socialNetworks.map(social => (
                        <a
                          key={social.id}
                          href={social.url}
                          className="social-link-v2"
                          onClick={(e) => e.stopPropagation()}
                          style={{ borderLeftColor: social.color }}
                        >
                          <span className="social-icon-v2">{social.icon}</span>
                          <span className="social-name-v2">{social.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Вариант 3: Text Arrow */}
              {variant.style === 'text-arrow' && (
                <div className="social-section-v3">
                  <button
                    className="social-text-btn-v3"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(variant.id)
                    }}
                  >
                    <span className="social-text-v3">Соцсети</span>
                    <span className="arrow-v3">▼</span>
                  </button>
                  {dropdownOpen[variant.id] && (
                    <div className="dropdown-social-v3">
                      <div className="social-grid-v3">
                        {socialNetworks.map(social => (
                          <a
                            key={social.id}
                            href={social.url}
                            className="social-card-v3"
                            onClick={(e) => e.stopPropagation()}
                            style={{ background: `linear-gradient(135deg, ${social.color}dd, ${social.color})` }}
                          >
                            <span className="social-icon-v3">{social.icon}</span>
                            <span className="social-name-v3">{social.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Вариант 4: Circle Button */}
              {variant.style === 'circle-button' && (
                <div className="social-section-v4">
                  <button
                    className="social-circle-btn-v4"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(variant.id)
                    }}
                  >
                    📱
                  </button>
                  {dropdownOpen[variant.id] && (
                    <div className="dropdown-social-v4">
                      <div className="dropdown-header-v4">
                        <span>Мы в соцсетях</span>
                      </div>
                      <div className="social-list-v4">
                        {socialNetworks.map(social => (
                          <a
                            key={social.id}
                            href={social.url}
                            className="social-item-v4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="social-icon-wrapper-v4" style={{ background: social.color }}>
                              {social.icon}
                            </div>
                            <span>{social.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Вариант 5: Sliding Panel */}
              {variant.style === 'sliding-panel' && (
                <div className="social-section-v5">
                  <button
                    className="social-slide-btn-v5"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(variant.id)
                    }}
                  >
                    Соцсети →
                  </button>
                  {dropdownOpen[variant.id] && (
                    <div className="sliding-panel-v5">
                      <div className="panel-header-v5">
                        <span>Подписывайтесь!</span>
                        <button
                          className="close-btn-v5"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleDropdown(variant.id)
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="panel-content-v5">
                        {socialNetworks.map(social => (
                          <a
                            key={social.id}
                            href={social.url}
                            className="social-panel-link-v5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="social-icon-panel-v5">{social.icon}</span>
                            <div className="social-info-v5">
                              <div className="social-name-panel-v5">{social.name}</div>
                              <div className="social-desc-v5">Подписаться</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="contact-preview-social">
                <span className="contact-text-preview">Связаться</span>
                <button className="contact-icon-preview">📞</button>
                <button className="contact-icon-preview">✉️</button>
                <button className="contact-icon-preview">🛒</button>
              </div>
            </div>

            {selected === variant.id && (
              <div className="selected-indicator-social">✓ Выбран</div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="action-buttons-social">
          <button
            className="apply-btn-social"
            onClick={() => alert(`Применяю вариант ${selected}`)}
          >
            Применить вариант {selected}
          </button>
          <button className="reset-btn-social" onClick={() => setSelected(null)}>
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}

export default SocialDropdownDemo
