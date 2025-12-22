import { useState } from 'react'
import './DropdownStyleDemo.css'

const searchFilters = [
  { label: 'Везде', value: 'all' },
  { label: 'В названии', value: 'name' },
  { label: 'В каталогах', value: 'catalog' },
  { label: 'В описании', value: 'description' },
  { label: 'По артикулу', value: 'article' },
  { label: 'По производителю', value: 'brand' },
  { label: 'По модели', value: 'model' }
]

const educationItems = [
  { label: 'Вебинары', icon: '📹' },
  { label: 'Курсы', icon: '📚' },
  { label: 'Мастер-классы', icon: '🎓' },
  { label: 'Статьи', icon: '📄' }
]

function DropdownStyleDemo() {
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [openDropdown, setOpenDropdown] = useState({})

  const toggleDropdown = (id) => {
    setOpenDropdown(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const variants = [
    { id: 1, name: 'Мягкие тени с иконками', description: 'Плавные тени, иконки слева, hover с подсветкой' },
    { id: 2, name: 'Градиентный акцент', description: 'Левая цветная полоса при hover, плавные переходы' },
    { id: 3, name: 'Карточки с разделителями', description: 'Тонкие линии между пунктами, минимализм' },
    { id: 4, name: 'Округлые пункты', description: 'Каждый пункт как отдельная кнопка с фоном' },
    { id: 5, name: 'Современный glass-эффект', description: 'Полупрозрачный фон, размытие, неон' }
  ]

  return (
    <div className="dropdown-style-demo-page">
      <h1>Демо: Стили выпадающих меню</h1>
      <p className="demo-subtitle">Выберите понравившийся вариант дизайна</p>

      {variants.map(variant => (
        <section
          key={variant.id}
          className={`variant-section ${selectedVariant === variant.id ? 'selected' : ''}`}
          onClick={() => setSelectedVariant(variant.id)}
        >
          <div className="variant-header">
            <div className="variant-info">
              <h2>Вариант {variant.id}: {variant.name}</h2>
              <p className="variant-desc">{variant.description}</p>
            </div>
            {selectedVariant === variant.id && <span className="selected-badge">Выбрано</span>}
          </div>

          <div className="dropdown-preview">
            {/* Вариант 1: Мягкие тени с иконками */}
            {variant.id === 1 && (
              <div className="preview-row">
                <div className="dropdown-demo-v1">
                  <button
                    className={`trigger-v1 ${openDropdown['v1-search'] ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown('v1-search'); }}
                  >
                    <span>Везде</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {openDropdown['v1-search'] && (
                    <div className="menu-v1">
                      {searchFilters.map((item, idx) => (
                        <div key={idx} className="menu-item-v1">
                          <span className="icon-v1">
                            {idx === 0 && '🔍'}
                            {idx === 1 && '📝'}
                            {idx === 2 && '📁'}
                            {idx === 3 && '📋'}
                            {idx === 4 && '🏷️'}
                            {idx === 5 && '🏭'}
                            {idx === 6 && '📦'}
                          </span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dropdown-demo-v1">
                  <button
                    className={`trigger-v1 education ${openDropdown['v1-edu'] ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown('v1-edu'); }}
                  >
                    <span className="edu-icon">🎓</span>
                    <span>Обучения и вебинары</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {openDropdown['v1-edu'] && (
                    <div className="menu-v1">
                      {educationItems.map((item, idx) => (
                        <div key={idx} className="menu-item-v1">
                          <span className="icon-v1">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Вариант 2: Градиентный акцент */}
            {variant.id === 2 && (
              <div className="preview-row">
                <div className="dropdown-demo-v2">
                  <button
                    className={`trigger-v2 ${openDropdown['v2-search'] ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown('v2-search'); }}
                  >
                    <span>Везде</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {openDropdown['v2-search'] && (
                    <div className="menu-v2">
                      {searchFilters.map((item, idx) => (
                        <div key={idx} className="menu-item-v2">
                          <span className="accent-bar"></span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dropdown-demo-v2">
                  <button
                    className={`trigger-v2 education ${openDropdown['v2-edu'] ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown('v2-edu'); }}
                  >
                    <span className="edu-icon">🎓</span>
                    <span>Обучения и вебинары</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {openDropdown['v2-edu'] && (
                    <div className="menu-v2">
                      {educationItems.map((item, idx) => (
                        <div key={idx} className="menu-item-v2">
                          <span className="accent-bar"></span>
                          <span className="item-icon">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Вариант 3: Карточки с разделителями */}
            {variant.id === 3 && (
              <div className="preview-row">
                <div className="dropdown-demo-v3">
                  <button
                    className={`trigger-v3 ${openDropdown['v3-search'] ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown('v3-search'); }}
                  >
                    <span>Везде</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {openDropdown['v3-search'] && (
                    <div className="menu-v3">
                      {searchFilters.map((item, idx) => (
                        <div key={idx} className="menu-item-v3">
                          <span>{item.label}</span>
                          <svg className="check-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dropdown-demo-v3">
                  <button
                    className={`trigger-v3 education ${openDropdown['v3-edu'] ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown('v3-edu'); }}
                  >
                    <span className="edu-icon">🎓</span>
                    <span>Обучения и вебинары</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {openDropdown['v3-edu'] && (
                    <div className="menu-v3">
                      {educationItems.map((item, idx) => (
                        <div key={idx} className="menu-item-v3">
                          <span>{item.label}</span>
                          <span className="arrow-icon">→</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Вариант 4: Округлые пункты */}
            {variant.id === 4 && (
              <div className="preview-row">
                <div className="dropdown-demo-v4">
                  <button
                    className={`trigger-v4 ${openDropdown['v4-search'] ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown('v4-search'); }}
                  >
                    <span>Везде</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {openDropdown['v4-search'] && (
                    <div className="menu-v4">
                      {searchFilters.map((item, idx) => (
                        <button key={idx} className="menu-item-v4">
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dropdown-demo-v4">
                  <button
                    className={`trigger-v4 education ${openDropdown['v4-edu'] ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown('v4-edu'); }}
                  >
                    <span className="edu-icon">🎓</span>
                    <span>Обучения и вебинары</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {openDropdown['v4-edu'] && (
                    <div className="menu-v4">
                      {educationItems.map((item, idx) => (
                        <button key={idx} className="menu-item-v4">
                          <span className="item-icon">{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Вариант 5: Glass-эффект */}
            {variant.id === 5 && (
              <div className="preview-row dark-bg">
                <div className="dropdown-demo-v5">
                  <button
                    className={`trigger-v5 ${openDropdown['v5-search'] ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown('v5-search'); }}
                  >
                    <span>Везде</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {openDropdown['v5-search'] && (
                    <div className="menu-v5">
                      {searchFilters.map((item, idx) => (
                        <div key={idx} className="menu-item-v5">
                          <span className="glow-dot"></span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dropdown-demo-v5">
                  <button
                    className={`trigger-v5 education ${openDropdown['v5-edu'] ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleDropdown('v5-edu'); }}
                  >
                    <span className="edu-icon">🎓</span>
                    <span>Обучения и вебинары</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {openDropdown['v5-edu'] && (
                    <div className="menu-v5">
                      {educationItems.map((item, idx) => (
                        <div key={idx} className="menu-item-v5">
                          <span className="glow-dot"></span>
                          <span className="item-icon">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {selectedVariant && (
        <div className="demo-actions">
          <button
            className="apply-btn"
            onClick={() => alert(`Применён вариант ${selectedVariant}: ${variants.find(v => v.id === selectedVariant)?.name}`)}
          >
            Применить вариант {selectedVariant}
          </button>
          <button className="reset-btn" onClick={() => setSelectedVariant(null)}>
            Сбросить выбор
          </button>
        </div>
      )}
    </div>
  )
}

export default DropdownStyleDemo
