import { useState } from 'react'
import './LogoDemo.css'

const variants = [
  {
    id: 1,
    name: 'Вариант 1: Круглый логотип (оригинал)',
    description: 'Круглая форма, стандартный размер',
    className: 'variant-1'
  },
  {
    id: 2,
    name: 'Вариант 2: Большой в центре',
    description: 'Увеличенный логотип по центру хедера',
    className: 'variant-2'
  },
  {
    id: 3,
    name: 'Вариант 3: Компактный слева',
    description: 'Небольшой логотип слева, экономия места',
    className: 'variant-3'
  },
  {
    id: 4,
    name: 'Вариант 4: С тенью и анимацией',
    description: 'Логотип с эффектами при наведении',
    className: 'variant-4'
  },
  {
    id: 5,
    name: 'Вариант 5: Премиум стиль',
    description: 'Крупный логотип с градиентным фоном',
    className: 'variant-5'
  }
]

function LogoDemo() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="logo-demo-page">
      <div className="demo-header">
        <h1>Демо: 5 вариантов размещения логотипа</h1>
        <p>Выберите понравившийся вариант</p>
      </div>

      <div className="variants-grid">
        {variants.map(variant => (
          <div
            key={variant.id}
            className={`variant-card ${selected === variant.id ? 'selected' : ''}`}
            onClick={() => setSelected(variant.id)}
          >
            <div className="variant-header">
              <h3>{variant.name}</h3>
              <p>{variant.description}</p>
            </div>

            <div className={`demo-preview ${variant.className}`}>
              <div className="demo-header-mock">
                <div className="phone-mock">
                  <span>📞</span>
                  <span>+7 930-950-88-87</span>
                </div>

                <div className="logo-container">
                  <img src="/images/logo-dutystom.png" alt="DUTYSTOM" className="demo-logo" />
                </div>

                <div className="cart-mock">
                  <span>🛒</span>
                </div>
              </div>
            </div>

            {selected === variant.id && (
              <div className="selected-badge">✓ Выбрано</div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="action-buttons">
          <button className="btn-apply" onClick={() => alert(`Применить вариант ${selected}`)}>
            Применить выбранный вариант
          </button>
          <button className="btn-reset" onClick={() => setSelected(null)}>
            Сбросить выбор
          </button>
        </div>
      )}
    </div>
  )
}

export default LogoDemo
