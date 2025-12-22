import { Router } from 'express'
import { dbAll, dbGet, dbRun } from '../database/init.js'

const router = Router()

// Получить все товары (с фильтрацией по категории)
router.get('/', (req, res) => {
  try {
    const { category } = req.query

    if (category) {
      const products = dbAll(`
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE c.slug = ?
      `, [category])
      return res.json(products)
    }

    const products = dbAll(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `)
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Получить товар по ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params

    const product = dbGet(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [parseInt(id)])

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Обновить изображение товара
router.patch('/:id/image', (req, res) => {
  try {
    const { id } = req.params
    const { image_url } = req.body

    dbRun('UPDATE products SET image_url = ? WHERE id = ?', [image_url, parseInt(id)])

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating product image:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
