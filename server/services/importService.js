import { getDb, dbRun, dbGet, dbAll, saveDb } from '../database/init.js'

/**
 * Валидация данных продукта
 * @param {Object} product - Данные продукта
 * @returns {Object} { valid: boolean, errors: [] }
 */
export function validateProductData(product) {
  const errors = []

  if (!product.name || typeof product.name !== 'string') {
    errors.push('Missing or invalid product name')
  }

  if (!product.brand || typeof product.brand !== 'string') {
    errors.push('Missing or invalid brand')
  }

  if (!product.priceRUB || typeof product.priceRUB !== 'object') {
    errors.push('Missing or invalid priceRUB object')
  } else {
    if (typeof product.priceRUB.retail !== 'number' || product.priceRUB.retail <= 0) {
      errors.push('Invalid retail price')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Проверка и создание категории если не существует
 * @param {String} name - Название категории
 * @param {String} slug - Слаг категории
 * @returns {Number} ID категории
 */
export function ensureCategory(name, slug) {
  const existing = dbGet('SELECT id FROM categories WHERE slug = ?', [slug])

  if (existing) {
    return existing.id
  }

  const result = dbRun(
    'INSERT INTO categories (name, slug) VALUES (?, ?)',
    [name, slug]
  )

  return result.lastInsertRowid
}

/**
 * Генерация уникального кода продукта
 * @returns {String} 5-значный код (00001, 00002...)
 */
export function generateProductCode() {
  const maxCode = dbGet('SELECT MAX(CAST(code AS INTEGER)) as max_code FROM products WHERE code IS NOT NULL')
  const nextCode = (maxCode?.max_code || 0) + 1
  return String(nextCode).padStart(5, '0')
}

/**
 * Трансформация продукта из JSON в формат БД
 * @param {Object} rawProduct - Продукт из JSON
 * @param {Number} categoryId - ID категории
 * @param {Number} exchangeRate - Курс USD/RUB
 * @returns {Object} Продукт для вставки в БД
 */
export function transformProduct(rawProduct, categoryId, exchangeRate = 80) {
  const code = generateProductCode()

  // Конвертируем цены из RUB в USD
  const priceUSD = rawProduct.priceRUB.retail / exchangeRate
  const priceTier200k = rawProduct.priceRUB.tier200k ? rawProduct.priceRUB.tier200k / exchangeRate : null
  const priceTier500k = rawProduct.priceRUB.tier500k ? rawProduct.priceRUB.tier500k / exchangeRate : null
  const priceTier1500k = rawProduct.priceRUB.tier1500k ? rawProduct.priceRUB.tier1500k / exchangeRate : null

  return {
    code,
    article: rawProduct.article || null,
    name: rawProduct.name,
    description: rawProduct.description || `${rawProduct.brand} ${rawProduct.name}`,
    price: Math.round(priceUSD * 100) / 100, // Цена в USD, округленная до 2 знаков
    price_usd: Math.round(priceUSD * 100) / 100,
    price_tier_200k: priceTier200k ? Math.round(priceTier200k * 100) / 100 : null,
    price_tier_500k: priceTier500k ? Math.round(priceTier500k * 100) / 100 : null,
    price_tier_1500k: priceTier1500k ? Math.round(priceTier1500k * 100) / 100 : null,
    category_id: categoryId,
    brand: rawProduct.brand,
    country: rawProduct.country || null,
    specs: JSON.stringify(rawProduct.specs || {}),
    in_stock: 1
  }
}

/**
 * Массовая вставка продуктов с транзакцией
 * @param {Array} products - Массив продуктов
 * @returns {Object} { success, insertedIds }
 */
export function bulkInsertProducts(products) {
  const insertedIds = []

  try {
    for (const product of products) {
      const result = dbRun(`
        INSERT INTO products
        (code, article, name, description, price, price_usd, price_tier_200k,
         price_tier_500k, price_tier_1500k, category_id, brand,
         country, specs, in_stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        product.code,
        product.article,
        product.name,
        product.description,
        product.price,
        product.price_usd,
        product.price_tier_200k,
        product.price_tier_500k,
        product.price_tier_1500k,
        product.category_id,
        product.brand,
        product.country,
        product.specs,
        product.in_stock
      ])

      insertedIds.push(result.lastInsertRowid)
    }

    return { success: true, insertedIds }
  } catch (error) {
    throw error
  }
}

/**
 * Импорт продуктов из JSON
 * @param {Object} jsonData - Данные из price-list-2025.json
 * @param {Object} options - { mode: 'add'|'replace', createCategories: true }
 * @returns {Object} { success, imported, failed, errors, importId }
 */
export async function importFromJSON(jsonData, options = {}) {
  const {
    mode = 'add',
    createCategories = true,
    overwriteExisting = false
  } = options

  const exchangeRate = jsonData.metadata?.exchangeRate || 80
  const importErrors = []
  const transformedProducts = []
  let totalProducts = 0
  let successfulImports = 0
  let failedImports = 0

  try {
    // Если режим 'replace', удаляем все существующие товары
    if (mode === 'replace') {
      dbRun('DELETE FROM products')
      console.log('Deleted all existing products (replace mode)')
    }

    // Обрабатываем каждую категорию
    for (const categoryData of jsonData.categories) {
      let categoryId

      // Проверяем/создаём категорию
      if (createCategories) {
        categoryId = ensureCategory(categoryData.name, categoryData.slug)
      } else {
        const existing = dbGet('SELECT id FROM categories WHERE slug = ?', [categoryData.slug])
        if (!existing) {
          importErrors.push(`Category not found: ${categoryData.slug}`)
          continue
        }
        categoryId = existing.id
      }

      // Обрабатываем товары категории
      for (const rawProduct of categoryData.products) {
        totalProducts++

        // Валидация
        const validation = validateProductData(rawProduct)
        if (!validation.valid) {
          failedImports++
          importErrors.push({
            product: rawProduct.name,
            errors: validation.errors
          })
          continue
        }

        // Трансформация
        try {
          const transformedProduct = transformProduct(rawProduct, categoryId, exchangeRate)
          transformedProducts.push(transformedProduct)
        } catch (error) {
          failedImports++
          importErrors.push({
            product: rawProduct.name,
            error: error.message
          })
        }
      }
    }

    // Массовая вставка
    if (transformedProducts.length > 0) {
      const result = bulkInsertProducts(transformedProducts)
      successfulImports = result.insertedIds.length
    }

    // Сохраняем историю импорта
    const importResult = dbRun(`
      INSERT INTO import_history
      (filename, total_products, successful_imports, failed_imports, notes)
      VALUES (?, ?, ?, ?, ?)
    `, [
      jsonData.metadata?.version || 'unknown',
      totalProducts,
      successfulImports,
      failedImports,
      JSON.stringify(importErrors.slice(0, 10)) // Первые 10 ошибок
    ])

    return {
      success: successfulImports > 0,
      imported: successfulImports,
      failed: failedImports,
      total: totalProducts,
      errors: importErrors,
      importId: importResult.lastInsertRowid
    }

  } catch (error) {
    console.error('Import error:', error)
    return {
      success: false,
      imported: 0,
      failed: totalProducts,
      total: totalProducts,
      errors: [{ error: error.message }],
      importId: null
    }
  }
}

/**
 * Предпросмотр импорта (без изменения БД)
 * @param {Object} jsonData - Данные для импорта
 * @returns {Object} Информация о предстоящем импорте
 */
export async function previewImport(jsonData) {
  const exchangeRate = jsonData.metadata?.exchangeRate || 80
  let totalProducts = 0
  const newCategories = []
  const existingProducts = []
  const validationErrors = []

  // Проверяем категории
  for (const categoryData of jsonData.categories) {
    const existing = dbGet('SELECT id FROM categories WHERE slug = ?', [categoryData.slug])
    if (!existing) {
      newCategories.push(categoryData.name)
    }

    // Подсчитываем товары
    totalProducts += categoryData.products.length

    // Валидация товаров
    for (const product of categoryData.products) {
      const validation = validateProductData(product)
      if (!validation.valid) {
        validationErrors.push({
          product: product.name,
          errors: validation.errors
        })
      }
    }
  }

  return {
    totalProducts,
    newCategories,
    existingProducts: existingProducts.length,
    newProducts: totalProducts - existingProducts.length,
    validationErrors,
    exchangeRate
  }
}

/**
 * Получить историю импортов
 * @param {Number} limit - Лимит записей
 * @returns {Array} История импортов
 */
export function getImportHistory(limit = 50) {
  return dbAll(`
    SELECT * FROM import_history
    ORDER BY import_date DESC
    LIMIT ?
  `, [limit])
}
