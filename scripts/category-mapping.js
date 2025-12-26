/**
 * Иерархия категорий для импорта из Excel
 *
 * Структура: Основная категория → список подкатегорий из Excel
 */

export const CATEGORY_HIERARCHY = {
  // 1. Имплантаты (48 товаров)
  'Implant': ['Implant'],

  // 2. Костные материалы (95 товаров)
  'Bone': [
    'Bone',
    'Bone collector'
  ],

  // 3. Мембраны (24 товара)
  'Membrane': ['Membrane'],

  // 4. Инструменты (43 товара)
  'TOOLS': ['TOOLS'],

  // 5. Протетика (69 товаров)
  'Prosthetics': [
    'Prosthetics replica',
    'DIO ORIGINAL Prosthetics',
    'DIO DIGITAL ORIGINAL Prosthetics',
    'BLUEDIAMOND MEGAGEN ORIGINAL Prosthetics',
    'BLUEDIAMOND MEGAGEN DIGITAL ORIGINAL Prosthetics'
  ],

  // 6. Наборы (14 товаров)
  'Kits': [
    'DIO ORIGINAL Kit',
    'DIO NAVI ORIGINAL Kit',
    'DIO SURGICAL ORIGINAL Kit',
    'BLUEDIAMOND MEGAGEN SURGICAL ORIGINAL Kit'
  ],

  // 7. Компоненты (13 товаров)
  'Components': [
    'DIO ORIGINAL Cover Screw',
    'DIO ORIGINAL Driver',
    'DIO ORIGINAL Fixture Driver',
    'DIO ORIGINAL Screwdriver',
    'DIO DIGITAL ORIGINAL Screwdriver',
    'DIO ORIGINAL Bone Profile Drill',
    'Straumann RC Cover Screw replica',
    'Screwdriver 1.2 replica',
    'Screwdriver all systems replica'
  ],

  // 8. GBR система (11 товаров)
  'GBR': [
    'GBR Pins',
    'GBR Screw'
  ],

  // 9. Материалы (7 товаров)
  'Materials': [
    'Suture material',
    'Bond',
    'Cement'
  ],

  // 10. Системы (1 товар)
  'Systems': [
    'Irrigation systems'
  ]
}

/**
 * Получить родительскую категорию для детальной категории из Excel
 * @param {string} detailedCategory - Название категории из Excel (например, "DIO ORIGINAL Kit")
 * @returns {string|null} - Название родительской категории или null
 */
export function getParentCategory(detailedCategory) {
  for (const [parent, children] of Object.entries(CATEGORY_HIERARCHY)) {
    if (children.includes(detailedCategory)) {
      return parent
    }
  }
  return null
}

/**
 * Получить список всех основных (родительских) категорий
 * @returns {string[]} - Массив названий основных категорий
 */
export function getMainCategories() {
  return Object.keys(CATEGORY_HIERARCHY)
}

/**
 * Получить подкатегории для основной категории
 * @param {string} mainCategory - Название основной категории
 * @returns {string[]} - Массив подкатегорий
 */
export function getSubcategories(mainCategory) {
  return CATEGORY_HIERARCHY[mainCategory] || []
}
