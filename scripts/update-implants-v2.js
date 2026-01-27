import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import initSqlJs from 'sql.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_PATH = path.join(__dirname, '..', 'server', 'database', 'db.sqlite')

// Категории имплантов
const IMPLANT_CATEGORIES = [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87]

// Сопоставление товаров с изображениями
const productImageMap = {
  // DIO (category 75) - используем существующие PNG
  341: 'dio-internal.png',           // DIO INTERNAL
  343: 'dio-protem-ball.png',        // DIO PROTEM MINI BALL TYPE
  342: 'dio-protem-pos.png',         // DIO PROTEM MINI POST TYPE
  339: 'dio-short-hsa.png',          // DIO SHORT
  338: 'dio-uf-ii-hsa.png',          // DIO UF II
  340: 'dio-ufi.png',                // DIO UF III

  // DENTIUM (category 76)
  344: 'dentium_superline_2_fxs.jpg',  // DENTIUM SUPERLINE II FXS
  345: 'dentium_simpleline_2.jpg',     // SIMPLELINE II

  // MEGAGEN (category 77)
  349: 'megagen_anyone_internal_deep_thread.jpg',     // MEGAGEN ANYONE INTERNAL DEEP THREAD
  348: 'megagen_anyone_internal_regular_thread.jpg',  // MEGAGEN ANYONE INTERNAL REGULAR THREAD
  352: 'megagen_anyone_onestage_deep_thread.jpg',     // MEGAGEN ANYONE ONESTAGE DEEP THREAD
  351: 'megagen_anyone_onestage_regular_thread.jpg',  // MEGAGEN ANYONE ONESTAGE REGULAR THREAD
  350: 'megagen_anyone_special_short.jpg',            // MEGAGEN ANYONE SPECIAL SHORT
  347: 'megagen_bluediamond_deep_thread.jpg',         // MEGAGEN BLUEDIAMOND DEEP THREAD
  346: 'megagen_bluediamond_regular_thread.jpg',      // MEGAGEN BLUEDIAMOND REGULAR THREAD

  // INNO (category 78)
  353: 'inno_submerged_no_mount.jpg',           // INNO SUBMERGED
  355: 'inno_submerged_narrow_no_mount.jpg',    // INNO SUBMERGED NARROW
  391: 'inno_submerged_narrow_pre_mount.jpg',   // INNO SUBMERGED NARROW WITH DRIVER
  354: 'inno_submerged_short_no_mount.jpg',     // INNO SUBMERGED SHORT
  390: 'inno_submerged_pre_mount.jpg',          // INNO SUBMERGED WITH DRIVER

  // SNUCONE (category 79)
  356: 'snucone_af1.jpg',   // SNUCONE AF+I
  357: 'snucone_af2.jpg',   // SNUCONE AF+II

  // NEOBITECH (category 80)
  358: 'neobiotech_is2active.jpg',        // NEOBITECH IS-II
  359: 'neobiotech_is2active_short.jpg',  // NEOBITECH IS-II SHORT
  360: 'neobiotech_is3active.jpg',        // NEOBITECH IS-III

  // DENTIS (category 81)
  363: 'dentis_oneq_sl.jpg',     // DENTIS ONEQ-SL
  361: 'dentis_sq_regular.jpg',  // DENTIS SQ
  362: 'dentis_sq_short.jpg',    // DENTIS SQ SHORT

  // OSSTEM TS-III (category 82)
  383: 'ossstem_ts3_no_mount.jpg',   // OSSTEM TS-III BA (без адаптера)
  364: 'ossstem_ts3_pre_mount.jpg',  // OSSTEM TS-III BA (с адаптером)
  385: 'ossstem_ts3_no_mount.jpg',   // OSSTEM TS-III CA (без адаптера)
  366: 'ossstem_ts3_pre_mount.jpg',  // OSSTEM TS-III CA (с адаптером)
  386: 'ossstem_ts3_no_mount.jpg',   // OSSTEM TS-III SA (без адаптера)
  367: 'ossstem_ts3_pre_mount.jpg',  // OSSTEM TS-III SA (с адаптером)
  384: 'ossstem_ts3_no_mount.jpg',   // OSSTEM TS-III SOI (без адаптера)
  365: 'ossstem_ts3_pre_mount.jpg',  // OSSTEM TS-III SOI (с адаптером)

  // OSSTEM TS-IV (category 83)
  387: 'ossstem_ts4_no_mount.jpg',   // OSSTEM TS-IV BA (без адаптера)
  368: 'ossstem_ts4_pre_mount.jpg',  // OSSTEM TS-IV BA (с адаптером)
  388: 'ossstem_ts4_no_mount.jpg',   // OSSTEM TS-IV CA (без адаптера)
  369: 'ossstem_ts4_pre_mount.jpg',  // OSSTEM TS-IV CA (с адаптером)
  389: 'ossstem_ts4_no_mount.jpg',   // OSSTEM TS-IV SA (без адаптера)
  370: 'ossstem_ts4_pre_mount.jpg',  // OSSTEM TS-IV SA (с адаптером)

  // STRAUMANN (category 84)
  371: 'straumann_bone_level.jpg',              // STRAUMANN BL Bone Level
  372: 'straumann_bone_level_tapered.jpg',      // STRAUMANN BLT Bone Level Tapered
  373: 'straumann_tissue_level_standart.jpg',   // STRAUMANN Standard
  374: 'straumann_tissue_level_standart_plus.jpg', // STRAUMANN Standard Plus

  // ANTHOGYR (category 85)
  376: 'anthogyr_axiom_px.jpg',   // ANTHOGYR Axiom PX
  377: 'anthogyr_axiom_reg.jpg',  // ANTHOGYR Axiom REG
  375: 'anthogyr_axiom_x3.jpg',   // ANTHOGYR Axiom X3

  // ASTRATECH (category 86)
  378: 'astratech_osseospeed_tx.jpg',          // ASTRATECH TX
  379: 'astratech_osseospeed_tx_profile.jpg',  // ASTRATECH TX PROFILE

  // SIC (category 87)
  380: 'sic_ace.jpg',      // SICace
  381: 'sic_max.jpg',      // SICmax
  382: 'sic_tapered.jpg',  // SICtapered
}

async function main() {
  console.log('=== Обновление изображений имплантатов ===\n')

  const SQL = await initSqlJs()
  const dbBuffer = fs.readFileSync(DB_PATH)
  const db = new SQL.Database(dbBuffer)

  // Backup
  const backupPath = path.join(__dirname, '..', 'data', `implants-backup-${Date.now()}.json`)

  // Получить текущие данные
  const currentData = db.exec(`
    SELECT id, name, image_url FROM products
    WHERE category_id IN (${IMPLANT_CATEGORIES.join(',')})
  `)

  if (currentData[0]) {
    const backup = currentData[0].values.map(row => ({
      id: row[0],
      name: row[1],
      oldImage: row[2]
    }))
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2))
    console.log(`Backup создан: ${backupPath}\n`)
  }

  // Обновить image_url
  let updated = 0
  let skipped = 0

  console.log('Обновление:\n')

  for (const [productId, imageFile] of Object.entries(productImageMap)) {
    const id = parseInt(productId)
    const imageUrl = `/images/products/${imageFile}`

    // Получить текущее название
    const nameResult = db.exec(`SELECT name FROM products WHERE id = ${id}`)
    const name = nameResult[0] ? nameResult[0].values[0][0] : 'Unknown'

    // Проверить что файл существует
    const filePath = path.join(__dirname, '..', 'client', 'public', 'images', 'products', imageFile)
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  [${id}] ${name} - файл не найден: ${imageFile}`)
      skipped++
      continue
    }

    // Обновить БД
    db.run('UPDATE products SET image_url = ? WHERE id = ?', [imageUrl, id])
    console.log(`✅ [${id}] ${name} → ${imageFile}`)
    updated++
  }

  // Сохранить БД
  const updatedDbBuffer = db.export()
  fs.writeFileSync(DB_PATH, updatedDbBuffer)

  console.log(`\n=== Результат ===`)
  console.log(`Обновлено: ${updated}`)
  console.log(`Пропущено: ${skipped}`)
  console.log(`Backup: ${backupPath}`)

  db.close()
}

main().catch(console.error)
