import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import initSqlJs from 'sql.js'
import { findImageMatch } from './brand-image-patterns.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Пути
const SOURCE_DIR = path.join(__dirname, '..', 'image', 'DIO 2', 'implants')
const TARGET_DIR = path.join(__dirname, '..', 'client', 'public', 'images', 'products')
const DB_PATH = path.join(__dirname, '..', 'server', 'database', 'db.sqlite')
const BACKUP_DIR = path.join(__dirname, '..', 'data')

// Режим выполнения
const args = process.argv.slice(2)
const mode = args[0] || '--preview'

console.log('='.repeat(60))
console.log('ОБНОВЛЕНИЕ ИЗОБРАЖЕНИЙ ИМПЛАНТОВ')
console.log('='.repeat(60))
console.log(`Режим: ${mode}`)
console.log(`Источник: ${SOURCE_DIR}`)
console.log(`Целевая папка: ${TARGET_DIR}`)
console.log(`База данных: ${DB_PATH}`)
console.log('='.repeat(60))
console.log()

// Проверка существования папок
if (!fs.existsSync(SOURCE_DIR)) {
  console.error('❌ Ошибка: папка с изображениями не найдена:', SOURCE_DIR)
  process.exit(1)
}

if (!fs.existsSync(TARGET_DIR)) {
  console.error('❌ Ошибка: целевая папка не найдена:', TARGET_DIR)
  process.exit(1)
}

if (!fs.existsSync(DB_PATH)) {
  console.error('❌ Ошибка: база данных не найдена:', DB_PATH)
  process.exit(1)
}

// Шаг 1: Копирование файлов (кроме DIO)
console.log('📁 Шаг 1: Копирование изображений...')
const sourceFiles = fs.readdirSync(SOURCE_DIR)
const imagesToCopy = sourceFiles.filter(file =>
  file.endsWith('.jpg') && !file.startsWith('dio_')
)

console.log(`Найдено ${sourceFiles.length} файлов, из них:`)
console.log(`  - JPG файлов: ${sourceFiles.filter(f => f.endsWith('.jpg')).length}`)
console.log(`  - DIO файлов (пропускаем): ${sourceFiles.filter(f => f.startsWith('dio_')).length}`)
console.log(`  - К копированию: ${imagesToCopy.length}`)
console.log()

let copiedCount = 0
if (mode === '--execute') {
  for (const file of imagesToCopy) {
    const sourcePath = path.join(SOURCE_DIR, file)
    const targetPath = path.join(TARGET_DIR, file)

    try {
      fs.copyFileSync(sourcePath, targetPath)
      copiedCount++
    } catch (error) {
      console.error(`  ❌ Ошибка копирования ${file}:`, error.message)
    }
  }
  console.log(`✅ Скопировано ${copiedCount} файлов`)
} else {
  console.log(`📋 Preview: будет скопировано ${imagesToCopy.length} файлов`)
}
console.log()

// Шаг 2: Получение продуктов из БД
console.log('📊 Шаг 2: Получение продуктов из базы данных...')

const SQL = await initSqlJs()
const dbBuffer = fs.readFileSync(DB_PATH)
const db = new SQL.Database(dbBuffer)

const query = `
  SELECT id, name, name_en, brand, image_url, category_id
  FROM products
  WHERE brand NOT LIKE '%DIO%'
  ORDER BY brand, name
`

const result = db.exec(query)
const products = result[0] ? result[0].values.map(row => ({
  id: row[0],
  name: row[1],
  name_en: row[2],
  brand: row[3],
  image_url: row[4],
  category_id: row[5]
})) : []

console.log(`Найдено продуктов: ${products.length}`)
console.log()

// Шаг 3: Сопоставление
console.log('🔍 Шаг 3: Сопоставление продуктов с изображениями...')
const matches = []
const notFound = []

