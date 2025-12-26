import 'dotenv/config'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initDatabase, dbAll } from './database/init.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const IMAGES_DIR = join(__dirname, '../client/public')

async function main() {
  await initDatabase()

  // Получаем все товары с image_url
  const products = dbAll(`
    SELECT id, name, image_url FROM products
    WHERE image_url IS NOT NULL AND image_url != ''
  `)

  console.log(`📦 Total products with image_url: ${products.length}`)

  let missing = 0
  let exists = 0
  const missingList = []

  for (const p of products) {
    const filepath = join(IMAGES_DIR, p.image_url)
    if (existsSync(filepath)) {
      exists++
    } else {
      missing++
      missingList.push({ id: p.id, name: p.name, url: p.image_url })
    }
  }

  console.log(`✅ Files exist: ${exists}`)
  console.log(`❌ Files missing: ${missing}`)

  if (missingList.length > 0) {
    console.log('\n❌ Missing files:')
    missingList.slice(0, 20).forEach(p => {
      console.log(`   [${p.id}] ${p.name} -> ${p.url}`)
    })
    if (missingList.length > 20) {
      console.log(`   ... and ${missingList.length - 20} more`)
    }
  }

  // Проверим товары без изображений
  const noImage = dbAll(`
    SELECT id, name FROM products
    WHERE image_url IS NULL OR image_url = ''
  `)
  console.log(`\n⚠️ Products without image_url: ${noImage.length}`)
  if (noImage.length > 0) {
    noImage.slice(0, 10).forEach(p => {
      console.log(`   [${p.id}] ${p.name}`)
    })
  }
}

main().catch(console.error)
