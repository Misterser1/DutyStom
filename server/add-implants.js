import { dbRun, dbGet } from './database/init.js'

const implants = [
  // INNO (South Korea)
  { name: 'INNO SUBMERGED NARROW', brand: 'INNO', country: 'South Korea', image: '/images/products/inno-submerged-narrow.png' },
  { name: 'INNO SUBMERGED SHORT', brand: 'INNO', country: 'South Korea', image: '/images/products/inno-submerged-short.png' },
  { name: 'INNO SUBMERGED WITH DRIVER', brand: 'INNO', country: 'South Korea', image: '/images/products/inno-submerged-driver.png' },
  { name: 'INNO SUBMERGED', brand: 'INNO', country: 'South Korea', image: '/images/products/inno-submerged.png' },
  { name: 'INNO SUBMERGED NARROW WITH DRIVER', brand: 'INNO', country: 'South Korea', image: '/images/products/inno-submerged-narrow-driver.png' },

  // NEOBITECH (South Korea)
  { name: 'NEOBITECH IS-II SHORT\n4 sizes', brand: 'NEOBITECH', country: 'South Korea', image: '/images/products/neobitech-is2-short.png' },
  { name: 'NEOBITECH IS-II', brand: 'NEOBITECH', country: 'South Korea', image: '/images/products/neobitech-is2.png' },
  { name: 'NEOBITECH IS-III', brand: 'NEOBITECH', country: 'South Korea', image: '/images/products/neobitech-is3.png' },

  // Ostem (South Korea)
  { name: 'Ostem без адаптера', brand: 'Osstem', country: 'South Korea', image: '/images/products/ostem-bez-adaptera.png' },
  { name: 'Ostem с адаптером', brand: 'Osstem', country: 'South Korea', image: '/images/products/ostem-s-adapterom.png' },

  // SIC (Switzerland)
  { name: 'SICace', brand: 'SIC', country: 'Switzerland', image: '/images/products/sic-ace.png' },
  { name: 'SICtapered', brand: 'SIC', country: 'Switzerland', image: '/images/products/sic-tapered.png' },
  { name: 'SICmax', brand: 'SIC', country: 'Switzerland', image: '/images/products/sic-max.png' },

  // SNUCONE (South Korea)
  { name: 'SNUCONE AF+I', brand: 'SNUCONE', country: 'South Korea', image: '/images/products/snucone-af-i.png' },
  { name: 'SNUCONE AF+II', brand: 'SNUCONE', country: 'South Korea', image: '/images/products/snucone-af-ii.png' },

  // STRAUMANN (Switzerland)
  { name: 'STRAUMANN BL\nBone Level', brand: 'Straumann', country: 'Switzerland', image: '/images/products/straumann-bl.png' },
  { name: 'STRAUMANN BLT\nBone Level Tapered', brand: 'Straumann', country: 'Switzerland', image: '/images/products/straumann-blt.png' },
  { name: 'STRAUMANN Standard Plus', brand: 'Straumann', country: 'Switzerland', image: '/images/products/straumann-standard-plus.png' },
  { name: 'STRAUMANN Standard', brand: 'Straumann', country: 'Switzerland', image: '/images/products/straumann-standard.png' },

  // SIMPLELINE II (South Korea - DENTIUM)
  { name: 'SIMPLELINE II', brand: 'Dentium', country: 'South Korea', image: '/images/products/simpleline-ii.png' },
]

async function addImplants() {
  console.log('Adding', implants.length, 'new implants...')

  for (const implant of implants) {
    try {
      dbRun(`
        INSERT INTO products (name, brand, country, category_id, price, price_usd, in_stock, image_url)
        VALUES (?, ?, ?, 1, 5500, 55, 1, ?)
      `, [implant.name, implant.brand, implant.country, implant.image])
      console.log('Added:', implant.name)
    } catch (err) {
      console.error('Error adding', implant.name, err.message)
    }
  }

  console.log('Done!')
}

addImplants()
