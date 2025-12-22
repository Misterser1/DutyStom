import { Router } from 'express'
import { dbAll, dbGet, dbRun } from '../database/init.js'

const router = Router()

// Создать новый заказ
router.post('/', (req, res) => {
  try {
    const { customer, items, total } = req.body

    if (!customer || !items || !total) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = dbRun(`
      INSERT INTO orders (customer_name, customer_phone, customer_email, customer_address, comment, items, total)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      customer.name,
      customer.phone,
      customer.email,
      customer.address,
      customer.comment || '',
      JSON.stringify(items),
      total
    ])

    console.log(`New order created: #${result.lastInsertRowid}`)

    res.status(201).json({
      success: true,
      orderId: result.lastInsertRowid
    })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Получить все заказы (для админки)
router.get('/', (req, res) => {
  try {
    const orders = dbAll('SELECT * FROM orders ORDER BY created_at DESC')

    // Парсим items из JSON
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }))

    res.json(ordersWithItems)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Получить заказ по ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params

    const order = dbGet('SELECT * FROM orders WHERE id = ?', [parseInt(id)])

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json({
      ...order,
      items: JSON.parse(order.items)
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Обновить статус заказа
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['new', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    dbRun('UPDATE orders SET status = ? WHERE id = ?', [status, parseInt(id)])

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
