const XLSX = require('xlsx');

const workbook = XLSX.readFile('ПРАЙС С ЯНВАРЯ 2026.xlsx', { cellStyles: true });

console.log('=== АНАЛИЗ ЦВЕТОВ И ГРУПП ===\n');

const sheetName = 'ПРАЙС ОБЩИЙ РОССИЯ N';
const sheet = workbook.Sheets[sheetName];

// Получаем все ячейки
const range = XLSX.utils.decode_range(sheet['!ref']);
const colors = {};
const rows = [];

for (let r = range.s.r; r <= range.e.r; r++) {
    const cellAddr = XLSX.utils.encode_cell({ r, c: 0 }); // Колонка A
    const cell = sheet[cellAddr];

    if (cell) {
        let bgColor = null;
        if (cell.s && cell.s.fgColor) {
            bgColor = cell.s.fgColor.rgb || cell.s.fgColor.theme;
        }

        const value = cell.v || '';
        if (value) {
            rows.push({
                row: r + 1,
                value: String(value).substring(0, 60),
                color: bgColor
            });

            if (bgColor) {
                if (!colors[bgColor]) colors[bgColor] = [];
                colors[bgColor].push({ row: r + 1, value: String(value).substring(0, 50) });
            }
        }
    }
}

console.log('=== ЦВЕТА И ИХ СТРОКИ ===\n');
Object.entries(colors).forEach(([color, items]) => {
    console.log(`\nЦВЕТ: ${color} (${items.length} строк)`);
    items.slice(0, 5).forEach(item => {
        console.log(`  Строка ${item.row}: ${item.value}`);
    });
    if (items.length > 5) console.log(`  ... и ещё ${items.length - 5} строк`);
});

console.log('\n\n=== ВСЕ СТРОКИ С ЦВЕТАМИ ===\n');
rows.forEach(r => {
    console.log(`${r.row}: [${r.color || 'без цвета'}] ${r.value}`);
});
