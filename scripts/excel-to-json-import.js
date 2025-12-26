import XLSX from 'xlsx';
import { readFileSync, writeFileSync } from 'fs';
import { initDatabase, dbRun, dbGet, dbAll } from '../server/database/init.js';
import { CATEGORY_HIERARCHY, getParentCategory } from './category-mapping.js';

const EXCEL_FILE = 'Price.xlsx';
const EXCHANGE_RATE = 80; // 80₽ = $1

console.log('=== ИМПОРТ ИЗ EXCEL В БД ===\n');
console.log(`Файл: ${EXCEL_FILE}`);
console.log(`Курс: ${EXCHANGE_RATE}₽ = $1\n`);

// Функция для создания slug
function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Функция для извлечения цены (берём последнее число из строки типа "От 10 штук - 5000")
function extractPrice(priceStr) {
  if (!priceStr) return null;
  // Ищем все числа в строке
  const numbers = String(priceStr).match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  // Возвращаем последнее число (это и есть цена)
  return parseInt(numbers[numbers.length - 1]);
}

// Читаем Excel
const workbook = XLSX.readFile(EXCEL_FILE);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log(`📊 Прочитано строк: ${data.length}\n`);

// Собираем данные по категориям
const categoriesMap = new Map();

data.forEach(row => {
  const name = row.__EMPTY || row['PRODUCT NAME / ARTICLE NUMBER'];
  const categoryName = row.__EMPTY_1 || row['THE PRODUCT'];
  const material = row.__EMPTY_2 || row['MANUFACTURING MATERIAL\r\nTOOLS NAME'];
  const country = row.__EMPTY_3 || row['COUNTRY'];
  const nameRu = row.__EMPTY_4 || row['НАЗВАНИЕ ТОВАРА НА РУССКОМ'];

  // Пропускаем заголовок и пустые строки
  if (!name || !categoryName || categoryName === 'THE PRODUCT') {
    return;
  }

  // Создаем категорию если не существует
  if (!categoriesMap.has(categoryName)) {
    categoriesMap.set(categoryName, {
      name: categoryName,
      slug: createSlug(categoryName),
      products: []
    });
  }

  // Извлекаем цены из разных колонок
  const price10 = extractPrice(row.__EMPTY_5);
  const price50 = extractPrice(row.__EMPTY_6);
  const price100 = extractPrice(row.__EMPTY_7);
  const price500 = extractPrice(row.__EMPTY_8);
  const price1000 = extractPrice(row.__EMPTY_9);

  // Извлекаем бренд (первое слово в названии)
  const brand = name.split(' ')[0];

  // Добавляем продукт в категорию
  categoriesMap.get(categoryName).products.push({
    name,
    brand,
    article: brand, // Используем бренд как артикул
    priceRUB: {
      retail: price10 || price50 || price100 || price500 || price1000 || 0,
      tier200k: price100 || null,
      tier500k: price500 || null,
      tier1500k: price1000 || null
    },
    country: country || null,
    specs: {
      material: material || null,
      nameRu: nameRu || null
    },
    description: name
  });
});

console.log(`📁 Найдено категорий: ${categoriesMap.size}\n`);

// Инициализируем БД
console.log('🔄 Инициализация БД...\n');
await initDatabase();

// Удаляем старые данные
console.log('🗑️  Удаление старых данных...\n');
dbRun('DELETE FROM products');
dbRun('DELETE FROM categories');
console.log('✅ Старые данные удалены\n');

// ===== СОЗДАНИЕ ИЕРАРХИИ КАТЕГОРИЙ =====
console.log('📁 Создание иерархии категорий...\n');

// 1. Создать основные категории (уровень 1, parent_id = NULL)
const parentCategoryIds = new Map();

console.log('  Уровень 1: Основные категории\n');
let mainCatIndex = 0;
for (const mainCat of Object.keys(CATEGORY_HIERARCHY)) {
  mainCatIndex++;
  dbRun('INSERT INTO categories (name, slug, parent_id) VALUES (?, ?, NULL)',
    [mainCat, createSlug(mainCat)]);

  const category = dbGet('SELECT id FROM categories WHERE slug = ?', [createSlug(mainCat)]);
  parentCategoryIds.set(mainCat, category.id);
  console.log(`    ${mainCatIndex}. ${mainCat} (ID: ${category.id})`);
}

// 2. Создать подкатегории (уровень 2)
const subcategoriesMap = new Map(); // детальная категория → её ID

