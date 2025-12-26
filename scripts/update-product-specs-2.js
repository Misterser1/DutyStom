/**
 * Скрипт для обновления описаний протетики и инструментов
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Протетические компоненты - общие описания
const PROSTHETIC_UPDATES = [
  // Формирователи десны
  {
    pattern: 'Формирователь десны',
    description: 'Формирователь десны (Healing Abutment). Временный компонент для формирования контура мягких тканей вокруг имплантата. Устанавливается после остеоинтеграции или немедленно.',
    specs: JSON.stringify({
      type: 'Формирователь десны',
      material: 'Титан Grade 5',
      heights: '2, 3, 4, 5, 6 мм',
      diameters: '3.5, 4.5, 5.5 мм',
      feature: 'Полированная поверхность'
    })
  },
  // Аналоги
  {
    pattern: 'Аналог имплантата',
    description: 'Аналог имплантата (Implant Analog). Лабораторный компонент для изготовления рабочей модели. Точная копия платформы имплантата.',
    specs: JSON.stringify({
      type: 'Аналог имплантата',
      material: 'Латунь или титан',
      application: 'Лабораторная модель',
      compatibility: 'Совместим с соответствующей системой'
    })
  },
  // Трансферы открытая ложка
  {
    pattern: 'Трансфер.*открыт',
    description: 'Слепочный трансфер для открытой ложки. Обеспечивает точную передачу положения имплантата на рабочую модель. Фиксируется винтом.',
    specs: JSON.stringify({
      type: 'Слепочный трансфер',
      technique: 'Открытая ложка',
      material: 'Титан или нержавеющая сталь',
      feature: 'Высокая точность передачи'
    })
  },
  // Трансферы закрытая ложка
  {
    pattern: 'Трансфер.*закрыт',
    description: 'Слепочный трансфер для закрытой ложки. Остаётся во рту при снятии слепка, затем переставляется в оттиск.',
    specs: JSON.stringify({
      type: 'Слепочный трансфер',
      technique: 'Закрытая ложка',
      material: 'Титан или нержавеющая сталь',
      feature: 'Удобство при затруднённом доступе'
    })
  },
  // Мультиюниты прямые
  {
    pattern: 'Мультиюнит прямой|Мультинит прямой',
    description: 'Прямой мультиюнит (Multi-unit Abutment). Промежуточный абатмент для условно-съёмных конструкций All-on-4/All-on-6.',
    specs: JSON.stringify({
      type: 'Мультиюнит прямой',
      angle: '0°',
      material: 'Титан Grade 5',
      heights: '1, 2, 3, 4 мм',
      application: 'All-on-4, All-on-6, балочные конструкции'
    })
  },
  // Мультиюниты угловые
  {
    pattern: 'Мультиюнит угловой|Мультинит угловой',
    description: 'Угловой мультиюнит (Angled Multi-unit). Для компенсации наклона имплантата до 30°.',
    specs: JSON.stringify({
      type: 'Мультиюнит угловой',
      angles: '17°, 30°',
      material: 'Титан Grade 5',
      heights: '1, 2, 3, 4 мм',
      application: 'All-on-4, скуловая имплантация'
    })
  },
  // Титановые основания
  {
    pattern: 'Титановое основание|Титановые основания',
    description: 'Титановое основание (Ti-base). Для изготовления индивидуальных CAD/CAM абатментов и коронок с винтовой фиксацией.',
    specs: JSON.stringify({
      type: 'Титановое основание',
      material: 'Титан Grade 5',
      heights: '3.5, 4.5, 5.5 мм',
      compatibility: 'Для циркониевых и PMMA коронок',
      feature: 'Анодированное золотое покрытие'
    })
  },
  // Абатменты цементируемые
  {
    pattern: 'Абатмент.*цементируем',
    description: 'Цементируемый абатмент. Для установки одиночных коронок с цементной фиксацией.',
    specs: JSON.stringify({
      type: 'Абатмент цементируемый',
      material: 'Титан Grade 5',
      heights: '4, 5.5, 7 мм',
      angles: '0°, 15°, 25°',
      feature: 'Препарируемый или стандартный'
    })
  },
  // Временные абатменты
  {
    pattern: 'Абатмент.*временн',
    description: 'Временный абатмент. Для изготовления провизорных коронок. Может быть из титана или PEEK.',
    specs: JSON.stringify({
      type: 'Временный абатмент',
      material: 'Титан или PEEK',
      application: 'Провизорные реставрации',
      feature: 'Для непосредственной нагрузки'
    })
  },
  // Скан-маркеры
  {
    pattern: 'Скан-маркер|Сканмаркер',
    description: 'Скан-маркер (Scan Body). Для внутриротового сканирования положения имплантата. Совместим с основными CAD-системами.',
    specs: JSON.stringify({
      type: 'Скан-маркер',
      material: 'PEEK с титановым основанием',
      compatibility: '3Shape, Exocad, Dental Wings',
      feature: 'Высокоточная геометрия'
    })
  },
  // Заглушки
  {
    pattern: 'Заглушка',
    description: 'Заглушка имплантата (Cover Screw). Защищает внутреннее соединение имплантата на период остеоинтеграции.',
    specs: JSON.stringify({
      type: 'Заглушка',
      material: 'Титан',
      heights: '0, 0.5, 1, 2, 3 мм',
      feature: 'Для закрытого заживления'
    })
  },
  // Винты
  {
    pattern: '^Винт',
    description: 'Фиксирующий винт для абатмента. Обеспечивает надёжное соединение протетических компонентов с имплантатом.',
    specs: JSON.stringify({
      type: 'Винт',
      material: 'Титан Grade 5',
      torque: '25-35 Нсм',
      feature: 'Прецизионная резьба'
    })
  }
];

// Инструменты
const INSTRUMENT_UPDATES = [
  {
    pattern: 'Иглодержатель.*Castroviejo',
    description: 'Иглодержатель Castroviejo с карбид-вольфрамовыми вставками. Для микрохирургических операций и работы с тонким шовным материалом.',
    specs: JSON.stringify({
      type: 'Иглодержатель',
      design: 'Castroviejo',
      material: 'Нержавеющая сталь + карбид-вольфрам',
      lengths: '14, 16, 18 см',
      feature: 'Замок с пружинным механизмом'
    })
  },
  {
    pattern: 'Иглодержатель.*14',
    description: 'Иглодержатель хирургический 14 см. Для работы с шовным материалом 4/0 - 6/0.',
    specs: JSON.stringify({
      type: 'Иглодержатель',
      length: '14 см',
      material: 'Нержавеющая сталь',
      needleSize: '4/0 - 6/0'
    })
  },
  {
    pattern: 'Иглодержатель.*16',
    description: 'Иглодержатель хирургический 16 см. Универсальный размер для большинства операций.',
    specs: JSON.stringify({
      type: 'Иглодержатель',
      length: '16 см',
      material: 'Нержавеющая сталь',
      needleSize: '3/0 - 5/0'
    })
  },
  {
    pattern: 'Ножницы.*11',
    description: 'Хирургические ножницы 11-11.5 см. Для разрезания шовного материала и тонких тканей.',
    specs: JSON.stringify({
      type: 'Ножницы хирургические',
      length: '11-11.5 см',
      material: 'Нержавеющая сталь',
      blade: 'Прямые или изогнутые'
    })
  },
  {
    pattern: 'Динамометрический ключ.*Сламывающ',
    description: 'Динамометрический ключ с механизмом сламывания. Точный контроль момента затяжки. Предотвращает перетяжку.',
    specs: JSON.stringify({
      type: 'Динамометрический ключ',
      mechanism: 'Сламывающийся',
      torque: '10-45 Нсм',
      connection: 'Квадратное 2.5х2.5 мм',
      feature: 'Звуковой щелчок при достижении момента'
    })
  },
  {
    pattern: 'Динамометрический ключ.*Струнн',
    description: 'Динамометрический ключ струнного типа. Плавное нарастание момента затяжки. Для прецизионной работы.',
    specs: JSON.stringify({
      type: 'Динамометрический ключ',
      mechanism: 'Струнный (тросиковый)',
      torque: '10-45 Нсм',
      connection: 'Круглое',
      feature: 'Плавный контроль момента'
    })
  },
  {
    pattern: 'Костная мельница',
    description: 'Костная мельница для измельчения аутогенной кости. Получение костной стружки для аугментации.',
    specs: JSON.stringify({
      type: 'Костная мельница',
      material: 'Нержавеющая сталь / Титан',
      output: 'Мелкие костные частицы',
      feature: 'Автоклавируемая'
    })
  },
  {
    pattern: 'Костная ступка|дробилка',
    description: 'Костная ступка-дробилка. Для ручного измельчения костных блоков и чипсов.',
    specs: JSON.stringify({
      type: 'Костная ступка',
      material: 'Нержавеющая сталь',
      feature: 'Рифлёная поверхность'
    })
  },
  {
    pattern: 'Молоток',
    description: 'Хирургический молоток для работы с остеотомами и долотами. Тефлоновые накладки для снижения шума.',
    specs: JSON.stringify({
      type: 'Хирургический молоток',
      material: 'Нержавеющая сталь',
      weight: '250-350 г',
      feature: 'Тефлоновые накладки'
    })
  },
  {
    pattern: 'Набор.*PRF',
    description: 'Набор для получения PRF (Platelet Rich Fibrin). Включает PRF-бокс, подставки и лотки.',
    specs: JSON.stringify({
      type: 'Набор PRF',
      components: 'PRF Box, подставка под пробирки, лоток, чашка',
      material: 'Нержавеющая сталь / Силикон',
      feature: 'Для получения фибриновых мембран'
    })
  },
  {
    pattern: 'Набор.*остеотом|изогнутых вогнутых остеотомов',
    description: 'Набор остеотомов для атравматичного расширения костного ложа. Вогнутые для латеральной конденсации.',
    specs: JSON.stringify({
      type: 'Остеотомы',
      quantity: '5 шт',
      diameters: '2.0, 2.5, 3.0, 3.5, 4.0 мм',
      feature: 'Вогнутый профиль, конденсация кости'
    })
  },
  {
    pattern: 'Набор.*долото',
    description: 'Набор долот для костной хирургии. Для расщепления альвеолярного гребня.',
    specs: JSON.stringify({
      type: 'Долота хирургические',
      quantity: '6 шт',
      widths: '3, 4, 5, 6, 8, 10 мм',
      material: 'Нержавеющая сталь'
    })
  },
  {
    pattern: 'Набор.*периотом',
    description: 'Набор периотомов для атравматичного удаления зубов. Рассечение периодонтальной связки.',
    specs: JSON.stringify({
      type: 'Периотомы',
      material: 'Нержавеющая сталь',
      feature: 'Тонкое гибкое лезвие'
    })
  },
  {
    pattern: 'Набор.*элеватор|миниэлеватор',
    description: 'Набор миниэлеваторов для люксации корней. Различные углы рабочей части.',
    specs: JSON.stringify({
      type: 'Миниэлеваторы',
      material: 'Нержавеющая сталь',
      feature: 'Разные углы наклона'
    })
  },
  {
    pattern: 'Набор.*кюрет.*синус|Синус лифтинг',
    description: 'Набор кюрет для синус-лифтинга. Для атравматичной отслойки слизистой оболочки верхнечелюстной пазухи.',
    specs: JSON.stringify({
      type: 'Кюреты для синус-лифтинга',
      quantity: '4 шт',
      material: 'Нержавеющая сталь',
      feature: 'Различные изгибы для разных зон'
    })
  },
  {
    pattern: 'Набор.*трепан',
    description: 'Набор трепанов для забора костных блоков. Различные диаметры для разных клинических ситуаций.',
    specs: JSON.stringify({
      type: 'Трепаны',
      diameters: '5, 6, 7, 8 мм',
      material: 'Нержавеющая сталь',
      rpm: '800-1500 об/мин с охлаждением'
    })
  },
  {
    pattern: 'Набор.*мукотом',
    description: 'Набор мукотомов для циркулярного иссечения слизистой над имплантатом.',
    specs: JSON.stringify({
      type: 'Мукотомы',
      diameters: '4, 5, 6, 7 мм',
      material: 'Нержавеющая сталь',
      feature: 'Для безлоскутной имплантации'
    })
  },
  {
    pattern: 'Набор.*отвёрт.*универсальн',
    description: 'Набор универсальных отвёрток для различных имплантационных систем.',
    specs: JSON.stringify({
      type: 'Отвёртки',
      compatibility: 'Универсальные для основных систем',
      material: 'Нержавеющая сталь',
      feature: 'В кассете для стерилизации'
    })
  },
  {
    pattern: 'Набор.*Densah|остеоденсификац',
    description: 'Набор свёрел для остеоденсификации (аналог Versah Densah). Уплотнение кости с сохранением объёма.',
    specs: JSON.stringify({
      type: 'Свёрла для остеоденсификации',
      technique: 'Osseodensification',
      diameters: '2.0 - 5.0 мм',
      rpm: '800-1200 об/мин (реверс)',
      feature: 'Латеральная конденсация кости'
    })
  },
  {
    pattern: 'Набор.*Грейси|Кюрет Грейси',
    description: 'Набор кюрет Грейси для пародонтологического лечения. Для глубокого кюретажа пародонтальных карманов.',
    specs: JSON.stringify({
      type: 'Кюреты Грейси',
      quantity: '7 шт',
      numbers: '1/2, 3/4, 5/6, 7/8, 9/10, 11/12, 13/14',
      material: 'Нержавеющая сталь',
      feature: 'Зоноспецифичные'
    })
  },
  {
    pattern: 'Экспандер',
    description: 'Набор костных экспандеров для расщепления узкого альвеолярного гребня.',
    specs: JSON.stringify({
      type: 'Экспандеры',
      diameters: '2.0 - 5.0 мм',
      technique: 'Split-crest',
      feature: 'С храповым ключом'
    })
  },
  {
    pattern: 'алмазная фреза.*синус',
    description: 'Алмазная фреза для синус-лифтинга. Для безопасного истончения костной стенки пазухи.',
    specs: JSON.stringify({
      type: 'Алмазная фреза',
      application: 'Синус-лифтинг',
      shapes: 'Шар 6мм, 8мм',
      rpm: '20000-40000 об/мин'
    })
  },
  {
    pattern: 'фреза.*забор.*кост',
    description: 'Фреза для забора аутогенной кости. Полая конструкция для получения костного цилиндра.',
    specs: JSON.stringify({
      type: 'Фреза для забора кости',
      diameters: '8, 9, 10 мм',
      material: 'Нержавеющая сталь',
      rpm: '800-1500 об/мин'
    })
  },
  {
    pattern: 'Экстрактор.*корней',
    description: 'Экстрактор для атравматичного удаления корней зубов. Вертикальное извлечение без повреждения лунки.',
    specs: JSON.stringify({
      type: 'Экстрактор',
      application: 'Атравматичное удаление',
      feature: 'Сохранение стенок лунки'
    })
  },
  {
    pattern: 'Шаблон.*Paulo Malo|All on 4',
    description: 'Хирургический шаблон по протоколу Paulo Malo для концепции All-on-4 / All-on-6.',
    specs: JSON.stringify({
      type: 'Хирургический шаблон',
      protocol: 'Paulo Malo All-on-4/6',
      feature: 'Направляющие для углового имплантата'
    })
  }
];

async function updateProductSpecs() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '../server/database/db.sqlite');
  const fileBuffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(fileBuffer);

  let updated = 0;

  // Обновляем протетику
  console.log('=== Обновление протетики ===');
  for (const item of PROSTHETIC_UPDATES) {
    try {
      const regex = new RegExp(item.pattern, 'i');

      // Получаем товары, соответствующие паттерну
      const products = db.exec(`SELECT id, name FROM products WHERE name REGEXP '${item.pattern}'`);

      // Используем LIKE для SQLite (без REGEXP)
      const stmt = db.prepare(`SELECT id, name FROM products WHERE name LIKE ?`);
      const likePattern = `%${item.pattern.replace(/\.\*/g, '%').replace(/\|/g, '%').replace(/\^/g, '')}%`;

      db.run(
        `UPDATE products SET description = ?, specs = ? WHERE name LIKE ? AND (specs IS NULL OR specs = '')`,
        [item.description, item.specs, likePattern]
      );

      console.log(`Обновлено: ${item.pattern}`);
      updated++;
    } catch (e) {
      // Пробуем простой LIKE
      const simplePattern = item.pattern.split('|')[0].replace(/\.\*/g, '').replace(/\^/g, '');
      db.run(
        `UPDATE products SET description = ?, specs = ? WHERE name LIKE ? AND (specs IS NULL OR specs = '')`,
        [item.description, item.specs, `%${simplePattern}%`]
      );
      console.log(`Обновлено (LIKE): ${simplePattern}`);
      updated++;
    }
  }

  // Обновляем инструменты
  console.log('\n=== Обновление инструментов ===');
  for (const item of INSTRUMENT_UPDATES) {
    try {
      const simplePattern = item.pattern.split('|')[0].replace(/\.\*/g, '').replace(/\^/g, '').replace(/\[.*?\]/g, '');
      db.run(
        `UPDATE products SET description = ?, specs = ? WHERE name LIKE ? AND (specs IS NULL OR specs = '')`,
        [item.description, item.specs, `%${simplePattern}%`]
      );
      console.log(`Обновлено: ${simplePattern}`);
      updated++;
    } catch (e) {
      console.log(`Ошибка: ${item.pattern}`, e.message);
    }
  }

  // Сохраняем базу данных
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);

  console.log(`\nВсего паттернов обработано: ${updated}`);
  console.log('База данных сохранена!');
}

updateProductSpecs().catch(console.error);
