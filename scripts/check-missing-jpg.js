import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import initSqlJs from 'sql.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_PATH = path.join(__dirname, '..', 'server', 'database', 'db.sqlite')

console.log('Товары без JPG изображений:\n')

const SQL = await initSqlJs()
const dbBuffer = fs.readFileSync(DB_PATH)
const db = new SQL.Database(dbBuffer)

// Проверяем товары брендов имплантов без JPG
const brands = ['INNO', 'OSSTEM', 'SNUCONE', 'NEOBIOTECH', 'SIC', 'DENTIS', 'STRAUMANN']

for (const brand of brands) {
  const result = db.exec(`
    SELECT id, name, name_en, image_url
    FROM products
    WHERE brand = '${brand}'
      AND (image_url NOT LIKE '%.jpg' OR image_url IS NULL)
    ORDER BY name
  `)

  if (result[0] && result[0].values.length > 0) {
    console.log(`\n=== ${brand} (${result[0].values.length} товаров) ===`)
    result[0].values.forEach(row => {
      console.log(`[${row[0]}] ${row[2] || row[1]}`)
      console.log(`    Текущее: ${row[3] || 'NULL'}`)
    })
  }
}

db.close()
