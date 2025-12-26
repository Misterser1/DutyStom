/**
 * Скрипт для заполнения характеристик товаров через API
 */

const API_BASE = 'http://localhost:5001/api'

// Реальные характеристики по названиям товаров
const PRODUCT_SPECS = {
  // OSSTEM имплантаты
  'OSSTEM TS-III': {
    description: 'Имплантат OSSTEM TS-III с внутренним коническим соединением 11°. SA-поверхность. Подходит для всех типов кости.',
    specs: {
      brand: 'OSSTEM',
      country: 'Корея',
      connection: 'Внутренний конус 11°',
      surface: 'SA (пескоструйная + кислотная)',
      diameters: '3.5, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      material: 'Титан Grade 4'
    }
  },
  'OSSTEM TS-IV': {
    description: 'Имплантат OSSTEM TS-IV с апикальной резьбой для мягкой кости. SA-поверхность.',
    specs: {
      brand: 'OSSTEM',
      country: 'Корея',
      connection: 'Внутренний конус 11°',
      surface: 'SA',
      diameters: '3.5, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      material: 'Титан Grade 4',
      feature: 'Для мягкой кости D3-D4'
    }
  },

  // STRAUMANN имплантаты
  'STRAUMANN BL Bone Level TITAN SLA': {
    description: 'Премиум имплантат Straumann Bone Level с SLA-поверхностью. CrossFit соединение.',
    specs: {
      brand: 'Straumann',
      country: 'Швейцария',
      connection: 'CrossFit',
      surface: 'SLA',
      diameters: '3.3, 4.1, 4.8 мм',
      lengths: '6, 8, 10, 12, 14 мм',
      material: 'Титан Roxolid'
    }
  },
  'STRAUMANN TL Tissue Level TITAN SLA': {
    description: 'Имплантат Straumann Tissue Level с полированной шейкой. SLA-поверхность.',
    specs: {
      brand: 'Straumann',
      country: 'Швейцария',
      connection: 'Synth Octa',
      surface: 'SLA',
      diameters: '3.3, 4.1, 4.8 мм',
      lengths: '6, 8, 10, 12, 14 мм',
      material: 'Титан Grade 4'
    }
  },

  // DIO имплантаты
  'DIO UF II': {
    description: 'Имплантат DIO UF II с двойной резьбой. RBM-поверхность.',
    specs: {
      brand: 'DIO',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'RBM',
      diameters: '3.4, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      material: 'Титан Grade 4'
    }
  },
  'DIO EXTRA WIDE': {
    description: 'Широкий имплантат DIO Extra Wide для лунок после удаления.',
    specs: {
      brand: 'DIO',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'RBM',
      diameters: '5.5, 6.0, 7.0 мм',
      lengths: '7, 8.5, 10, 11.5 мм',
      feature: 'Для немедленной имплантации'
    }
  },
  'DIO SM': {
    description: 'Имплантат DIO SM с минимальным диаметром для узких промежутков.',
    specs: {
      brand: 'DIO',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'RBM',
      diameters: '3.0, 3.25 мм',
      lengths: '10, 11.5, 13, 15 мм',
      feature: 'Узкий профиль'
    }
  },

  // MEGAGEN имплантаты
  'MEGAGEN BLUEDIAMOND REGULAR THREAD': {
    description: 'Имплантат MEGAGEN BlueDiamond с обычной резьбой. Xpeed поверхность с ионами кальция.',
    specs: {
      brand: 'MEGAGEN',
      country: 'Корея',
      connection: 'Конус 10°',
      surface: 'Xpeed (ионы кальция)',
      diameters: '3.5, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      material: 'Титан Grade 4'
    }
  },
  'MEGAGEN BLUEDIAMOND DEEP THREAD': {
    description: 'Имплантат MEGAGEN BlueDiamond с глубокой резьбой для мягкой кости.',
    specs: {
      brand: 'MEGAGEN',
      country: 'Корея',
      connection: 'Конус 10°',
      surface: 'Xpeed',
      diameters: '3.5, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      feature: 'Глубокая резьба'
    }
  },
  'MEGAGEN ANYONE REGULAR THREAD': {
    description: 'Универсальный имплантат MEGAGEN AnyOne с обычной резьбой.',
    specs: {
      brand: 'MEGAGEN',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'Xpeed',
      diameters: '3.5, 4.0, 4.5, 5.0, 6.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      material: 'Титан Grade 4'
    }
  },
  'MEGAGEN ANYONE DEEP THREAD': {
    description: 'Имплантат MEGAGEN AnyOne с глубокой резьбой.',
    specs: {
      brand: 'MEGAGEN',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'Xpeed',
      diameters: '3.5, 4.0, 4.5, 5.0, 6.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13, 15 мм',
      feature: 'Глубокая резьба'
    }
  },

  // NORIS MEDICAL имплантаты
  'NORIS MEDICAL TUFF': {
    description: 'Имплантат Noris Medical TUFF с агрессивной резьбой для отличной первичной стабильности.',
    specs: {
      brand: 'Noris Medical',
      country: 'Израиль',
      connection: 'Внутренний шестигранник',
      surface: 'SLA',
      diameters: '3.3, 3.75, 4.2, 5.0 мм',
      lengths: '8, 10, 11.5, 13, 16 мм',
      material: 'Титан Grade 5'
    }
  },
  'NORIS MEDICAL ONIX': {
    description: 'Имплантат Noris Medical ONIX с коническим дизайном.',
    specs: {
      brand: 'Noris Medical',
      country: 'Израиль',
      connection: 'Конический',
      surface: 'SLA',
      diameters: '3.3, 3.75, 4.2, 5.0 мм',
      lengths: '8, 10, 11.5, 13, 16 мм',
      material: 'Титан Grade 5'
    }
  },

  // AnyRidge
  'MEGAGEN ANYRIDGE': {
    description: 'Премиум имплантат MEGAGEN AnyRidge с уникальной резьбой Knife-Thread.',
    specs: {
      brand: 'MEGAGEN',
      country: 'Корея',
      connection: 'Конус 10°',
      surface: 'Xpeed',
      diameters: '3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 7.0 мм',
      lengths: '5, 7, 8.5, 10, 11.5, 13, 15 мм',
      feature: 'Knife-Thread резьба'
    }
  },

  // IMPLANTIUM (Dentium)
  'DENTIUM IMPLANTIUM': {
    description: 'Имплантат Dentium Implantium с двойной резьбой. SLA-поверхность.',
    specs: {
      brand: 'Dentium',
      country: 'Корея',
      connection: 'Внутренний шестигранник',
      surface: 'SLA',
      diameters: '3.4, 3.8, 4.3, 4.8 мм',
      lengths: '7, 8, 10, 12, 14 мм',
      material: 'Титан Grade 4'
    }
  },
  'DENTIUM SUPERLINE': {
    description: 'Имплантат Dentium SuperLine с S.L.A. поверхностью.',
    specs: {
      brand: 'Dentium',
      country: 'Корея',
      connection: 'Внутренний конус',
      surface: 'S.L.A.',
      diameters: '3.6, 4.0, 4.5, 5.0 мм',
      lengths: '7, 8.5, 10, 11.5, 13 мм',
      material: 'Титан Grade 4'
    }
  },

  // ALPHA-BIO
  'ALPHA-BIO SPI': {
    description: 'Имплантат Alpha-Bio SPI спирального дизайна.',
    specs: {
      brand: 'Alpha-Bio',
      country: 'Израиль',
      connection: 'Внутренний шестигранник',
      surface: 'NanoTec',
      diameters: '3.2, 3.75, 4.2, 5.0, 6.0 мм',
      lengths: '6, 8, 10, 11.5, 13, 16 мм',
      material: 'Титан Grade 5'
    }
  },
  'ALPHA-BIO ICE': {
    description: 'Имплантат Alpha-Bio ICE с внутренним коническим соединением.',
    specs: {
      brand: 'Alpha-Bio',
      country: 'Израиль',
      connection: 'Внутренний конус',
      surface: 'NanoTec',
      diameters: '3.2, 3.75, 4.2, 5.0, 6.0 мм',
      lengths: '6, 8, 10, 11.5, 13, 16 мм',
      material: 'Титан Grade 5'
    }
  },

  // BICON
  'BICON SHORT': {
    description: 'Короткий имплантат Bicon с уникальным дизайном без винтовой фиксации.',
    specs: {
      brand: 'Bicon',
      country: 'США',
      connection: 'Конус Морзе (locking taper)',
      surface: 'HA (гидроксиапатит)',
      diameters: '4.0, 4.5, 5.0, 6.0 мм',
      lengths: '5, 6, 8, 11 мм',
      feature: 'Без винта, конус Морзе'
    }
  },

  // ZIMMER
  'ZIMMER TSV': {
    description: 'Имплантат Zimmer TSV (Tapered Screw-Vent) с MTX поверхностью.',
    specs: {
      brand: 'Zimmer',
      country: 'США',
      connection: 'Внутренний шестигранник',
      surface: 'MTX (Microtextured)',
      diameters: '3.7, 4.1, 4.7 мм',
      lengths: '8, 10, 11.5, 13, 16 мм',
      material: 'Титан'
    }
  }
}

