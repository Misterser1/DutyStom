/**
 * Скрипт импорта товаров из JSON в базу данных
 * Запуск: node scripts/import-to-db.js
 */

import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, '..', 'server', 'database', 'db.sqlite')
const jsonPath = join(__dirname, '..', 'data', 'price-2026-import.json')

// Маппинг slug для категорий
const CATEGORY_SLUGS = {
  'Имплантаты': 'implants',
  'Компоненты': 'components',
  'Костные материалы': 'bone',
  'Мембраны': 'membrane',
  'Расходники': 'supplies',
  'Протетика': 'prosthetics',
  'Инструменты': 'instruments',
  'Хирургические наборы': 'surgical-kits',
  'Пины и GBR': 'pins-gbr',
  'Прочее': 'other'
}

// Генерация slug из названия
function generateSlug(name) {
  const translitMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': '-', '/': '-', '>': '', '<': ''
  }

  return name.toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function importData() {
  console.log('=== Импорт данных в БД ===\n')

  // Загружаем sql.js
  const SQL = await initSqlJs()

  // Открываем БД
  let db
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath)
    db = new SQL.Database(fileBuffer)
    console.log('✓ База данных открыта')
  } else {
    console.error('✗ База данных не найдена:', dbPath)
    return
  }

  // Загружаем JSON
  if (!existsSync(jsonPath)) {
    console.error('✗ JSON файл не найден:', jsonPath)
    return
  }

  const jsonData = JSON.parse(readFileSync(jsonPath, 'utf8'))
  console.log(`✓ Загружено ${jsonData.products.length} товаров из JSON\n`)

  // Получаем существующие категории
  const existingCategories = {}
  const catResult = db.exec('SELECT id, name, slug, parent_id FROM categories')
  if (catResult[0]) {
    for (const row of catResult[0].values) {
      existingCategories[row[1]] = { id: row[0], slug: row[2], parent_id: row[3] }
    }
  }
  console.log('Существующие категории:', Object.keys(existingCategories))

  // Создаём подкатегории для имплантов
  const implantsCat = existingCategories['Имплантаты']
  if (!implantsCat) {
    console.error('✗ Категория "Имплантаты" не найдена!')
    return
  }

  // Собираем уникальные подкатегории из JSON
  const subcategories = new Set()
  for (const product of jsonData.products) {
    if (product.subcategory && product.category === 'Имплантаты') {
      subcategories.add(product.subcategory)
    }
  }

  console.log('\nПодкатегории имплантов:', Array.from(subcategories))

  // Создаём подкатегории
  const subcategoryIds = {}
  for (const subcat of subcategories) {
    const slug = generateSlug(subcat)

    // Проверяем существует ли
    const checkResult = db.exec(`SELECT id FROM categories WHERE slug = '${slug}'`)

    if (checkResult[0] && checkResult[0].values.length > 0) {
      subcategoryIds[subcat] = checkResult[0].values[0][0]
      console.log(`  ✓ ${subcat} уже существует (id: ${subcategoryIds[subcat]})`)
    } else {
      // Создаём новую подкатегорию
      db.run(
        'INSERT INTO categories (name, slug, parent_id) VALUES (?, ?, ?)',
        [subcat, slug, implantsCat.id]
      )

      // Получаем ID
      const newIdResult = db.exec('SELECT last_insert_rowid()')
      subcategoryIds[subcat] = newIdResult[0].values[0][0]
      console.log(`  + ${subcat} создана (id: ${subcategoryIds[subcat]})`)
    }
  }

  // Очищаем старые товары категории имплантов
  console.log('\n--- Очистка старых товаров ---')

  // Получаем все ID категорий имплантов (родительская + подкатегории)
  const implantCatIds = [implantsCat.id, ...Object.values(subcategoryIds)]
  const implantCatIdsStr = implantCatIds.join(',')

  const deleteResult = db.exec(`SELECT COUNT(*) FROM products WHERE category_id IN (${implantCatIdsStr})`)
  const deleteCount = deleteResult[0]?.values[0][0] || 0
  console.log(`Удаляем ${deleteCount} старых товаров...`)

  db.run(`DELETE FROM products WHERE category_id IN (${implantCatIdsStr})`)

  // Импортируем товары
  console.log('\n--- Импорт товаров ---')

  let imported = 0
  let skipped = 0

  for (const product of jsonData.products) {
    // Только имплантаты
    if (product.category !== 'Имплантаты') {
      skipped++
      continue
    }

    // Определяем category_id
    let categoryId = implantsCat.id
    if (product.subcategory && subcategoryIds[product.subcategory]) {
      categoryId = subcategoryIds[product.subcategory]
    }

    // Определяем цену (basePrice или первая доступная)
    const price = product.basePrice ||
                  product.prices?.qty_10 ||
                  product.prices?.qty_100 ||
                  product.prices?.qty_1000 ||
                  0

    // Форматируем цены для specs
    const pricesJson = JSON.stringify(product.prices || {})

    // Определяем бренд из subcategory или названия
    let brand = product.subcategory || ''
    if (!brand && product.nameEn) {
      // Извлекаем бренд из начала названия
      const brandMatch = product.nameEn.match(/^(DIO|MEGAGEN|DENTIUM|OSSTEM|STRAUMANN|ANTHOGYR|ASTRATECH|SIC|SNUCONE|INNO|NEOBITECH|DENTIS)/i)
      if (brandMatch) brand = brandMatch[1].toUpperCase()
    }

    try {
      db.run(`
        INSERT INTO products (name, description, price, category_id, brand, country, specs, in_stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        product.nameRu || product.nameEn,
        `${product.nameEn || ''} - ${product.productType || 'Implant'}`,
        price,
        categoryId,
        brand,
        product.country || '',
        pricesJson,
        1
      ])
      imported++
    } catch (err) {
      console.error(`Ошибка при импорте ${product.nameRu}:`, err.message)
    }
  }

  console.log(`\n✓ Импортировано: ${imported}`)
  console.log(`○ Пропущено (не имплантаты): ${skipped}`)

  // Сохраняем БД
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(dbPath, buffer)
  console.log('\n✓ База данных сохранена')

  // Проверяем результат
  const countResult = db.exec(`SELECT COUNT(*) FROM products WHERE category_id IN (${implantCatIdsStr})`)
  console.log(`\nВсего товаров в категории имплантов: ${countResult[0]?.values[0][0]}`)

  // Показываем по подкатегориям
  console.log('\nПо подкатегориям:')
  for (const [name, id] of Object.entries(subcategoryIds)) {
    const result = db.exec(`SELECT COUNT(*) FROM products WHERE category_id = ${id}`)
    console.log(`  ${name}: ${result[0]?.values[0][0]} товаров`)
  }

  db.close()
  console.log('\n=== Импорт завершён ===')
}

importData().catch(console.error)
