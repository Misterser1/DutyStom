import { useState } from 'react'
import './ProductCardDemo.css'

// Демо товары
const demoProducts = [
  {
    id: 1,
    code: '15187',
    article: 'CRB46LN',
    name: 'Угловой наконечник CRB46LN',
    brand: 'SAESHIN',
    country: 'Южная Корея',
    description: 'Угловой наконечник с водяным охлаждением',
    price: 61750,
    oldPrice: 68500,
    specs: {
      'Макс.скорость': '2000 об/мин',
      'Передаточное значение': '20:1',
      'Фиброоптика': 'Да'
    },
    inStock: true,
    delivery: 'от 1 дня',
    image: null
  },
  {
    id: 2,
    code: '06016',
    article: 'VHS-N',
    name: 'Vonflex S Heavy Normal',
    brand: 'VERICOM',
    country: 'Ю.Корея',
    description: 'Материал стоматологический слепочный силиконовый',
    price: 1795,
    oldPrice: 1994,
    specs: {
      'Время затвердевания': "4'00\"",
      'Пропорции смешивания': '1:1',
      'Рабочее время': "2'15\""
    },
    inStock: true,
    delivery: 'от 1 дня',
    image: null
  },
  {
    id: 3,
    code: '04073',
    article: 'FMS49',
    name: 'FMS49 Втулка для шаблона закрытая',
    brand: 'Dentium',
    country: 'Ю.Корея',
    description: 'Втулка для хирургического шаблона',
    price: 1283,
    oldPrice: null,
    specs: {
      'Высота, мм': '4.0',
      'Диаметр, мм': '6.7'
    },
    inStock: true,
    delivery: 'от 1 дня',
    image: null
  }
]

function ProductCardDemo() {
  const [selectedVariant, setSelectedVariant] = useState(null)

  const variants = [
    { id: 1, name: 'Вариант 1: Горизонтальные строки', className: 'variant-rows' },
    { id: 2, name: 'Вариант 2: Компактные карточки', className: 'variant-compact' },
    { id: 3, name: 'Вариант 3: Премиум карточки', className: 'variant-premium' },
    { id: 4, name: 'Вариант 4: Минималистичные', className: 'variant-minimal' },
    { id: 5, name: 'Вариант 5: С боковой панелью', className: 'variant-sidebar' }
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const renderProductCard = (product, variantClass) => {
    return (
      <div key={product.id} className={`product-card-demo ${variantClass}`}>
        {/* Код и артикул */}
        <div className="product-meta">
          <span className="product-code">КОД: {product.code}</span>
          <span className="product-article">Арт.: {product.article}</span>
        </div>

        {/* Бренд */}
        <div className="product-brand-section">
          <span className="brand-name">{product.brand}</span>
          <span className="brand-country">{product.country}</span>
        </div>

        {/* Изображение */}
        <div className="product-image-demo">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="image-placeholder">
              <svg viewBox="0 0 64 64" fill="currentColor">
                <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
                <circle cx="24" cy="28" r="6" opacity="0.5"/>
                <path d="M8 40l16-12 12 8 20-16v24H8z" opacity="0.4"/>
              </svg>
            </div>
          )}
        </div>

        {/* Название и описание */}
        <div className="product-info-demo">
          <h3 className="product-name-demo">{product.name}</h3>
          <p className="product-description-demo">{product.description}</p>
        </div>

        {/* Характеристики */}
        <div className="product-specs-demo">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="spec-row">
              <span className="spec-label">{key}:</span>
              <span className="spec-value">{value}</span>
            </div>
          ))}
        </div>

        {/* Цена */}
        <div className="product-price-section">
          {product.oldPrice && (
            <span className="old-price">{formatPrice(product.oldPrice)} ₽</span>
          )}
          <span className="current-price">{formatPrice(product.price)} ₽</span>
        </div>

        {/* Количество и кнопки */}
        <div className="product-actions-demo">
          <div className="quantity-control">
            <button className="qty-btn">−</button>
            <span className="qty-value">1</span>
            <button className="qty-btn">+</button>
          </div>
          <button className="add-to-cart-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            В корзину
          </button>
        </div>

        {/* Дополнительная информация */}
        <div className="product-extra">
          <button className="bookmark-btn" title="В закладки">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <div className="availability">
            <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-stock'}`}>
              {product.inStock ? '● в наличии' : '○ нет в наличии'}
            </span>
            <span className="delivery-time">Доставка: {product.delivery}</span>
          </div>
          <button className="details-link">Детальная информация</button>
          <button className="quick-buy-btn">Купить в 1 клик</button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-card-demo-page">
      <h1>Демо: Карточки товаров</h1>
      <p className="demo-subtitle">Выберите понравившийся вариант дизайна</p>

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
          <div className={`products-demo-container ${variant.className}`}>
            {demoProducts.map(product => renderProductCard(product, variant.className))}
          </div>
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

export default ProductCardDemo
