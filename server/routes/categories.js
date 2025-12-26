import { Router } from 'express'
import { dbAll, dbGet } from '../database/init.js'

const router = Router()

// Получить все категории (только основные, если указан parent_only=true)
router.get('/', (req, res) => {
  try {
    let query = 'SELECT * FROM categories'

    // По умолчанию возвращаем только основные категории (parent_id IS NULL)
    if (req.query.parent_only !== 'false') {
      query += ' WHERE parent_id IS NULL'
    }

    query += ' ORDER BY id'

    const categories = dbAll(query)
    res.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Получить подкатегории для категории с количеством товаров
router.get('/:slug/subcategories', (req, res) => {
  try {
    const { slug } = req.params

    // 1. Найти родительскую категорию
    const parent = dbGet('SELECT id FROM categories WHERE slug = ?', [slug])

    if (!parent) {
      return res.status(404).json({ error: 'Category not found' })
    }

    // 2. Получить подкатегории с количеством товаров
    const subcategories = dbAll(`
      SELECT
        c.id,
        c.name,
        c.slug,
        c.parent_id,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      WHERE c.parent_id = ?
      GROUP BY c.id
      ORDER BY c.name
    `, [parent.id])

    res.json(subcategories)
  } catch (error) {
    console.error('Error fetching subcategories:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Получить категорию по slug
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params

    const category = dbGet('SELECT * FROM categories WHERE slug = ?', [slug])

    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
