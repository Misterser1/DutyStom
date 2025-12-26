import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './ProductCard.css'

// Курс конвертации
const USD_RATE = 100

function ProductCard({ product, showUSD = false }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, quantity)
  }

  const handleQuantityChange = (e, delta) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value) || 1
    setQuantity(Math.max(1, value))
  }

  // Форматирование цены в USD (с запятой для тысяч)
  const formatUSD = (price) => {
    const usd = Math.round(price / USD_RATE)
    return new Intl.NumberFormat('en-US').format(usd)
  }

  // Форматирование цены в рублях
  const formatRUB = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  // Данные товара
  const inStock = product.in_stock !== undefined ? product.in_stock === 1 : true
  const priceUSD = product.priceUSD || Math.round(product.price / USD_RATE)

  return (
    <div className="product-card-compact">
      {/* Верхний ряд: информация о товаре */}
      <div className="card-row-top">
        <Link to={`/product/${product.id}`} className="card-image-link">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} loading="lazy" />
          ) : (
            <div className="card-image-placeholder">
              <svg viewBox="0 0 64 64" fill="currentColor">
                <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
              </svg>
            </div>
          )}
        </Link>

        {product.brand && (
          <div className="card-brand">{product.brand}</div>
        )}

        <Link to={`/product/${product.id}`} className="card-name-link">
          <span className="card-name">{product.name}</span>
        </Link>

        <div className={`card-stock ${inStock ? 'in-stock' : 'out-stock'}`}>
          <span className="stock-dot"></span>
          {inStock ? 'В наличии' : 'Под заказ'}
        </div>
      </div>

      {/* Нижний ряд: цена и действия */}
      <div className="card-row-bottom">
        <div className="card-price">
          <span className="current-price">${formatUSD(product.price)}</span>
          <span className="price-hint">/ шт.</span>
        </div>

        <div className="card-actions">
          <div className="card-quantity">
            <button className="qty-btn" onClick={(e) => handleQuantityChange(e, -1)} disabled={quantity <= 1}>−</button>
            <input
              type="number"
              className="qty-input"
              value={quantity}
              onChange={handleQuantityInput}
              min="1"
              onClick={(e) => e.stopPropagation()}
            />
            <button className="qty-btn" onClick={(e) => handleQuantityChange(e, 1)}>+</button>
          </div>

          <button className="card-add-btn" onClick={handleAddToCart}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            В корзину
          </button>

          <Link to={`/product/${product.id}`} className="detail-link">Детальная информация</Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
