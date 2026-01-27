const initSqlJs = require('sql.js')
const fs = require('fs')
const path = require('path')

async function updateNames() {
  const SQL = await initSqlJs()
  const dbPath = path.join(__dirname, 'database', 'db.sqlite')
  const fileBuffer = fs.readFileSync(dbPath)
  const db = new SQL.Database(fileBuffer)

  // INNO products - EXACT format from user
  const innoUpdates = [
    { id: 353, name: 'INNO SUBMERGED No-Mount and there is Cover Screw' },
    { id: 354, name: 'INNO SUBMERGED-SHORT Pre-Mount and Cover Screw' },
    { id: 355, name: 'INNO SUBMERGED NARROW No-Mount and there is Cover Screw' },
    { id: 390, name: 'INNO SUBMERGED Pre-Mount and Cover Screw' },
    { id: 391, name: 'INNO SUBMERGED NARROW Pre-Mount and Cover Screw' }
  ]

  // OSSTEM products - remove Russian, add English
  const osstemUpdates = [
    // с адаптером → Pre-Mount and Cover Screw
    { id: 364, name: 'OSSTEM TS-III BA Pre-Mount and Cover Screw' },
    { id: 366, name: 'OSSTEM TS-III CA Pre-Mount and Cover Screw' },
    { id: 367, name: 'OSSTEM TS-III SA Pre-Mount and Cover Screw' },
    { id: 365, name: 'OSSTEM TS-III SOI Pre-Mount and Cover Screw' },
    // без адаптера → No-Mount and no Cover Screw
    { id: 383, name: 'OSSTEM TS-III BA No-Mount and no Cover Screw' },
    { id: 385, name: 'OSSTEM TS-III CA No-Mount and no Cover Screw' },
    { id: 386, name: 'OSSTEM TS-III SA No-Mount and no Cover Screw' },
    { id: 384, name: 'OSSTEM TS-III SOI No-Mount and no Cover Screw' }
  ]

  const allUpdates = [...innoUpdates, ...osstemUpdates]

  console.log('Updating product names...\n')

  for (const update of allUpdates) {
    // Get current name
    const current = db.exec(`SELECT name FROM products WHERE id = ${update.id}`)
    const currentName = current[0]?.values[0]?.[0] || 'NOT FOUND'

    // Update
    db.run('UPDATE products SET name = ? WHERE id = ?', [update.name, update.id])

    console.log(`ID ${update.id}:`)
    console.log(`  OLD: ${currentName}`)
    console.log(`  NEW: ${update.name}`)
    console.log('')
  }

  // Save database
  const data = db.export()
  fs.writeFileSync(dbPath, Buffer.from(data))
  console.log('Database saved!')

  db.close()
}

updateNames().catch(console.error)
