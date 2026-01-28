import { Router } from 'express'
import { dbAll, dbGet, dbRun } from '../database/init.js'

const router = Router()

// Получить все товары (с фильтрацией по категории и поиском)
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query

    // Поиск по названию и бренду
    if (search && search.trim()) {
      const term = search.trim()
      const startsWith = `${term}%`        // Начало строки

      // Поиск по словам внутри названия только если 3+ символов
      let query, params
      if (term.length > 2) {
        const wordStart = `% ${term}%`     // Начало слова (после пробела)
        query = `
          SELECT
            p.*,
            c.name as category_name,
            c.slug as category_slug,
            parent.name as parent_category_name,
            parent.slug as parent_category_slug
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          LEFT JOIN categories parent ON c.parent_id = parent.id
          WHERE
            p.name LIKE ? OR p.name LIKE ? OR
            p.brand LIKE ? OR
            p.code LIKE ? OR
            p.article LIKE ?
          ORDER BY
            CASE
              WHEN p.name LIKE ? THEN 1
              WHEN p.brand LIKE ? THEN 2
              ELSE 3
            END,
            p.brand, p.name
        `
        params = [startsWith, wordStart, startsWith, startsWith, startsWith, startsWith, startsWith]
      } else {
        // 1 символ - ищем только по началу строки
        query = `
          SELECT
            p.*,
            c.name as category_name,
            c.slug as category_slug,
            parent.name as parent_category_name,
            parent.slug as parent_category_slug
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          LEFT JOIN categories parent ON c.parent_id = parent.id
          WHERE
            p.name LIKE ? OR
            p.brand LIKE ? OR
            p.code LIKE ? OR
            p.article LIKE ?
          ORDER BY
            CASE
              WHEN p.name LIKE ? THEN 1
              WHEN p.brand LIKE ? THEN 2
              ELSE 3
            END,
            p.brand, p.name
        `
        params = [startsWith, startsWith, startsWith, startsWith, startsWith, startsWith]
      }

      const products = dbAll(query, params)
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

// Создать товар
router.post('/', (req, res) => {
  try {
    const {
      name, name_en, description, description_en, price, category_id,
      brand, image_url, in_stock, code, article, price_usd,
      country, specs, material
    } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const result = dbRun(`
      INSERT INTO products (
        name, name_en, description, description_en, price, category_id,
        brand, image_url, in_stock, code, article, price_usd,
        country, specs, material
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name.trim(),
      name_en || null,
      description || null,
      description_en || null,
      price || 0,
      category_id || null,
      brand || null,
      image_url || '/images/products/placeholder.png',
      in_stock !== undefined ? (in_stock ? 1 : 0) : 1,
      code || null,
      article || null,
      price_usd || null,
      country || null,
      specs || null,
      material || null
    ])

    const insertedId = result.lastInsertRowid

    if (insertedId === undefined || insertedId === null || insertedId === 0) {
      console.error('Failed to get lastInsertRowid, got:', insertedId)
      return res.status(500).json({ error: 'Failed to create product' })
    }

    const newProduct = dbGet(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [insertedId])

    if (!newProduct) {
      console.error('Product not found after insert, id:', insertedId)
      return res.status(500).json({ error: 'Product created but not found' })
    }

    res.status(201).json({ ...newProduct, inStock: newProduct.in_stock })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Обновить товар полностью
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params
    const {
      name, name_en, description, description_en, price, category_id,
      brand, image_url, in_stock, code, article, price_usd,
      country, specs, material
    } = req.body

    const product = dbGet('SELECT * FROM products WHERE id = ?', [parseInt(id)])
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    dbRun(`
      UPDATE products SET
        name = ?, name_en = ?, description = ?, description_en = ?,
        price = ?, category_id = ?, brand = ?, image_url = ?,
        in_stock = ?, code = ?, article = ?, price_usd = ?,
        country = ?, specs = ?, material = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name?.trim() || product.name,
      name_en !== undefined ? name_en : product.name_en,
      description !== undefined ? description : product.description,
      description_en !== undefined ? description_en : product.description_en,
      price !== undefined ? price : product.price,
      category_id !== undefined ? category_id : product.category_id,
      brand !== undefined ? brand : product.brand,
      image_url !== undefined ? image_url : product.image_url,
      in_stock !== undefined ? (in_stock ? 1 : 0) : product.in_stock,
      code !== undefined ? code : product.code,
      article !== undefined ? article : product.article,
      price_usd !== undefined ? price_usd : product.price_usd,
      country !== undefined ? country : product.country,
      specs !== undefined ? specs : product.specs,
      material !== undefined ? material : product.material,
      parseInt(id)
    ])

    const updated = dbGet(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [parseInt(id)])

    res.json({ ...updated, inStock: updated.in_stock })
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Удалить товар
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params

    const product = dbGet('SELECT * FROM products WHERE id = ?', [parseInt(id)])
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    dbRun('DELETE FROM products WHERE id = ?', [parseInt(id)])
    res.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('Error deleting product:', error)
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
