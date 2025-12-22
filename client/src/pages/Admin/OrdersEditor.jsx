import { useState, useEffect } from 'react'

// Моковые данные для демонстрации
const mockOrders = [
  {
    id: 1,
    customerName: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
    items: [
      { name: 'Имплантат AnyRidge M3.5x10', qty: 2, price: 15000 },
      { name: 'Абатмент прямой', qty: 2, price: 5000 }
    ],
    total: 40000,
    status: 'new',
    createdAt: '2025-12-22T10:30:00'
  },
  {
    id: 2,
    customerName: 'Мария Сидорова',
    phone: '+7 (903) 555-12-34',
    email: '',
    items: [
      { name: 'Костный материал Bio-Oss 0.5g', qty: 3, price: 8000 }
    ],
    total: 24000,
    status: 'processing',
    createdAt: '2025-12-21T14:15:00'
  },
  {
    id: 3,
    customerName: 'Алексей Козлов',
    phone: '+7 (916) 777-88-99',
    email: 'alex.kozlov@mail.ru',
    items: [
      { name: 'Мембрана коллагеновая 20x30', qty: 1, price: 12000 },
      { name: 'Винт формирователь', qty: 4, price: 2000 }
    ],
    total: 20000,
    status: 'completed',
    createdAt: '2025-12-20T09:00:00'
  }
]

function OrdersEditor() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Попытка загрузить заказы с сервера
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setOrders(data)
        } else {
          setOrders(mockOrders)
        }
        setLoading(false)
      })
      .catch(() => {
        // Используем моковые данные если сервер недоступен
        setOrders(mockOrders)
        setLoading(false)
      })
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusLabel = (status) => {
    const statuses = {
      new: 'Новая',
      processing: 'В обработке',
      completed: 'Выполнена',
      cancelled: 'Отменена'
    }
    return statuses[status] || status
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  if (loading) {
    return (
      <div className="orders-editor">
        <div className="editor-header">
          <h2>Заявки</h2>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-editor">
      <div className="editor-header">
        <h2>Заявки с сайта</h2>
        <p>Заказы, оформленные через корзину</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/>
          </svg>
          <p>Пока нет заявок</p>
        </div>
      ) : (
        <>
          <div className="orders-table-header">
            <span>№</span>
            <span>Клиент</span>
            <span>Телефон</span>
            <span>Дата</span>
            <span>Сумма</span>
            <span>Статус</span>
          </div>

          {orders.map(order => (
            <div
              key={order.id}
              className="order-row"
              onClick={() => setSelectedOrder(order)}
              style={{ cursor: 'pointer' }}
            >
              <span className="order-id">#{order.id}</span>
              <div className="order-customer">
                <span className="customer-name">{order.customerName}</span>
                {order.email && <span className="customer-contact">{order.email}</span>}
              </div>
              <span className="order-phone">{order.phone}</span>
              <span className="order-date">{formatDate(order.createdAt)}</span>
              <span className="order-total">{order.total.toLocaleString('ru-RU')} ₽</span>
              <span className={`order-status status-${order.status}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          ))}
        </>
      )}

      {/* Модальное окно с деталями заказа */}
      {selectedOrder && (
        <div className="product-form-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-details-modal" onClick={e => e.stopPropagation()}>
            <div className="order-details-header">
              <h3>Заявка #{selectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>

            <div className="order-details-content">
              <div className="order-info-section">
                <h4>Информация о клиенте</h4>
                <div className="order-info-row">
                  <span className="order-info-label">Имя:</span>
                  <span className="order-info-value">{selectedOrder.customerName}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-info-label">Телефон:</span>
                  <span className="order-info-value">{selectedOrder.phone}</span>
                </div>
                {selectedOrder.email && (
                  <div className="order-info-row">
                    <span className="order-info-label">Email:</span>
                    <span className="order-info-value">{selectedOrder.email}</span>
                  </div>
                )}
                <div className="order-info-row">
                  <span className="order-info-label">Дата:</span>
                  <span className="order-info-value">{formatDate(selectedOrder.createdAt)}</span>
                </div>
              </div>

              <div className="order-info-section">
                <h4>Товары</h4>
                <div className="order-items-list">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-qty">× {item.qty}</span>
                      <span className="order-item-price">{(item.price * item.qty).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                </div>
                <div className="order-info-row" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #e0e0e0' }}>
                  <span className="order-info-label" style={{ fontWeight: 600 }}>Итого:</span>
                  <span className="order-info-value" style={{ color: '#e63946', fontSize: '1.2rem' }}>
                    {selectedOrder.total.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <div className="order-info-section">
                <h4>Статус заявки</h4>
                <div className="form-group">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  >
                    <option value="new">Новая</option>
                    <option value="processing">В обработке</option>
                    <option value="completed">Выполнена</option>
                    <option value="cancelled">Отменена</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="save-btn" onClick={() => setSelectedOrder(null)}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersEditor
