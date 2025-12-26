/**
 * Скрипт для обновления описаний и характеристик товаров
 * Заполняет реальными техническими характеристиками
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Реальные характеристики имплантатов по брендам
const IMPLANT_SPECS = {
  // OSSTEM (Корея)
  'OSSTEM TS-III': {
    description: 'Имплантат OSSTEM TS-III с внутренним коническим соединением 11°. SA-поверхность (Sand-blasted, Acid-etched). Подходит для всех типов кости D1-D4.',
    specs: JSON.stringify({
      brand: 'OSSTEM',
      country: 'Корея',
      connection: 'Внутренний конус 11°',
      surface: 'SA (пескоструйная + кислотное травление)',
      platform: 'Стандартная',
      diameters: '3.5, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      material: 'Титан Grade 4',
      boneType: 'D1-D4'
    })
  },
  'OSSTEM TS-IV': {
    description: 'Имплантат OSSTEM TS-IV с апикальной резьбой для мягкой кости. SA-поверхность. Улучшенная первичная стабильность в кости D3-D4.',
    specs: JSON.stringify({
      brand: 'OSSTEM',
      country: 'Корея',
      connection: 'Внутренний конус 11°',
      surface: 'SA (пескоструйная + кислотное травление)',
      platform: 'Стандартная',
      diameters: '3.5, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      material: 'Титан Grade 4',
      boneType: 'D3-D4 (мягкая кость)',
      feature: 'Апикальная резьба для мягкой кости'
    })
  },

  // STRAUMANN (Швейцария)
  'STRAUMANN BL Bone Level TITAN SLA': {
    description: 'Премиум имплантат Straumann Bone Level с SLA-поверхностью. CrossFit соединение. Для установки на уровне кости.',
    specs: JSON.stringify({
      brand: 'Straumann',
      country: 'Швейцария',
      connection: 'CrossFit (внутренний)',
      surface: 'SLA (Sand-blasted Large-grit Acid-etched)',
      platform: 'Bone Level',
      diameters: '3.3, 4.1, 4.8 мм',
      lengths: '6, 8, 10, 12, 14 мм',
      material: 'Титан Grade 4 Roxolid',
      boneType: 'Универсальный',
      feature: 'Гидрофильная поверхность SLActive опционально'
    })
  },
  'STRAUMANN TL Tissue Level TITAN SLA': {
    description: 'Имплантат Straumann Tissue Level с полированной шейкой. SLA-поверхность. Для одноэтапной установки.',
    specs: JSON.stringify({
      brand: 'Straumann',
      country: 'Швейцария',
      connection: 'Synth Octa (внешний восьмигранник)',
      surface: 'SLA',
      platform: 'Tissue Level',
      diameters: '3.3, 4.1, 4.8 мм',
      lengths: '6, 8, 10, 12, 14 мм',
      material: 'Титан Grade 4',
      feature: 'Полированная шейка 1.8-2.8 мм'
    })
  },

  // DIO (Корея)
  'DIO UF II': {
    description: 'Имплантат DIO UF II с двойной резьбой. RBM-поверхность. Универсальное внутреннее соединение.',
    specs: JSON.stringify({
      brand: 'DIO',
      country: 'Корея',
      connection: 'Внутренний шестигранник 2.5мм',
      surface: 'RBM (Resorbable Blast Media)',
      platform: 'Regular, Narrow',
      diameters: '3.4, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      material: 'Титан Grade 4',
      feature: 'Двойная резьба для быстрой установки'
    })
  },
  'DIO EXTRA WIDE': {
    description: 'Широкий имплантат DIO Extra Wide для лунок после удаления. RBM-поверхность.',
    specs: JSON.stringify({
      brand: 'DIO',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'RBM',
      diameters: '5.5, 6.0, 7.0 мм',
      lengths: '7, 8.5, 10, 11.5 мм',
      feature: 'Для немедленной имплантации'
    })
  },
  'DIO SM': {
    description: 'Узкий имплантат DIO SM для узких межзубных промежутков. RBM-поверхность.',
    specs: JSON.stringify({
      brand: 'DIO',
      country: 'Корея',
      connection: 'Внутренний шестигранник 2.1мм',
      surface: 'RBM',
      platform: 'Narrow',
      diameters: '3.0, 3.3 мм',
      lengths: '10, 11.5, 13, 15 мм',
      feature: 'Для резцов нижней челюсти'
    })
  },

  // MEGAGEN (Корея)
  'MEGAGEN AnyOne': {
    description: 'Универсальный имплантат MEGAGEN AnyOne с Xpeed-поверхностью (Ca2+ ионы). Подходит для всех типов кости.',
    specs: JSON.stringify({
      brand: 'MEGAGEN',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'Xpeed (ионы кальция)',
      diameters: '3.5, 4.0, 4.5, 5.0, 6.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      material: 'Титан Grade 4',
      feature: 'Двойная резьба, самонарезающий'
    })
  },
  'MEGAGEN AnyRidge': {
    description: 'Имплантат MEGAGEN AnyRidge с ножевидной резьбой. Xpeed-поверхность. Максимальная первичная стабильность.',
    specs: JSON.stringify({
      brand: 'MEGAGEN',
      country: 'Корея',
      connection: 'Конус 10°',
      surface: 'Xpeed',
      diameters: '3.5, 4.0, 4.5, 5.0, 5.5, 6.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      feature: 'Ножевидная резьба Knife Thread'
    })
  },
  'MEGAGEN Blue Diamond': {
    description: 'Премиум имплантат MEGAGEN Blue Diamond. Конусное соединение 10°. Xpeed-поверхность с ионами Ca2+.',
    specs: JSON.stringify({
      brand: 'MEGAGEN',
      country: 'Корея',
      connection: 'Конус 10°',
      surface: 'Xpeed',
      diameters: '3.5, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      feature: 'Переключение платформ'
    })
  },

  // DENTIUM (Корея)
  'DENTIUM SuperLine': {
    description: 'Имплантат DENTIUM SuperLine с SLA-поверхностью. Двойная резьба для быстрой установки.',
    specs: JSON.stringify({
      brand: 'DENTIUM',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'SLA',
      diameters: '3.6, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8, 10, 12, 14 мм',
      feature: 'Двойная спиральная резьба'
    })
  },
  'DENTIUM Implantium': {
    description: 'Имплантат DENTIUM Implantium. Внутреннее соединение. SLA-поверхность.',
    specs: JSON.stringify({
      brand: 'DENTIUM',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'SLA',
      diameters: '3.4, 3.8, 4.3, 4.8 мм',
      lengths: '8, 10, 12, 14 мм'
    })
  },

  // NeoBiotech (Корея)
  'NeoBiotech IS-II': {
    description: 'Имплантат NeoBiotech IS-II Active с SLA-поверхностью. Самонарезающий дизайн.',
    specs: JSON.stringify({
      brand: 'NeoBiotech',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'SLA',
      diameters: '3.5, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      feature: 'Активная резьба'
    })
  },
  'NeoBiotech IS-III': {
    description: 'Имплантат NeoBiotech IS-III третьего поколения. Улучшенная геометрия резьбы.',
    specs: JSON.stringify({
      brand: 'NeoBiotech',
      country: 'Корея',
      connection: 'Внутренний конус',
      surface: 'SLA',
      diameters: '3.5, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм'
    })
  },

  // Astra Tech (Швеция)
  'ASTRA TECH EV': {
    description: 'Премиум имплантат Astra Tech EV с OsseoSpeed-поверхностью. Конусное соединение.',
    specs: JSON.stringify({
      brand: 'Astra Tech (Dentsply Sirona)',
      country: 'Швеция',
      connection: 'Conical Seal Design',
      surface: 'OsseoSpeed (фторированная)',
      diameters: '3.0, 3.6, 4.2, 4.8 мм',
      lengths: '6, 8, 9, 11, 13, 15, 17 мм',
      feature: 'Microthread на шейке'
    })
  },

  // Nobel Biocare (Швейцария)
  'Nobel Replace': {
    description: 'Имплантат Nobel Biocare Replace с TiUnite-поверхностью. Внутреннее трёхканальное соединение.',
    specs: JSON.stringify({
      brand: 'Nobel Biocare',
      country: 'Швейцария',
      connection: 'Tri-Channel внутреннее',
      surface: 'TiUnite (анодированная)',
      diameters: '3.5, 4.3, 5.0, 6.0 мм',
      lengths: '8, 10, 11.5, 13, 16 мм'
    })
  },
  'Nobel Active': {
    description: 'Имплантат Nobel Active с агрессивной резьбой. Для немедленной нагрузки.',
    specs: JSON.stringify({
      brand: 'Nobel Biocare',
      country: 'Швейцария',
      connection: 'Конусное',
      surface: 'TiUnite',
      diameters: '3.0, 3.5, 4.3, 5.0 мм',
      lengths: '8.5, 10, 11.5, 13, 15, 18 мм',
      feature: 'Высокая первичная стабильность'
    })
  }
};

// Костные материалы
const BONE_SPECS = {
  'VERI-OSS': {
    description: 'Бычий ксенографт VERI-OSS Surgident. Инновационная низкотемпературная обработка 32 дня. Полностью деантигенизирован.',
    specs: JSON.stringify({
      type: 'Ксенографт (бычий)',
      processing: 'Низкотемпературная обработка 32 дня',
      granuleSize: '0.25-1 мм или 1-2 мм',
      resorption: '6-12 месяцев',
      application: 'Аугментация, синус-лифтинг, лунки',
      country: 'Корея'
    })
  },
  'Bio-Oss': {
    description: 'Натуральный бычий ксенографт Bio-Oss (Geistlich). Золотой стандарт костной пластики.',
    specs: JSON.stringify({
      type: 'Ксенографт (бычий)',
      manufacturer: 'Geistlich',
      granuleSize: 'S: 0.25-1мм, L: 1-2мм',
      porosity: '70-75%',
      resorption: '6-12 месяцев',
      country: 'Швейцария'
    })
  },
  'Cerabone': {
    description: 'Бычий ксенографт Cerabone. 100% минеральная костная матрица. Высокая остеокондуктивность.',
    specs: JSON.stringify({
      type: 'Ксенографт (бычий)',
      manufacturer: 'Straumann (Botiss)',
      composition: '100% минеральный',
      granuleSize: '0.5-1 мм или 1-2 мм',
      country: 'Германия'
    })
  },
  'InterOss': {
    description: 'Бычий ксенографт InterOss (Sigmagraft). Гранулы или блоки для костной пластики.',
    specs: JSON.stringify({
      type: 'Ксенографт (бычий)',
      manufacturer: 'Sigmagraft',
      granuleSize: '0.25-1 мм или 1-2 мм',
      forms: 'Гранулы, шприц, блок'
    })
  },
  'A-Oss': {
    description: 'Бычий ксенографт A-Oss (OSSTEM). Высокая чистота и биосовместимость.',
    specs: JSON.stringify({
      type: 'Ксенографт (бычий)',
      manufacturer: 'OSSTEM',
      granuleSize: 'S, M, L',
      country: 'Корея'
    })
  },
  'i-Bone': {
    description: 'Аллографт i-Bone. Деминерализованная костная матрица человеческого происхождения.',
    specs: JSON.stringify({
      type: 'Аллографт (ДККМ)',
      origin: 'Человеческая кость',
      processing: 'Деминерализованный',
      resorption: '3-6 месяцев'
    })
  }
};

// Мембраны
const MEMBRANE_SPECS = {
  'Bio-Gide': {
    description: 'Коллагеновая мембрана Bio-Gide (Geistlich). Двухслойная, резорбируемая.',
    specs: JSON.stringify({
      type: 'Резорбируемая',
      material: 'Коллаген (свиной)',
      structure: 'Двухслойная',
      resorption: '4-6 месяцев',
      manufacturer: 'Geistlich',
      country: 'Швейцария'
    })
  },
  'Jason': {
    description: 'Перикардиальная мембрана Jason. Нативный коллаген, резорбируемая.',
    specs: JSON.stringify({
      type: 'Резорбируемая',
      material: 'Перикард (свиной)',
      resorption: '4-8 месяцев',
      manufacturer: 'Straumann (Botiss)'
    })
  },
  'Creos Syntoprotect': {
    description: 'Синтетическая мембрана Creos Syntoprotect (Nobel). Резорбируемая PEG-мембрана.',
    specs: JSON.stringify({
      type: 'Резорбируемая синтетическая',
      material: 'PEG (полиэтиленгликоль)',
      resorption: '4-6 недель',
      manufacturer: 'Nobel Biocare'
    })
  },
  'Ossix': {
    description: 'Коллагеновая мембрана Ossix Plus. Сшитый коллаген, длительная резорбция.',
    specs: JSON.stringify({
      type: 'Резорбируемая',
      material: 'Сшитый коллаген',
      resorption: '4-6 месяцев',
      feature: 'Glymatrix технология'
    })
  },
  'PTFE': {
    description: 'Нерезорбируемая PTFE мембрана. Политетрафторэтилен для GBR.',
    specs: JSON.stringify({
      type: 'Нерезорбируемая',
      material: 'PTFE (тефлон)',
      removal: 'Требует удаления через 4-6 недель',
      feature: 'Высокая барьерная функция'
    })
  },
  'Ti-mesh': {
    description: 'Титановая сетка Ti-mesh для объёмной костной пластики.',
    specs: JSON.stringify({
      type: 'Нерезорбируемая',
      material: 'Титан Grade 2',
      removal: 'Требует удаления через 6-9 месяцев',
      feature: 'Для больших дефектов'
    })
  }
};

// Шовный материал
const SUTURE_SPECS = {
  'Супрамид': {
    description: 'Нерассасывающийся шовный материал Супрамид (полиамид). Мягкий, эластичный.',
    specs: JSON.stringify({
      type: 'Нерассасывающийся',
      material: 'Полиамид (нейлон)',
      structure: 'Мононить',
      applications: 'Кожа, слизистая'
    })
  },
  'Polysorb': {
    description: 'Рассасывающийся шовный материал Polysorb. Синтетический плетёный.',
    specs: JSON.stringify({
      type: 'Рассасывающийся',
      material: 'Полигликолевая кислота',
      structure: 'Плетёный',
      resorption: '56-70 дней'
    })
  },
  'Vicryl': {
    description: 'Рассасывающийся шовный материал Vicryl (Ethicon). Плетёный, покрытый.',
    specs: JSON.stringify({
      type: 'Рассасывающийся',
      material: 'Polyglactin 910',
      structure: 'Плетёный с покрытием',
      resorption: '56-70 дней',
      manufacturer: 'Ethicon (J&J)'
    })
  },
  'PDS': {
    description: 'Рассасывающийся шовный материал PDS II (Ethicon). Мононить, длительная поддержка.',
    specs: JSON.stringify({
      type: 'Рассасывающийся',
      material: 'Полидиоксанон',
      structure: 'Мононить',
      resorption: '180-210 дней'
    })
  },
  'Gore-Tex': {
    description: 'Нерассасывающийся шовный материал Gore-Tex (ePTFE). Для мягких тканей.',
    specs: JSON.stringify({
      type: 'Нерассасывающийся',
      material: 'ePTFE (расширенный политетрафторэтилен)',
      structure: 'Мононить',
      feature: 'Минимальная травматизация тканей'
    })
  }
};

async function updateProductSpecs() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '../server/database/db.sqlite');
  const fileBuffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(fileBuffer);

  let updated = 0;

  // Обновляем имплантаты
  for (const [productName, data] of Object.entries(IMPLANT_SPECS)) {
    const result = db.run(
      `UPDATE products SET description = ?, specs = ? WHERE name LIKE ?`,
      [data.description, data.specs, `%${productName}%`]
    );
    console.log(`Обновлён: ${productName}`);
    updated++;
  }

  // Обновляем костные материалы
  for (const [productName, data] of Object.entries(BONE_SPECS)) {
    db.run(
      `UPDATE products SET description = ?, specs = ? WHERE name LIKE ?`,
      [data.description, data.specs, `%${productName}%`]
    );
    console.log(`Обновлён: ${productName}`);
    updated++;
  }

  // Обновляем мембраны
  for (const [productName, data] of Object.entries(MEMBRANE_SPECS)) {
    db.run(
      `UPDATE products SET description = ?, specs = ? WHERE name LIKE ?`,
      [data.description, data.specs, `%${productName}%`]
    );
    console.log(`Обновлён: ${productName}`);
    updated++;
  }

  // Обновляем шовный материал
  for (const [productName, data] of Object.entries(SUTURE_SPECS)) {
    db.run(
      `UPDATE products SET description = ?, specs = ? WHERE name LIKE ?`,
      [data.description, data.specs, `%${productName}%`]
    );
    console.log(`Обновлён: ${productName}`);
    updated++;
  }

  // Сохраняем базу данных
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);

  console.log(`\nВсего обновлено: ${updated} товаров`);
  console.log('База данных сохранена!');
}

updateProductSpecs().catch(console.error);
