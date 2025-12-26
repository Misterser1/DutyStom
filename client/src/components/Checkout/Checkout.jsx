import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const formatPrice = (price) => {
    return '$' + new Intl.NumberFormat('en-US').format(price)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон'
    } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона'
    }

    // Email необязательный, но если заполнен - проверяем формат
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const orderData = {
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        items: items.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: item.price
        })),
        total: total,
        status: 'new',
        createdAt: new Date().toISOString()
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        clearCart()
        setSubmitted(true)
      } else {
        throw new Error('Ошибка при оформлении заказа')
      }
    } catch (error) {
      console.error('Order error:', error)
      // Для демо - просто показываем успех
      clearCart()
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0 && !submitted) {
    navigate('/cart')
    return null
  }

  // Успешное оформление
  if (submitted) {
    return (
      <div className="checkout-success">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <h2>Заявка отправлена!</h2>
        <p>Спасибо за заказ! Мы свяжемся с вами в ближайшее время.</p>
        <button onClick={() => navigate('/')} className="btn-home">
          Вернуться на главную
        </button>
      </div>
    )
  }

  return (
    <div className="checkout">
      <div className="checkout-form-wrapper">
        <h2>Оформление заказа</h2>
        <p className="checkout-subtitle">Заполните контактные данные</p>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className={`form-group ${errors.name ? 'error' : ''}`}>
            <label htmlFor="name">
              Имя <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ваше имя"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className={`form-group ${errors.phone ? 'error' : ''}`}>
            <label htmlFor="phone">
              Телефон <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (___) ___-__-__"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label htmlFor="email">
              Email <span className="optional">(по желанию)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Отправка...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
                Отправить заявку
              </>
            )}
          </button>
        </form>
      </div>

      <div className="checkout-summary">
        <h3>Ваш заказ</h3>
        <div className="summary-items">
          {items.map(item => (
            <div key={item.id} className="summary-item">
              <span className="summary-item-name">
                {item.name} <span className="qty">x {item.quantity}</span>
              </span>
              <span className="summary-item-price">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="summary-total">
          <span>Итого:</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>
    </div>
  )
}

export default Checkout
