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

// Найти категорию имплантов
const catResult = db.exec("SELECT id, name FROM categories")
console.log('ВСЕ КАТЕГОРИИ:')
if (catResult[0]) {
  catResult[0].values.forEach(row => {
    console.log(`  [${row[0]}] ${row[1]}`)
  })
}

// Товары в категории 1 (Имплантаты) по брендам
const result = db.exec(`
  SELECT brand, COUNT(*) as cnt
  FROM products
  WHERE category_id = 1
  GROUP BY brand
  ORDER BY brand
`)

console.log('\n\nИМПЛАНТАТЫ (category_id=1) ПО БРЕНДАМ:\n')
let total = 0
if (result[0]) {
  result[0].values.forEach(row => {
    console.log(`${row[0]}: ${row[1]} шт.`)
    total += row[1]
  })
}
console.log(`\nИТОГО ИМПЛАНТАТОВ: ${total}`)

// Показать названия по каждому бренду
const brands = ['ANTHOGYR', 'ASTRATECH', 'DENTIS', 'DENTIUM', 'DIO', 'INNO', 'MEGAGEN', 'NEOBIOTECH', 'OSSTEM', 'SIC', 'SNUCONE', 'STRAUMANN']

console.log('\n\nДЕТАЛИ ПО БРЕНДАМ:')
for (const brand of brands) {
  const brandResult = db.exec(`
    SELECT id, name FROM products
    WHERE category_id = 1 AND brand = '${brand}'
    ORDER BY name
  `)
  if (brandResult[0] && brandResult[0].values.length > 0) {
    console.log(`\n=== ${brand} ===`)
    brandResult[0].values.forEach(row => {
      console.log(`  [${row[0]}] ${row[1]}`)
    })
  }
}

db.close()
