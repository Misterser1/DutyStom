import 'dotenv/config'
import { initDatabase, dbAll } from './database/init.js'

async function main() {
  await initDatabase()

  console.log('=== CATEGORIES ===')
  const cats = dbAll('SELECT * FROM categories')
  console.log(cats)

  console.log('\n=== PRODUCTS COUNT BY CATEGORY ===')
  const counts = dbAll(`
    SELECT c.slug, c.name,
           COUNT(p.id) as total,
           SUM(CASE WHEN p.image_url IS NULL OR p.image_url = '' THEN 1 ELSE 0 END) as no_image
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id
  `)
  console.log(counts)

  console.log('\n=== SAMPLE PRODUCTS FROM IMPLANTATY ===')
  const samples = dbAll(`
    SELECT id, name, image_url FROM products WHERE category_id = 1 LIMIT 5
  `)
  console.log(samples)
}

main().catch(console.error)
