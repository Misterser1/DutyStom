import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import './ProductPage.css'

// Переводы значений спецификаций (для английского языка)
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
  // Соединения
  'Внутренний конус': 'Internal Cone',
  'Внутренний шестигранник': 'Internal Hex',
  'Внешний шестигранник': 'External Hex',
  'Конический': 'Conical',
  'Конус': 'Cone',
  'конус': 'cone',
  'Шестигранник': 'Hexagon',
  'Октагон': 'Octagon',
  'Морзе': 'Morse',
  // Поверхности
  'ионы кальция': 'calcium ions',
  'Ионы кальция': 'Calcium ions',
  'пескоструйная': 'sandblasted',
  'Пескоструйная': 'Sandblasted',
  'кислотное травление': 'acid-etched',
  'анодированная': 'anodized',
  'гидрофильная': 'hydrophilic',
  'наноструктурированная': 'nanostructured',
  // Материалы
  'Титан': 'Titanium',
  'титан': 'titanium',
  'Цирконий': 'Zirconium',
  'Нержавеющая сталь': 'Stainless steel',
  'Пластик': 'Plastic',
  // Типы
  'Стандартный': 'Standard',
  'Угловой': 'Angled',
  'Прямой': 'Straight',
  'Временный': 'Temporary',
  'Постоянный': 'Permanent',
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
  'Нет': 'No'
}

// Названия характеристик на русском и английском
const SPEC_LABELS = {
  ru: {
    type: 'Тип',
    brand: 'Бренд',
    country: 'Страна',
    connection: 'Соединение',
    surface: 'Поверхность',
    platform: 'Платформа',
    diameters: 'Диаметры',
    lengths: 'Длины',
    material: 'Материал',
    boneType: 'Тип кости',
    feature: 'Особенности',
    heights: 'Высоты',
    angles: 'Углы',
    compatibility: 'Совместимость',
    application: 'Применение',
    technique: 'Техника',
    granuleSize: 'Размер гранул',
    resorption: 'Резорбция',
    processing: 'Обработка',
    structure: 'Структура',
    origin: 'Происхождение',
    manufacturer: 'Производитель',
    porosity: 'Пористость',
    forms: 'Формы',
    composition: 'Состав',
    removal: 'Удаление',
    torque: 'Момент затяжки',
    mechanism: 'Механизм',
    rpm: 'Обороты',
    quantity: 'Количество',
    widths: 'Ширины',
    numbers: 'Номера',
    needleSize: 'Размер иглы',
    components: 'Комплектация',
    shapes: 'Формы',
    output: 'Результат',
    weight: 'Вес',
    blade: 'Лезвие',
    protocol: 'Протокол',
    design: 'Дизайн'
  },
  en: {
    type: 'Type',
    brand: 'Brand',
    country: 'Country',
    connection: 'Connection',
    surface: 'Surface',
    platform: 'Platform',
    diameters: 'Diameters',
    lengths: 'Lengths',
    material: 'Material',
    boneType: 'Bone Type',
    feature: 'Features',
    heights: 'Heights',
    angles: 'Angles',
    compatibility: 'Compatibility',
    application: 'Application',
    technique: 'Technique',
    granuleSize: 'Granule Size',
    resorption: 'Resorption',
    processing: 'Processing',
    structure: 'Structure',
    origin: 'Origin',
    manufacturer: 'Manufacturer',
    porosity: 'Porosity',
    forms: 'Forms',
    composition: 'Composition',
    removal: 'Removal',
    torque: 'Torque',
    mechanism: 'Mechanism',
    rpm: 'RPM',
    quantity: 'Quantity',
    widths: 'Widths',
    numbers: 'Numbers',
    needleSize: 'Needle Size',
    components: 'Components',
    shapes: 'Shapes',
    output: 'Output',
    weight: 'Weight',
    blade: 'Blade',
    protocol: 'Protocol',
    design: 'Design'
  }
}

// Демо-данные
const demoProducts = [
  { id: 1, name: 'Blue Diamond Regular Thread', brand: 'MEGAGEN', category_id: 1, price: 13500, image_url: null, description: 'Имплантат Blue Diamond с обычной резьбой. Высококачественный титановый имплантат для надежной остеоинтеграции.' },
  { id: 2, name: 'Blue Diamond Deep Thread', brand: 'MEGAGEN', category_id: 1, price: 13500, image_url: null, description: 'Имплантат Blue Diamond с глубокой резьбой. Обеспечивает отличную первичную стабильность.' },
  { id: 3, name: 'AnyOne Regular Thread', brand: 'MEGAGEN', category_id: 1, price: 6600, image_url: null, description: 'Универсальный имплантат AnyOne с обычной резьбой. Оптимальное соотношение цены и качества.' },
]

// Парсинг характеристик из JSON
const parseSpecs = (specsString) => {
  if (!specsString) return null
  try {
    return JSON.parse(specsString)
  } catch {
    return null
  }
}

function ProductPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { language, t, getLocalized } = useLanguage()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  const formatPrice = (price) => {
    return '$' + new Intl.NumberFormat('en-US').format(price)
  }

  // Получить название спецификации на текущем языке
  const getSpecLabel = (key) => {
    return SPEC_LABELS[language]?.[key] || SPEC_LABELS.ru[key] || key
  }

  // Перевод значения спецификации
  const translateSpecValue = (value) => {
    if (language === 'en' && typeof value === 'string') {
      let translated = value
      Object.entries(SPEC_VALUE_TRANSLATIONS).forEach(([ru, en]) => {
        translated = translated.replace(new RegExp(ru, 'g'), en)
      })
      return translated
    }
    return value
  }

  // Функция проверки дублирования описания
  const isDescriptionDuplicate = (desc, name) => {
    if (!desc || !name) return true
    const descLower = desc.toLowerCase().trim()
    const nameLower = name.toLowerCase().trim()
    return descLower === nameLower ||
           descLower.startsWith(nameLower) ||
           nameLower.startsWith(descLower) ||
           (descLower.includes(nameLower) && desc.length < name.length + 25)
  }

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          const demo = demoProducts.find(p => p.id === parseInt(id))
          setProduct(demo || null)
        }
      } catch (error) {
        const demo = demoProducts.find(p => p.id === parseInt(id))
        setProduct(demo || null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
  }

  if (loading) {
    return <div className="loading"></div>
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>{language === 'en' ? 'Product not found' : 'Товар не найден'}</h2>
        <Link to="/" className="btn-back">{language === 'en' ? 'Back to home' : 'Вернуться на главную'}</Link>
      </div>
    )
  }

  return (
    <div className="product-page">
      <div className="product-page-content">
        <div className="product-page-image">
          {(product.image_url || product.image) ? (
            <img src={product.image_url || product.image} alt={product.name} />
          ) : (
            <div className="product-page-placeholder">
              <svg viewBox="0 0 64 64" fill="currentColor">
                <path d="M32 4c-4 0-7 3-7 7v10c0 2 1 4 3 5v30c0 3 2 5 4 5s4-2 4-5V26c2-1 3-3 3-5V11c0-4-3-7-7-7z"/>
              </svg>
            </div>
          )}
        </div>

        <div className="product-page-info">
          {/* Название */}
          <h1 className="product-page-title">{product.name_en || product.name}</h1>

          <div className="product-page-price">
            <span className="price-value">{formatPrice(product.price)}</span>
          </div>

          <div className="product-page-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>

            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {t('product.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
