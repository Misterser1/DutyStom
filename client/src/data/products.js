// Данные товаров из Excel ЭКСЕЛЬ_НАБРОСОК_ДЛЯ_САЙТА_ЧЕРНОВИК.xlsx

export const products = [
  // =============== ИМПЛАНТАТЫ ===============
  // DIO
  { id: 1, code: '00001', name: 'DIO UF II HSA', brand: 'DIO', country: 'Ю.Корея', price: 2500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Тип': 'HSA' } },
  { id: 2, code: '00002', name: 'DIO SHORT HSA', brand: 'DIO', country: 'Ю.Корея', price: 2500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Тип': 'HSA Short' } },
  { id: 3, code: '00003', name: 'DIO UF III HSA', brand: 'DIO', country: 'Ю.Корея', price: 2500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Тип': 'HSA' } },
  { id: 4, code: '00004', name: 'DIO INTERNAL', brand: 'DIO', country: 'Ю.Корея', price: 2500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Internal' } },
  { id: 5, code: '00005', name: 'DIO PROTEM MINI POST TYPE', brand: 'DIO', country: 'Ю.Корея', price: 2500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Mini Post' } },
  { id: 6, code: '00006', name: 'DIO PROTEM MINI BALL TYPE', brand: 'DIO', country: 'Ю.Корея', price: 2500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Mini Ball' } },
  { id: 7, code: '00007', name: 'DIO FTN EXTERNAL', brand: 'DIO', country: 'Ю.Корея', price: 2500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Тип': 'External' } },

  // DENTIUM
  { id: 8, code: '00008', name: 'DENTIUM SUPERLINE II FXS', brand: 'DENTIUM', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'Superline II' } },
  { id: 9, code: '00009', name: 'SIMPLELINE II', brand: 'DENTIUM', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'Simpleline' } },

  // MEGAGEN
  { id: 10, code: '00010', name: 'BLUEDIAMOND REGULAR THREAD', brand: 'MEGAGEN', country: 'Ю.Корея', price: 5000, category_id: 1, category: 'Имплантаты', image: '/images/products/megagen-bluediamond-regular.png', specs: { 'Размер': 'ALL SIZE', 'Резьба': 'Regular' } },
  { id: 11, code: '00011', name: 'BLUEDIAMOND DEEP THREAD', brand: 'MEGAGEN', country: 'Ю.Корея', price: 5000, category_id: 1, category: 'Имплантаты', image: '/images/products/megagen-bluediamond-deep.png', specs: { 'Размер': 'ALL SIZE', 'Резьба': 'Deep' } },
  { id: 12, code: '00012', name: 'ANYONE INTERNAL REGULAR THREAD', brand: 'MEGAGEN', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', image: '/images/products/megagen-anyone-regular.png', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Internal', 'Резьба': 'Regular' } },
  { id: 13, code: '00013', name: 'ANYONE INTERNAL DEEP THREAD', brand: 'MEGAGEN', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', image: '/images/products/megagen-anyone-deep.png', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Internal', 'Резьба': 'Deep' } },
  { id: 14, code: '00014', name: 'ANYONE SPECIAL SHORT', brand: 'MEGAGEN', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', image: '/images/products/megagen-anyone-short.png', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Short' } },
  { id: 101, code: '00101', name: 'ANYONE ONESTAGE REGULAR THREAD', brand: 'MEGAGEN', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', image: '/images/products/megagen-anyone-onestage-regular.png', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Onestage', 'Резьба': 'Regular' } },
  { id: 102, code: '00102', name: 'ANYONE ONESTAGE DEEP THREAD', brand: 'MEGAGEN', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', image: '/images/products/megagen-anyone-onestage-deep.png', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Onestage', 'Резьба': 'Deep' } },

  // INNO
  { id: 15, code: '00015', name: 'INNO SUBMERGED', brand: 'INNO', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Submerged' } },
  { id: 16, code: '00016', name: 'INNO SUBMERGED SHORT', brand: 'INNO', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Submerged Short' } },
  { id: 17, code: '00017', name: 'INNO SUBMERGED NARROW', brand: 'INNO', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Тип': 'Narrow' } },

  // SNUCONE
  { id: 18, code: '00018', name: 'SNUCONE AF+I', brand: 'SNUCONE', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'AF+I' } },
  { id: 19, code: '00019', name: 'SNUCONE AF+II', brand: 'SNUCONE', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'AF+II' } },

  // NEOBITECH
  { id: 20, code: '00020', name: 'NEOBITECH IS-II', brand: 'NEOBITECH', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'IS-II' } },
  { id: 21, code: '00021', name: 'NEOBITECH IS-II SHORT', brand: 'NEOBITECH', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': '4 sizes', 'Серия': 'IS-II Short' } },
  { id: 22, code: '00022', name: 'NEOBITECH IS-III', brand: 'NEOBITECH', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'IS-III' } },

  // DENTIS
  { id: 23, code: '00023', name: 'DENTIS AXEL REGULAR THREAD', brand: 'DENTIS', country: 'Ю.Корея', price: 3300, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Резьба': 'Regular' } },
  { id: 24, code: '00024', name: 'DENTIS AXEL DEEP THREAD', brand: 'DENTIS', country: 'Ю.Корея', price: 3300, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Резьба': 'Deep' } },
  { id: 25, code: '00025', name: 'DENTIS SQ', brand: 'DENTIS', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'SQ' } },
  { id: 26, code: '00026', name: 'DENTIS ONEQ-SL', brand: 'DENTIS', country: 'Ю.Корея', price: 3000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'OneQ-SL' } },

  // OSSTEM
  { id: 27, code: '00027', name: 'OSSTEM TS-III BA Pre-mount', brand: 'OSSTEM', country: 'Ю.Корея', price: 4500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'TS-III', 'Тип': 'BA Pre-mount' } },
  { id: 28, code: '00028', name: 'OSSTEM TS-III SOI Pre-mount', brand: 'OSSTEM', country: 'Ю.Корея', price: 4500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'TS-III', 'Тип': 'SOI Pre-mount' } },
  { id: 29, code: '00029', name: 'OSSTEM TS-III CA Pre-mount', brand: 'OSSTEM', country: 'Ю.Корея', price: 4500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'TS-III', 'Тип': 'CA Pre-mount' } },
  { id: 30, code: '00030', name: 'OSSTEM TS-III SA Pre-mount', brand: 'OSSTEM', country: 'Ю.Корея', price: 4000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'TS-III', 'Тип': 'SA Pre-mount' } },

  // STRAUMANN
  { id: 31, code: '00031', name: 'STRAUMANN BL Bone Level', brand: 'STRAUMANN', country: 'Швейцария', price: 12000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'BL', 'Поверхность': 'SLA' } },
  { id: 32, code: '00032', name: 'STRAUMANN BLT Bone Level Tapered', brand: 'STRAUMANN', country: 'Швейцария', price: 12000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'BLT', 'Тип': 'Tapered' } },
  { id: 33, code: '00033', name: 'STRAUMANN Standard', brand: 'STRAUMANN', country: 'Швейцария', price: 12000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'TL Standard' } },
  { id: 34, code: '00034', name: 'STRAUMANN Standard Plus', brand: 'STRAUMANN', country: 'Швейцария', price: 12000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'TL Standard Plus' } },

  // ANTHOGYR
  { id: 35, code: '00035', name: 'ANTHOGYR Axiom X3', brand: 'ANTHOGYR', country: 'Франция', price: 7500, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'Axiom X3' } },
  { id: 36, code: '00036', name: 'ANTHOGYR Axiom PX', brand: 'ANTHOGYR', country: 'Франция', price: 7000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'Axiom PX' } },
  { id: 37, code: '00037', name: 'ANTHOGYR Axiom REG', brand: 'ANTHOGYR', country: 'Франция', price: 7000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'Axiom REG' } },

  // ASTRATECH
  { id: 38, code: '00038', name: 'ASTRATECH TX', brand: 'ASTRATECH', country: 'Швеция', price: 12000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'TX' } },
  { id: 39, code: '00039', name: 'ASTRATECH TX PROFILE', brand: 'ASTRATECH', country: 'Швеция', price: 12000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'TX Profile' } },

  // SIC
  { id: 40, code: '00040', name: 'SICace', brand: 'SIC', country: 'Швейцария', price: 7000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'ace' } },
  { id: 41, code: '00041', name: 'SICmax', brand: 'SIC', country: 'Швейцария', price: 7000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'max' } },
  { id: 42, code: '00042', name: 'SICtapered', brand: 'SIC', country: 'Швейцария', price: 7000, category_id: 1, category: 'Имплантаты', specs: { 'Размер': 'ALL SIZE', 'Серия': 'tapered' } },

  // =============== КОСТНЫЕ МАТЕРИАЛЫ ===============
  // TITAN B
  { id: 43, code: '00043', article: 'TBV02025', name: 'TITAN B Vial 0.25g 0.2-1.0mm', brand: 'TITAN', country: 'Ю.Корея', price: 3000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '0.5cc', 'Гранулы': '0.2-1.0mm', 'Масса': '0.25g' } },
  { id: 44, code: '00044', article: 'TBV10025', name: 'TITAN B Vial 0.25g 1.0-2.0mm', brand: 'TITAN', country: 'Ю.Корея', price: 3000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '0.75cc', 'Гранулы': '1.0-2.0mm', 'Масса': '0.25g' } },
  { id: 45, code: '00045', article: 'TBV02050', name: 'TITAN B Vial 0.5g 0.2-1.0mm', brand: 'TITAN', country: 'Ю.Корея', price: 4000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '1.0cc', 'Гранулы': '0.2-1.0mm', 'Масса': '0.5g' } },
  { id: 46, code: '00046', article: 'TBV05050', name: 'TITAN B Vial 0.5g 0.5-1.2mm', brand: 'TITAN', country: 'Ю.Корея', price: 4000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '1.25cc', 'Гранулы': '0.5-1.2mm', 'Масса': '0.5g' } },
  { id: 47, code: '00047', article: 'TBV12050', name: 'TITAN B Vial 0.5g 1.2-1.7mm', brand: 'TITAN', country: 'Ю.Корея', price: 4000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '1.75cc', 'Гранулы': '1.2-1.7mm', 'Масса': '0.5g' } },
  { id: 48, code: '00048', article: 'TBV10050', name: 'TITAN B Vial 0.5g 1.0-2.0mm', brand: 'TITAN', country: 'Ю.Корея', price: 4000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '1.5cc', 'Гранулы': '1.0-2.0mm', 'Масса': '0.5g' } },
  { id: 49, code: '00049', article: 'TBV02100', name: 'TITAN B Vial 1.0g 0.2-1.0mm', brand: 'TITAN', country: 'Ю.Корея', price: 6500, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '2.0cc', 'Гранулы': '0.2-1.0mm', 'Масса': '1.0g' } },
  { id: 50, code: '00050', article: 'TBV10100', name: 'TITAN B Vial 1.0g 1.0-2.0mm', brand: 'TITAN', country: 'Ю.Корея', price: 6500, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '3.0cc', 'Гранулы': '1.0-2.0mm', 'Масса': '1.0g' } },
  { id: 51, code: '00051', article: 'TBV02200', name: 'TITAN B Vial 2.0g 0.2-1.0mm', brand: 'TITAN', country: 'Ю.Корея', price: 10000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '4.0cc', 'Гранулы': '0.2-1.0mm', 'Масса': '2.0g' } },
  { id: 52, code: '00052', article: 'TBV10200', name: 'TITAN B Vial 2.0g 1.0-2.0mm', brand: 'TITAN', country: 'Ю.Корея', price: 10000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '6.0cc', 'Гранулы': '1.0-2.0mm', 'Масса': '2.0g' } },

  // STRAUMANN Cerabone
  { id: 53, code: '00053', article: '1510', name: 'STRAUMANN Botiss Cerabone 0.5ml', brand: 'STRAUMANN', country: 'Швейцария', price: 3500, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '0.5ml', 'Гранулы': '0.2-1.0mm' } },
  { id: 54, code: '00054', article: '1520', name: 'STRAUMANN Botiss Cerabone 0.5ml', brand: 'STRAUMANN', country: 'Швейцария', price: 3500, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '0.5ml', 'Гранулы': '1.0-2.0mm' } },
  { id: 55, code: '00055', article: '1511', name: 'STRAUMANN Botiss Cerabone 1.0ml', brand: 'STRAUMANN', country: 'Швейцария', price: 4500, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '1.0ml', 'Гранулы': '0.2-1.0mm' } },
  { id: 56, code: '00056', article: '1521', name: 'STRAUMANN Botiss Cerabone 1.0ml', brand: 'STRAUMANN', country: 'Швейцария', price: 4500, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '1.0ml', 'Гранулы': '1.0-2.0mm' } },
  { id: 57, code: '00057', article: '1512', name: 'STRAUMANN Botiss Cerabone 2.0ml', brand: 'STRAUMANN', country: 'Швейцария', price: 7000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '2.0ml', 'Гранулы': '0.2-1.0mm' } },
  { id: 58, code: '00058', article: '1522', name: 'STRAUMANN Botiss Cerabone 2.0ml', brand: 'STRAUMANN', country: 'Швейцария', price: 7000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '2.0ml', 'Гранулы': '1.0-2.0mm' } },

  // STRAUMANN XenoGraft
  { id: 59, code: '00059', article: 'S1-0210-025', name: 'STRAUMANN XenoGraft 0.25g', brand: 'STRAUMANN', country: 'Швейцария', price: 3000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '0.55cc', 'Гранулы': '0.2-1.0mm', 'Масса': '0.25g' } },
  { id: 60, code: '00060', article: 'S1-1020-025', name: 'STRAUMANN XenoGraft 0.25g', brand: 'STRAUMANN', country: 'Швейцария', price: 3000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '0.68cc', 'Гранулы': '1.0-2.0mm', 'Масса': '0.25g' } },
  { id: 61, code: '00061', article: 'S1-0210-050', name: 'STRAUMANN XenoGraft 0.5g', brand: 'STRAUMANN', country: 'Швейцария', price: 4000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '1.3cc', 'Гранулы': '0.2-1.0mm', 'Масса': '0.5g' } },
  { id: 62, code: '00062', article: 'S1-1020-050', name: 'STRAUMANN XenoGraft 0.5g', brand: 'STRAUMANN', country: 'Швейцария', price: 4000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '1.55cc', 'Гранулы': '1.0-2.0mm', 'Масса': '0.5g' } },
  { id: 63, code: '00063', article: 'S1-0210-100', name: 'STRAUMANN XenoGraft 1.0g', brand: 'STRAUMANN', country: 'Швейцария', price: 6000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '2.4cc', 'Гранулы': '0.2-1.0mm', 'Масса': '1.0g' } },
  { id: 64, code: '00064', article: 'S1-1020-100', name: 'STRAUMANN XenoGraft 1.0g', brand: 'STRAUMANN', country: 'Швейцария', price: 6000, category_id: 3, category: 'Костные материалы', specs: { 'Объём': '2.9cc', 'Гранулы': '1.0-2.0mm', 'Масса': '1.0g' } },

  // =============== МЕМБРАНЫ ===============
  { id: 65, code: '00065', article: 'TB-1520', name: 'TITAN GIDE Bovine 15x20mm', brand: 'TITAN', country: 'Ю.Корея', price: 3000, category_id: 4, category: 'Мембраны', specs: { 'Размер': '15x20mm', 'Тип': 'Bovine' } },
  { id: 66, code: '00066', article: 'TB-2030', name: 'TITAN GIDE Bovine 20x30mm', brand: 'TITAN', country: 'Ю.Корея', price: 5000, category_id: 4, category: 'Мембраны', specs: { 'Размер': '20x30mm', 'Тип': 'Bovine' } },
  { id: 67, code: '00067', name: 'TITAN M Synthetic 15x20mm', brand: 'TITAN', country: 'Ю.Корея', price: 4000, category_id: 4, category: 'Мембраны', specs: { 'Размер': '15x20mm', 'Тип': 'Synthetic' } },

  { id: 68, code: '00068', article: '681520', name: 'STRAUMANN Botiss Jason 15x20mm', brand: 'STRAUMANN', country: 'Швейцария', price: 3000, category_id: 4, category: 'Мембраны', specs: { 'Размер': '15x20mm', 'Тип': 'Pork' } },
  { id: 69, code: '00069', article: '682030', name: 'STRAUMANN Botiss Jason 20x30mm', brand: 'STRAUMANN', country: 'Швейцария', price: 5000, category_id: 4, category: 'Мембраны', specs: { 'Размер': '20x30mm', 'Тип': 'Pork' } },
  { id: 70, code: '00070', article: '683040', name: 'STRAUMANN Botiss Jason 30x40mm', brand: 'STRAUMANN', country: 'Швейцария', price: 6500, category_id: 4, category: 'Мембраны', specs: { 'Размер': '30x40mm', 'Тип': 'Pork' } },

  { id: 71, code: '00071', article: 'ICG1520', name: 'SIGMAGRAFT InterCollagen Guide 15x20mm', brand: 'SIGMAGRAFT', country: 'США', price: 3000, category_id: 4, category: 'Мембраны', specs: { 'Размер': '15x20mm', 'Тип': 'Pork' } },
  { id: 72, code: '00072', article: 'ICG2030', name: 'SIGMAGRAFT InterCollagen Guide 20x30mm', brand: 'SIGMAGRAFT', country: 'США', price: 5000, category_id: 4, category: 'Мембраны', specs: { 'Размер': '20x30mm', 'Тип': 'Pork' } },
  { id: 73, code: '00073', article: 'ICG3040', name: 'SIGMAGRAFT InterCollagen Guide 30x40mm', brand: 'SIGMAGRAFT', country: 'США', price: 6500, category_id: 4, category: 'Мембраны', specs: { 'Размер': '30x40mm', 'Тип': 'Pork' } },

  { id: 74, code: '00074', name: 'MYDERM Allogeneic 10x20mm (0.4-0.8mm)', brand: 'MYDERM', country: 'Россия', price: 3000, category_id: 4, category: 'Мембраны', specs: { 'Размер': '10x20mm', 'Толщина': '0.4-0.8mm', 'Тип': 'Allogeneic' } },
  { id: 75, code: '00075', name: 'MYDERM Allogeneic 15x20mm (0.4-0.8mm)', brand: 'MYDERM', country: 'Россия', price: 3500, category_id: 4, category: 'Мембраны', specs: { 'Размер': '15x20mm', 'Толщина': '0.4-0.8mm', 'Тип': 'Allogeneic' } },
  { id: 76, code: '00076', name: 'MYDERM Allogeneic 15x25mm (0.4-0.8mm)', brand: 'MYDERM', country: 'Россия', price: 4500, category_id: 4, category: 'Мембраны', specs: { 'Размер': '15x25mm', 'Толщина': '0.4-0.8mm', 'Тип': 'Allogeneic' } },

  { id: 77, code: '00077', article: 'PM2025A', name: 'PTFE Membrane 20x25mm', brand: 'PTFE', country: 'Ю.Корея', price: 4000, category_id: 4, category: 'Мембраны', specs: { 'Размер': '20x25mm', 'Тип': 'PTFE' } },
  { id: 78, code: '00078', article: 'PM2530A', name: 'PTFE Membrane 25x30mm', brand: 'PTFE', country: 'Ю.Корея', price: 4300, category_id: 4, category: 'Мембраны', specs: { 'Размер': '25x30mm', 'Тип': 'PTFE' } },
  { id: 79, code: '00079', article: 'PM3040A', name: 'PTFE Membrane 30x40mm', brand: 'PTFE', country: 'Ю.Корея', price: 4500, category_id: 4, category: 'Мембраны', specs: { 'Размер': '30x40mm', 'Тип': 'PTFE' } },

  // =============== РАСХОДНИКИ ===============
  // GBR Pins
  { id: 80, code: '00080', name: 'GBR Pins unstressed 2.0mm', brand: 'GBR', country: 'Ю.Корея', price: 250, category_id: 5, category: 'Расходники', specs: { 'Длина': '2.0mm', 'Тип': 'Unstressed' } },
  { id: 81, code: '00081', name: 'GBR Pins unstressed 2.7mm', brand: 'GBR', country: 'Ю.Корея', price: 250, category_id: 5, category: 'Расходники', specs: { 'Длина': '2.7mm', 'Тип': 'Unstressed' } },
  { id: 82, code: '00082', name: 'GBR FULL KIT (tip + pin holder + 25 pins)', brand: 'GBR', country: 'Ю.Корея', price: 4000, category_id: 5, category: 'Расходники', specs: { 'Комплект': 'Полный', 'Пины': '25 шт' } },
  { id: 83, code: '00083', name: 'GBR Cassette 15 pins', brand: 'GBR', country: 'Ю.Корея', price: 4000, category_id: 5, category: 'Расходники', specs: { 'Пины': '15 шт', 'Тип': 'Кассета' } },
  { id: 84, code: '00084', name: 'GBR Pin holder', brand: 'GBR', country: 'Ю.Корея', price: 4000, category_id: 5, category: 'Расходники', specs: { 'Тип': 'Держатель пинов' } },
  { id: 85, code: '00085', name: 'GBR Tip for installing pins', brand: 'GBR', country: 'Ю.Корея', price: 4000, category_id: 5, category: 'Расходники', specs: { 'Тип': 'Наконечник' } },

  // GBR Screw
  { id: 86, code: '00086', name: 'GBR FULL KIT Screw', brand: 'GBR', country: 'Ю.Корея', price: 4000, category_id: 5, category: 'Расходники', specs: { 'Комплект': 'Полный GBR' } },
  { id: 87, code: '00087', name: 'GBR Screw Ø1.4 Length 3-8mm', brand: 'GBR', country: 'Ю.Корея', price: 400, category_id: 5, category: 'Расходники', specs: { 'Диаметр': 'Ø1.4mm', 'Длина': '3, 4, 6, 8mm' } },
  { id: 88, code: '00088', name: 'GBR Screw Ø1.6 Length 3-10mm', brand: 'GBR', country: 'Ю.Корея', price: 400, category_id: 5, category: 'Расходники', specs: { 'Диаметр': 'Ø1.6mm', 'Длина': '3, 4, 6, 8, 10mm' } },

  // Bone collector
  { id: 89, code: '00089', name: 'Bone Scraper TITAN S', brand: 'TITAN', country: 'Ю.Корея', price: 4000, category_id: 5, category: 'Расходники', specs: { 'Тип': 'Bone Scraper' } },
  { id: 90, code: '00090', name: 'KIT BONE COLLECTOR Ø 3.4-5.2mm', brand: 'TITAN', country: 'Ю.Корея', price: 4000, category_id: 5, category: 'Расходники', specs: { 'Диаметр': 'Ø 3.4, 4.0, 4.2, 5.2mm', 'Комплект': '4 шт' } },
  { id: 91, code: '00091', name: 'Фреза для забора аутокости AUTO-MAX', brand: 'MEGAGEN', country: 'Ю.Корея', price: 4000, category_id: 5, category: 'Расходники', specs: { 'Размер': 'ALL SIZE', 'Тип': 'AUTO-MAX' } },
  { id: 92, code: '00092', name: 'KIT AUTO-MAX Megagen 4pc', brand: 'MEGAGEN', country: 'Ю.Корея', price: 14000, category_id: 5, category: 'Расходники', specs: { 'Диаметр': 'Ø 3.5, 5.0, 6.0, 7.0mm', 'Комплект': '4 шт' } },

  // Suture material
  { id: 93, code: '00093', article: 'C0932132', name: 'B. BRAUN Dafilon 4.0 45cm DS16', brand: 'B. BRAUN', country: 'Германия', price: 4500, category_id: 5, category: 'Расходники', specs: { 'Размер': '4.0', 'Длина': '45cm', 'Игла': 'DS16' } },
  { id: 94, code: '00094', article: 'C0932124', name: 'B. BRAUN Dafilon 5.0 45cm DS16', brand: 'B. BRAUN', country: 'Германия', price: 5500, category_id: 5, category: 'Расходники', specs: { 'Размер': '5.0', 'Длина': '45cm', 'Игла': 'DS16' } },
  { id: 95, code: '00095', article: 'C0932060', name: 'B. BRAUN Dafilon 6.0 45cm DS12', brand: 'B. BRAUN', country: 'Германия', price: 6000, category_id: 5, category: 'Расходники', specs: { 'Размер': '6.0', 'Длина': '45cm', 'Игла': 'DS12' } },
  { id: 96, code: '00096', article: 'C0932116', name: 'B. BRAUN Dafilon 6.0 45cm DS16', brand: 'B. BRAUN', country: 'Германия', price: 6000, category_id: 5, category: 'Расходники', specs: { 'Размер': '6.0', 'Длина': '45cm', 'Игла': 'DS16' } },

  // Cement & Bond
  { id: 97, code: '00097', name: 'GC Fuji I 35g Powder + 20ml Liquid', brand: 'GC', country: 'Япония', price: 3000, category_id: 5, category: 'Расходники', specs: { 'Порошок': '35g', 'Жидкость': '20ml', 'Тип': 'Цемент' } },
  { id: 98, code: '00098', name: '3M Single Bond Universal 5ml', brand: '3M', country: 'США', price: 2000, category_id: 5, category: 'Расходники', specs: { 'Объём': '5ml', 'Тип': 'Universal Bond' } },
  { id: 99, code: '00099', name: '3M Adper Single Bond 2 6ml', brand: '3M', country: 'США', price: 1500, category_id: 5, category: 'Расходники', specs: { 'Объём': '6ml', 'Тип': 'Bond' } },

  // Irrigation
  { id: 100, code: '00100', name: 'Irrigation systems (tubes)', brand: 'Generic', country: 'Ю.Корея', price: 250, category_id: 5, category: 'Расходники', specs: { 'Тип': 'Ирригационная система' } },
]

// Получить товары по категории
export const getProductsByCategory = (categoryId) => {
  return products.filter(p => p.category_id === categoryId)
}

// Получить популярные товары (первые N товаров из разных категорий)
export const getPopularProducts = (limit = 10) => {
  const result = []
  const categories = [1, 3, 4, 5] // Имплантаты, Костные, Мембраны, Расходники

  for (const catId of categories) {
    const catProducts = products.filter(p => p.category_id === catId)
    result.push(...catProducts.slice(0, Math.ceil(limit / categories.length)))
  }

  return result.slice(0, limit)
}

export default products
