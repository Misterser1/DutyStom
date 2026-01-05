import initSqlJs from 'sql.js'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'database/db.sqlite')

async function checkImages() {
  const SQL = await initSqlJs()

  if (!existsSync(dbPath)) {
    console.error('Database not found:', dbPath)
    return
  }

  const fileBuffer = readFileSync(dbPath)
  const db = new SQL.Database(fileBuffer)

  // Найти товары MEGAGEN
  const stmt = db.prepare("SELECT id, name, image_url FROM products WHERE brand = 'MEGAGEN' OR name LIKE '%MEGAGEN%' OR name LIKE '%BLUEDIAMOND%' OR name LIKE '%ANYONE%'")

  console.log('MEGAGEN products in database:\n')
  while (stmt.step()) {
    const row = stmt.getAsObject()
    console.log(`ID ${row.id}: ${row.name}`)
    console.log(`  image_url: ${row.image_url || 'NULL'}`)
    console.log('')
  }
  stmt.free()
  db.close()
}

checkImages().catch(console.error)
