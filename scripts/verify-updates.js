import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import initSqlJs from 'sql.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_PATH = path.join(__dirname, '..', 'server', 'database', 'db.sqlite')

console.log('Проверка обновленных изображений...\n')

const SQL = await initSqlJs()
const dbBuffer = fs.readFileSync(DB_PATH)
const db = new SQL.Database(dbBuffer)

// Проверяем обновленные товары (не DIO, с JPG)
const updatedQuery = `
  SELECT id, name, brand, image_url
  FROM products
  WHERE brand NOT LIKE '%DIO%'
    AND image_url LIKE '%.jpg'
  ORDER BY brand, name
`

const updatedResult = db.exec(updatedQuery)
if (updatedResult[0]) {
  console.log('✅ Обновлено товаров с JPG изображениями:', updatedResult[0].values.length)
  console.log('\nПо брендам:')

  const byBrand = {}
  updatedResult[0].values.forEach(row => {
    const brand = row[2]
    if (!byBrand[brand]) byBrand[brand] = 0
    byBrand[brand]++
  })

  Object.keys(byBrand).sort().forEach(brand => {
    console.log(`  ${brand}: ${byBrand[brand]} товаров`)
  })

  console.log('\nПримеры обновленных товаров:')
  updatedResult[0].values.slice(0, 5).forEach(row => {
    console.log(`\n  ID: ${row[0]}`)
    console.log(`  Название: ${row[1].substring(0, 60)}`)
    console.log(`  Бренд: ${row[2]}`)
    console.log(`  Изображение: ${row[3]}`)
  })
}

// Проверяем что DIO не изменились
const dioQuery = `
  SELECT id, name, brand, image_url
  FROM products
  WHERE brand LIKE '%DIO%'
    AND image_url IS NOT NULL
`

const dioResult = db.exec(dioQuery)
if (dioResult[0]) {
  console.log('\n\n✅ DIO товары (не изменены):')
  console.log(`  Всего с изображениями: ${dioResult[0].values.length}`)
  const jpgCount = dioResult[0].values.filter(row => row[3] && row[3].includes('.jpg')).length
  const pngCount = dioResult[0].values.filter(row => row[3] && row[3].includes('.png')).length
  console.log(`  PNG: ${pngCount}`)
  console.log(`  JPG: ${jpgCount} ${jpgCount > 0 ? '(ОШИБКА - DIO должны быть PNG!)' : ''}`)
}

db.close()
console.log('\n')
