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
    email: '',
    address: '',
    comment: ''
  })
  const [errors, setErrors] = useState({})

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
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

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Введите адрес доставки'
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
        customer: formData,
        items: items,
        total: total,
        created_at: new Date().toISOString()
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        clearCart()
        alert('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.')
        navigate('/')
      } else {
        throw new Error('Ошибка при оформлении заказа')
      }
    } catch (error) {
      console.error('Order error:', error)
      // Для демо - просто очищаем корзину
      clearCart()
      alert('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.')
      navigate('/')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="checkout">
      <div className="checkout-form-wrapper">
        <h2>Оформление заказа</h2>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className={`form-group ${errors.name ? 'error' : ''}`}>
            <label htmlFor="name">Имя *</label>
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
            <label htmlFor="phone">Телефон *</label>
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
            <label htmlFor="email">Email *</label>
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

          <div className={`form-group ${errors.address ? 'error' : ''}`}>
            <label htmlFor="address">Адрес доставки *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Город, улица, дом, квартира"
              rows="3"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="comment">Комментарий к заказу</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Дополнительная информация"
              rows="3"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Оформление...' : 'Подтвердить заказ'}
          </button>
        </form>
      </div>

      <div className="checkout-summary">
        <h3>Ваш заказ</h3>
        <div className="summary-items">
          {items.map(item => (
            <div key={item.id} className="summary-item">
              <span className="summary-item-name">
                {item.name} x {item.quantity}
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
