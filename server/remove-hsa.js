import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'database/db.sqlite')

async function removeHSA() {
  const SQL = await initSqlJs()

  if (!existsSync(dbPath)) {
    console.error('Database not found:', dbPath)
    return
  }

  const fileBuffer = readFileSync(dbPath)
  const db = new SQL.Database(fileBuffer)

  // Найти все товары с HSA в названии
  const stmt = db.prepare("SELECT id, name FROM products WHERE name LIKE '%HSA%'")

  const updates = []
  while (stmt.step()) {
    const row = stmt.getAsObject()
    const newName = row.name.replace(/\s*HSA\s*/g, ' ').trim().replace(/\s+/g, ' ')
    updates.push({ id: row.id, oldName: row.name, newName })
  }
  stmt.free()

  console.log(`Found ${updates.length} products with HSA:\n`)

  // Обновить названия
  for (const update of updates) {
    console.log(`ID ${update.id}:`)
    console.log(`  OLD: ${update.oldName}`)
    console.log(`  NEW: ${update.newName}`)

    db.run("UPDATE products SET name = ? WHERE id = ?", [update.newName, update.id])
  }

  // Сохранить базу данных
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(dbPath, buffer)

  console.log(`\nUpdated ${updates.length} products. Database saved.`)
  db.close()
}

removeHSA().catch(console.error)
