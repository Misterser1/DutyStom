const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Конфигурация
const EXCEL_FILE = 'Price.xlsx';
const DB_FILE = path.join(__dirname, '../server/database/dutystom.db');
const EXCHANGE_RATE = 80; // 80₽ = $1

console.log('=== ИМПОРТ ДАННЫХ ИЗ EXCEL В БД ===\n');
console.log(`Excel файл: ${EXCEL_FILE}`);
console.log(`База данных: ${DB_FILE}`);
console.log(`Курс конвертации: ${EXCHANGE_RATE}₽ = $1\n`);

// Открываем БД
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err);
    process.exit(1);
  }
  console.log('✅ Подключено к БД\n');
});

// Читаем Excel
const workbook = XLSX.readFile(EXCEL_FILE);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log(`📊 Прочитано строк из Excel: ${data.length}\n`);

// Функция для создания slug из названия
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Функция для извлечения цены из строки типа "От 10 штук - 5000"
function extractPrice(priceStr) {
  if (!priceStr) return null;
  const match = String(priceStr).match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Функция для конвертации цены в USD
function convertToUSD(rublePrice) {
  if (!rublePrice) return null;
  return Math.round((rublePrice / EXCHANGE_RATE) * 100) / 100; // Округляем до 2 знаков
}

// Шаг 1: Собираем уникальные категории
console.log('📋 Шаг 1: Сбор уникальных категорий...\n');
const categoriesMap = new Map();

data.forEach(row => {
  const categoryName = row.__EMPTY_1 || row['THE PRODUCT'];
  if (categoryName && categoryName !== 'THE PRODUCT') {
    if (!categoriesMap.has(categoryName)) {
      categoriesMap.set(categoryName, {
        name: categoryName,
        slug: createSlug(categoryName),
        count: 0
      });
    }
    categoriesMap.get(categoryName).count++;
  }
});

console.log(`Найдено уникальных категорий: ${categoriesMap.size}\n`);
categoriesMap.forEach((cat, name) => {
  console.log(`  - ${name} (${cat.count} товаров)`);
});

// Шаг 2: Очистка БД
console.log('\n🗑️  Шаг 2: Очистка старых данных...\n');

db.serialize(() => {
  db.run('DELETE FROM products', (err) => {
    if (err) {
      console.error('Ошибка при удалении товаров:', err);
      return;
    }
    console.log('✅ Удалены старые товары');
  });

  db.run('DELETE FROM categories', (err) => {
    if (err) {
      console.error('Ошибка при удалении категорий:', err);
      return;
    }
    console.log('✅ Удалены старые категории\n');
  });

  // Шаг 3: Вставка категорий
  console.log('📁 Шаг 3: Вставка категорий в БД...\n');

  const categoryIds = new Map();
  const insertCategory = db.prepare('INSERT INTO categories (name, slug, description, icon_url) VALUES (?, ?, ?, ?)');

  let categoryIndex = 0;
  categoriesMap.forEach((cat, name) => {
    categoryIndex++;
    insertCategory.run(cat.name, cat.slug, `${cat.name} category`, null, function(err) {
      if (err) {
        console.error(`Ошибка при вставке категории ${name}:`, err);
        return;
      }
      categoryIds.set(cat.name, this.lastID);
      console.log(`  ✅ [${categoryIndex}/${categoriesMap.size}] ${cat.name} (ID: ${this.lastID})`);

      // После вставки всех категорий, вставляем товары
      if (categoryIndex === categoriesMap.size) {
        insertCategory.finalize();
        insertProducts(categoryIds);
      }
    });
  });
});

// Шаг 4: Вставка товаров
function insertProducts(categoryIds) {
  console.log('\n📦 Шаг 4: Вставка товаров в БД...\n');

  const insertProduct = db.prepare(`
    INSERT INTO products (
      name, description, price, category_id, brand, image_url, in_stock,
      code, article, price_usd, price_tier_200k, price_tier_500k, price_tier_1500k,
      country, specs, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  let productIndex = 0;
  let successCount = 0;
  let errorCount = 0;

  data.forEach((row, index) => {
    const name = row.__EMPTY || row['PRODUCT NAME / ARTICLE NUMBER'];
    const categoryName = row.__EMPTY_1 || row['THE PRODUCT'];
    const material = row.__EMPTY_2 || row['MANUFACTURING MATERIAL\r\nTOOLS NAME'];
    const country = row.__EMPTY_3 || row['COUNTRY'];
    const nameRu = row.__EMPTY_4 || row['НАЗВАНИЕ ТОВАРА НА РУССКОМ'];

    // Пропускаем заголовок и пустые строки
    if (!name || !categoryName || categoryName === 'THE PRODUCT') {
      return;
    }

    productIndex++;

    // Извлекаем цены
    const price10 = extractPrice(row.__EMPTY_5);
    const price50 = extractPrice(row.__EMPTY_6);
    const price100 = extractPrice(row.__EMPTY_7);
    const price500 = extractPrice(row.__EMPTY_8);
    const price1000 = extractPrice(row.__EMPTY_9);

    // Базовая цена - первая найденная цена, конвертированная в USD
    const basePrice = convertToUSD(price10 || price50 || price100 || price500 || price1000 || 0);

    // Извлекаем бренд из названия (первое слово)
    const brand = name.split(' ')[0];

    // Категория ID
    const categoryId = categoryIds.get(categoryName);
    if (!categoryId) {
      console.error(`  ❌ [${productIndex}] Категория не найдена: ${categoryName} для товара ${name}`);
      errorCount++;
      return;
    }

    // Спецификации
    const specs = JSON.stringify({
      material: material || null,
      nameRu: nameRu || null
    });

    insertProduct.run(
      name,                              // name
      name,                              // description
      basePrice,                         // price (в USD)
      categoryId,                        // category_id
      brand,                             // brand
      null,                              // image_url
      1,                                 // in_stock
      '00001',                           // code
      brand,                             // article
      basePrice,                         // price_usd
      convertToUSD(price100),            // price_tier_200k
      convertToUSD(price500),            // price_tier_500k
      convertToUSD(price1000),           // price_tier_1500k
      country || null,                   // country
      specs,                             // specs
      function(err) {
        if (err) {
          console.error(`  ❌ [${productIndex}] Ошибка при вставке товара ${name}:`, err.message);
          errorCount++;
        } else {
          successCount++;
          if (successCount % 50 === 0) {
            console.log(`  ✅ Импортировано: ${successCount} товаров...`);
          }
        }

        // Проверяем, закончили ли мы
        if (successCount + errorCount === productIndex) {
          insertProduct.finalize();
          finishImport(successCount, errorCount);
        }
      }
    );
  });
}

// Шаг 5: Завершение
function finishImport(successCount, errorCount) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 РЕЗУЛЬТАТЫ ИМПОРТА');
  console.log('='.repeat(60));
  console.log(`✅ Успешно импортировано: ${successCount} товаров`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📁 Категорий создано: ${categoriesMap.size}`);
  console.log('='.repeat(60));

  // Проверка данных
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('Ошибка при проверке:', err);
    } else {
      console.log(`\n🔍 Проверка: В БД ${row.count} товаров`);
    }

    db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
      if (err) {
        console.error('Ошибка при проверке:', err);
      } else {
        console.log(`🔍 Проверка: В БД ${row.count} категорий`);
      }

      // Показываем примеры товаров
      db.all(`
        SELECT p.name, p.price, c.name as category, p.country
        FROM products p
        JOIN categories c ON p.category_id = c.id
        LIMIT 5
      `, (err, rows) => {
        if (err) {
          console.error('Ошибка при выборке примеров:', err);
        } else {
          console.log('\n📦 Примеры импортированных товаров:');
          rows.forEach(row => {
            console.log(`  - ${row.name} | $${row.price} | ${row.category} | ${row.country || 'N/A'}`);
          });
        }

        db.close((err) => {
          if (err) {
            console.error('Ошибка при закрытии БД:', err);
          } else {
            console.log('\n✅ БД закрыта. Импорт завершён!\n');
          }
        });
      });
    });
  });
}
