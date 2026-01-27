import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../contexts/LanguageContext'
import './Cart.css'

function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart()
  const { language, t, getLocalized } = useLanguage()

  const formatPrice = (price) => {
    return '$' + new Intl.NumberFormat('en-US').format(price)
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
        <h2>{t('cart.empty')}</h2>
        <p>{language === 'en' ? 'Add products from the catalog' : 'Добавьте товары из каталога'}</p>
        <Link to="/" className="btn-continue">{t('cart.continue')}</Link>
      </div>
    )
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>{t('cart.title')} ({items.length} {language === 'en' ? 'items' : 'товаров'})</h2>
        <button className="btn-clear" onClick={clearCart}>{t('cart.clear')}</button>
      </div>

      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} />
              ) : (
                <div className="cart-item-placeholder">
                  <svg viewBox="0 0 64 64" fill="currentColor">
                    <path d="M32 4c-4 0-7 3-7 7v10c0 2 1 4 3 5v30c0 3 2 5 4 5s4-2 4-5V26c2-1 3-3 3-5V11c0-4-3-7-7-7z"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="cart-item-info">
              {/* Название всегда на английском */}
              <h3>{item.name_en || item.name}</h3>
              {item.brand && <span className="cart-item-brand">{item.brand}</span>}
            </div>

            <div className="cart-item-quantity">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            <div className="cart-item-price">
              {formatPrice(item.price * item.quantity)}
            </div>

            <button className="cart-item-remove" onClick={() => removeItem(item.id)}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>{t('cart.total')}:</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <Link to="/checkout" className="btn-checkout">{t('cart.checkout')}</Link>
      </div>
    </div>
  )
}

export default Cart
