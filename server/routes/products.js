import { Router } from 'express'
import { dbAll, dbGet, dbRun } from '../database/init.js'

const router = Router()

// Получить все товары (с фильтрацией по категории и поиском)
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query

    // Поиск по названию и бренду
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`
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
        WHERE p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?
        ORDER BY
          CASE WHEN p.name LIKE ? THEN 1 ELSE 2 END,
          p.brand, p.name
      `, [searchTerm, searchTerm, searchTerm, `${search.trim()}%`])
      const mappedProducts = products.map(p => ({ ...p, inStock: p.in_stock }))
      return res.json(mappedProducts)
    }

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

// Обновить характеристики товара
router.patch('/:id/specs', (req, res) => {
  try {
    const { id } = req.params
    const { description, specs } = req.body

    if (description !== undefined && specs !== undefined) {
      dbRun('UPDATE products SET description = ?, specs = ? WHERE id = ?', [description, specs, parseInt(id)])
    } else if (specs !== undefined) {
      dbRun('UPDATE products SET specs = ? WHERE id = ?', [specs, parseInt(id)])
    } else if (description !== undefined) {
      dbRun('UPDATE products SET description = ? WHERE id = ?', [description, parseInt(id)])
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating product specs:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Массовое обновление характеристик
router.post('/bulk-update-specs', (req, res) => {
  try {
    const { products } = req.body // Array of { id, description, specs }

    let updated = 0
    for (const product of products) {
      if (product.id && (product.description || product.specs)) {
        if (product.description && product.specs) {
          dbRun('UPDATE products SET description = ?, specs = ? WHERE id = ?',
            [product.description, product.specs, product.id])
        } else if (product.specs) {
          dbRun('UPDATE products SET specs = ? WHERE id = ?', [product.specs, product.id])
        } else if (product.description) {
          dbRun('UPDATE products SET description = ? WHERE id = ?', [product.description, product.id])
        }
        updated++
      }
    }

    res.json({ success: true, updated })
  } catch (error) {
    console.error('Error bulk updating specs:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