for (const product of products) {
  const nameToMatch = product.name_en || product.name || ''
  const match = findImageMatch(nameToMatch, product.brand)

  if (match) {
    matches.push({
      productId: product.id,
      productName: product.name,
      productNameEn: product.name_en,
      productBrand: product.brand,
      currentImage: product.image_url,
      newImage: `/images/products/${match.image}`,
      confidence: match.confidence,
      pattern: match.pattern
    })
  } else {
    notFound.push({
      productId: product.id,
      productName: product.name,
      productNameEn: product.name_en,
      productBrand: product.brand,
      currentImage: product.image_url
    })
  }
}

console.log(`✅ Найдено совпадений: ${matches.length}`)
console.log(`⚠️  Не найдено: ${notFound.length}`)
console.log()

// Шаг 4: Отчет
console.log('=' .repeat(60))
console.log('ОТЧЕТ О СОВПАДЕНИЯХ')
console.log('='.repeat(60))
console.log()

// Группировка по брендам
const byBrand = {}
matches.forEach(m => {
  if (!byBrand[m.productBrand]) {
    byBrand[m.productBrand] = []
  }
  byBrand[m.productBrand].push(m)
})

Object.keys(byBrand).sort().forEach(brand => {
  console.log(`\n📦 ${brand} (${byBrand[brand].length} продуктов)`)
  console.log('-'.repeat(60))
  byBrand[brand].forEach(m => {
    console.log(`  ID: ${m.productId}`)
    console.log(`  Название: ${m.productNameEn || m.productName}`)
    console.log(`  Сейчас: ${m.currentImage || 'NULL'}`)
    console.log(`  Новое: ${m.newImage}`)
    console.log(`  Уверенность: ${m.confidence}%`)
    console.log()
  })
})

if (notFound.length > 0) {
  console.log('\n⚠️  НЕ НАЙДЕНО СОВПАДЕНИЙ:')
  console.log('-'.repeat(60))
  notFound.forEach(p => {
    console.log(`  ID: ${p.productId} | ${p.productBrand} | ${p.productNameEn || p.productName}`)
  })
  console.log()
}

// Шаг 5: Обновление БД
if (mode === '--execute') {
  console.log('\n' + '='.repeat(60))
  console.log('ОБНОВЛЕНИЕ БАЗЫ ДАННЫХ')
  console.log('='.repeat(60))
  console.log()

  // Создаем backup
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(BACKUP_DIR, `image-update-backup-${timestamp}.json`)

  fs.writeFileSync(backupPath, JSON.stringify(matches, null, 2))
  console.log(`💾 Backup сохранен: ${backupPath}`)
  console.log()

  // Обновляем БД
  let updatedCount = 0

  for (const match of matches) {
    try {
      db.run('UPDATE products SET image_url = ? WHERE id = ?', [match.newImage, match.productId])
      updatedCount++
    } catch (error) {
      console.error(`❌ Ошибка обновления ID ${match.productId}:`, error.message)
    }
  }

  // Сохраняем изменения в файл
  const updatedDbBuffer = db.export()
  fs.writeFileSync(DB_PATH, updatedDbBuffer)

  console.log(`✅ Обновлено записей: ${updatedCount}`)
  console.log()
}

db.close()

// Итоговая статистика
console.log('='.repeat(60))
console.log('ИТОГОВАЯ СТАТИСТИКА')
console.log('='.repeat(60))
console.log(`Файлов к копированию: ${imagesToCopy.length}`)
console.log(`Файлов скопировано: ${mode === '--execute' ? copiedCount : 'N/A (preview)'}`)
console.log(`Продуктов найдено в БД: ${products.length}`)
console.log(`Совпадений найдено: ${matches.length}`)
console.log(`Не найдено: ${notFound.length}`)
console.log(`Обновлено в БД: ${mode === '--execute' ? matches.length : 'N/A (preview)'}`)
console.log('='.repeat(60))
console.log()

if (mode === '--preview') {
  console.log('📋 Это был preview режим. Запустите с --execute для применения изменений:')
  console.log('   node scripts/update-implant-images.js --execute')
} else {
  console.log('✅ Обновление завершено!')
  console.log()
  console.log('🔍 Для проверки выполните:')
  console.log('   SELECT id, name, brand, image_url FROM products WHERE image_url LIKE "%.jpg" LIMIT 10')
}
console.log()