console.log('\n  Уровень 2: Подкатегории\n');
let subCatIndex = 0;
for (const [parentCat, subcats] of Object.entries(CATEGORY_HIERARCHY)) {
  const parentId = parentCategoryIds.get(parentCat);
  const parentSlug = createSlug(parentCat);

  for (const subcat of subcats) {
    subCatIndex++;

    // Создаём уникальный slug для подкатегории
    let subcatSlug = createSlug(subcat);

    // Если slug совпадает с родительским, добавляем суффикс
    const existingCat = dbGet('SELECT id FROM categories WHERE slug = ?', [subcatSlug]);
    if (existingCat) {
      subcatSlug = `${parentSlug}-${subcatSlug}`;
    }

    dbRun('INSERT INTO categories (name, slug, parent_id) VALUES (?, ?, ?)',
      [subcat, subcatSlug, parentId]);

    const subcatRecord = dbGet('SELECT id FROM categories WHERE slug = ?', [subcatSlug]);
    subcategoriesMap.set(subcat, subcatRecord.id);
    console.log(`    ${subCatIndex}. ${subcat} → ${parentCat} (ID: ${subcatRecord.id}, slug: ${subcatSlug})`);
  }
}

console.log('\n  ✅ Создано категорий:');
console.log(`     - Основных: ${parentCategoryIds.size}`);
console.log(`     - Подкатегорий: ${subcategoriesMap.size}`);
console.log(`     - Всего: ${parentCategoryIds.size + subcategoriesMap.size}\n`);

// ===== ИМПОРТ ТОВАРОВ =====
console.log('📦 Импорт товаров...\n');

let totalInserted = 0;
let skipped = 0;

// Импортируем товары из собранных данных
for (const [categoryName, categoryData] of categoriesMap) {
  const subcategoryId = subcategoriesMap.get(categoryName);

  if (!subcategoryId) {
    console.warn(`  ⚠️  Подкатегория не найдена: ${categoryName}`);
    skipped += categoryData.products.length;
    continue;
  }

  // Вставляем товары этой подкатегории
  for (const product of categoryData.products) {
    const priceUSD = Math.round((product.priceRUB.retail / EXCHANGE_RATE) * 100) / 100;
    const tier200k = product.priceRUB.tier200k ? Math.round((product.priceRUB.tier200k / EXCHANGE_RATE) * 100) / 100 : null;
    const tier500k = product.priceRUB.tier500k ? Math.round((product.priceRUB.tier500k / EXCHANGE_RATE) * 100) / 100 : null;
    const tier1500k = product.priceRUB.tier1500k ? Math.round((product.priceRUB.tier1500k / EXCHANGE_RATE) * 100) / 100 : null;

    dbRun(`
      INSERT INTO products
      (code, article, name, description, price, price_usd, price_tier_200k,
       price_tier_500k, price_tier_1500k, category_id, brand,
       country, specs, in_stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      '00001',                    // code
      product.article,            // article
      product.name,               // name
      product.description,        // description
      priceUSD,                   // price (USD)
      priceUSD,                   // price_usd
      tier200k,                   // price_tier_200k
      tier500k,                   // price_tier_500k
      tier1500k,                  // price_tier_1500k
      subcategoryId,              // category_id (привязка к подкатегории!)
      product.brand,              // brand
      product.country,            // country
      JSON.stringify(product.specs), // specs
      1                           // in_stock
    ]);

    totalInserted++;
  }
}

// Проверка
console.log('\n' + '='.repeat(60));
console.log('📊 РЕЗУЛЬТАТЫ ИМПОРТА');
console.log('='.repeat(60));

const productsCount = dbGet('SELECT COUNT(*) as count FROM products');
const categoriesCount = dbGet('SELECT COUNT(*) as count FROM categories');
const mainCategoriesCount = dbGet('SELECT COUNT(*) as count FROM categories WHERE parent_id IS NULL');
const subCategoriesCount = dbGet('SELECT COUNT(*) as count FROM categories WHERE parent_id IS NOT NULL');

console.log(`✅ Категорий всего: ${categoriesCount.count}`);
console.log(`   - Основных (уровень 1): ${mainCategoriesCount.count}`);
console.log(`   - Подкатегорий (уровень 2): ${subCategoriesCount.count}`);
console.log(`✅ Товаров импортировано: ${productsCount.count}`);
if (skipped > 0) {
  console.log(`⚠️  Пропущено товаров: ${skipped}`);
}

// Показываем примеры
const examples = dbAll(`
  SELECT p.name, p.price, c.name as category, p.country
  FROM products p
  JOIN categories c ON p.category_id = c.id
  LIMIT 10
`);

console.log('\n📦 Примеры импортированных товаров:');
examples.forEach((row, i) => {
  console.log(`  ${i+1}. ${row.name} | $${row.price} | ${row.category} | ${row.country || 'N/A'}`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ ИМПОРТ ЗАВЕРШЁН УСПЕШНО!');
console.log('='.repeat(60));

process.exit(0);
