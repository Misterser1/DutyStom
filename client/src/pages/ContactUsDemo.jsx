import { useState } from 'react'
import './ContactUsDemo.css'

const variants = [
  {
    id: 1,
    name: 'Вариант 1: Текст сверху',
    description: 'Текст над иконками, центрировано',
    style: 'text-above'
  },
  {
    id: 2,
    name: 'Вариант 2: Текст слева',
    description: 'Текст слева от иконок с разделителем',
    style: 'text-left'
  },
  {
    id: 3,
    name: 'Вариант 3: Вертикальный блок',
    description: 'Текст и иконки вертикально',
    style: 'vertical-block'
  },
  {
    id: 4,
    name: 'Вариант 4: Текст внутри рамки',
    description: 'Текст в красивой рамке с иконками',
    style: 'framed-text'
  },
  {
    id: 5,
    name: 'Вариант 5: Плавающий текст',
    description: 'Текст появляется при наведении',
    style: 'floating-text'
  }
]

function ContactUsDemo() {
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState({})

  return (
    <div className="contact-demo-page">
      <div className="contact-demo-header">
        <h1>Демо: "Связаться с нами"</h1>
        <p>5 вариантов красивого размещения текста</p>
      </div>

      <div className="contact-variants-grid">
        {variants.map(variant => (
          <div
            key={variant.id}
            className={`contact-variant-card ${selected === variant.id ? 'selected' : ''}`}
            onClick={() => setSelected(variant.id)}
          >
            <div className="contact-variant-info">
              <h3>{variant.name}</h3>
              <p>{variant.description}</p>
            </div>

            {/* Header Preview */}
            <div className="contact-header-preview">
              <div className="preview-logo-contact">
                <img src="/images/logo2-dutystom.png" alt="DUTYSTOM" />
              </div>

              <div className="preview-search-contact">
                <input type="text" placeholder="Поиск..." readOnly />
                <button>🔍</button>
              </div>

              {/* Вариант 1: Text Above */}
              {variant.style === 'text-above' && (
                <div
                  className="contact-actions-above"
                  onMouseEnter={() => setHovered(prev => ({ ...prev, [variant.id]: true }))}
                  onMouseLeave={() => setHovered(prev => ({ ...prev, [variant.id]: false }))}
                >
                  <div className="contact-label-above">Связаться с нами</div>
                  <div className="contact-icons-row">
                    <button className="contact-icon-demo phone">📞</button>
                    <button className="contact-icon-demo email">✉️</button>
                    <button className="contact-icon-demo cart">🛒<span className="badge-demo">3</span></button>
                  </div>
                </div>
              )}

              {/* Вариант 2: Text Left */}
              {variant.style === 'text-left' && (
                <div className="contact-actions-left">
                  <div className="contact-label-left">
                    <span>Связаться с нами</span>
                    <div className="vertical-divider"></div>
                  </div>
                  <div className="contact-icons-row">
                    <button className="contact-icon-demo phone">📞</button>
                    <button className="contact-icon-demo email">✉️</button>
                    <button className="contact-icon-demo cart">🛒<span className="badge-demo">3</span></button>
                  </div>
                </div>
              )}

              {/* Вариант 3: Vertical Block */}
              {variant.style === 'vertical-block' && (
                <div className="contact-actions-vertical">
                  <div className="contact-label-vertical">Связаться</div>
                  <button className="contact-icon-demo phone">📞</button>
                  <button className="contact-icon-demo email">✉️</button>
                  <button className="contact-icon-demo cart">🛒<span className="badge-demo">3</span></button>
                </div>
              )}

              {/* Вариант 4: Framed Text */}
              {variant.style === 'framed-text' && (
                <div className="contact-actions-framed">
                  <div className="contact-frame">
                    <div className="contact-label-framed">Связаться с нами</div>
                    <div className="contact-icons-framed">
                      <button className="contact-icon-demo phone">📞</button>
                      <button className="contact-icon-demo email">✉️</button>
                      <button className="contact-icon-demo cart">🛒<span className="badge-demo">3</span></button>
                    </div>
                  </div>
                </div>
              )}

              {/* Вариант 5: Floating Text */}
              {variant.style === 'floating-text' && (
                <div
                  className="contact-actions-floating"
                  onMouseEnter={() => setHovered(prev => ({ ...prev, [variant.id]: true }))}
                  onMouseLeave={() => setHovered(prev => ({ ...prev, [variant.id]: false }))}
                >
                  {hovered[variant.id] && (
                    <div className="contact-label-floating">Связаться с нами</div>
                  )}
                  <div className="contact-icons-row">
                    <button className="contact-icon-demo phone">📞</button>
                    <button className="contact-icon-demo email">✉️</button>
                    <button className="contact-icon-demo cart">🛒<span className="badge-demo">3</span></button>
                  </div>
                </div>
              )}
            </div>

            {selected === variant.id && (
              <div className="selected-badge-contact">✓ Выбран</div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="contact-action-section">
          <button
            className="contact-apply-btn"
            onClick={() => alert(`Применяю вариант ${selected}`)}
          >
            Применить вариант {selected}
          </button>
          <button className="contact-reset-btn" onClick={() => setSelected(null)}>
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}

export default ContactUsDemo