// Характеристики по бренду (для товаров без точного совпадения)
const BRAND_DEFAULTS = {
  'OSSTEM': {
    country: 'Корея',
    connection: 'Внутренний конус 11°',
    surface: 'SA',
    material: 'Титан Grade 4'
  },
  'STRAUMANN': {
    country: 'Швейцария',
    connection: 'CrossFit / Synth Octa',
    surface: 'SLA',
    material: 'Титан Roxolid'
  },
  'DIO': {
    country: 'Корея',
    connection: 'Внутренний шестигранник',
    surface: 'RBM',
    material: 'Титан Grade 4'
  },
  'MEGAGEN': {
    country: 'Корея',
    connection: 'Конус 10°',
    surface: 'Xpeed (ионы кальция)',
    material: 'Титан Grade 4'
  },
  'DENTIUM': {
    country: 'Корея',
    connection: 'Внутренний шестигранник',
    surface: 'SLA',
    material: 'Титан Grade 4'
  },
  'ALPHA-BIO': {
    country: 'Израиль',
    connection: 'Внутренний шестигранник',
    surface: 'NanoTec',
    material: 'Титан Grade 5'
  },
  'NORIS': {
    country: 'Израиль',
    connection: 'Внутренний шестигранник',
    surface: 'SLA',
    material: 'Титан Grade 5'
  }
}

