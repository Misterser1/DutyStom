import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'db.sqlite')
let db = null
let SQL = null

// Сохранение базы данных в файл
function saveDb() {
  if (db) {
    const data = db.export()
    const buffer = Buffer.from(data)
    writeFileSync(dbPath, buffer)
  }
}

export function getDb() {
  return db
}

// Хелперы для совместимости с синхронным API
export function dbRun(sql, params = []) {
  db.run(sql, params)
  saveDb()
  return { lastInsertRowid: db.exec('SELECT last_insert_rowid()')[0]?.values[0]?.[0] }
}

export function dbGet(sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  if (stmt.step()) {
    const row = stmt.getAsObject()
    stmt.free()
    return row
  }
  stmt.free()
  return null
}

export function dbAll(sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const results = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }
  stmt.free()
  return results
}

export async function initDatabase() {
  // Инициализируем sql.js
  SQL = await initSqlJs()

  // Загружаем существующую БД или создаем новую
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  // Создание таблиц
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category_id INTEGER,
      brand TEXT,
      image_url TEXT,
      in_stock INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      comment TEXT,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Проверяем есть ли категории
  const categoriesCount = dbGet('SELECT COUNT(*) as count FROM categories')

  if (!categoriesCount || categoriesCount.count === 0) {
    const categories = [
      ['Имплантаты', 'implants'],
      ['Компоненты', 'components'],
      ['Костные материалы', 'bone'],
      ['Мембраны', 'membrane'],
      ['Расходники', 'supplies']
    ]

    for (const [name, slug] of categories) {
      db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug])
    }
    console.log('Categories initialized')
  }

  // Проверяем есть ли товары
  const productsCount = dbGet('SELECT COUNT(*) as count FROM products')

  if (!productsCount || productsCount.count === 0) {
    const products = [
      // Имплантаты
      ['Blue Diamond Regular Thread', 'MEGAGEN', 1, 13500, 'Имплантат с обычной резьбой'],
      ['Blue Diamond Deep Thread', 'MEGAGEN', 1, 13500, 'Имплантат с глубокой резьбой'],
      ['AnyOne Regular Thread', 'MEGAGEN', 1, 6600, 'Универсальный имплантат'],
      ['AnyOne Deep Thread', 'MEGAGEN', 1, 6600, 'Универсальный имплантат с глубокой резьбой'],
      ['SimpleLine II', 'DENTIUM', 1, 12350, 'Премиум имплантат'],
      ['INNO Submerged', 'CWM', 1, 7500, 'Погружной имплантат'],
      ['DIO Implant UFII', 'DIO', 1, 5950, 'Имплантат DIO серии UFII'],
      ['DIO Internal', 'DIO', 1, 5950, 'Имплантат с внутренним соединением'],
      ['SNUCone AF+I', 'SNUCONE', 1, 5300, 'Имплантат SNUCone серии AF+I'],
      ['NeoBiotech IS-II Active', 'NeoBiotech', 1, 5990, 'Активный имплантат'],
      ['NeoBiotech IS-III Active', 'NeoBiotech', 1, 6500, 'Имплантат третьего поколения'],
      ['DENTIS AXEL Regular', 'DENTIS', 1, 9000, 'Имплантат AXEL'],
      ['DENTIS SQ', 'DENTIS', 1, 7000, 'Имплантат серии SQ'],
      ['OSSTEM TS IV BA', 'OSSTEM', 1, 9000, 'Имплантат TS IV BA'],
      ['OSSTEM TS IV CA', 'OSSTEM', 1, 6500, 'Имплантат TS IV CA'],
      ['OSSTEM TS III BA', 'OSSTEM', 1, 9000, 'Имплантат TS III BA'],
      ['Straumann Bone Level (BL)', 'Straumann', 1, 18400, 'Премиум имплантат Bone Level'],
      ['Straumann Bone Level Tapered (BLT)', 'Straumann', 1, 18400, 'Конусный имплантат BLT'],
      ['Astra Tech TX', 'ASTRA TECH', 1, 19900, 'Премиум имплантат Astra Tech TX'],
      ['Astra Tech TX Profile', 'ASTRA TECH', 1, 23100, 'Профильный имплантат'],
      ['SICace', 'SIC', 1, 10600, 'Имплантат SICace'],
      ['Anthogyr Axiom X3', 'Anthogyr', 1, 10690, 'Имплантат Axiom X3'],

      // Компоненты
      ['Irrigation Tube for NSK, SAESHIN', 'Universal', 2, 600, 'Ирригационная трубка'],
      ['GEO Titanium Base', 'GEO', 2, 750, 'Титановая база'],
      ['Abutment Cemented', 'Universal', 2, 800, 'Цементируемый абатмент'],
      ['Healing Abutment', 'Universal', 2, 600, 'Формирователь десны'],
      ['Analog', 'Universal', 2, 800, 'Аналог имплантата'],
      ['Transfer', 'Universal', 2, 850, 'Трансфер'],
      ['Screw', 'Universal', 2, 350, 'Винт'],
      ['D-TYPE Multiunit Direct Set', 'D-TYPE', 2, 5200, 'Набор Multiunit Direct'],
      ['D-TYPE Multiunit Angled Set', 'D-TYPE', 2, 8000, 'Угловой набор Multiunit'],

      // Костные материалы
      ['i-Bone Max Allograft 1.2cc', 'i-Bone', 3, 12500, 'Аллографт 1.2cc'],
      ['Titan B Xenograft 0.25g', 'TITAN', 3, 7700, 'Ксенографт 0.25г'],
      ['Titan B Xenograft 0.5g', 'TITAN', 3, 8500, 'Ксенографт 0.5г'],
      ['Cerabone 2ml', 'Straumann', 3, 13500, 'Cerabone 2мл'],
      ['InterOss Xenograft 0.5cc', 'SIGMAGRAFT', 3, 6500, 'Ксенографт InterOss 0.5cc'],
      ['InterOss Xenograft 1g', 'SIGMAGRAFT', 3, 15700, 'Ксенографт InterOss 1г'],
      ['Collagen Xenograft 1cc', 'Universal', 3, 4900, 'Коллагеновый ксенографт 1cc'],
      ['Veri-Oss Xenograft 0.25g', 'VERI-OSS', 3, 6000, 'Ксенографт Veri-Oss 0.25г'],
      ['Bone Scraper Titan S', 'TITAN', 3, 4000, 'Костный скребок'],
      ['Creos Xenogain 0.25g', 'Nobel', 3, 7200, 'Creos Xenogain 0.25г'],
      ['Straumann Xenograft 0.5g', 'Straumann', 3, 9700, 'Straumann Xenograft 0.5г'],

      // Мембраны
      ['MyDerm Membrane 15x20mm', 'MyDerm', 4, 10000, 'Мембрана MyDerm 15x20мм'],
      ['PTFE Membrane PM2025A 20x25mm', 'Universal', 4, 8000, 'PTFE мембрана 20x25мм'],
      ['Titan-Gide Membrane 15x20mm', 'TITAN', 4, 6000, 'Titan-Gide 15x20мм'],
      ['Titan M Membrane 15x20mm', 'TITAN', 4, 4000, 'Titan M 15x20мм'],
      ['Jason Membrane 15x20mm', 'Straumann', 4, 10000, 'Jason 15x20мм'],
      ['InterCollagen Guide 15x20mm', 'SIGMAGRAFT', 4, 11000, 'InterCollagen Guide 15x20мм'],
      ['Contur Membrane 15x20mm', 'Contur', 4, 5400, 'Contur 15x20мм'],
      ['Barrier Membrane 15x20mm', 'Barrier', 4, 5400, 'Barrier 15x20мм'],

      // Расходники
      ['Dafilon Suture 4/0 45cm 16mm', 'B.BRAUN', 5, 10000, 'Шовный материал 4/0'],
      ['Dafilon Suture 5/0 45cm 16mm', 'B.BRAUN', 5, 12000, 'Шовный материал 5/0'],
      ['Pins Unstressed 2.0mm', 'Universal', 5, 600, 'Пины 2.0мм'],
      ['Screws', 'Universal', 5, 1200, 'Винты'],
      ['Kit Screw for GBR', 'Universal', 5, 37000, 'Набор винтов для GBR'],
      ['GC Fuji I Cement', 'GC', 5, 6000, 'Цемент GC Fuji I'],
      ['Single Bond Universal Adhesive', '3M', 5, 5500, 'Адгезив Single Bond Universal'],
      ['Adper Single Bond 2 Adhesive', '3M', 5, 4500, 'Адгезив Adper Single Bond 2']
    ]

    for (const [name, brand, category_id, price, description] of products) {
      db.run('INSERT INTO products (name, brand, category_id, price, description) VALUES (?, ?, ?, ?, ?)',
        [name, brand, category_id, price, description])
    }
    console.log('Products initialized')
  }

  saveDb()
  return db
}
