import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './ProductCard.css'

function ProductCard({ product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
  }

  const handleQuantityChange = (e, delta) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  // Данные товара
  const code = product.code || String(product.id).padStart(5, '0')
  const article = product.article || product.name?.split(' ')[0] || 'ART-' + product.id
  const inStock = product.inStock !== undefined ? product.inStock : true
  const delivery = product.delivery || 'от 1 дня'

  // Характеристики товара (демо или реальные)
  const specs = product.specs || {
    'Категория': product.category_id === 1 ? 'Имплантаты' :
                 product.category_id === 2 ? 'Компоненты' :
                 product.category_id === 3 ? 'Костные материалы' :
                 product.category_id === 4 ? 'Мембраны' : 'Расходники'
  }

  return (
    <div className="product-card-row">
      {/* Колонка 1: Код, артикул */}
      <div className="card-col card-col-meta">
        <span className="card-code">КОД: {code}</span>
        <span className="card-article">Арт.: {article}</span>
      </div>

      {/* Колонка 2: Бренд */}
      <div className="card-col card-col-brand">
        {product.brand && (
          <>
            <span className="brand-name">{product.brand}</span>
            <span className="brand-country">Ю.Корея</span>
          </>
        )}
      </div>

      {/* Колонка 3: Изображение */}
      <Link to={`/product/${product.id}`} className="card-col card-col-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="card-image-placeholder">
            <svg viewBox="0 0 64 64" fill="currentColor">
              <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
              <circle cx="24" cy="28" r="6" opacity="0.5"/>
              <path d="M8 40l16-12 12 8 20-16v24H8z" opacity="0.4"/>
            </svg>
          </div>
        )}
      </Link>

      {/* Колонка 4: Название */}
      <div className="card-col card-col-name">
        <Link to={`/product/${product.id}`} className="card-name-link">
          <span className="card-article-inline">{article}</span>
          <h3 className="card-name">{product.name}</h3>
        </Link>
      </div>

      {/* Колонка 5: Характеристики */}
      <div className="card-col card-col-specs">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="spec-row">
            <span className="spec-key">{key}:</span>
            <span className="spec-value">{value}</span>
          </div>
        ))}
      </div>

      {/* Колонка 6: Цена */}
      <div className="card-col card-col-price">
        <span className="price-label">Цена</span>
        {product.oldPrice && (
          <span className="card-old-price">{formatPrice(product.oldPrice)} ₽</span>
        )}
        <span className="card-current-price">{formatPrice(product.price)} ₽</span>
      </div>

      {/* Колонка 7: Действия */}
      <div className="card-col card-col-actions">
        <div className="card-quantity">
          <button className="qty-btn" onClick={(e) => handleQuantityChange(e, -1)} disabled={quantity <= 1}>−</button>
          <span className="qty-value">{quantity}</span>
          <button className="qty-btn" onClick={(e) => handleQuantityChange(e, 1)}>+</button>
        </div>

        <button className="bookmark-btn" title="В закладки">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          В закладки
        </button>

        <div className="card-availability">
          <span className={`card-stock ${inStock ? 'in-stock' : 'out-stock'}`}>
            В наличии: {inStock ? 'есть' : 'нет'}
          </span>
          <span className="card-delivery">Доставка: {delivery}</span>
        </div>

        <button className="card-add-btn" onClick={handleAddToCart}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          В корзину
        </button>

        <div className="card-links">
          <Link to={`/product/${product.id}`} className="detail-link">Детальная информация</Link>
          <button className="quick-buy-btn">Купить в 1 клик</button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
