import { Router } from 'express'
import { dbAll, dbGet, dbRun } from '../database/init.js'

const router = Router()

// Генерация slug из названия
function generateSlug(name) {
  const translitMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  }

  return name.toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

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

// Получить все категории с подкатегориями (для админки)
router.get('/all/tree', (req, res) => {
  try {
    // Получить все родительские категории
    const parents = dbAll('SELECT * FROM categories WHERE parent_id IS NULL ORDER BY id')

    // Для каждой добавить подкатегории
    const tree = parents.map(parent => {
      const subcategories = dbAll(`
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        WHERE c.parent_id = ?
        GROUP BY c.id
        ORDER BY c.name
      `, [parent.id])

      // Количество товаров в родительской категории (напрямую + через подкатегории)
      const directCount = dbGet('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [parent.id])
      const totalProducts = subcategories.reduce((sum, sub) => sum + sub.product_count, directCount?.count || 0)

      return {
        ...parent,
        product_count: totalProducts,
        subcategories
      }
    })

    res.json(tree)
  } catch (error) {
    console.error('Error fetching categories tree:', error)
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

// Создать категорию
router.post('/', (req, res) => {
  try {
    const { name, parent_id, icon_url } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const slug = generateSlug(name.trim())

    // Проверить уникальность slug
    const existing = dbGet('SELECT id FROM categories WHERE slug = ?', [slug])
    if (existing) {
      return res.status(400).json({ error: 'Category with this name already exists' })
    }

    const result = dbRun(
      'INSERT INTO categories (name, slug, parent_id, icon_url) VALUES (?, ?, ?, ?)',
      [name.trim(), slug, parent_id || null, icon_url || null]
    )

    const newCategory = dbGet('SELECT * FROM categories WHERE id = ?', [result.lastInsertRowid])
    res.status(201).json(newCategory)
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Обновить категорию
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, icon_url } = req.body

    const category = dbGet('SELECT * FROM categories WHERE id = ?', [parseInt(id)])
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }

    let slug = category.slug
    if (name && name.trim() !== category.name) {
      slug = generateSlug(name.trim())
      // Проверить уникальность нового slug
      const existing = dbGet('SELECT id FROM categories WHERE slug = ? AND id != ?', [slug, parseInt(id)])
      if (existing) {
        return res.status(400).json({ error: 'Category with this name already exists' })
      }
    }

    dbRun(
      'UPDATE categories SET name = ?, slug = ?, icon_url = ? WHERE id = ?',
      [name?.trim() || category.name, slug, icon_url !== undefined ? icon_url : category.icon_url, parseInt(id)]
    )

    const updated = dbGet('SELECT * FROM categories WHERE id = ?', [parseInt(id)])
    res.json(updated)
  } catch (error) {
    console.error('Error updating category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Удалить категорию
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params

    const category = dbGet('SELECT * FROM categories WHERE id = ?', [parseInt(id)])
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }

    // Проверить, есть ли подкатегории
    const subcategories = dbAll('SELECT id FROM categories WHERE parent_id = ?', [parseInt(id)])
    if (subcategories.length > 0) {
      return res.status(400).json({ error: 'Cannot delete category with subcategories. Delete subcategories first.' })
    }

    // Проверить, есть ли товары
    const products = dbGet('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [parseInt(id)])
    if (products.count > 0) {
      return res.status(400).json({ error: `Cannot delete category with ${products.count} products. Move or delete products first.` })
    }

    dbRun('DELETE FROM categories WHERE id = ?', [parseInt(id)])
    res.json({ message: 'Category deleted' })
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
