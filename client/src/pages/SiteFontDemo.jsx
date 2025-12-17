import { useState } from 'react'
import { Link } from 'react-router-dom'
import './SiteFontDemo.css'

// Демо товар для превью
const demoProduct = {
  id: 1,
  code: '15187',
  article: 'CRB46LN',
  name: 'Угловой наконечник CRB46LN с водяным охлаждением',
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

// Категории для превью
const demoCategories = [
  { id: 1, name: 'Имплантаты', slug: 'implants' },
  { id: 2, name: 'Компоненты', slug: 'components' },
  { id: 3, name: 'Костные материалы', slug: 'bone' },
  { id: 4, name: 'Мембраны', slug: 'membrane' },
  { id: 5, name: 'Расходники', slug: 'supplies' }
]

function SiteFontDemo() {
  const [selectedVariant, setSelectedVariant] = useState(null)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const variants = [
    { id: 1, name: 'Крупный системный (Segoe UI)', className: 'font-segoe', description: 'Системный шрифт, увеличенный на 25-30%' },
    { id: 2, name: 'Современный Inter', className: 'font-inter', description: 'Чёткие буквы, отличная читаемость на экране' },
    { id: 3, name: 'Классический Roboto', className: 'font-roboto', description: 'Нейтральный, профессиональный вид' },
    { id: 4, name: 'Элегантный Open Sans', className: 'font-opensans', description: 'Округлые формы, дружелюбный стиль' },
    { id: 5, name: 'Премиум Montserrat', className: 'font-montserrat', description: 'Геометрический, современный дизайн' }
  ]

  const renderPreview = (variant) => (
    <div className={`site-preview ${variant.className}`}>
      {/* Мини Header */}
      <div className="preview-header">
        <div className="preview-logo">DUTYSTOM</div>
        <div className="preview-search">
          <span className="preview-search-type">Везде</span>
          <input type="text" placeholder="Поиск товаров, имплантатов..." readOnly />
        </div>
        <div className="preview-actions">
          <span className="preview-contact">Связаться с нами</span>
          <span className="preview-social">Мы в соцсетях</span>
        </div>
      </div>

      {/* Мини CategoryBar */}
      <div className="preview-categories">
        {demoCategories.map(cat => (
          <div key={cat.id} className={`preview-category ${cat.id === 1 ? 'active' : ''}`}>
            <div className="preview-cat-icon">
              <svg viewBox="0 0 64 64" fill="currentColor">
                <path d="M32 4c-3 0-5.5 2-6.5 5l-1 4c-.5 2-.5 4 0 6l2 8c.5 2 .5 4 0 6l-2 8c-.5 2-.5 4 0 6l2 8c.5 2 .5 4 0 6l-1 4c1 3 3.5 5 6.5 5s5.5-2 6.5-5l-1-4c-.5-2-.5-4 0-6l2-8c.5-2 .5-4 0-6l-2-8c-.5-2-.5-4 0-6l2-8c.5-2 .5-4 0-6l-1-4c-1-3-3.5-5-6.5-5z"/>
              </svg>
            </div>
            <span className="preview-cat-name">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Заголовок секции */}
      <h2 className="preview-section-title">Популярные товары</h2>

      {/* Карточка товара */}
      <div className="preview-product-card">
        <div className="preview-col preview-col-meta">
          <span className="preview-code">КОД: {demoProduct.code}</span>
          <span className="preview-article-small">Арт.: {demoProduct.article}</span>
        </div>

        <div className="preview-col preview-col-brand">
          <span className="preview-brand-name">{demoProduct.brand}</span>
          <span className="preview-brand-country">{demoProduct.country}</span>
        </div>

        <div className="preview-col preview-col-image">
          <div className="preview-image-placeholder">
            <svg viewBox="0 0 64 64" fill="currentColor">
              <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
              <circle cx="24" cy="28" r="6" opacity="0.5"/>
              <path d="M8 40l16-12 12 8 20-16v24H8z" opacity="0.4"/>
            </svg>
          </div>
        </div>

        <div className="preview-col preview-col-name">
          <span className="preview-article-inline">{demoProduct.article}</span>
          <h3 className="preview-name">{demoProduct.name}</h3>
        </div>

        <div className="preview-col preview-col-specs">
          {Object.entries(demoProduct.specs).map(([key, value]) => (
            <div key={key} className="preview-spec-row">
              <span className="preview-spec-key">{key}:</span>
              <span className="preview-spec-value">{value}</span>
            </div>
          ))}
        </div>

        <div className="preview-col preview-col-price">
          <span className="preview-price-label">Цена</span>
          <span className="preview-old-price">{formatPrice(demoProduct.oldPrice)} ₽</span>
          <span className="preview-current-price">{formatPrice(demoProduct.price)} ₽</span>
        </div>

        <div className="preview-col preview-col-actions">
          <div className="preview-quantity">
            <button className="preview-qty-btn">−</button>
            <span className="preview-qty-value">1</span>
            <button className="preview-qty-btn">+</button>
          </div>

          <button className="preview-bookmark-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            В закладки
          </button>

          <div className="preview-availability">
            <span className="preview-stock">В наличии: есть</span>
            <span className="preview-delivery">Доставка: {demoProduct.delivery}</span>
          </div>

          <button className="preview-add-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            В корзину
          </button>

          <div className="preview-links">
            <a href="#" className="preview-detail-link">Детальная информация</a>
            <button className="preview-quick-buy">Купить в 1 клик</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="site-font-demo-page">
      <h1>Демо: Шрифты для всего сайта</h1>
      <p className="demo-subtitle">Выберите вариант типографики с увеличенными шрифтами</p>

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
          {renderPreview(variant)}
        </section>
      ))}

      {selectedVariant && (
        <div className="demo-actions">
          <button className="apply-btn" onClick={() => alert(`Применён вариант ${selectedVariant}: ${variants.find(v => v.id === selectedVariant)?.name}`)}>
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

export default SiteFontDemo
