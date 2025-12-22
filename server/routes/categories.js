import { Router } from 'express'
import { dbAll, dbGet } from '../database/init.js'

const router = Router()

// Получить все категории
router.get('/', (req, res) => {
  try {
    const categories = dbAll('SELECT * FROM categories ORDER BY id')
    res.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
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
