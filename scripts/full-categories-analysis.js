const XLSX = require('xlsx');

const workbook = XLSX.readFile('Price.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('=== ПОЛНЫЙ СПИСОК КАТЕГОРИЙ ИЗ EXCEL ===\n');

// Собираем все товары с категориями
const categories = {};
const products = [];

data.forEach((row, index) => {
  const name = row.__EMPTY || row['PRODUCT NAME / ARTICLE NUMBER'];
  const type = row.__EMPTY_1 || row['THE PRODUCT'];
  const material = row.__EMPTY_2 || row['MANUFACTURING MATERIAL\r\nTOOLS NAME'];
  const country = row.__EMPTY_3 || row['COUNTRY'];

  // Пропускаем заголовок
  if (type === 'THE PRODUCT' || !type || !name) return;

  if (!categories[type]) {
    categories[type] = {
      count: 0,
      products: []
    };
  }

  categories[type].count++;
  categories[type].products.push({
    name,
    material,
    country
  });
});

// Сортируем по количеству товаров
const sortedCategories = Object.entries(categories).sort((a, b) => b[1].count - a[1].count);

let totalProducts = 0;
sortedCategories.forEach(([categoryName, data], index) => {
  totalProducts += data.count;
  console.log(`${index + 1}. ${categoryName}`);
  console.log(`   Товаров: ${data.count}`);

  // Показываем первые 3 примера товаров
  console.log(`   Примеры:`);
  data.products.slice(0, 3).forEach(p => {
    const info = [p.material, p.country].filter(Boolean).join(', ');
    console.log(`     - ${p.name}${info ? ' (' + info + ')' : ''}`);
  });
  console.log('');
});

console.log('=== ИТОГО ===');
console.log(`Всего категорий: ${sortedCategories.length}`);
console.log(`Всего товаров: ${totalProducts}`);

// Проверяем, есть ли подкатегории (по именам категорий)
console.log('\n=== АНАЛИЗ СТРУКТУРЫ КАТЕГОРИЙ ===');
const mainCategories = {
  'Имплантаты': ['Implant'],
  'Костные материалы': ['Bone', 'Bone collector'],
  'Мембраны': ['Membrane'],
  'Инструменты': ['TOOLS'],
  'Протетика DIO': ['DIO ORIGINAL Prosthetics', 'DIO DIGITAL ORIGINAL Prosthetics', 'Prosthetics replica'],
  'Наборы DIO': ['DIO ORIGINAL Kit', 'DIO NAVI ORIGINAL Kit', 'DIO SURGICAL ORIGINAL Kit'],
  'Компоненты DIO': ['DIO ORIGINAL Cover Screw', 'DIO ORIGINAL Driver', 'DIO ORIGINAL Fixture Driver', 'DIO ORIGINAL Screwdriver', 'DIO DIGITAL ORIGINAL Screwdriver', 'DIO ORIGINAL Bone Profile Drill'],
  'Протетика MEGAGEN': ['BLUEDIAMOND MEGAGEN ORIGINAL Prosthetics', 'BLUEDIAMOND MEGAGEN DIGITAL ORIGINAL Prosthetics', 'BLUEDIAMOND MEGAGEN SURGICAL ORIGINAL Kit'],
  'GBR система': ['GBR Pins', 'GBR Screw'],
  'Материалы': ['Suture material', 'Bond', 'Cement'],
  'Системы': ['Irrigation systems'],
  'Реплики': ['Straumann RC Cover Screw replica', 'Screwdriver 1.2 replica', 'Screwdriver all systems replica']
};

console.log('\nВозможная группировка по основным категориям:');
Object.entries(mainCategories).forEach(([main, subs]) => {
  const total = subs.reduce((sum, subCat) => {
    const found = categories[subCat];
    return sum + (found ? found.count : 0);
  }, 0);
  console.log(`\n${main}: ${total} товаров`);
  subs.forEach(sub => {
    const found = categories[sub];
    if (found) {
      console.log(`  └─ ${sub}: ${found.count}`);
    }
  });
});
