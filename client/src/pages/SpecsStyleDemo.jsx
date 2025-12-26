import { useState } from 'react'
import './SpecsStyleDemo.css'

// Демо данные характеристик
const demoSpecs = {
  type: 'Имплантат',
  brand: 'MEGAGEN',
  country: 'Корея',
  connection: 'Конус 10°',
  surface: 'Xpeed (ионы кальция)',
  diameters: '3.5, 4.0, 4.5, 5.0 мм',
  lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
  material: 'Титан Grade 4'
}

// Оптовые цены
const demoPrices = {
  qty_10: 7500,
  qty_30: 7000,
  qty_50: 6500,
  qty_200: 6000,
  qty_1000: 5000
}

const SPEC_LABELS = {
  type: 'Тип',
  brand: 'Бренд',
  country: 'Страна',
  connection: 'Соединение',
  surface: 'Поверхность',
  diameters: 'Диаметры',
  lengths: 'Длины',
  material: 'Материал'
}

function SpecsStyleDemo() {
  const [selectedStyle, setSelectedStyle] = useState(1)

  return (
    <div className="specs-demo-page">
      <h1>Варианты оформления характеристик</h1>

      <div className="style-selector">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            className={selectedStyle === num ? 'active' : ''}
            onClick={() => setSelectedStyle(num)}
          >
            Вариант {num}
          </button>
        ))}
      </div>

      <div className="demo-container">
        {/* Вариант 1: Карточки с иконками */}
        {selectedStyle === 1 && (
          <div className="specs-style-1">
            <h3 className="specs-header">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              Характеристики
            </h3>
            <div className="specs-cards">
              {Object.entries(demoSpecs).map(([key, value]) => (
                <div key={key} className="spec-card">
                  <span className="spec-card-label">{SPEC_LABELS[key]}</span>
                  <span className="spec-card-value">{value}</span>
                </div>
              ))}
            </div>

            <h3 className="specs-header prices-header">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
              Оптовые цены
            </h3>
            <div className="price-tiers">
              {Object.entries(demoPrices).map(([key, value]) => (
                <div key={key} className="price-tier">
                  <span className="tier-qty">от {key.replace('qty_', '')} шт.</span>
                  <span className="tier-price">${value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вариант 2: Компактная таблица */}
        {selectedStyle === 2 && (
          <div className="specs-style-2">
            <div className="specs-table-wrapper">
              <h3>Характеристики</h3>
              <table className="specs-table">
                <tbody>
                  {Object.entries(demoSpecs).map(([key, value]) => (
                    <tr key={key}>
                      <td className="table-label">{SPEC_LABELS[key]}</td>
                      <td className="table-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prices-table-wrapper">
              <h3>Оптовые цены</h3>
              <div className="prices-row">
                {Object.entries(demoPrices).map(([key, value]) => (
                  <div key={key} className="price-column">
                    <span className="col-qty">{key.replace('qty_', '')}+</span>
                    <span className="col-price">${value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Вариант 3: Теги/чипы */}
        {selectedStyle === 3 && (
          <div className="specs-style-3">
            <div className="specs-section">
              <h3>Характеристики</h3>
              <div className="specs-chips">
                {Object.entries(demoSpecs).map(([key, value]) => (
                  <div key={key} className="spec-chip">
                    <span className="chip-label">{SPEC_LABELS[key]}:</span>
                    <span className="chip-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="prices-section">
              <h3>Скидки при заказе</h3>
              <div className="discount-chips">
                {Object.entries(demoPrices).map(([key, value], idx) => (
                  <div key={key} className={`discount-chip tier-${idx}`}>
                    <span className="discount-qty">от {key.replace('qty_', '')} шт.</span>
                    <span className="discount-price">${value}</span>
                    {idx > 0 && (
                      <span className="discount-badge">
                        -{Math.round((1 - value / Object.values(demoPrices)[0]) * 100)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Вариант 4: Минималистичный с разделителями */}
        {selectedStyle === 4 && (
          <div className="specs-style-4">
            <div className="minimal-specs">
              <div className="minimal-header">Технические характеристики</div>
              {Object.entries(demoSpecs).map(([key, value], idx) => (
                <div key={key} className="minimal-row">
                  <span className="minimal-label">{SPEC_LABELS[key]}</span>
                  <span className="minimal-dots"></span>
                  <span className="minimal-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="minimal-prices">
              <div className="minimal-header">Цены от объёма</div>
              <div className="price-scale">
                {Object.entries(demoPrices).map(([key, value], idx) => (
                  <div key={key} className="scale-item" style={{ '--tier': idx }}>
                    <div className="scale-bar"></div>
                    <span className="scale-qty">{key.replace('qty_', '')}+</span>
                    <span className="scale-price">${value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Вариант 5: Двухколоночный с акцентами */}
        {selectedStyle === 5 && (
          <div className="specs-style-5">
            <div className="two-column-layout">
              <div className="column-specs">
                <div className="column-title">
                  <span className="title-icon">📋</span>
                  Характеристики
                </div>
                <div className="column-content">
                  {Object.entries(demoSpecs).map(([key, value]) => (
                    <div key={key} className="accent-row">
                      <span className="accent-label">{SPEC_LABELS[key]}</span>
                      <span className="accent-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="column-prices">
                <div className="column-title">
                  <span className="title-icon">💰</span>
                  Оптовые цены
                </div>
                <div className="column-content">
                  {Object.entries(demoPrices).map(([key, value], idx) => (
                    <div key={key} className={`price-row tier-${idx}`}>
                      <span className="price-label">от {key.replace('qty_', '')} шт.</span>
                      <span className="price-amount">${value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpecsStyleDemo
