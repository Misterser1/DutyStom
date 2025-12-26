const XLSX = require('xlsx');
const path = require('path');

// Маппинг цветов на бренды (используется как подсказка)
const COLOR_BRAND_MAP = {
  '00B0F0': 'DIO',
  '93CDDD': 'DENTIUM / OSSTEM',
  'FCD5B5': 'MEGAGEN / SNUCONE',
  'F2DCDB': 'INNO',
  'D99694': 'NEOBITECH / STRAUMANN',
  'D7E4BD': 'DENTIS / ASTRATECH',
  'E6E0EC': 'OSSTEM TS-III',
  'C3D69B': 'OSSTEM TS-IV / STRAUMANN Botiss',
  'FFC000': 'STRAUMANN',
  'B3A2C7': 'ANTHOGYR',
  'FF0066': 'SIC',
  'B7DEE8': 'Реплика',
  'E6B9B8': 'Реплика Мультиюнит',
  '00B050': 'DIO / B.BRAUN',
  'CCC1DA': 'DIO DIGITAL',
  '4BACC6': 'DIO ORIGINAL',
  'C4BD97': 'DIO Ball / BioOst',
  '7FE2EF': 'MEGAGEN',
  'FFFF00': 'MEGAGEN BLUEDIAMOND',
  'F79646': 'DIO Surgical',
  '92D050': 'Инструменты',
  '9BBB59': 'STRAUMANN XenoGraft',
  'FF5050': 'NOBEL / Инструменты',
  '8EB4E3': 'NIBEC',
  'C6D9F1': 'SIGMAGRAFT',
  'DDD9C3': 'BioOst',
};

// Определение категории по типу продукта и тексту
function determineCategory(nameEn, nameRu, productType, color) {
  const text = (nameEn + ' ' + nameRu).toUpperCase();
  const typeUpper = (productType || '').toUpperCase();
  const brand = COLOR_BRAND_MAP[color] || '';

  // 1. ИМПЛАНТАТЫ - по типу продукта
  if (typeUpper === 'IMPLANT' || typeUpper.includes('IMPLANT')) {
    let subcategory = brand;
    if (text.includes('DIO')) subcategory = 'DIO';
    else if (text.includes('DENTIUM')) subcategory = 'DENTIUM';
    else if (text.includes('SIMPLELINE')) subcategory = 'DENTIUM';
    else if (text.includes('MEGAGEN') || text.includes('BLUEDIAMOND') || text.includes('ANYONE')) subcategory = 'MEGAGEN';
    else if (text.includes('SNUCONE')) subcategory = 'SNUCONE';
    else if (text.includes('INNO')) subcategory = 'INNO';
    else if (text.includes('NEOBITECH')) subcategory = 'NEOBITECH';
    else if (text.includes('DENTIS')) subcategory = 'DENTIS';
    else if (text.includes('OSSTEM')) {
      if (text.includes('TS-IV') || text.includes('TS IV')) subcategory = 'OSSTEM TS-IV';
      else if (text.includes('TS-III') || text.includes('TS III')) subcategory = 'OSSTEM TS-III';
      else subcategory = 'OSSTEM';
    }
    else if (text.includes('STRAUMANN')) subcategory = 'STRAUMANN';
    else if (text.includes('ANTHOGYR')) subcategory = 'ANTHOGYR';
    else if (text.includes('ASTRATECH') || text.includes('ASTRA TECH')) subcategory = 'ASTRATECH';
    else if (text.includes('SIC')) subcategory = 'SIC';
    return { category: 'Имплантаты', subcategory };
  }

  // 2. МУЛЬТИЮНИТЫ
  if (typeUpper.includes('MULTIUNIT') || text.includes('MULTIUNIT') || text.includes('МУЛЬТИЮНИТ') || text.includes('МУЛЬТИНИТ')) {
    if (text.includes('X GATE') || text.includes('X-GATE')) {
      return { category: 'Протетика', subcategory: 'Мультиюниты X GATE' };
    }
    if (text.includes('DIO') && text.includes('NOT DIGITAL')) {
      return { category: 'Протетика', subcategory: 'DIO NOT DIGITAL Мультиюниты' };
    }
    if (text.includes('DIO') && text.includes('DIGITAL')) {
      return { category: 'Протетика', subcategory: 'DIO DIGITAL Мультиюниты' };
    }
    if (text.includes('DIO ORIGINAL')) {
      return { category: 'Протетика', subcategory: 'DIO ORIGINAL Мультиюниты' };
    }
    return { category: 'Протетика', subcategory: 'Мультиюниты реплика' };
  }

  // 3. ПРОТЕТИКА (Cover Screw, Prosthetics)
  if (typeUpper.includes('COVER SCREW') || text.includes('COVER SCREW') || text.includes('ЗАГЛУШКА')) {
    return { category: 'Протетика', subcategory: 'Заглушки' };
  }

  if (typeUpper.includes('PROSTHETICS') || typeUpper === 'PROSTHETICS REPLICA') {
    if (text.includes('BALL ABUTMENT') || text.includes('ШАРИКОВ')) {
      return { category: 'Протетика', subcategory: 'DIO Ball Abutment' };
    }
    if (text.includes('DIO ORIGINAL') || text.includes('DIO DIGITAL')) {
      return { category: 'Протетика', subcategory: 'DIO ORIGINAL Протетика' };
    }
    if (text.includes('BLUEDIAMOND') || text.includes('MEGAGEN')) {
      return { category: 'Протетика', subcategory: 'MEGAGEN BLUEDIAMOND Протетика' };
    }
    if (text.includes('GEO') || text.includes('TITANIUM BASE') || text.includes('ТИТАНОВЫЕ ОСНОВАНИЯ')) {
      return { category: 'Протетика', subcategory: 'Титановые основания GEO' };
    }
    return { category: 'Протетика', subcategory: 'Протетика реплика' };
  }

  // Протетика по тексту
  if (text.includes('TITANIUM BASE') || text.includes('ТИТАНОВЫЕ ОСНОВАНИЯ') ||
      text.includes('HEALING ABUTMENT') || text.includes('ФОРМИРОВАТЕЛЬ') ||
      text.includes('TRANSFER') || text.includes('ТРАНСФЕР') ||
      text.includes('ANALOG') || text.includes('АНАЛОГ') ||
      (text.includes('ABUTMENT') && !text.includes('BALL'))) {
    if (text.includes('DIO ORIGINAL') || text.includes('DIO DIGITAL')) {
      return { category: 'Протетика', subcategory: 'DIO ORIGINAL Протетика' };
    }
    if (text.includes('BLUEDIAMOND') || text.includes('MEGAGEN')) {
      return { category: 'Протетика', subcategory: 'MEGAGEN BLUEDIAMOND Протетика' };
    }
    return { category: 'Протетика', subcategory: 'Протетика реплика' };
  }

  if (text.includes('BALL ABUTMENT') || text.includes('ШАРИКОВ')) {
    return { category: 'Протетика', subcategory: 'DIO Ball Abutment' };
  }

  // 4. ХИРУРГИЧЕСКИЕ НАБОРЫ
  if (text.includes('SURGICAL KIT') || text.includes('ХИРУРГИЧЕСКИЙ НАБОР')) {
    if (text.includes('DIO')) return { category: 'Хирургические наборы', subcategory: 'DIO Surgical Kit' };
    if (text.includes('MEGAGEN') || text.includes('BLUEDIAMOND')) return { category: 'Хирургические наборы', subcategory: 'MEGAGEN Surgical Kit' };
    return { category: 'Хирургические наборы', subcategory: 'Прочие наборы' };
  }

  // 5. КОСТНЫЕ МАТЕРИАЛЫ
  if (text.includes('XENOGRAFT') || text.includes('XENOGAIN') || text.includes('XENOFLEX') ||
      text.includes('CERABONE') || text.includes('INTEROSS') ||
      text.includes('TITAN B') && (text.includes('VIAL') || text.includes('SYRINGE')) ||
      text.includes('I-BONE') || text.includes('OCS-B') || text.includes('VERI-OSS') ||
      text.includes('BIOOST') && text.includes('XENOGRAFT') ||
      text.includes('BLOCK') && (text.includes('COLLAGEN') || text.includes('MM'))) {
    if (text.includes('TITAN B')) return { category: 'Костные материалы', subcategory: 'TITAN B' };
    if (text.includes('CERABONE')) return { category: 'Костные материалы', subcategory: 'STRAUMANN Botiss Cerabone' };
    if (text.includes('XENOGRAFT') && text.includes('STRAUMANN')) return { category: 'Костные материалы', subcategory: 'STRAUMANN XenoGraft' };
    if (text.includes('XENOFLEX')) return { category: 'Костные материалы', subcategory: 'STRAUMANN XenoFlex' };
    if (text.includes('XENOGAIN') || text.includes('NOBEL') || text.includes('CREOS')) return { category: 'Костные материалы', subcategory: 'NOBEL CreoS Xenogain' };
    if (text.includes('OCS-B') || text.includes('NIBEC')) return { category: 'Костные материалы', subcategory: 'NIBEC OCS-B' };
    if (text.includes('INTEROSS') || text.includes('SIGMAGRAFT')) return { category: 'Костные материалы', subcategory: 'SIGMAGRAFT InterOss' };
    if (text.includes('VERI-OSS')) return { category: 'Костные материалы', subcategory: 'VERI-OSS' };
    if (text.includes('BIOOST')) return { category: 'Костные материалы', subcategory: 'BioOst' };
    if (text.includes('I-BONE')) return { category: 'Костные материалы', subcategory: 'I-Bone Max' };
    return { category: 'Костные материалы', subcategory: 'Прочие' };
  }

  // 6. МЕМБРАНЫ
  if (text.includes('MEMBRANE') || text.includes('МЕМБРАН') ||
      text.includes('TITAN GIDE') || text.includes('TITAN-GIDE') ||
      text.includes('TITAN M') || text.includes('JASON') ||
      text.includes('INTERCOLLAGEN') || text.includes('BIOPLATE') ||
      text.includes('MYDERM') || text.includes('PTFE') || text.includes('CONTUR') || text.includes('BARRIER')) {
    if (text.includes('TITAN GIDE') || text.includes('TITAN-GIDE')) return { category: 'Мембраны', subcategory: 'TITAN GIDE' };
    if (text.includes('TITAN M')) return { category: 'Мембраны', subcategory: 'TITAN M' };
    if (text.includes('JASON')) return { category: 'Мембраны', subcategory: 'STRAUMANN Botiss Jason' };
    if (text.includes('INTERCOLLAGEN')) return { category: 'Мембраны', subcategory: 'SIGMAGRAFT InterCollagen' };
    if (text.includes('MYDERM')) return { category: 'Мембраны', subcategory: 'MYDERM' };
    if (text.includes('PTFE')) return { category: 'Мембраны', subcategory: 'PTFE с титановым каркасом' };
    if (text.includes('CONTUR')) return { category: 'Мембраны', subcategory: 'BioPLATE Contur' };
    if (text.includes('BARRIER') || text.includes('BIOPLATE')) return { category: 'Мембраны', subcategory: 'BioPLATE Barrier' };
    return { category: 'Мембраны', subcategory: 'Прочие' };
  }

  // 7. ПИНЫ И GBR
  if (text.includes('PINS') || text.includes('ПИН') || text.includes('GBR') ||
      (text.includes('SCREW') && text.includes('KIT') && text.includes('GBR'))) {
    return { category: 'Пины и GBR', subcategory: 'Пины и винты GBR' };
  }

  // 8. РАСХОДНИКИ
  if (text.includes('SUTURE') || text.includes('DAFILON') || text.includes('ШОВН') ||
      text.includes('FUJI') || text.includes('BOND') ||
      text.includes('ADHESIVE') || text.includes('CEMENT') || text.includes('ЦЕМЕНТ') ||
      text.includes('IRRIGATION') || text.includes('ИРРИГАЦ')) {
    if (text.includes('DAFILON') || text.includes('SUTURE') || text.includes('BRAUN')) {
      return { category: 'Расходники', subcategory: 'Шовный материал' };
    }
    if (text.includes('FUJI') || text.includes('CEMENT') || text.includes('BOND')) {
      return { category: 'Расходники', subcategory: 'Цементы и адгезивы' };
    }
    if (text.includes('IRRIGATION')) {
      return { category: 'Расходники', subcategory: 'Ирригационные системы' };
    }
    return { category: 'Расходники', subcategory: 'Прочие расходники' };
  }

  // 9. ИНСТРУМЕНТЫ
  if (text.includes('SCREWDRIVER') || text.includes('ОТВЁРТКА') || text.includes('DRIVER') ||
      text.includes('KIT') || text.includes('НАБОР') ||
      text.includes('NEEDLE HOLDER') || text.includes('ИГЛОДЕРЖАТЕЛЬ') ||
      text.includes('SCISSORS') || text.includes('НОЖНИЦЫ') ||
      text.includes('TWEEZERS') || text.includes('ПИНЦЕТ') ||
      text.includes('HAMMER') || text.includes('МОЛОТОК') ||
      text.includes('OSTEOTOME') || text.includes('ОСТЕОТОМ') ||
      text.includes('CURETTE') || text.includes('КЮРЕТ') ||
      text.includes('BONE MILL') || text.includes('BONE SCRAPER') ||
      text.includes('PERIOTOME') || text.includes('ПЕРИОТОМ') ||
      text.includes('ELEVATOR') || text.includes('ЭЛЕВАТОР') ||
      text.includes('DRILL') || text.includes('ФРЕЗ') || text.includes('СВЕРЛ') ||
      text.includes('TORQUE WRENCH') || text.includes('ДИНАМОМЕТРИЧЕСКИЙ') ||
      text.includes('EXPANDER') || text.includes('TREPAN') ||
      text.includes('AUTO-MAX') || text.includes('BONE COLLECTOR') ||
      text.includes('PRF') || text.includes('SINUS') ||
      text.includes('DASK') || text.includes('DENSAH')) {

    if (text.includes('SCREWDRIVER') || text.includes('ОТВЁРТКА') || text.includes('DRIVER')) {
      return { category: 'Инструменты', subcategory: 'Отвёртки' };
    }
    if (text.includes('SURGICAL KIT') || text.includes('SURGICAL WIDE') || text.includes('NAVI') || text.includes('FLAPLESS')) {
      if (text.includes('DIO')) return { category: 'Хирургические наборы', subcategory: 'DIO Surgical Kit' };
      if (text.includes('MEGAGEN')) return { category: 'Хирургические наборы', subcategory: 'MEGAGEN Surgical Kit' };
    }
    if (text.includes('SINUS')) return { category: 'Инструменты', subcategory: 'Синус-лифтинг' };
    if (text.includes('PRF')) return { category: 'Инструменты', subcategory: 'PRF' };
    if (text.includes('OSTEOTOME') || text.includes('ОСТЕОТОМ')) return { category: 'Инструменты', subcategory: 'Остеотомы' };
    if (text.includes('EXPANDER')) return { category: 'Инструменты', subcategory: 'Костные экспандеры' };
    if (text.includes('BONE MILL') || text.includes('BONE SCRAPER') || text.includes('BONE COLLECTOR')) {
      return { category: 'Инструменты', subcategory: 'Инструменты для костной пластики' };
    }
    if (text.includes('NEEDLE HOLDER') || text.includes('ИГЛОДЕРЖАТЕЛЬ')) return { category: 'Инструменты', subcategory: 'Иглодержатели' };
    if (text.includes('SCISSORS') || text.includes('НОЖНИЦЫ')) return { category: 'Инструменты', subcategory: 'Ножницы' };
    if (text.includes('TWEEZERS') || text.includes('ПИНЦЕТ')) return { category: 'Инструменты', subcategory: 'Пинцеты' };
    if (text.includes('CURETTE') || text.includes('КЮРЕТ')) return { category: 'Инструменты', subcategory: 'Кюреты' };
    if (text.includes('PERIOTOME') || text.includes('ПЕРИОТОМ')) return { category: 'Инструменты', subcategory: 'Периотомы' };
    if (text.includes('ELEVATOR') || text.includes('ЭЛЕВАТОР')) return { category: 'Инструменты', subcategory: 'Элеваторы' };
    if (text.includes('TORQUE WRENCH') || text.includes('ДИНАМОМЕТРИЧЕСКИЙ')) return { category: 'Инструменты', subcategory: 'Динамометрические ключи' };
    if (text.includes('DRILL') || text.includes('ПРОФИЛ')) return { category: 'Инструменты', subcategory: 'Свёрла и профилеры' };
    if (text.includes('TREPAN') || text.includes('TRIMMER')) return { category: 'Инструменты', subcategory: 'Трепаны и триммеры' };
    return { category: 'Инструменты', subcategory: 'Прочие инструменты' };
  }

  // По умолчанию
  return { category: 'Прочее', subcategory: brand || 'Без категории' };
}

