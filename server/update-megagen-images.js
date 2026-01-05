import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'database/db.sqlite')

async function updateMegagenImages() {
  const SQL = await initSqlJs()

  if (!existsSync(dbPath)) {
    console.error('Database file not found:', dbPath)
    return
  }

  const fileBuffer = readFileSync(dbPath)
  const db = new SQL.Database(fileBuffer)

  // Найти товары MEGAGEN
  const stmt = db.prepare("SELECT id, name FROM products WHERE brand = 'MEGAGEN'")
  const products = []
  while (stmt.step()) {
    products.push(stmt.getAsObject())
  }
  stmt.free()

  console.log('Found MEGAGEN products:', products.length)

  // Маппинг названий на изображения
  const imageMap = {
    'BLUEDIAMOND REGULAR': '/images/products/megagen-bluediamond-regular.png',
    'BLUEDIAMOND DEEP': '/images/products/megagen-bluediamond-deep.png',
    'Blue Diamond Regular': '/images/products/megagen-bluediamond-regular.png',
    'Blue Diamond Deep': '/images/products/megagen-bluediamond-deep.png',
    'AnyOne Regular': '/images/products/megagen-anyone-regular.png',
    'AnyOne Deep': '/images/products/megagen-anyone-deep.png',
    'ANYONE INTERNAL REGULAR': '/images/products/megagen-anyone-regular.png',
    'ANYONE INTERNAL DEEP': '/images/products/megagen-anyone-deep.png',
    'ANYONE SPECIAL SHORT': '/images/products/megagen-anyone-short.png',
    'AnyOne Short': '/images/products/megagen-anyone-short.png',
    'ANYONE ONESTAGE REGULAR': '/images/products/megagen-anyone-onestage-regular.png',
    'ANYONE ONESTAGE DEEP': '/images/products/megagen-anyone-onestage-deep.png'
  }

  for (const product of products) {
    let imageUrl = null
    const name = product.name.toUpperCase()

    // Поиск подходящего изображения
    for (const [pattern, url] of Object.entries(imageMap)) {
      if (name.includes(pattern.toUpperCase())) {
        imageUrl = url
        break
      }
    }

    if (imageUrl) {
      db.run('UPDATE products SET image_url = ? WHERE id = ?', [imageUrl, product.id])
      console.log(`Updated: ${product.name} -> ${imageUrl}`)
    } else {
      console.log(`No image found for: ${product.name}`)
    }
  }

  // Сохранить изменения
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(dbPath, buffer)

  console.log('\nDatabase updated successfully!')
  db.close()
}

updateMegagenImages().catch(console.error)
