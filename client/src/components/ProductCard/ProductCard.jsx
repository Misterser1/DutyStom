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

  // Форматирование цены в рублях
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
  }

  // Данные товара
  const inStock = product.in_stock !== undefined ? product.in_stock === 1 : true

  // Парсинг спецификаций
  const parseSpecs = (specsStr) => {
    if (!specsStr) return null
    try {
      return JSON.parse(specsStr)
    } catch {
      return null
    }
  }

  const specs = parseSpecs(product.specs)
  // Фильтруем qty_* поля (оптовые цены)
  const filteredSpecs = specs
    ? Object.entries(specs).filter(([key]) => !key.startsWith('qty_')).slice(0, 5)
    : []

  return (
    <div className="compact-card">
      {/* Левая секция - код и бренд */}
      <div className="cc-left">
        <div className="cc-code">КОД: {product.code || product.id}</div>
        <div className="cc-article">Арт.: {product.article || '—'}</div>
        <div className="cc-brand">{product.brand || '—'}</div>
        <div className="cc-country">{product.country || '—'}</div>
      </div>

      {/* Изображение */}
      <Link to={`/product/${product.id}`} className="cc-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="cc-image-placeholder">
            <svg viewBox="0 0 64 64" fill="currentColor">
              <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
            </svg>
          </div>
        )}
      </Link>

      {/* Информация */}
      <div className="cc-info">
        <Link to={`/product/${product.id}`} className="cc-name-link">
          <h3 className="cc-name">{product.name}</h3>
        </Link>
        {product.description && product.description !== product.name && (
          <p className="cc-desc">
            {product.description.length > 80
              ? product.description.substring(0, 80) + '...'
              : product.description}
          </p>
        )}
        {filteredSpecs.length > 0 && (
          <div className="cc-specs">
            {filteredSpecs.map(([key, value]) => (
              <span key={key} className="cc-spec">
                <span className="cc-spec-key">{key}:</span> {value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Правая секция */}
      <div className="cc-right">
        <div className="cc-right-row">
          <div className="cc-price">{formatPrice(product.price)}</div>
          <div className={`cc-stock ${inStock ? 'in' : 'out'}`}>
            <span className="stock-dot"></span>
            {inStock ? 'В наличии' : 'Под заказ'}
          </div>
        </div>
        <div className="cc-actions">
          <div className="cc-qty">
            <button onClick={(e) => handleQuantityChange(e, -1)} disabled={quantity <= 1}>−</button>
            <span>{quantity}</span>
            <button onClick={(e) => handleQuantityChange(e, 1)}>+</button>
          </div>
          <button className="cc-cart-btn" onClick={handleAddToCart}>В корзину</button>
        </div>
        <Link to={`/product/${product.id}`} className="cc-detail-link">Детальная информация</Link>
      </div>
    </div>
  )
}

export default ProductCard