// Парсинг цен из строки
function parsePrices(priceColumns) {
  const prices = {};

  for (const col of priceColumns) {
    if (!col || col === 'NOT FOR SALE') continue;

    const str = String(col);

    // Формат: "От X штук - ЦЕНА" или "Поштучно - ЦЕНА"
    const match = str.match(/(?:От\s*)?(\d+)\s*штук?\s*[-–]\s*([\d\s]+)/i) ||
                  str.match(/Поштучно\s*[-–]\s*([\d\s]+)/i);

    if (match) {
      if (match[0].toLowerCase().includes('поштучно')) {
        prices.single = parseInt(match[1].replace(/\s/g, ''));
      } else {
        const qty = parseInt(match[1]);
        const price = parseInt(match[2].replace(/\s/g, ''));
        prices[`qty_${qty}`] = price;
      }
    }
  }

  return prices;
}

// Основная функция импорта
async function importPrice() {
  const filePath = path.join(__dirname, '..', 'ПРАЙС С ЯНВАРЯ 2026.xlsx');
  const workbook = XLSX.readFile(filePath, { cellStyles: true });

  const sheetName = 'ПРАЙС ОБЩИЙ РОССИЯ N';
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    console.error('Лист не найден:', sheetName);
    return;
  }

  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const range = XLSX.utils.decode_range(sheet['!ref']);

  const categories = new Map();
  const products = [];

  console.log('=== ИМПОРТ ТОВАРОВ ===\n');

  // Пропускаем заголовок (строка 1-2)
  for (let r = 2; r < data.length; r++) {
    const row = data[r];
    if (!row || !row[0]) continue;

    const cellAddr = XLSX.utils.encode_cell({ r, c: 0 });
    const cell = sheet[cellAddr];

    // Получаем цвет ячейки
    let bgColor = null;
    if (cell && cell.s && cell.s.fgColor) {
      bgColor = cell.s.fgColor.rgb || cell.s.fgColor.theme;
    }

    const nameEn = String(row[0] || '').trim();
    const productType = String(row[1] || '').trim();
    const material = String(row[2] || '').trim();
    const country = String(row[3] || '').trim();
    const nameRu = String(row[4] || '').trim();

    // Цены в колонках 5-9
    const priceColumns = row.slice(5, 14);
    const prices = parsePrices(priceColumns);

    // Определяем категорию на основе типа продукта и текста
    const categoryInfo = determineCategory(nameEn, nameRu, productType, bgColor);

    // Собираем категорию
    const fullCategory = categoryInfo.subcategory
      ? `${categoryInfo.category} > ${categoryInfo.subcategory}`
      : categoryInfo.category;

    if (!categories.has(fullCategory)) {
      categories.set(fullCategory, []);
    }

    const product = {
      row: r + 1,
      nameEn,
      nameRu: nameRu || nameEn,
      productType,
      material,
      country,
      category: categoryInfo.category,
      subcategory: categoryInfo.subcategory || '',
      color: bgColor,
      prices,
      basePrice: prices.single || prices.qty_10 || prices.qty_100 || Object.values(prices)[0] || 0
    };

    products.push(product);
    categories.get(fullCategory).push(product);
  }

  // Выводим результаты
  console.log('=== КАТЕГОРИИ ===\n');
  for (const [cat, items] of categories) {
    console.log(`${cat}: ${items.length} товаров`);
  }

  console.log('\n=== ВСЕГО ===');
  console.log(`Категорий: ${categories.size}`);
  console.log(`Товаров: ${products.length}`);

  // Сохраняем результат в JSON
  const result = {
    categories: Array.from(categories.keys()),
    products: products,
    summary: {
      totalCategories: categories.size,
      totalProducts: products.length,
      categoryCounts: Object.fromEntries(
        Array.from(categories.entries()).map(([k, v]) => [k, v.length])
      )
    }
  };

  const outputPath = path.join(__dirname, '..', 'data', 'price-2026-import.json');
  const fs = require('fs');

  // Создаём папку data если её нет
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`\nРезультат сохранён в: ${outputPath}`);

  return result;
}

importPrice().catch(console.error);
