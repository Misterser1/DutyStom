import { useState } from 'react'
import './HeaderButtonsDemo.css'

function HeaderButtonsDemo() {
  const [selectedVariant, setSelectedVariant] = useState(null)

  const variants = [
    { id: 1, name: 'Жирная белая окантовка', description: 'Толстая белая рамка 3px, крупный шрифт, мягкие тени' },
    { id: 2, name: 'Двойная рамка', description: 'Внутренняя и внешняя окантовка, эффект глубины' },
    { id: 3, name: 'Glow-эффект', description: 'Белое свечение вокруг кнопок, неоновый стиль' },
    { id: 4, name: 'Градиентная рамка', description: 'Рамка с градиентом от белого к бежевому' },
    { id: 5, name: 'Стекло с рамкой', description: 'Glass-морфизм + толстая белая рамка, backdrop blur' }
  ]

  return (
    <div className="header-buttons-demo-page">
      <h1>Демо: Стили кнопок Header</h1>
      <p className="demo-subtitle">Выберите понравившийся вариант дизайна кнопок</p>

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

          {/* Превью Header */}
          <div className={`header-preview v${variant.id}`}>
            <div className="preview-header-content">
              {/* Кнопка "Везде" */}
              <button className={`btn-везде v${variant.id}`}>
                <span>Везде</span>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {/* Поиск */}
              <div className={`search-preview v${variant.id}`}>
                <input type="text" placeholder="Поиск товаров, имплантатов, компонентов..." readOnly />
                <button className="search-btn-preview">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </button>
              </div>

              {/* Контакты */}
              <div className={`contact-badge-preview v${variant.id}`}>
                <span className="icon">📞</span>
                <span>+7 930-950-88-87</span>
              </div>

              <div className={`contact-badge-preview v${variant.id}`}>
                <span className="icon">✉️</span>
                <span>info@dutystom.ru</span>
              </div>

              {/* Кнопка соцсетей */}
              <button className={`btn-social v${variant.id}`}>
                <span>Мы в соцсетях</span>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {/* Корзина */}
              <button className={`btn-cart v${variant.id}`}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
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

export default HeaderButtonsDemo