async function main() {
  try {
    // Получаем все товары
    const response = await fetch(`${API_BASE}/products`)
    const products = await response.json()
    console.log(`Всего товаров: ${products.length}`)

    const updates = []

    for (const product of products) {
      const name = product.name?.toUpperCase() || ''
      const brand = product.brand?.toUpperCase() || ''

      // Ищем точное совпадение
      let specData = null
      for (const [key, value] of Object.entries(PRODUCT_SPECS)) {
        if (name.includes(key.toUpperCase())) {
          specData = value
          break
        }
      }

      // Если нет точного совпадения, используем дефолты по бренду
      if (!specData && brand) {
        const brandDefaults = BRAND_DEFAULTS[brand]
        if (brandDefaults) {
          specData = {
            description: `${product.brand} ${product.name}`,
            specs: {
              brand: product.brand,
              ...brandDefaults
            }
          }
        }
      }

      if (specData) {
        updates.push({
          id: product.id,
          description: specData.description,
          specs: JSON.stringify(specData.specs)
        })
      }
    }

    console.log(`Товаров для обновления: ${updates.length}`)

    if (updates.length > 0) {
      // Массовое обновление
      const updateResponse = await fetch(`${API_BASE}/products/bulk-update-specs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updates })
      })
      const result = await updateResponse.json()
      console.log('Результат:', result)
    }

  } catch (error) {
    console.error('Ошибка:', error)
  }
}

main()
