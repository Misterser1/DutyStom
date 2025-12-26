import { useState } from 'react'
import './CardGradientDemo.css'

// Демо данные товара
const demoProduct = {
  id: 1,
  code: '07264',
  article: 'P3157516211',
  brand: 'MEGAGEN',
  country: 'Корея',
  name: 'BlueDiamond Regular Thread',
  description: 'Имплантат с обычной резьбой. Xpeed поверхность.',
  image_url: '/images/products/product-27.png',
  price: 13500,
  inStock: true,
  specs: {
    connection: 'Конус 10°',
    surface: 'Xpeed',
    diameters: '3.5, 4.0, 4.5, 5.0 мм',
    lengths: '7-15 мм',
    material: 'Титан Grade 4'
  }
}

function CardGradientDemo() {
  const [selectedStyle, setSelectedStyle] = useState(1)
  const [quantity, setQuantity] = useState(1)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
  }

  const styles = [
    { id: 1, name: 'Teal градиент' },
    { id: 2, name: 'Beige → Teal' },
    { id: 3, name: 'Акцентная полоса' },
    { id: 4, name: 'Glassmorphism' },
    { id: 5, name: 'Split секции' },
  ]

  const renderCard = (styleClass) => (
    <div className={`gradient-card ${styleClass}`}>
      <div className="gc-left">
        <div className="gc-code">КОД: {demoProduct.code}</div>
        <div className="gc-article">Арт.: {demoProduct.article}</div>
        <div className="gc-brand">{demoProduct.brand}</div>
        <div className="gc-country">{demoProduct.country}</div>
      </div>

      <div className="gc-image">
        <img src={demoProduct.image_url} alt={demoProduct.name} />
      </div>

      <div className="gc-info">
        <h3 className="gc-name">{demoProduct.name}</h3>
        <p className="gc-desc">{demoProduct.description}</p>
        <div className="gc-specs">
          {Object.entries(demoProduct.specs).slice(0, 4).map(([key, value]) => (
            <span key={key} className="gc-spec">
              <span className="gc-spec-key">{key}:</span> {value}
            </span>
          ))}
        </div>
      </div>

      <div className="gc-right">
        <div className="gc-right-row">
          <div className="gc-price">{formatPrice(demoProduct.price)}</div>
          <div className={`gc-stock ${demoProduct.inStock ? 'in' : 'out'}`}>
            <span className="stock-dot"></span>
            {demoProduct.inStock ? 'В наличии' : 'Под заказ'}
          </div>
        </div>
        <div className="gc-actions">
          <div className="gc-qty">
            <button onClick={() => setQuantity(q => Math.max(1, q-1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q+1)}>+</button>
          </div>
          <button className="gc-cart-btn">В корзину</button>
        </div>
        <a href="#" className="gc-detail-link">Детальная информация</a>
      </div>
    </div>
  )

  return (
    <div className="gradient-demo-page">
      <h1>Градиентные карточки товаров</h1>

      <div className="style-selector">
        {styles.map(style => (
          <button
            key={style.id}
            className={selectedStyle === style.id ? 'active' : ''}
            onClick={() => setSelectedStyle(style.id)}
          >
            {style.name}
          </button>
        ))}
      </div>

      <div className="demo-container">
        <h2>Выбранный стиль: {styles.find(s => s.id === selectedStyle)?.name}</h2>

        <div className="cards-list">
          {renderCard(`style-${selectedStyle}`)}
          {renderCard(`style-${selectedStyle}`)}
          {renderCard(`style-${selectedStyle}`)}
        </div>
      </div>

      <div className="comparison-section">
        <h2>Сравнение всех стилей</h2>
        <div className="comparison-list">
          {styles.map(style => (
            <div key={style.id} className="comparison-item">
              <div className="comparison-label">{style.name}</div>
              {renderCard(`style-${style.id}`)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardGradientDemo
