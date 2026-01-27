// Конфигурация паттернов для сопоставления названий продуктов с файлами изображений
// 52 изображения для 12 брендов (DIO исключены)

const brandPatterns = {
  'ANTHOGYR': [
    { match: /axiom\s*px/i, image: 'anthogyr_axiom_px.jpg' },
    { match: /axiom\s*reg/i, image: 'anthogyr_axiom_reg.jpg' },
    { match: /axiom\s*x3/i, image: 'anthogyr_axiom_x3.jpg' }
  ],

  'ASTRATECH': [
    { match: /tx\s*profile/i, image: 'astratech_osseospeed_tx_profile.jpg' },
    { match: /osseospeed.*tx(?!\s*profile)/i, image: 'astratech_osseospeed_tx.jpg' },
    { match: /tx(?!\s*profile)/i, image: 'astratech_osseospeed_tx.jpg' } // fallback
  ],

  'DENTIS': [
    { match: /axel.*regular/i, image: 'dentis_axel_regular.jpg' },
    { match: /axel.*xread/i, image: 'dentis_axel_xread.jpg' },
    { match: /oneq.*narrow/i, image: 'dentis_oneq_narrow.jpg' },
    { match: /oneq.*regular/i, image: 'dentis_oneq_regular.jpg' },
    { match: /oneq.*sl/i, image: 'dentis_oneq_sl.jpg' },
    { match: /sq.*narrow/i, image: 'dentis_sq_narrow.jpg' },
    { match: /sq.*regular/i, image: 'dentis_sq_regular.jpg' },
    { match: /sq.*short/i, image: 'dentis_sq_short.jpg' },
    { match: /sq.*wide/i, image: 'dentis_sq_wide.jpg' }
  ],

  'DENTIUM': [
    { match: /simpleline.*2/i, image: 'dentium_simpleline_2.jpg' },
    { match: /simpleline/i, image: 'dentium_simpleline_2.jpg' }, // fallback
    { match: /superline.*2.*fxs/i, image: 'dentium_superline_2_fxs.jpg' },
    { match: /superline.*2.*short/i, image: 'dentium_superline_2_short.jpg' },
    { match: /superline.*fxs/i, image: 'dentium_superline_2_fxs.jpg' } // fallback
  ],

  'INNO': [
    { match: /submerged.*narrow.*no.*mount/i, image: 'inno_submerged_narrow_no_mount.jpg' },
    { match: /submerged.*narrow.*pre.*mount/i, image: 'inno_submerged_narrow_pre_mount.jpg' },
    { match: /submerged.*short.*no.*mount/i, image: 'inno_submerged_short_no_mount.jpg' },
    { match: /submerged.*short.*pre.*mount/i, image: 'inno_submerged_short_pre_mount.jpg' },
    { match: /submerged.*no.*mount/i, image: 'inno_submerged_no_mount.jpg' },
    { match: /submerged.*pre.*mount/i, image: 'inno_submerged_pre_mount.jpg' }
  ],

  'MEGAGEN': [
    { match: /anyone.*internal.*deep/i, image: 'megagen_anyone_internal_deep_thread.jpg' },
    { match: /anyone.*internal.*regular/i, image: 'megagen_anyone_internal_regular_thread.jpg' },
    { match: /anyone.*onestage.*deep/i, image: 'megagen_anyone_onestage_deep_thread.jpg' },
    { match: /anyone.*onestage.*regular/i, image: 'megagen_anyone_onestage_regular_thread.jpg' },
    { match: /anyone.*special.*short/i, image: 'megagen_anyone_special_short.jpg' },
    { match: /anyone.*short/i, image: 'megagen_anyone_special_short.jpg' }, // fallback
    { match: /bluediamond.*deep/i, image: 'megagen_bluediamond_deep_thread.jpg' },
    { match: /bluediamond.*regular/i, image: 'megagen_bluediamond_regular_thread.jpg' },
    { match: /blue.*diamond.*deep/i, image: 'megagen_bluediamond_deep_thread.jpg' },
    { match: /blue.*diamond.*regular/i, image: 'megagen_bluediamond_regular_thread.jpg' }
  ],

  'NEOBIOTECH': [
    { match: /is[-\s]?2.*active.*short/i, image: 'neobiotech_is2active_short.jpg' },
    { match: /is[-\s]?2.*active/i, image: 'neobiotech_is2active.jpg' },
    { match: /is[-\s]?2.*short/i, image: 'neobiotech_is2active_short.jpg' }, // fallback
    { match: /is[-\s]?3.*active.*narrow/i, image: 'neobiotech_is3active_narrow.jpg' },
    { match: /is[-\s]?3.*active/i, image: 'neobiotech_is3active.jpg' },
    { match: /is[-\s]?3.*narrow/i, image: 'neobiotech_is3active_narrow.jpg' } // fallback
  ],

  'OSSTEM': [
    { match: /surface.*ba/i, image: 'ossstem_surface_ba.jpg' },
    { match: /surface.*ca/i, image: 'ossstem_surface_ca.jpg' },
    { match: /surface.*ha/i, image: 'ossstem_surface_ha.jpg' },
    { match: /surface.*sa/i, image: 'ossstem_surface_sa.jpg' },
    { match: /surface.*soi/i, image: 'ossstem_surface_soi.jpg' },
    { match: /ts[-\s]?3.*extra.*short.*15/i, image: 'ossstem_ts3_extra_short_15.jpg' },
    { match: /ts[-\s]?3.*extra.*short.*6/i, image: 'ossstem_ts3_extra_short_6.jpg' },
    { match: /ts[-\s]?3.*extra.*short.*24/i, image: 'ossstem_ts3_extra_short24.jpg' },
    { match: /ts[-\s]?3.*no.*mount/i, image: 'ossstem_ts3_no_mount.jpg' },
    { match: /ts[-\s]?3.*pre.*mount/i, image: 'ossstem_ts3_pre_mount.jpg' },
    { match: /ts[-\s]?3/i, image: 'ossstem_ts3_no_mount.jpg' }, // fallback
    { match: /ts[-\s]?4.*no.*mount/i, image: 'ossstem_ts4_no_mount.jpg' },
    { match: /ts[-\s]?4.*pre.*mount/i, image: 'ossstem_ts4_pre_mount.jpg' },
    { match: /ts[-\s]?4/i, image: 'ossstem_ts4_no_mount.jpg' } // fallback
  ],

  'SIC': [
    { match: /\bace\b/i, image: 'sic_ace.jpg' },
    { match: /\bmax\b/i, image: 'sic_max.jpg' },
    { match: /tapered/i, image: 'sic_tapered.jpg' }
  ],

  'SNUCONE': [
    { match: /af[-\s]?1/i, image: 'snucone_af1.jpg' },
    { match: /af[-\s]?2/i, image: 'snucone_af2.jpg' },
    { match: /afs/i, image: 'snucone_afs.jpg' },
    { match: /rff/i, image: 'snucone_rff.jpg' }
  ],

  'STRAUMANN': [
    { match: /bone.*level.*tapered/i, image: 'straumann_bone_level_tapered.jpg' },
    { match: /bone.*level/i, image: 'straumann_bone_level.jpg' },
    { match: /tissue.*level.*standard.*plus/i, image: 'straumann_tissue_level_standart_plus.jpg' },
    { match: /tissue.*level.*standart.*plus/i, image: 'straumann_tissue_level_standart_plus.jpg' },
    { match: /tissue.*level.*standard/i, image: 'straumann_tissue_level_standart.jpg' },
    { match: /tissue.*level.*standart/i, image: 'straumann_tissue_level_standart.jpg' },
    { match: /tissue.*level/i, image: 'straumann_tissue_level_standart.jpg' } // fallback
  ]
}

// Нормализация бренда для сопоставления
function normalizeBrand(brand) {
  if (!brand) return ''

  const normalized = brand.toUpperCase().trim()

  // Маппинг вариаций брендов
  const brandMap = {
    'ASTRA TECH': 'ASTRATECH',
    'ASTRA-TECH': 'ASTRATECH',
    'NEO BIOTECH': 'NEOBIOTECH',
    'NEO-BIOTECH': 'NEOBIOTECH',
    'NEOBIOTECH': 'NEOBIOTECH'
  }

  return brandMap[normalized] || normalized
}

// Попытка найти совпадение для продукта
function findImageMatch(productName, productBrand) {
  const brand = normalizeBrand(productBrand)
  const patterns = brandPatterns[brand]

  if (!patterns) {
    return null
  }

  const name = (productName || '').toLowerCase()

  // Пробуем каждый паттерн по порядку
  for (const pattern of patterns) {
    if (pattern.match.test(name)) {
      return {
        image: pattern.image,
        confidence: 90, // pattern match
        pattern: pattern.match.toString()
      }
    }
  }

  return null
}

export {
  brandPatterns,
  normalizeBrand,
  findImageMatch
}
