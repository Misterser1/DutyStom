const XLSX = require('xlsx');

const wb = XLSX.readFile('Price.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, {header: 1});

console.log('=== ПЕРВЫЕ 150 СТРОК EXCEL ФАЙЛА ===\n');

data.slice(0, 150).forEach((row, i) => {
  if (row.length > 0) {
    const col1 = (row[0] || '').toString().substring(0, 60);
    const col2 = (row[1] || '').toString();
    const col3 = (row[2] || '').toString().substring(0, 30);

    // Определяем, это заголовок раздела или нет
    const isSection = col1 && !col2 && !col3 && col1.length > 3;
    const marker = isSection ? ' <<<< РАЗДЕЛ' : '';

    if (col1) {
      console.log(`${(i+1).toString().padStart(3)}. [${col1}] [${col2}] [${col3}]${marker}`);
    }
  }
});
