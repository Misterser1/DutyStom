const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const workbook = XLSX.readFile('Price.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('=== АНАЛИЗ EXCEL ФАЙЛА Price.xlsx ===');
console.log('Общее количество строк:', data.length);

// Подсчитаем категории
const categories = {};
const products = [];

data.forEach((row, index) => {
  const name = row.__EMPTY || row['PRODUCT NAME / ARTICLE NUMBER'];
  const type = row.__EMPTY_1 || row['THE PRODUCT'];
  const country = row.__EMPTY_3 || row['COUNTRY'];

  // Пропускаем заголовок
  if (type === 'THE PRODUCT' || !type) return;

  if (type && name) {
    categories[type] = (categories[type] || 0) + 1;
    products.push({ name, type, country });
  }
});

console.log('\n=== КАТЕГОРИИ ===');
Object.entries(categories).sort((a,b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`${cat}: ${count} товаров`);
});

console.log('\n=== ИТОГО ===');
console.log(`Всего уникальных категорий: ${Object.keys(categories).length}`);
console.log(`Всего товаров: ${products.length}`);

console.log('\n=== ПРИМЕРЫ ТОВАРОВ ПО КАТЕГОРИЯМ ===');
Object.keys(categories).slice(0, 5).forEach(cat => {
  console.log(`\n${cat}:`);
  products.filter(p => p.type === cat).slice(0, 3).forEach(p => {
    console.log(`  - ${p.name} (${p.country || 'N/A'})`);
  });
});
