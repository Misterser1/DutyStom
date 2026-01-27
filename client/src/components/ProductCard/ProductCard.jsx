import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../contexts/LanguageContext'
import './ProductCard.css'

// Курс конвертации
const USD_RATE = 100

// Переводы ключей спецификаций
const SPEC_KEY_TRANSLATIONS = {
  // Русский ключ -> Английский
  'Brand': 'Brand',
  'Country': 'Country',
  'Connection': 'Connection',
  'Surface': 'Surface',
  'Diameters': 'Diameters',
  'Material': 'Material',
  'Lengths': 'Lengths',
  'Platform': 'Platform',
  'Heights': 'Heights',
  'Angles': 'Angles',
  'Type': 'Type',
  // Добавляем русские варианты
  'Бренд': 'Brand',
  'Страна': 'Country',
  'Соединение': 'Connection',
  'Поверхность': 'Surface',
  'Диаметры': 'Diameters',
  'Материал': 'Material',
  'Длины': 'Lengths',
  'Платформа': 'Platform',
  'Высоты': 'Heights',
  'Углы': 'Angles',
  'Тип': 'Type',
  'Особенности': 'Features',
  'Применение': 'Application',
  'Совместимость': 'Compatibility'
}

// Переводы значений спецификаций
const SPEC_VALUE_TRANSLATIONS = {
  // Страны
  'Корея': 'South Korea',
  'Южная Корея': 'South Korea',
  'Германия': 'Germany',
  'Швейцария': 'Switzerland',
  'Израиль': 'Israel',
  'США': 'USA',
  'Россия': 'Russia',
  'Япония': 'Japan',
  'Италия': 'Italy',
  'Франция': 'France',
  'Китай': 'China',
  'Тайвань': 'Taiwan',
  'Бразилия': 'Brazil',
  // Соединения
  'Внутренний конус': 'Internal Cone',
  'Внутренний шестигранник': 'Internal Hex',
  'Внешний шестигранник': 'External Hex',
  'Конический': 'Conical',
  'Конус': 'Cone',
  'конус': 'cone',
  'Шестигранник': 'Hexagon',
  'шестигранник': 'hexagon',
  'Октагон': 'Octagon',
  'Трехканальный': 'Tri-Channel',
  'Морзе': 'Morse',
  // Поверхности
  'S.L.A.': 'S.L.A.',
  'SLA': 'SLA',
  'RBM': 'RBM',
  'HA': 'HA',
  'ионы кальция': 'calcium ions',
  'Ионы кальция': 'Calcium ions',
  'пескоструйная': 'sandblasted',
  'Пескоструйная': 'Sandblasted',
  'кислотное травление': 'acid-etched',
  'Кислотное травление': 'Acid-etched',
  'анодированная': 'anodized',
  'Анодированная': 'Anodized',
  'гидрофильная': 'hydrophilic',
  'Гидрофильная': 'Hydrophilic',
  'наноструктурированная': 'nanostructured',
  'Наноструктурированная': 'Nanostructured',
  // Материалы
  'Титан': 'Titanium',
  'титан': 'titanium',
  'Титан Grade 4': 'Titanium Grade 4',
  'Титан Grade 5': 'Titanium Grade 5',
  'Цирконий': 'Zirconium',
  'цирконий': 'zirconium',
  'Нержавеющая сталь': 'Stainless steel',
  'PEEK': 'PEEK',
  'Пластик': 'Plastic',
  // Типы
  'Стандартный': 'Standard',
  'стандартный': 'standard',
  'Угловой': 'Angled',
  'угловой': 'angled',
  'Прямой': 'Straight',
  'прямой': 'straight',
  'Временный': 'Temporary',
  'временный': 'temporary',
  'Постоянный': 'Permanent',
  'постоянный': 'permanent',
  'Формирователь десны': 'Healing abutment',
  'Аналог': 'Analog',
  'Трансфер': 'Transfer',
  'Абатмент': 'Abutment',
  // Единицы
  'мм': 'mm',
  'шт': 'pcs',
  'мл': 'ml',
  'г': 'g',
  'кг': 'kg',
  // Прочее
  'Да': 'Yes',
  'да': 'yes',
  'Нет': 'No',
  'нет': 'no',
  'с': 'with',
  'без': 'without',
  'для': 'for',
  'или': 'or',
  'и': 'and'
}

function ProductCard({ product, showUSD = false }) {
  const { addItem } = useCart()
  const { language, t, getLocalized } = useLanguage()
  const [quantity, setQuantity] = useState(1)

  // Функция перевода ключа спецификации
  const translateSpecKey = (key) => {
    if (language === 'en') {
      return SPEC_KEY_TRANSLATIONS[key] || key
    }
    return key
  }

  // Функция перевода значения спецификации
  const translateSpecValue = (value) => {
    if (language === 'en' && typeof value === 'string') {
      // Заменяем известные значения
      let translated = value
      Object.entries(SPEC_VALUE_TRANSLATIONS).forEach(([ru, en]) => {
        translated = translated.replace(new RegExp(ru, 'g'), en)
      })
      return translated
    }
    return value
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, quantity)
  }

  const handleQuantityChange = (e, delta) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity(prev => Math.max(1, prev + delta))
  }

  // Форматирование цены в рублях
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
  }

  // Данные товара
  const inStock = product.in_stock !== undefined ? product.in_stock === 1 : true
  const isImplant = product.category_slug === 'implantaty' || product.parent_category_slug === 'implantaty'
  const isProtetika = product.category_slug === 'protetika' || product.parent_category_slug === 'protetika'
  // Для имплантов и протетики скрываем код/артикул/спеки и описание в каталоге
  // Описание показывается только на странице товара
  const hideCodeArticleSpecs = isImplant || isProtetika
  const hideDescription = isImplant || isProtetika

  // Парсинг спецификаций
  const parseSpecs = (specsStr) => {
    if (!specsStr) return null
    try {
      return JSON.parse(specsStr)
    } catch {
      return null
    }
  }

  const specs = parseSpecs(product.specs)
  // Фильтруем qty_* поля (оптовые цены)
  const filteredSpecs = specs
    ? Object.entries(specs).filter(([key]) => !key.startsWith('qty_')).slice(0, 5)
    : []

  // Функция проверки дублирования описания
  const isDescriptionDuplicate = (desc, name) => {
    if (!desc || !name) return true
    const descLower = desc.toLowerCase().trim()
    const nameLower = name.toLowerCase().trim()
    // Описание дублируется если:
    // 1. Полностью совпадает с названием
    // 2. Начинается с названия (например "Name - Implant")
    // 3. Название содержится в описании и описание короткое
    return descLower === nameLower ||
           descLower.startsWith(nameLower) ||
           nameLower.startsWith(descLower) ||
           (descLower.includes(nameLower) && desc.length < name.length + 25)
  }

  return (
    <div className="compact-card">
      {/* Левая секция - код и бренд */}
      <div className="cc-left">
        {!hideCodeArticleSpecs && <div className="cc-code">{language === 'en' ? 'CODE' : 'КОД'}: {product.code || product.id}</div>}
        {!hideCodeArticleSpecs && <div className="cc-article">{language === 'en' ? 'Art.' : 'Арт.'}: {product.article || '—'}</div>}
        <div className="cc-brand">{product.brand || '—'}</div>
        <div className="cc-country">{translateSpecValue(product.country) || '—'}</div>
      </div>

      {/* Изображение */}
      <Link to={`/product/${product.id}`} className="cc-image">
        {(product.image_url || product.image) ? (
          <img src={product.image_url || product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className="cc-image-placeholder">
            <svg viewBox="0 0 64 64" fill="currentColor">
              <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
            </svg>
          </div>
        )}
      </Link>

      {/* Информация */}
      <div className="cc-info">
        <Link to={`/product/${product.id}`} className="cc-name-link">
          {/* Название всегда на английском */}
          <h3 className="cc-name">{product.name_en || product.name}</h3>
        </Link>
        {/* Описание: показываем для протетики, скрываем для имплантов */}
        {!hideDescription && language === 'ru' && product.description && !isDescriptionDuplicate(product.description, product.name_en || product.name) && (
          <p className="cc-desc">
            {product.description.length > 80
              ? product.description.substring(0, 80) + '...'
              : product.description}
          </p>
        )}
        {!hideDescription && language === 'en' && product.description_en && !isDescriptionDuplicate(product.description_en, product.name_en || product.name) && (
          <p className="cc-desc">
            {product.description_en.length > 80
              ? product.description_en.substring(0, 80) + '...'
              : product.description_en}
          </p>
        )}
        {!hideCodeArticleSpecs && filteredSpecs.length > 0 && (
          <div className="cc-specs">
            {filteredSpecs.map(([key, value]) => (
              <span key={key} className="cc-spec">
                <span className="cc-spec-key">{translateSpecKey(key)}:</span> {translateSpecValue(value)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Правая секция */}
      <div className="cc-right">
        <div className="cc-right-row">
          <div className="cc-price">{formatPrice(product.price)}</div>
          <div className={`cc-stock ${inStock ? 'in' : 'out'}`}>
            <span className="stock-dot"></span>
            {inStock ? t('product.inStock') : t('product.outOfStock')}
          </div>
        </div>
        <div className="cc-actions">
          <div className="cc-qty">
            <button onClick={(e) => handleQuantityChange(e, -1)} disabled={quantity <= 1}>−</button>
            <span>{quantity}</span>
            <button onClick={(e) => handleQuantityChange(e, 1)}>+</button>
          </div>
          <button className="cc-cart-btn" onClick={handleAddToCart}>{t('product.addToCart')}</button>
        </div>
        <Link to={`/product/${product.id}`} className="cc-detail-link">{t('product.details')}</Link>
      </div>
    </div>
  )
}

export default ProductCard
