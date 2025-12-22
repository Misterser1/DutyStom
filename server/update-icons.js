import { initDatabase, dbRun } from './database/init.js'

async function updateIcons() {
  try {
    await initDatabase()

    const icons = [
      { slug: 'implants', path: '/images/category-icons/implants-icon.png' },
      { slug: 'components', path: '/images/category-icons/components-icon.png' },
      { slug: 'bone', path: '/images/category-icons/bone-materials-icon.png' },
      { slug: 'membrane', path: '/images/category-icons/membranes-icon.png' },
      { slug: 'supplies', path: '/images/category-icons/supplies-icon.png' }
    ]

    for (const icon of icons) {
      dbRun('UPDATE categories SET icon_url = ? WHERE slug = ?', [icon.path, icon.slug])
      console.log(`Updated ${icon.slug}: ${icon.path}`)
    }

    console.log('✅ All category icon URLs updated successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating icons:', error)
    process.exit(1)
  }
}

updateIcons()
