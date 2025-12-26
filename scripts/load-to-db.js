/**
 * Скрипт загрузки товаров из price-2026-import.json в базу данных SQLite
 */

const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

// Пути к файлам
const scriptDir = __dirname;
const rootDir = path.join(scriptDir, '..');
const dbPath = path.join(rootDir, 'server', 'database', 'db.sqlite');
const dataPath = path.join(rootDir, 'data', 'price-2026-import.json');

async function loadToDb() {
  console.log('=== ЗАГРУЗКА ТОВАРОВ В БАЗУ ДАННЫХ ===\n');

  // Загружаем JSON с товарами
  if (!fs.existsSync(dataPath)) {
    console.error('Файл данных не найден:', dataPath);
    console.log('Сначала запустите: node scripts/import-price-2026.js');
    return;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Загружено ${data.products.length} товаров из JSON\n`);

  // Инициализируем sql.js
  const SQL = await initSqlJs();

  // Загружаем или создаём БД
  let db;
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
    console.log('База данных загружена\n');
  } else {
    db = new SQL.Database();
    console.log('Создана новая база данных\n');
  }

  // Создаём таблицы если не существуют
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon_url TEXT,
      parent_id INTEGER REFERENCES categories(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Проверяем существующую таблицу products
  try {
    const tableInfo = db.exec("PRAGMA table_info(products)");
    const existingColumns = tableInfo[0]?.values.map(row => row[1]) || [];
    console.log('Существующие колонки products:', existingColumns.join(', '));

    // Добавляем недостающие колонки
    const neededColumns = [
      ['name_en', 'TEXT'],
      ['subcategory_id', 'INTEGER'],
      ['material', 'TEXT'],
      ['price_qty_10', 'REAL'],
      ['price_qty_30', 'REAL'],
      ['price_qty_50', 'REAL'],
      ['price_qty_100', 'REAL'],
      ['price_qty_200', 'REAL'],
      ['price_qty_500', 'REAL'],
      ['price_qty_1000', 'REAL']
    ];

    for (const [col, type] of neededColumns) {
      if (!existingColumns.includes(col)) {
        try {
          db.run(`ALTER TABLE products ADD COLUMN ${col} ${type}`);
          console.log(`  + Добавлена колонка: ${col}`);
        } catch (e) {
          // Колонка уже существует или ошибка
        }
      }
    }
  } catch (e) {
    // Таблица не существует, создаём
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        name_en TEXT,
        description TEXT,
        price REAL NOT NULL,
        category_id INTEGER,
        subcategory_id INTEGER,
        brand TEXT,
        image_url TEXT,
        in_stock INTEGER DEFAULT 1,
        country TEXT,
        material TEXT,
        code TEXT,
        article TEXT,
        price_qty_10 REAL,
        price_qty_30 REAL,
        price_qty_50 REAL,
        price_qty_100 REAL,
        price_qty_200 REAL,
        price_qty_500 REAL,
        price_qty_1000 REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (subcategory_id) REFERENCES categories(id)
      )
    `);
  }

  // Очищаем существующие данные
  console.log('Очистка существующих данных...');
  db.run('DELETE FROM products');
  db.run('DELETE FROM categories');
  try {
    db.run('DELETE FROM sqlite_sequence WHERE name="products"');
    db.run('DELETE FROM sqlite_sequence WHERE name="categories"');
  } catch(e) {
    // Игнорируем если sqlite_sequence не существует
  }

  // Собираем уникальные категории
  const categories = new Map();
  const subcategories = new Map();

  for (const product of data.products) {
    const cat = product.category;
    const subcat = product.subcategory;

    if (cat && !categories.has(cat)) {
      categories.set(cat, null);
    }

    if (cat && subcat) {
      const key = `${cat}::${subcat}`;
      if (!subcategories.has(key)) {
        subcategories.set(key, { category: cat, subcategory: subcat });
      }
    }
  }

  // Создаём slug из названия
  function toSlug(str) {
    const translitMap = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
      'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    return str.toLowerCase()
      .split('')
      .map(char => translitMap[char] || char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Вставляем главные категории
  console.log('\nСоздание категорий...');
  const categoryIds = {};

  for (const catName of categories.keys()) {
    const slug = toSlug(catName);
    try {
      db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', [catName, slug]);
      const result = db.exec('SELECT last_insert_rowid()');
      categoryIds[catName] = result[0].values[0][0];
      console.log(`  + ${catName} (id: ${categoryIds[catName]})`);
    } catch (e) {
      console.error(`  ! Ошибка создания категории ${catName}:`, e.message);
    }
  }

  // Вставляем подкатегории
  console.log('\nСоздание подкатегорий...');
  const subcategoryIds = {};

  for (const [key, { category, subcategory }] of subcategories) {
    const parentId = categoryIds[category];
    const slug = toSlug(`${category}-${subcategory}`);

    try {
      db.run('INSERT INTO categories (name, slug, parent_id) VALUES (?, ?, ?)',
        [subcategory, slug, parentId]);
      const result = db.exec('SELECT last_insert_rowid()');
      subcategoryIds[key] = result[0].values[0][0];
      console.log(`  + ${subcategory} -> ${category} (id: ${subcategoryIds[key]})`);
    } catch (e) {
      console.error(`  ! Ошибка создания подкатегории ${subcategory}:`, e.message);
    }
  }

  // Вставляем товары
  console.log('\nЗагрузка товаров...');
  let successCount = 0;
  let errorCount = 0;

  for (const product of data.products) {
    const catId = categoryIds[product.category] || null;
    const subcatKey = `${product.category}::${product.subcategory}`;
    const subcatId = subcategoryIds[subcatKey] || null;

    // Определяем бренд из названия
    let brand = '';
    const nameUpper = (product.nameEn || '').toUpperCase();
    if (nameUpper.includes('DIO')) brand = 'DIO';
    else if (nameUpper.includes('DENTIUM')) brand = 'DENTIUM';
    else if (nameUpper.includes('MEGAGEN') || nameUpper.includes('BLUEDIAMOND')) brand = 'MEGAGEN';
    else if (nameUpper.includes('SNUCONE')) brand = 'SNUCONE';
    else if (nameUpper.includes('INNO')) brand = 'INNO';
    else if (nameUpper.includes('NEOBITECH')) brand = 'NEOBITECH';
    else if (nameUpper.includes('DENTIS')) brand = 'DENTIS';
    else if (nameUpper.includes('OSSTEM')) brand = 'OSSTEM';
    else if (nameUpper.includes('STRAUMANN')) brand = 'STRAUMANN';
    else if (nameUpper.includes('ANTHOGYR')) brand = 'ANTHOGYR';
    else if (nameUpper.includes('ASTRATECH') || nameUpper.includes('ASTRA TECH')) brand = 'ASTRATECH';
    else if (nameUpper.includes('SIC')) brand = 'SIC';
    else if (nameUpper.includes('NOBEL') || nameUpper.includes('CREOS')) brand = 'NOBEL';
    else if (nameUpper.includes('NIBEC')) brand = 'NIBEC';
    else if (nameUpper.includes('SIGMAGRAFT')) brand = 'SIGMAGRAFT';
    else if (nameUpper.includes('TITAN')) brand = 'TITAN';
    else if (nameUpper.includes('BIOOST')) brand = 'BioOst';
    else if (nameUpper.includes('X GATE') || nameUpper.includes('X-GATE')) brand = 'X GATE';
    else if (nameUpper.includes('GEO')) brand = 'GEO';
    else if (nameUpper.includes('BRAUN')) brand = 'B.BRAUN';
    else if (nameUpper.includes('FUJI')) brand = 'GC';
    else if (nameUpper.includes('3M')) brand = '3M';

    // Извлекаем цены
    const prices = product.prices || {};
    const basePrice = product.basePrice || 0;

    try {
      db.run(`
        INSERT INTO products (
          name, name_en, description, price, category_id, subcategory_id,
          brand, country, material,
          price_qty_10, price_qty_30, price_qty_50, price_qty_100,
          price_qty_200, price_qty_500, price_qty_1000
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        product.nameRu || product.nameEn,
        product.nameEn,
        product.nameRu,
        basePrice,
        catId,
        subcatId,
        brand,
        product.country || '',
        product.material || '',
        prices.qty_10 || null,
        prices.qty_30 || null,
        prices.qty_50 || null,
        prices.qty_100 || null,
        prices.qty_200 || null,
        prices.qty_500 || null,
        prices.qty_1000 || null
      ]);
      successCount++;
    } catch (e) {
      console.error(`  ! Ошибка добавления товара "${product.nameRu}":`, e.message);
      errorCount++;
    }
  }

  // Сохраняем БД
  const dbData = db.export();
  const buffer = Buffer.from(dbData);
  fs.writeFileSync(dbPath, buffer);

  console.log('\n=== РЕЗУЛЬТАТ ===');
  console.log(`Категорий создано: ${Object.keys(categoryIds).length}`);
  console.log(`Подкатегорий создано: ${Object.keys(subcategoryIds).length}`);
  console.log(`Товаров добавлено: ${successCount}`);
  console.log(`Ошибок: ${errorCount}`);
  console.log(`\nБаза данных сохранена: ${dbPath}`);
}

loadToDb().catch(console.error);
