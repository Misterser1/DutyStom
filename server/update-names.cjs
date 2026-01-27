const initSqlJs = require('sql.js')
const fs = require('fs')
const path = require('path')

async function swapINNO() {
  const SQL = await initSqlJs()
  const dbPath = path.join(__dirname, 'database', 'db.sqlite')
  const fileBuffer = fs.readFileSync(dbPath)
  const db = new SQL.Database(fileBuffer)

  console.log('Swapping INNO products 354 and 355...\n')

  // Получаем данные обоих товаров
  const prod354 = db.exec("SELECT name, description, image_url FROM products WHERE id = 354")[0].values[0]
  const prod355 = db.exec("SELECT name, description, image_url FROM products WHERE id = 355")[0].values[0]

  console.log('Before swap:')
  console.log('  354:', prod354[0])
  console.log('  355:', prod355[0])

  // Меняем местами
  db.run('UPDATE products SET name = ?, description = ?, image_url = ? WHERE id = 354',
    [prod355[0], prod355[1], prod355[2]])
  db.run('UPDATE products SET name = ?, description = ?, image_url = ? WHERE id = 355',
    [prod354[0], prod354[1], prod354[2]])

  console.log('\nAfter swap:')
  const after354 = db.exec("SELECT name FROM products WHERE id = 354")[0].values[0][0]
  const after355 = db.exec("SELECT name FROM products WHERE id = 355")[0].values[0][0]
  console.log('  354:', after354)
  console.log('  355:', after355)

  // Проверим итоговый порядок
  console.log('\nFinal order:')
  const all = db.exec("SELECT id, name FROM products WHERE category_id = 78 ORDER BY id")
  all[0]?.values.forEach(row => console.log(`  ${row[0]}: ${row[1]}`))

  const data = db.export()
  fs.writeFileSync(dbPath, Buffer.from(data))
  console.log('\nDatabase saved!')

  db.close()
}

swapINNO().catch(console.error)
