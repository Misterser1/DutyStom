import { useState } from 'react'
import './CardCompactDemo.css'

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

function CardCompactDemo() {
  const [selectedSize, setSelectedSize] = useState(3)
  const [quantity, setQuantity] = useState(1)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
  }

  const sizes = [
    { id: 1, name: 'Очень компактный', height: '70px' },
    { id: 2, name: 'Компактный', height: '85px' },
    { id: 3, name: 'Средний', height: '100px' },
    { id: 4, name: 'Комфортный', height: '115px' },
    { id: 5, name: 'Просторный', height: '130px' },
  ]

  const renderCard = (sizeClass) => (
    <div className={`compact-card ${sizeClass}`}>
      <div className="cc-left">
        <div className="cc-code">КОД: {demoProduct.code}</div>
        <div className="cc-article">Арт.: {demoProduct.article}</div>
        <div className="cc-brand">{demoProduct.brand}</div>
        <div className="cc-country">{demoProduct.country}</div>
      </div>

      <div className="cc-image">
        <img src={demoProduct.image_url} alt={demoProduct.name} />
      </div>

      <div className="cc-info">
        <h3 className="cc-name">{demoProduct.name}</h3>
        <p className="cc-desc">{demoProduct.description}</p>
        <div className="cc-specs">
          {Object.entries(demoProduct.specs).map(([key, value]) => (
            <span key={key} className="cc-spec">
              <span className="cc-spec-key">{key}:</span> {value}
            </span>
          ))}
        </div>
      </div>

      <div className="cc-right">
        <div className="cc-right-row">
          <div className="cc-price">{formatPrice(demoProduct.price)}</div>
          <div className={`cc-stock ${demoProduct.inStock ? 'in' : 'out'}`}>
            <span className="stock-dot"></span>
            {demoProduct.inStock ? 'В наличии' : 'Под заказ'}
          </div>
        </div>
        <div className="cc-actions">
          <div className="cc-qty">
            <button onClick={() => setQuantity(q => Math.max(1, q-1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q+1)}>+</button>
          </div>
          <button className="cc-cart-btn">В корзину</button>
        </div>
        <a href="#" className="cc-detail-link">Детальная информация</a>
      </div>
    </div>
  )

  return (
    <div className="compact-demo-page">
      <h1>Компактность карточки товара</h1>

      <div className="size-selector">
        {sizes.map(size => (
          <button
            key={size.id}
            className={selectedSize === size.id ? 'active' : ''}
            onClick={() => setSelectedSize(size.id)}
          >
            {size.name}
          </button>
        ))}
      </div>

      <div className="demo-container">
        <h2>Выбранный размер: {sizes.find(s => s.id === selectedSize)?.name}</h2>

        <div className="cards-list">
          {renderCard(`size-${selectedSize}`)}
          {renderCard(`size-${selectedSize}`)}
          {renderCard(`size-${selectedSize}`)}
        </div>
      </div>

      <div className="comparison-section">
        <h2>Сравнение всех размеров</h2>
        <div className="comparison-list">
          {sizes.map(size => (
            <div key={size.id} className="comparison-item">
              <div className="comparison-label">{size.name}</div>
              {renderCard(`size-${size.id}`)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardCompactDemo
