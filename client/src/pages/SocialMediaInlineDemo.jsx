import { useState } from 'react'
import './SocialMediaInlineDemo.css'

const variants = [
  {
    id: 1,
    name: 'Вариант 1: Тонкая полоса с иконками',
    description: 'Минималистичные маленькие иконки в ряд',
    style: 'thin-icons'
  },
  {
    id: 2,
    name: 'Вариант 2: С текстом "Мы в соцсетях"',
    description: 'Текст слева + иконки справа',
    style: 'with-label'
  },
  {
    id: 3,
    name: 'Вариант 3: Glassmorphism эффект',
    description: 'Полупрозрачный фон с размытием',
    style: 'glass-effect'
  },
  {
    id: 4,
    name: 'Вариант 4: Разделители между иконками',
    description: 'Иконки с вертикальными разделителями',
    style: 'with-dividers'
  },
  {
    id: 5,
    name: 'Вариант 5: Hover эффект свечения',
    description: 'Иконки светятся при наведении',
    style: 'glow-hover'
  }
]

function SocialMediaInlineDemo() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="inline-demo-page">
      <div className="inline-demo-header">
        <h1>Демо: Соцсети под поиском (внутри header)</h1>
        <p>5 вариантов тонкой строки с соцсетями</p>
      </div>

      <div className="inline-variants-grid">
        {variants.map(variant => (
          <div
            key={variant.id}
            className={`inline-variant-card ${selected === variant.id ? 'selected' : ''}`}
            onClick={() => setSelected(variant.id)}
          >
            <div className="inline-variant-info">
              <h3>{variant.name}</h3>
              <p>{variant.description}</p>
            </div>

            {/* Полный превью header */}
            <div className="full-header-preview">
              {/* Верхняя часть header */}
              <div className="header-top-section">
                <div className="preview-logo-inline">
                  <img src="/images/logo2-dutystom.png" alt="DUTYSTOM" />
                </div>

                <div className="preview-search-inline">
                  <input type="text" placeholder="Поиск товаров, имплантатов, компонентов..." readOnly />
                  <button className="search-btn-inline">🔍</button>
                </div>

                <div className="preview-icons-inline">
                  <button className="icon-btn">📞</button>
                  <button className="icon-btn">✉️</button>
                  <button className="icon-btn">🛒<span className="badge">3</span></button>
                </div>
              </div>

              {/* Тонкая строка с соцсетями (по вариантам) */}
              <div className={`social-inline-row ${variant.style}`}>
                {variant.style === 'thin-icons' && (
                  <div className="social-thin">
                    <a href="#" className="social-mini vk">VK</a>
                    <a href="#" className="social-mini tg">TG</a>
                    <a href="#" className="social-mini wa">WA</a>
                    <a href="#" className="social-mini ig">IG</a>
                  </div>
                )}

                {variant.style === 'with-label' && (
                  <div className="social-with-label">
                    <span className="social-text">Мы в соцсетях:</span>
                    <div className="social-icons-group">
                      <a href="#" className="social-icon-label vk">VK</a>
                      <a href="#" className="social-icon-label tg">TG</a>
                      <a href="#" className="social-icon-label wa">WA</a>
                      <a href="#" className="social-icon-label ig">IG</a>
                    </div>
                  </div>
                )}

                {variant.style === 'glass-effect' && (
                  <div className="social-glass">
                    <div className="glass-container">
                      <span className="glass-text">Мы в соцсетях</span>
                      <div className="glass-icons">
                        <a href="#" className="glass-icon vk">📱</a>
                        <a href="#" className="glass-icon tg">✈️</a>
                        <a href="#" className="glass-icon wa">💬</a>
                        <a href="#" className="glass-icon ig">📷</a>
                      </div>
                    </div>
                  </div>
                )}

                {variant.style === 'with-dividers' && (
                  <div className="social-dividers">
                    <span className="divider-text">Соцсети:</span>
                    <a href="#" className="divider-icon">VK</a>
                    <span className="divider">|</span>
                    <a href="#" className="divider-icon">TG</a>
                    <span className="divider">|</span>
                    <a href="#" className="divider-icon">WA</a>
                    <span className="divider">|</span>
                    <a href="#" className="divider-icon">IG</a>
                  </div>
                )}

                {variant.style === 'glow-hover' && (
                  <div className="social-glow">
                    <span className="glow-label">Мы в соцсетях:</span>
                    <a href="#" className="glow-icon vk-glow">VK</a>
                    <a href="#" className="glow-icon tg-glow">TG</a>
                    <a href="#" className="glow-icon wa-glow">WA</a>
                    <a href="#" className="glow-icon ig-glow">IG</a>
                  </div>
                )}
              </div>
            </div>

            {selected === variant.id && (
              <div className="selected-badge-inline">✓ Выбран</div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="inline-action-section">
          <button
            className="inline-apply-btn"
            onClick={() => alert(`Применяю вариант ${selected}`)}
          >
            Применить вариант {selected}
          </button>
          <button className="inline-reset-btn" onClick={() => setSelected(null)}>
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}

export default SocialMediaInlineDemo
