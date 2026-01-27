const initSqlJs = require('sql.js')
const fs = require('fs')
const path = require('path')

async function addProtetika() {
  const SQL = await initSqlJs()
  const dbPath = path.join(__dirname, 'database', 'db.sqlite')
  const fileBuffer = fs.readFileSync(dbPath)
  const db = new SQL.Database(fileBuffer)

  console.log('=== ИСПРАВЛЕНИЕ раздела Протетика (v4 - полные данные) ===\n')

  const protetikaId = 3
  console.log('Удаление старых данных...')

  const oldCats = db.exec(`SELECT id FROM categories WHERE parent_id = ${protetikaId}`)
  if (oldCats.length > 0 && oldCats[0].values.length > 0) {
    const oldCatIds = oldCats[0].values.map(row => row[0]).join(',')
    db.run(`DELETE FROM products WHERE category_id IN (${oldCatIds})`)
    db.run(`DELETE FROM categories WHERE parent_id = ${protetikaId}`)
    console.log(`  Удалено ${oldCats[0].values.length} подкатегорий`)
  }

  console.log('\nСоздание подкатегорий...')
  const subcategories = [
    { name: 'Prosthetics Replica', slug: 'prosthetics-replica', brand: 'Prosthetics Replica' },
    { name: 'X GATE Multiunit', slug: 'x-gate-multiunit', brand: 'X GATE' },
    { name: 'DIO NOT DIGITAL', slug: 'dio-not-digital', brand: 'DIO' },
    { name: 'DIO DIGITAL', slug: 'dio-digital', brand: 'DIO' },
    { name: 'DIO ORIGINAL', slug: 'dio-original', brand: 'DIO' },
    { name: 'DIO Ball Abutment', slug: 'dio-ball-abutment', brand: 'DIO' },
    { name: 'BLUEDIAMOND MEGAGEN', slug: 'bluediamond-megagen', brand: 'MEGAGEN' },
    { name: 'Tools', slug: 'protetika-tools', brand: 'Tools' }
  ]

  const categoryIds = {}
  for (const cat of subcategories) {
    db.run(`INSERT INTO categories (name, slug, parent_id) VALUES (?, ?, ?)`, [cat.name, cat.slug, protetikaId])
    const catId = db.exec("SELECT last_insert_rowid()")[0].values[0][0]
    categoryIds[cat.slug] = { id: catId, brand: cat.brand }
    console.log(`  ${cat.name} (ID: ${catId})`)
  }

  console.log('\nДобавление товаров...')

  // Структура: name (с брендом для каталога), description_en (полное EN), description (полное RU)
  const products = [
    // === 1. Prosthetics Replica (9 товаров) - Screenshot 1 ===
    { name: 'Prosthetics Replica Titanium bases GEO Korean systems', description_en: 'Titanium bases GEO Korean systems', description: 'Титановые основания аналог GEO Корейские системы', category: 'prosthetics-replica', country: 'Russia', price: 450 },
    { name: 'Prosthetics Replica Titanium bases GEO other systems', description_en: 'Titanium bases GEO other systems', description: 'Титановые основания аналог GEO Другие системы', category: 'prosthetics-replica', country: 'Russia', price: 550 },
    { name: 'Prosthetics Replica Titanium bases GEO anodized gold Korean', description_en: 'Titanium bases GEO anodized gold Korean systems', description: 'Титановые основания аналог GEO анодированные золотые Корейские системы', category: 'prosthetics-replica', country: 'Russia', price: 650 },
    { name: 'Prosthetics Replica Titanium bases GEO anodized gold other', description_en: 'Titanium bases GEO anodized gold other systems', description: 'Титановые основания аналог GEO анодированные золотые Другие системы', category: 'prosthetics-replica', country: 'Russia', price: 750 },
    { name: 'Prosthetics Replica Laboratory analog implant Korean', description_en: 'Laboratory analog implant Korean systems', description: 'Аналог имплантата Корейские системы', category: 'prosthetics-replica', country: 'China', price: 500 },
    { name: 'Prosthetics Replica Transfer open spoon Korean', description_en: 'Transfer open spoon Korean systems', description: 'Трансфер открытая ложка Корейские системы', category: 'prosthetics-replica', country: 'China', price: 700 },
    { name: 'Prosthetics Replica Healing Abutment Korean', description_en: 'Healing Abutment Korean systems', description: 'Формирователь десны Корейские системы', category: 'prosthetics-replica', country: 'China', price: 500 },
    { name: 'Prosthetics Replica Abutment cemented straight Korean', description_en: 'Abutment is cemented straight Korean systems', description: 'Цементируемый прямой абатмент Корейские системы', category: 'prosthetics-replica', country: 'China', price: 500 },
    { name: 'Prosthetics Replica Abutment cemented angular Korean', description_en: 'Abutment is cemented angular Korean systems', description: 'Цементируемый угловой абатмент Корейские системы', category: 'prosthetics-replica', country: 'China', price: 750 },

    // === 2. X GATE Multiunit type D (11 товаров) - Screenshot 2 ===
    { name: 'X GATE SET Multiunit straight + Titanium bases', description_en: 'X GATE Multiunit type D SET Multiunit straight + Titanium bases Korean systems', description: 'X GATE Multiunit type D Комплект прямой мультиюнит + титановое основание', category: 'x-gate-multiunit', country: 'Israel', price: 2900 },
    { name: 'X GATE SET Multiunit angular + Titanium bases', description_en: 'X GATE Multiunit type D SET Multiunit angular + Titanium bases Korean systems', description: 'X GATE Multiunit type D Комплект угловой мультиюнит + титановое основание', category: 'x-gate-multiunit', country: 'Israel', price: 4000 },
    { name: 'X GATE Multiunit straight', description_en: 'X GATE Multiunit type D straight Korean systems', description: 'X GATE Multiunit type D Мультиюнит прямой на Корейские системы', category: 'x-gate-multiunit', country: 'Israel', price: 1800 },
    { name: 'X GATE Multiunit angular', description_en: 'X GATE Multiunit type D angular Korean systems', description: 'X GATE Multiunit type D Мультиюнит угловой на Корейские системы', category: 'x-gate-multiunit', country: 'Israel', price: 3000 },
    { name: 'X GATE Analog implant', description_en: 'X GATE Multiunit type D Analog implant Korean systems', description: 'X GATE Multiunit type D Аналог мультиюнита на Корейские системы', category: 'x-gate-multiunit', country: 'Israel', price: 1400 },
    { name: 'X GATE Transfer open spoon', description_en: 'X GATE Multiunit type D Transfer open spoon Korean systems', description: 'X GATE Multiunit type D Трансфер мультиюнита открытая ложка на Корейские системы', category: 'x-gate-multiunit', country: 'Israel', price: 1500 },
    { name: 'X GATE Titanium bases', description_en: 'X GATE Multiunit type D Titanium bases Korean systems', description: 'X GATE Multiunit type D Титановое основание мультиюнита на Корейские системы', category: 'x-gate-multiunit', country: 'Israel', price: 1300 },
    { name: 'X GATE Titanium temporary cylinder', description_en: 'X GATE Multiunit type D Titanium temporary cylinder Korean systems', description: 'X GATE Multiunit type D Титановый временный цилиндр мультиюнита на Корейские системы', category: 'x-gate-multiunit', country: 'Israel', price: 1400 },
    { name: 'X GATE Healing Abutment', description_en: 'X GATE Multiunit type D Healing Abutment Korean systems', description: 'X GATE Multiunit type D Формирователь десны для мультиюнита (Защитный заживляющий колпачок) на Корейские системы', category: 'x-gate-multiunit', country: 'Israel', price: 1400 },
    { name: 'X GATE Screw', description_en: 'X GATE Multiunit type D Screw', description: 'X GATE Multiunit type D Винт', category: 'x-gate-multiunit', country: 'Israel', price: 350 },
    { name: 'X GATE Screwdriver Multiunit straight', description_en: 'X GATE Multiunit type D Screwdriver Multiunit straight', description: 'X GATE Multiunit type D Отвёртка для прямого мультиюнита', category: 'x-gate-multiunit', country: 'Israel', price: 6000 },

    // === 3. DIO NOT DIGITAL (7 товаров) - Screenshot 3 ===
    { name: 'DIO NOT DIGITAL Multiunit straight', description_en: 'DIO NOT DIGITAL ORIGINAL Multiunit straight', description: 'DIO НЕ ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Мультиюнит прямой НЕ ЦИФРОВОЙ', category: 'dio-not-digital', country: 'South Korea', price: 4500 },
    { name: 'DIO NOT DIGITAL Multiunit angular', description_en: 'DIO NOT DIGITAL ORIGINAL Multiunit angular', description: 'DIO НЕ ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Мультиюнит угловой НЕ ЦИФРОВОЙ', category: 'dio-not-digital', country: 'South Korea', price: 4500 },
    { name: 'DIO NOT DIGITAL Analog MU', description_en: 'DIO NOT DIGITAL ORIGINAL Multiunit Analog Ø4.8 Height 12 Narrow/Regular RCN 40412', description: 'DIO НЕ ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Аналог мультиюнита Ø4.8 Высота 12 универсальный для Narrow и Regular', category: 'dio-not-digital', country: 'South Korea', price: 1000 },
    { name: 'DIO NOT DIGITAL Transfer MU', description_en: 'DIO NOT DIGITAL ORIGINAL Multiunit Pick-up Impression Coping Ø4.8 Height 8, Non-Hex (Narrow/Regular) + Guide Pin PCN 603105. IPN 40508N', description: 'DIO НЕ ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Трансфер слепочный для мультиюнита Ø4.8 Высота 8 без шестигранника, с направляющим пином универсальный для Narrow и Regular', category: 'dio-not-digital', country: 'South Korea', price: 2100 },
    { name: 'DIO NOT DIGITAL Healing Cap MU', description_en: 'DIO NOT DIGITAL ORIGINAL Multiunit Healing Cap Ø1.4 Height 4.5 (Narrow/Regular). HCN 60504', description: 'DIO НЕ ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Формирователь десны для мультиюнита (Защитный заживляющий колпачок) Ø1.4, Высота 4.5 универсальный для Narrow и Regular', category: 'dio-not-digital', country: 'South Korea', price: 1500 },
    { name: 'DIO NOT DIGITAL Titanium Cylinder MU', description_en: 'DIO NOT DIGITAL ORIGINAL Multiunit Temporary Cylinder Ø5.4, Height 11, Non-Hex For fabricating temporary prosthetics (Narrow/Regular) + Cylinder Screw SHN 1403. TCN 40511N', description: 'DIO НЕ ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Цилиндр титановый Ø5.4, Высота 11, для мультиюнита для временных конструкций без шестигранника с винтом универсальный для Narrow и Regular', category: 'dio-not-digital', country: 'South Korea', price: 2600 },
    { name: 'DIO NOT DIGITAL Plastic Burnout Cylinder MU', description_en: 'DIO NOT DIGITAL ORIGINAL Multiunit Plastic Cylinder Ø5.0, Height 13, Non-Hex Cast in premium gold alloy after customisation. (Narrow/Regular) + Cylinder Screw SHN 1403. APN 40514G8', description: 'DIO НЕ ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Цилиндр из золотого сплава под литьё Ø5.0, Высота 13, для мультиюнита для постоянных конструкций с винтом без шестигранника универсальный для Narrow и Regular', category: 'dio-not-digital', country: 'South Korea', price: 2050 },

    // === 4. DIO DIGITAL (12 товаров) - Screenshot 4 ===
    { name: 'DIO DIGITAL Multiunit straight', description_en: 'DIO DIGITAL ORIGINAL Multiunit straight', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Мультиюнит прямой', category: 'dio-digital', country: 'South Korea', price: 3400 },
    { name: 'DIO DIGITAL Multiunit angular', description_en: 'DIO DIGITAL ORIGINAL Multiunit angular', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Мультиюнит угловой', category: 'dio-digital', country: 'South Korea', price: 3400 },
    { name: 'DIO DIGITAL Analog', description_en: 'DIO DIGITAL ORIGINAL Multiunit Analog Ø4.8 Height 15mm. Provides anchor point for Digital Multiunit Abutment on working model. MSJA 48159', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Аналог цифрового мультиюнита для рабочей модели Ø4.8, высота 15мм', category: 'dio-digital', country: 'South Korea', price: 2100 },
    { name: 'DIO DIGITAL Analog for 3D model', description_en: 'DIO DIGITAL ORIGINAL Multiunit Analog Ø4.8 Height 14.7mm. Provides anchor point for Digital Multiunit Abutment on 3D printed model. MSGA 4814', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Аналог цифрового мультиюнита для 3D печатной модели, Ø4.8, высота 14.7мм', category: 'dio-digital', country: 'South Korea', price: 2800 },
    { name: 'DIO DIGITAL Transfer', description_en: 'DIO DIGITAL ORIGINAL Multiunit Digital Pick-up Impression Coping Ø4.8 Height 12mm, Non-Hex + Guide Pin MSCP 1815. Only for Digital Multiunit Abutment. Used with an open tray.', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Трансфер для цифрового мультиюнита открытая ложка Ø4.8, высота 12мм, без шестигранника с направляющим пином.', category: 'dio-digital', country: 'South Korea', price: 1800 },
    { name: 'DIO DIGITAL Healing Cap', description_en: 'DIO DIGITAL ORIGINAL Multiunit Healing Cap Ø5.0, Height 5.5mm. Only for Digital Multiunit Abutment. MSHC 5005', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Формирователь десны для мультиюнита (Защитный заживляющий элемент) для цифрового мультиюнита Ø5.0, высота 5.5мм', category: 'dio-digital', country: 'South Korea', price: 2500 },
    { name: 'DIO DIGITAL H-Scanbody', description_en: 'DIO DIGITAL ORIGINAL Multiunit H-Scanbody Ø5.0, Height 9.5mm + Screw MSHDSC 1605. Use for digital impression taking. Only for Multiunit Abutment. MSHD 50095', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Сканирующий элемент для цифрового мультиюнита Ø5.0, высота 9.5мм, с винтом', category: 'dio-digital', country: 'South Korea', price: 3800 },
    { name: 'DIO DIGITAL Scan Adapter', description_en: 'DIO DIGITAL ORIGINAL Multiunit Scan Adapter Ø4.8 Height 8mm on MSSC 1095. Use for digital impression taking. Only for Multiunit Abutment. MSSAM 48089', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Сканмаркер для цифрового мультиюнита Ø4.8 высота 8мм, с винтом', category: 'dio-digital', country: 'South Korea', price: 3800 },
    { name: 'DIO DIGITAL Temporary Cylinder', description_en: 'DIO DIGITAL ORIGINAL Multiunit Digital Temporary Cylinder Ø5.4 Height 12mm, Non-Hex + Screw MSC 1604. Only for Digital Multiunit Abutment. Used for fabricating temporary prosthetics. MSTM 54129', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Цилиндр временный для цифрового мультиюнита Ø5.4, высота 12мм, без шестигранника, с винтом', category: 'dio-digital', country: 'South Korea', price: 2500 },
    { name: 'DIO DIGITAL Titanium Cylinder', description_en: 'DIO DIGITAL ORIGINAL Multiunit Cemented Cylinder Ø5.4 Height 8mm, Non-Hex + Screw MSC 1604. Only for Digital Multiunit Abutment. Used to fabricate cement retained prosthetics. MSCM 54089', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Цилиндр титановый для цифрового мультиюнита Ø5.4, высота 8мм, без шестигранника, с винтом', category: 'dio-digital', country: 'South Korea', price: 3700 },
    { name: 'DIO DIGITAL Plastic Burnout Cylinder', description_en: 'DIO DIGITAL ORIGINAL Multiunit Digital Plastic Cylinder Ø5.4 Height 13mm, Non-Hex + Screw MSC 1604. Only for Digital Multiunit Abutment. Used for fabricate prosthetics with casting with non-precious metal alloys. MPLA 54139', description: 'DIO ЦИФРОВЫЕ ОРИГИНАЛЬНЫЕ МУЛЬТИЮНИТЫ Технический цилиндр под литье для цифрового мультиюнита Ø5.4, высота 13мм, без шестигранника, с винтом', category: 'dio-digital', country: 'South Korea', price: 2700 },
    { name: 'DIO DIGITAL Multiunit Driver', description_en: 'DIO ORIGINAL Multiunit Driver Multiunit Screw Driver UTMEA (Torque), UCA (Regular), MNA. HD 2012A', description: 'DIO ОРИГИНАЛЬНЫЕ ОТВЁРТКИ ДЛЯ МУЛЬТИЮНИТА Ключ (Отвёртка) для мультиюнита прямая UTMEA (Torque), UCA (Regular), MNA (Digital Regular), 12mm.', category: 'dio-digital', country: 'South Korea', price: 8000 },

    // === 5. DIO ORIGINAL Prosthetics (16 товаров) - Screenshots 5, 6 ===
    { name: 'DIO ORIGINAL Healing Abutment with marking', description_en: 'DIO ORIGINAL Healing Abutment Ø4.0. Radiopaque with marking', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Формирователь десны. Рентгеноконтрастный с маркировкой.', category: 'dio-original', country: 'South Korea', price: 2100 },
    { name: 'DIO ORIGINAL Healing Abutment ALL size', description_en: 'DIO ORIGINAL Healing Abutment ALL size', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Формирователь десны любой размер', category: 'dio-original', country: 'South Korea', price: 2100 },
    { name: 'DIO ORIGINAL Temporary Abutment + Screw', description_en: 'DIO ORIGINAL Temporary abutment + Screw SSC 2006H', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Абатмент титановый временный с винтом', category: 'dio-original', country: 'South Korea', price: 3400 },
    { name: 'DIO ORIGINAL Analog NOT DIGITAL', description_en: 'DIO ORIGINAL Analog NOT DIGITAL', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Аналог имплантата не цифровой', category: 'dio-original', country: 'South Korea', price: 1700 },
    { name: 'DIO ORIGINAL Transfer Open-tray + Guide Pin', description_en: 'DIO ORIGINAL Transfer Impression Coping Open-tray Technique + Guide Pin', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Слепочный трансфер открытая ложка с направляющим пином', category: 'dio-original', country: 'South Korea', price: 2900 },
    { name: 'DIO ORIGINAL Transfer Closed-tray + Guide Pin', description_en: 'DIO ORIGINAL Transfer Impression Coping Closed-tray Technique + Guide Pin', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Слепочный трансфер закрытая ложка с направляющим пином', category: 'dio-original', country: 'South Korea', price: 2900 },
    { name: 'DIO ORIGINAL Analog for 3D model', description_en: 'DIO DIGITAL ORIGINAL Analog. Provides anchor point for abutment on 3D printed model', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА ЦИФРОВАЯ Аналог имплантата цифровой', category: 'dio-original', country: 'South Korea', price: 1700 },
    { name: 'DIO ORIGINAL Scan Adapter + Screw', description_en: 'DIO DIGITAL ORIGINAL Scan Adapter Height + Screw', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА ЦИФРОВАЯ Скан-маркер с винтом', category: 'dio-original', country: 'South Korea', price: 2900 },
    { name: 'DIO ORIGINAL Mill Abutment + Screw', description_en: 'DIO ORIGINAL Mill Abutment + Screw', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Абатмент обтачиваемый (фрезеруемый) цементируемый индивидуальный с винтом', category: 'dio-original', country: 'South Korea', price: 4200 },
    { name: 'DIO ORIGINAL Cemented Abutment Straight + Screw', description_en: 'DIO ORIGINAL Cemented Abutment Straight + Screw', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Абатмент прямой цементируемый с винтом', category: 'dio-original', country: 'South Korea', price: 4200 },
    { name: 'DIO ORIGINAL Cemented Abutment Angled 15 + Screw', description_en: 'DIO ORIGINAL Cemented Abutment Angled 15° + Screw', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Абатмент угловой цементируемый 15° с винтом', category: 'dio-original', country: 'South Korea', price: 5100 },
    { name: 'DIO ORIGINAL Cemented Abutment Angled 25 + Screw', description_en: 'DIO ORIGINAL Cemented Abutment Angled 25° + Screw', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Абатмент угловой цементируемый 25° с винтом', category: 'dio-original', country: 'South Korea', price: 5100 },
    { name: 'DIO ORIGINAL Pre-Milled Bar + Screw 2ea', description_en: 'DIO ORIGINAL Pre-Milled Bar + Screw 2ea', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Премилд заготовка индивидуального абатмента с двумя винтами', category: 'dio-original', country: 'South Korea', price: 4500 },
    { name: 'DIO ORIGINAL Titanium bases Hybrid Link + Screw', description_en: 'DIO ORIGINAL Titanium bases (Hybrid Link) + Screw. Up to implant platform connection part is made of titanium, making it easy to produce prosthesis for anterior region by cementation the post made of zirconia', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Титановое основание с винтом', category: 'dio-original', country: 'South Korea', price: 3500 },
    { name: 'DIO ORIGINAL Plastic Abutment + Screw', description_en: 'DIO ORIGINAL Plastic Abutment + Screw', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Абатмент пластиковый выжигаемый с винтом', category: 'dio-original', country: 'South Korea', price: 2500 },
    { name: 'DIO ORIGINAL UCLA CCM Abutment + Screw', description_en: 'DIO ORIGINAL UCLA CCM Abutment + Screw', description: 'DIO ОРИГИНАЛЬНАЯ ПРОТЕТИКА Абатмент приливаемый КХС кобальт-хром-молибден с винтом', category: 'dio-original', country: 'South Korea', price: 4500 },

    // === 6. DIO Ball Abutment (6 товаров) - Screenshot 7 ===
    { name: 'DIO Ball Abutment', description_en: 'DIO ORIGINAL Ball Abutment', description: 'DIO ОРИГИНАЛЬНЫЕ ШАРИКОВЫЕ АБАТМЕНТЫ Абатмент шариковый', category: 'dio-ball-abutment', country: 'South Korea', price: 3500 },
    { name: 'DIO Ball Abutment Retainer + O-Ring', description_en: 'DIO ORIGINAL Ball Abutment Retainer Ball Abutment + O-Ring OR 04508 + O-Ring OR 04500', description: 'DIO ОРИГИНАЛЬНЫЕ ШАРИКОВЫЕ АБАТМЕНТЫ Ретейнер для шарикового абатмента универсальный + матрица чёрная лабораторная и оранжевая клиническая', category: 'dio-ball-abutment', country: 'South Korea', price: 1500 },
    { name: 'DIO Ball Abutment Cap + O-Ring', description_en: 'DIO ORIGINAL Ball Abutment Cap Ball Abutment + O-Ring OR 04508 + O-Ring OR 04500', description: 'DIO ОРИГИНАЛЬНЫЕ ШАРИКОВЫЕ АБАТМЕНТЫ Колпачок для шарикового абатмента универсальный + матрица чёрная лабораторная и оранжевая клиническая', category: 'dio-ball-abutment', country: 'South Korea', price: 2500 },
    { name: 'DIO Ball Abutment O-Ring Black', description_en: 'DIO ORIGINAL Ball Abutment O-Ring Black For dental lab use', description: 'DIO ОРИГИНАЛЬНЫЕ ШАРИКОВЫЕ АБАТМЕНТЫ Матрица (кольцо) чёрное для шарикового абатмента лабораторная универсальное', category: 'dio-ball-abutment', country: 'South Korea', price: 900 },
    { name: 'DIO Ball Abutment O-Ring Orange', description_en: 'DIO ORIGINAL Ball Abutment O-Ring Ø4.5 Orange For clinic use', description: 'DIO ОРИГИНАЛЬНЫЕ ШАРИКОВЫЕ АБАТМЕНТЫ Матрица (кольцо) оранжевое для шарикового абатмента клиника универсальное', category: 'dio-ball-abutment', country: 'South Korea', price: 900 },
    { name: 'DIO Ball Abutment Driver', description_en: 'DIO ORIGINAL Ball Abutment Driver Ball Abutment Driver', description: 'DIO ОРИГИНАЛЬНЫЕ ОТВЁРТКИ ДЛЯ ШАРИКОВЫХ АБАТМЕНТОВ Ключ (отвёртка) для шарикового абатмента', category: 'dio-ball-abutment', country: 'South Korea', price: 8000 },

    // === 7. BLUEDIAMOND MEGAGEN (5 товаров) - Screenshot 8 ===
    { name: 'BLUEDIAMOND MEGAGEN Scan Abutment', description_en: 'BLUEDIAMOND MEGAGEN ORIGINAL Scan Abutment', description: 'BLUEDIAMOND MEGAGEN ОРИГИНАЛЬНАЯ ПРОТЕТИКА ЦИФРОВАЯ Скан-маркер с винтом', category: 'bluediamond-megagen', country: 'South Korea', price: 1900 },
    { name: 'BLUEDIAMOND MEGAGEN Analog', description_en: 'BLUEDIAMOND MEGAGEN ORIGINAL Analog', description: 'BLUEDIAMOND MEGAGEN ОРИГИНАЛЬНАЯ ПРОТЕТИКА ЦИФРОВАЯ Аналог имплантата цифровой', category: 'bluediamond-megagen', country: 'South Korea', price: 900 },
    { name: 'BLUEDIAMOND MEGAGEN Titanium bases ZrGEN Abutment', description_en: 'BLUEDIAMOND MEGAGEN ORIGINAL Titanium bases (Hybrid Link) ZrGEN Abutment', description: 'BLUEDIAMOND MEGAGEN ОРИГИНАЛЬНАЯ ПРОТЕТИКА Титановое основание', category: 'bluediamond-megagen', country: 'South Korea', price: 1900 },
    { name: 'BLUEDIAMOND MEGAGEN Healing Abutment', description_en: 'BLUEDIAMOND MEGAGEN ORIGINAL Healing Abutment', description: 'BLUEDIAMOND MEGAGEN ОРИГИНАЛЬНАЯ ПРОТЕТИКА Формирователь десны', category: 'bluediamond-megagen', country: 'South Korea', price: 1500 },
    { name: 'BLUEDIAMOND MEGAGEN Transfer Open-tray + Guide Pin', description_en: 'BLUEDIAMOND MEGAGEN ORIGINAL Transfer Impression Coping Open-tray Technique + Guide Pin', description: 'BLUEDIAMOND MEGAGEN ОРИГИНАЛЬНАЯ ПРОТЕТИКА Трансфер для открытой ложки', category: 'bluediamond-megagen', country: 'South Korea', price: 1700 },

    // === 8. Tools (6 товаров) - Screenshot 9 ===
    { name: 'Tools Screwdriver 1.2 replica', description_en: 'Screwdriver 1.2 replica for Torque wrench for round screwdrivers', description: 'Отвёртка реплика 1.2 для динамометрического ключа круглым соединением (Струнный ключ)', category: 'protetika-tools', country: 'China', price: 1500 },
    { name: 'Tools Screwdriver all systems replica', description_en: 'Screwdriver all systems replica for Torque wrench for round screwdrivers', description: 'Отвёртка реплика на любую систему (кроме 1.2) для динамометрического ключа круглым соединением (Струнный ключ)', category: 'protetika-tools', country: 'China', price: 2000 },
    { name: 'Tools KIT 16pc + Torque wrench', description_en: 'KIT 16pc universal dental screwdrivers for all systems Torque wrench for round screwdrivers Sterilization cassette', description: 'Набор 16 универсальных субокостных отвёрток для всех систем Динамометрический ключ для отвёрток с круглым соединением (Струнный) Кассета для стерилизации', category: 'protetika-tools', country: 'Pakistan', price: 8000 },
    { name: 'Tools KIT 8pc universal screwdrivers', description_en: 'KIT 8pc universal dental screwdrivers for all systems for a dental technician Sterilization cassette', description: 'Набор 8 универсальных субокостных отвёрток для всех систем Кассета для стерилизации', category: 'protetika-tools', country: 'Pakistan', price: 5500 },
    { name: 'Tools Torque wrench for square', description_en: 'Torque wrench (collapsible) for square screwdrivers', description: 'Динамометрический ключ для отвёрток с квадратным соединением (Складывающийся)', category: 'protetika-tools', country: 'Pakistan', price: 4000 },
    { name: 'Tools Torque wrench for round', description_en: 'Torque wrench for round screwdrivers', description: 'Динамометрический ключ для отвёрток с круглым соединением (Струнный)', category: 'protetika-tools', country: 'Pakistan', price: 5000 }
  ]

  let count = 0
  for (const product of products) {
    const catInfo = categoryIds[product.category]
    db.run(
      `INSERT INTO products (name, name_en, description, description_en, price, category_id, brand, country, image_url, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [product.name, product.name, product.description, product.description_en, product.price, catInfo.id, catInfo.brand, product.country, '/images/products/placeholder.png', 1]
    )
    count++
  }
  console.log(`  Добавлено ${count} товаров`)

  const data = db.export()
  fs.writeFileSync(dbPath, Buffer.from(data))
  console.log('\nБаза данных сохранена!')

  const catCount = db.exec(`SELECT COUNT(*) FROM categories WHERE parent_id = ${protetikaId}`)[0].values[0][0]
  const prodCount = db.exec(`SELECT COUNT(*) FROM products WHERE category_id IN (SELECT id FROM categories WHERE parent_id = ${protetikaId})`)[0].values[0][0]
  console.log(`\nИтого: ${catCount} подкатегорий, ${prodCount} товаров`)

  console.log('\nПримеры товаров:')
  const samples = db.exec(`SELECT name, description_en, description FROM products WHERE category_id IN (SELECT id FROM categories WHERE parent_id = ${protetikaId}) LIMIT 3`)
  if (samples.length > 0) {
    samples[0].values.forEach(row => {
      console.log(`  name: ${row[0]}`)
      console.log(`  description_en: ${row[1]}`)
      console.log(`  description: ${row[2]}`)
      console.log('  ---')
    })
  }

  db.close()
}

addProtetika().catch(console.error)
