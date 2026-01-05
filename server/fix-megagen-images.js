import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'database/db.sqlite')

async function fixMegagenImages() {
  const SQL = await initSqlJs()

  if (!existsSync(dbPath)) {
    console.error('Database file not found:', dbPath)
    return
  }

  const fileBuffer = readFileSync(dbPath)
  const db = new SQL.Database(fileBuffer)

  // Найти ВСЕ товары MEGAGEN с имплантами
  const stmt = db.prepare("SELECT id, name, image_url FROM products WHERE brand = 'MEGAGEN' OR name LIKE '%MEGAGEN%'")
  const products = []
  while (stmt.step()) {
    products.push(stmt.getAsObject())
  }
  stmt.free()

  console.log('Found products:', products.length)
  console.log('\nCurrent state:')
  products.forEach(p => {
    console.log(`  ID ${p.id}: ${p.name}`)
    console.log(`    image_url: ${p.image_url || 'NULL'}`)
  })

  // Принудительное обновление по названию
  const updates = [
    { pattern: 'BLUEDIAMOND REGULAR', image: '/images/products/megagen-bluediamond-regular.png' },
    { pattern: 'BLUEDIAMOND DEEP', image: '/images/products/megagen-bluediamond-deep.png' },
    { pattern: 'ANYONE INTERNAL REGULAR', image: '/images/products/megagen-anyone-regular.png' },
    { pattern: 'ANYONE INTERNAL DEEP', image: '/images/products/megagen-anyone-deep.png' },
    { pattern: 'ANYONE SPECIAL SHORT', image: '/images/products/megagen-anyone-short.png' },
    { pattern: 'ANYONE ONESTAGE REGULAR', image: '/images/products/megagen-anyone-onestage-regular.png' },
    { pattern: 'ANYONE ONESTAGE DEEP', image: '/images/products/megagen-anyone-onestage-deep.png' },
  ]

  console.log('\n\nUpdating images...')

  for (const product of products) {
    const nameUpper = product.name.toUpperCase()

    for (const update of updates) {
      if (nameUpper.includes(update.pattern)) {
        db.run('UPDATE products SET image_url = ? WHERE id = ?', [update.image, product.id])
        console.log(`Updated ID ${product.id}: ${product.name} -> ${update.image}`)
        break
      }
    }
  }

  // Сохранить изменения
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(dbPath, buffer)

  console.log('\n\nVerifying updates...')

  // Проверка
  const stmt2 = db.prepare("SELECT id, name, image_url FROM products WHERE name LIKE '%BLUEDIAMOND%' OR name LIKE '%ANYONE%'")
  while (stmt2.step()) {
    const row = stmt2.getAsObject()
    console.log(`  ID ${row.id}: ${row.name}`)
    console.log(`    image_url: ${row.image_url}`)
  }
  stmt2.free()

  console.log('\nDone!')
  db.close()
}

fixMegagenImages().catch(console.error)
