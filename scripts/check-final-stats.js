import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import initSqlJs from 'sql.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_PATH = path.join(__dirname, '..', 'server', 'database', 'db.sqlite')

const SQL = await initSqlJs()
const dbBuffer = fs.readFileSync(DB_PATH)
const db = new SQL.Database(dbBuffer)

// Все имплантаты
const implantCategories = [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87]

const result = db.exec(`
  SELECT id, name, category_id, image_url
  FROM products
  WHERE category_id IN (${implantCategories.join(',')})
  ORDER BY category_id, name
`)

const brandNames = {
  75: 'DIO',
  76: 'DENTIUM',
  77: 'MEGAGEN',
  78: 'INNO',
  79: 'SNUCONE',
  80: 'NEOBIOTECH',
  81: 'DENTIS',
  82: 'OSSTEM TS-III',
  83: 'OSSTEM TS-IV',
  84: 'STRAUMANN',
  85: 'ANTHOGYR',
  86: 'ASTRATECH',
  87: 'SIC'
}

console.log('\n=== СТАТИСТИКА ИЗОБРАЖЕНИЙ ИМПЛАНТАТОВ ===\n')

const stats = {}
if (result[0]) {
  result[0].values.forEach(row => {
    const catId = row[2]
    const brand = brandNames[catId] || 'OTHER'
    if (!stats[brand]) stats[brand] = { total: 0, withImage: 0 }
    stats[brand].total++
    if (row[3]) stats[brand].withImage++
  })
}

console.log('Бренд          | Всего | С изображением')
console.log('---------------|-------|---------------')

let totalAll = 0
let totalWithImage = 0

Object.keys(stats).sort().forEach(brand => {
  const s = stats[brand]
  totalAll += s.total
  totalWithImage += s.withImage
  const check = s.total === s.withImage ? ' ✅' : ''
  console.log(`${brand.padEnd(14)} | ${String(s.total).padStart(5)} | ${String(s.withImage).padStart(14)}${check}`)
})

console.log('---------------|-------|---------------')
console.log(`ИТОГО          | ${String(totalAll).padStart(5)} | ${String(totalWithImage).padStart(14)}`)
console.log(`\nПокрытие: ${Math.round(totalWithImage/totalAll*100)}%`)

// Примеры обновленных товаров
console.log('\n\n=== ПРИМЕРЫ ОБНОВЛЕННЫХ ТОВАРОВ ===\n')
if (result[0]) {
  result[0].values.slice(0, 10).forEach(row => {
    console.log(`[${row[0]}] ${row[1]}`)
    console.log(`    → ${row[3]}\n`)
  })
}

db.close()
