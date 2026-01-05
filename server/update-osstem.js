import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'database/db.sqlite')

async function updateOsstem() {
  const SQL = await initSqlJs()

  if (!existsSync(dbPath)) {
    console.error('Database not found:', dbPath)
    return
  }

  const fileBuffer = readFileSync(dbPath)
  const db = new SQL.Database(fileBuffer)

  // Существующие товары OSSTEM (ID 364-370)
  const existingProducts = [
    { id: 364, oldName: 'BA с адаптером/без адаптера', newName: 'OSSTEM TS-III BA', price: 5000 },
    { id: 365, oldName: 'SOI с адаптером/без адаптера', newName: 'OSSTEM TS-III SOI', price: 5000 },
    { id: 366, oldName: 'CA с адаптером/без адаптера', newName: 'OSSTEM TS-III CA', price: 5000 },
    { id: 367, oldName: 'SA с адаптером/без адаптера', newName: 'OSSTEM TS-III SA', price: 4300 },
    { id: 368, oldName: 'BA с адаптером/без адаптера', newName: 'OSSTEM TS-IV BA', price: 5000 },
    { id: 369, oldName: 'CA с адаптером/без адаптера', newName: 'OSSTEM TS-IV CA', price: 5000 },
    { id: 370, oldName: 'SA с адаптером/без адаптера', newName: 'OSSTEM TS-IV SA', price: 4300 },
  ]

  console.log('=== Обновление товаров OSSTEM ===\n')

  // 1. Обновляем существующие товары (с адаптером)
  console.log('1. Обновляем существующие товары (с адаптером):\n')
  for (const product of existingProducts) {
    const nameWithAdapter = `${product.newName} (с адаптером)`
    db.run(
      "UPDATE products SET brand = 'OSSTEM', name = ? WHERE id = ?",
      [nameWithAdapter, product.id]
    )
    console.log(`  ID ${product.id}: ${nameWithAdapter} - ${product.price} руб`)
  }

  // 2. Получаем максимальный ID
  const maxIdResult = db.exec("SELECT MAX(id) as max_id FROM products")
  let nextId = maxIdResult[0].values[0][0] + 1
  console.log(`\nСледующий ID: ${nextId}`)

  // 3. Создаём новые товары (без адаптера)
  console.log('\n2. Создаём новые товары (без адаптера):\n')
  for (const product of existingProducts) {
    const nameWithoutAdapter = `${product.newName} (без адаптера)`
    const priceWithoutAdapter = product.price - 1500

    // Получаем данные оригинального товара для копирования
    const stmt = db.prepare("SELECT * FROM products WHERE id = ?")
    stmt.bind([product.id])
    stmt.step()
    const original = stmt.getAsObject()
    stmt.free()

    // Вставляем новый товар
    db.run(`
      INSERT INTO products (id, code, name, brand, country, price, category_id, description, specs, image_url, in_stock)
      VALUES (?, ?, ?, 'OSSTEM', ?, ?, ?, ?, ?, ?, 1)
    `, [
      nextId,
      original.code ? original.code + '-NA' : null,
      nameWithoutAdapter,
      original.country,
      priceWithoutAdapter,
      original.category_id,
      original.description,
      original.specs,
      original.image_url
    ])

    console.log(`  ID ${nextId}: ${nameWithoutAdapter} - ${priceWithoutAdapter} руб`)
    nextId++
  }

  // Сохраняем базу данных
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(dbPath, buffer)

  console.log('\n=== Готово! База данных обновлена ===')
  console.log('Всего товаров OSSTEM: 14')

  db.close()
}

updateOsstem().catch(console.error)
