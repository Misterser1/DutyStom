import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dbPath = join(__dirname, 'database/db.sqlite')

async function fixDioImages() {
  const SQL = await initSqlJs()

  if (!existsSync(dbPath)) {
    console.log('Database not found at:', dbPath)
    return
  }

  const fileBuffer = readFileSync(dbPath)
  const db = new SQL.Database(fileBuffer)

  db.run("UPDATE products SET image_url = '/images/products/dio-uf-ii-hsa.png' WHERE id = 338")
  console.log('Updated DIO UF II (338)')

  db.run("UPDATE products SET image_url = '/images/products/dio-short-hsa.png' WHERE id = 339")
  console.log('Updated DIO SHORT (339)')

  db.run("UPDATE products SET image_url = '/images/products/dio-ufi.png' WHERE id = 340")
  console.log('Updated DIO UF III (340)')

  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(dbPath, buffer)

  console.log('Database saved!')
  db.close()
}

fixDioImages().catch(console.error)
