import { useState } from 'react'
import './InfoBarDemo.css'

const infoItems = [
  { label: 'Активные акции', value: null, type: 'promo' },
  { label: 'Товаров со скидкой', value: 662, type: 'discount' },
  { label: 'Бренды', value: 48, type: 'brands' },
  { label: 'Постоянных покупателей', value: 1578, type: 'customers' },
  { label: 'Обучения и вебинары', value: null, type: 'education' }
]

function InfoBarDemo() {
  const [selectedVariant, setSelectedVariant] = useState(null)

  const variants = [
    { id: 1, name: 'Минималистичные вкладки', description: 'Чистый дизайн с акцентными стрелками' },
    { id: 2, name: 'Карточки с иконками', description: 'Каждый пункт в отдельной карточке' },
    { id: 3, name: 'Градиентная полоса', description: 'Единая полоса с разделителями' },
    { id: 4, name: 'Кнопки-теги', description: 'Округлые кнопки в ряд' },
    { id: 5, name: 'Компактные бейджи', description: 'Маленькие бейджи с числами' }
  ]

  return (
    <div className="info-bar-demo-page">
      <h1>Демо: Информационная панель</h1>
      <p className="demo-subtitle">Вкладки под категориями: акции, скидки, бренды, обучение</p>

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

          {/* Вариант 1: Минималистичные вкладки */}
          {variant.id === 1 && (
            <div className="info-bar-preview">
              <div className="info-bar-v1">
                {infoItems.map((item, idx) => (
                  <div key={idx} className={`info-item-v1 ${item.type}`}>
                    <span className="arrow-v1">▼</span>
                    <span className="label-v1">{item.label}</span>
                    {item.value && <span className="value-v1">{item.value.toLocaleString()}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Вариант 2: Карточки с иконками */}
          {variant.id === 2 && (
            <div className="info-bar-preview">
              <div className="info-bar-v2">
                {infoItems.map((item, idx) => (
                  <div key={idx} className={`info-card-v2 ${item.type}`}>
                    <div className="icon-v2">
                      {item.type === 'promo' && '🎁'}
                      {item.type === 'discount' && '💰'}
                      {item.type === 'brands' && '🏷️'}
                      {item.type === 'customers' && '👥'}
                      {item.type === 'education' && '🎓'}
                    </div>
                    <div className="content-v2">
                      <span className="label-v2">{item.label}</span>
                      {item.value && <span className="value-v2">{item.value.toLocaleString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Вариант 3: Градиентная полоса */}
          {variant.id === 3 && (
            <div className="info-bar-preview">
              <div className="info-bar-v3">
                {infoItems.map((item, idx) => (
                  <div key={idx} className={`info-segment-v3 ${item.type}`}>
                    <span className="label-v3">{item.label}</span>
                    {item.value && <span className="value-v3">{item.value.toLocaleString()}</span>}
                    {idx < infoItems.length - 1 && <span className="divider-v3">|</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Вариант 4: Кнопки-теги */}
          {variant.id === 4 && (
            <div className="info-bar-preview">
              <div className="info-bar-v4">
                {infoItems.map((item, idx) => (
                  <button key={idx} className={`info-tag-v4 ${item.type}`}>
                    <span className="label-v4">{item.label}</span>
                    {item.value && <span className="value-v4">{item.value.toLocaleString()}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Вариант 5: Компактные бейджи */}
          {variant.id === 5 && (
            <div className="info-bar-preview">
              <div className="info-bar-v5">
                {infoItems.map((item, idx) => (
                  <div key={idx} className={`info-badge-v5 ${item.type}`}>
                    <span className="dot-v5"></span>
                    <span className="label-v5">{item.label}</span>
                    {item.value && <span className="value-v5">{item.value.toLocaleString()}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default InfoBarDemo
