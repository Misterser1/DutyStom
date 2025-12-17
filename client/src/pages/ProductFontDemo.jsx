import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ProductFontDemo.css'

// Демо товар
const demoProduct = {
  id: 1,
  code: '15187',
  article: 'CRB46LN',
  name: 'Угловой наконечник CRB46LN',
  brand: 'SAESHIN',
  country: 'Южная Корея',
  price: 61750,
  oldPrice: 68500,
  specs: {
    'Водяное охлаждение': 'Да',
    'Макс.скорость': '2000 об/мин',
    'Передаточное значение': '20:1',
    'Фиброоптика': 'Да'
  },
  inStock: true,
  delivery: 'от 1 дня'
}

function ProductFontDemo() {
  const [selectedVariant, setSelectedVariant] = useState(null)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const variants = [
    { id: 1, name: 'Вариант 1: Крупный читаемый', className: 'font-large' },
    { id: 2, name: 'Вариант 2: Средний сбалансированный', className: 'font-medium' },
    { id: 3, name: 'Вариант 3: Жирный акцентный', className: 'font-bold' },
    { id: 4, name: 'Вариант 4: Элегантный с засечками', className: 'font-serif' },
    { id: 5, name: 'Вариант 5: Современный контрастный', className: 'font-modern' }
  ]

  const renderCard = (variant) => (
    <div className={`demo-card ${variant.className}`}>
      {/* Колонка 1: Код, артикул */}
      <div className="demo-col demo-col-meta">
        <span className="demo-code">КОД: {demoProduct.code}</span>
        <span className="demo-article-small">Арт.: {demoProduct.article}</span>
      </div>

      {/* Колонка 2: Бренд */}
      <div className="demo-col demo-col-brand">
        <span className="demo-brand-name">{demoProduct.brand}</span>
        <span className="demo-brand-country">{demoProduct.country}</span>
      </div>

      {/* Колонка 3: Изображение */}
      <div className="demo-col demo-col-image">
        <div className="demo-image-placeholder">
          <svg viewBox="0 0 64 64" fill="currentColor">
            <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
            <circle cx="24" cy="28" r="6" opacity="0.5"/>
            <path d="M8 40l16-12 12 8 20-16v24H8z" opacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Колонка 4: Название */}
      <div className="demo-col demo-col-name">
        <span className="demo-article-inline">{demoProduct.article}</span>
        <h3 className="demo-name">{demoProduct.name}</h3>
      </div>

      {/* Колонка 5: Характеристики */}
      <div className="demo-col demo-col-specs">
        {Object.entries(demoProduct.specs).map(([key, value]) => (
          <div key={key} className="demo-spec-row">
            <span className="demo-spec-key">{key}:</span>
            <span className="demo-spec-value">{value}</span>
          </div>
        ))}
      </div>

      {/* Колонка 6: Цена */}
      <div className="demo-col demo-col-price">
        <span className="demo-price-label">Цена</span>
        <span className="demo-old-price">{formatPrice(demoProduct.oldPrice)} ₽</span>
        <span className="demo-current-price">{formatPrice(demoProduct.price)} ₽</span>
      </div>

      {/* Колонка 7: Действия */}
      <div className="demo-col demo-col-actions">
        <div className="demo-quantity">
          <button className="demo-qty-btn">−</button>
          <span className="demo-qty-value">1</span>
          <button className="demo-qty-btn">+</button>
        </div>

        <button className="demo-bookmark-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          В закладки
        </button>

        <div className="demo-availability">
          <span className="demo-stock in-stock">В наличии: есть</span>
          <span className="demo-delivery">Доставка: {demoProduct.delivery}</span>
        </div>

        <button className="demo-add-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          В корзину
        </button>

        <div className="demo-links">
          <a href="#" className="demo-detail-link">Детальная информация</a>
          <button className="demo-quick-buy">Купить в 1 клик</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="product-font-demo-page">
      <h1>Демо: Шрифты карточек товаров</h1>
      <p className="demo-subtitle">Выберите вариант с лучшей читаемостью</p>

      {variants.map(variant => (
        <section
          key={variant.id}
          className={`variant-section ${selectedVariant === variant.id ? 'selected' : ''}`}
          onClick={() => setSelectedVariant(variant.id)}
        >
          <div className="variant-header">
            <h2>{variant.name}</h2>
            {selectedVariant === variant.id && <span className="selected-badge">Выбрано</span>}
          </div>
          {renderCard(variant)}
        </section>
      ))}

      {selectedVariant && (
        <div className="demo-actions">
          <button className="apply-btn" onClick={() => alert(`Применён вариант ${selectedVariant}`)}>
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

export default ProductFontDemo
