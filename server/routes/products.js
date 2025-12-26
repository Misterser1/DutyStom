import { Router } from 'express'
import { dbAll, dbGet, dbRun } from '../database/init.js'

const router = Router()

// Получить все товары (с фильтрацией по категории)
router.get('/', (req, res) => {
  try {
    const { category } = req.query

    if (category) {
      // Фильтрация по slug (может быть родительская категория или подкатегория)
      const products = dbAll(`
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          parent.name as parent_category_name,
          parent.slug as parent_category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN categories parent ON c.parent_id = parent.id
        WHERE c.slug = ? OR parent.slug = ?
      `, [category, category])
      const mappedProducts = products.map(p => ({ ...p, inStock: p.in_stock }))
      return res.json(mappedProducts)
    }

    // Все товары с информацией о категории и родителе
    const products = dbAll(`
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        parent.name as parent_category_name,
        parent.slug as parent_category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN categories parent ON c.parent_id = parent.id
    `)
    const mappedProducts = products.map(p => ({ ...p, inStock: p.in_stock }))
    res.json(mappedProducts)
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
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        parent.name as parent_category_name,
        parent.slug as parent_category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN categories parent ON c.parent_id = parent.id
      WHERE p.id = ?
    `, [parseInt(id)])

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const mappedProduct = { ...product, inStock: product.in_stock }
    res.json(mappedProduct)
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
