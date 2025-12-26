const XLSX = require('xlsx');

const workbook = XLSX.readFile('Price.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

console.log('=== СТРУКТУРА EXCEL ФАЙЛА ===\n');
console.log('Всего строк:', data.length);
console.log('\nПервые 50 строк для анализа структуры:\n');

data.slice(0, 50).forEach((row, index) => {
  // Проверяем, не является ли это заголовком раздела
  const firstCol = row[0] || '';
  const secondCol = row[1] || '';
  const thirdCol = row[2] || '';

  // Если первая колонка заполнена, а остальные пустые - возможно это заголовок раздела
  const isHeader = firstCol && !secondCol && !thirdCol;

  if (isHeader) {
    console.log(`\n========== СТРОКА ${index + 1}: ВОЗМОЖНО ЗАГОЛОВОК РАЗДЕЛА ==========`);
    console.log(`"${firstCol}"`);
    console.log('='.repeat(60));
  } else if (firstCol) {
    console.log(`${index + 1}. ${firstCol.substring(0, 60)} | ${secondCol} | ${thirdCol}`);
  } else {
    console.log(`${index + 1}. [ПУСТАЯ СТРОКА]`);
  }
});

console.log('\n\n=== ПОИСК ЗАГОЛОВКОВ РАЗДЕЛОВ ===\n');

let currentSection = null;
const sections = {};

data.forEach((row, index) => {
  const firstCol = row[0] || '';
  const secondCol = row[1] || '';
  const thirdCol = row[2] || '';

  // Заголовок раздела - если только первая колонка заполнена
  if (firstCol && !secondCol && !thirdCol && firstCol.length > 3) {
    currentSection = firstCol.trim();
    if (!sections[currentSection]) {
      sections[currentSection] = {
        startRow: index + 1,
        items: []
      };
    }
    console.log(`\nНайден раздел: "${currentSection}" (строка ${index + 1})`);
  } else if (firstCol && secondCol && currentSection) {
    // Это товар внутри раздела
    sections[currentSection].items.push({
      name: firstCol,
      type: secondCol,
      row: index + 1
    });
  }
});

console.log('\n\n=== ИТОГОВАЯ СТРУКТУРА РАЗДЕЛОВ ===\n');

Object.entries(sections).forEach(([sectionName, data]) => {
  console.log(`📁 ${sectionName}`);
  console.log(`   Товаров: ${data.items.length}`);
  console.log(`   Начинается со строки: ${data.startRow}`);
  if (data.items.length > 0) {
    console.log(`   Примеры:`);
    data.items.slice(0, 3).forEach(item => {
      console.log(`     - ${item.name} (${item.type})`);
    });
  }
  console.log('');
});
