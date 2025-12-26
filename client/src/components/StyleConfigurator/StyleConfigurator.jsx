import { useState, useEffect } from 'react'
import './StyleConfigurator.css'

// Дефолтные значения
const defaultStyles = {
  // Header
  headerHeight: 80,
  logoHeight: 56,
  searchHeight: 48,
  actionBtnSize: 48,

  // Categories
  categoryWidth: 120,
  categoryHeight: 88,
  categoryIconSize: 36,
  categoryFontSize: 13,
  categoryGap: 12,

  // Product Cards
  cardPadding: 16,
  qtyBtnSize: 36,
  cartBtnHeight: 40,
  priceFontSize: 19,

  // Hero Banner
  heroHeight: 280,
  heroTitleSize: 36,
  heroSubtitleSize: 16,
  heroPadding: 40,

  // Disclaimer
  disclaimerPadding: 15,
  disclaimerTitleSize: 15,
  disclaimerTextSize: 13,

  // Footer
  footerPadding: 40,
  footerFontSize: 14,
  footerBtnHeight: 48,

  // Colors
  colorPrimary: '#3d9b9b',
  colorPrimaryDark: '#2d7a7a',
  colorAccent: '#e63946',
  colorBeige: '#d4c4b0',
  colorBeigeDark: '#f5f2ed',
  colorBeigeLight: '#faf8f5',

  // Background
  bgPage: '#f5f2ed',
  bgCards: '#f8f5f0',
  bgBorder: '#e8e2d8',

  // Fonts
  fontFamily: 'Inter',
  baseFontSize: 16,
  h1Size: 32,
  h2Size: 24,
  h3Size: 20,
  smallTextSize: 13,
  fontWeight: 500,
}

function StyleConfigurator() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [styles, setStyles] = useState(() => {
    const saved = localStorage.getItem('dutystom-styles')
    return saved ? JSON.parse(saved) : defaultStyles
  })
  const [expandedSections, setExpandedSections] = useState({
    header: true,
    categories: true,
    cards: false,
    hero: false,
    disclaimer: false,
    footer: false,
    background: false,
    colors: false,
    fonts: false,
  })
  const [copied, setCopied] = useState(false)

  // Применяем стили к CSS переменным
  useEffect(() => {
    const root = document.documentElement

    // Header
    root.style.setProperty('--cfg-header-height', `${styles.headerHeight}px`)
    root.style.setProperty('--cfg-logo-height', `${styles.logoHeight}px`)
    root.style.setProperty('--cfg-search-height', `${styles.searchHeight}px`)
    root.style.setProperty('--cfg-action-btn-size', `${styles.actionBtnSize}px`)

    // Categories
    root.style.setProperty('--cfg-category-width', `${styles.categoryWidth}px`)
    root.style.setProperty('--cfg-category-height', `${styles.categoryHeight}px`)
    root.style.setProperty('--cfg-category-icon-size', `${styles.categoryIconSize}px`)
    root.style.setProperty('--cfg-category-font-size', `${styles.categoryFontSize}px`)
    root.style.setProperty('--cfg-category-gap', `${styles.categoryGap}px`)

    // Product Cards
    root.style.setProperty('--cfg-card-padding', `${styles.cardPadding}px`)
    root.style.setProperty('--cfg-qty-btn-size', `${styles.qtyBtnSize}px`)
    root.style.setProperty('--cfg-cart-btn-height', `${styles.cartBtnHeight}px`)
    root.style.setProperty('--cfg-price-font-size', `${styles.priceFontSize}px`)

    // Hero
    root.style.setProperty('--cfg-hero-height', `${styles.heroHeight}px`)
    root.style.setProperty('--cfg-hero-title-size', `${styles.heroTitleSize}px`)
    root.style.setProperty('--cfg-hero-subtitle-size', `${styles.heroSubtitleSize}px`)
    root.style.setProperty('--cfg-hero-padding', `${styles.heroPadding}px`)

    // Disclaimer
    root.style.setProperty('--cfg-disclaimer-padding', `${styles.disclaimerPadding}px`)
    root.style.setProperty('--cfg-disclaimer-title-size', `${styles.disclaimerTitleSize}px`)
    root.style.setProperty('--cfg-disclaimer-text-size', `${styles.disclaimerTextSize}px`)

    // Footer
    root.style.setProperty('--cfg-footer-padding', `${styles.footerPadding}px`)
    root.style.setProperty('--cfg-footer-font-size', `${styles.footerFontSize}px`)
    root.style.setProperty('--cfg-footer-btn-height', `${styles.footerBtnHeight}px`)

    // Colors
    root.style.setProperty('--cfg-color-primary', styles.colorPrimary)
    root.style.setProperty('--cfg-color-primary-dark', styles.colorPrimaryDark)
    root.style.setProperty('--cfg-color-accent', styles.colorAccent)
    root.style.setProperty('--cfg-color-beige', styles.colorBeige)
    root.style.setProperty('--cfg-color-beige-dark', styles.colorBeigeDark)
    root.style.setProperty('--cfg-color-beige-light', styles.colorBeigeLight)

    // Background
    root.style.setProperty('--cfg-bg-page', styles.bgPage)
    root.style.setProperty('--cfg-bg-cards', styles.bgCards)
    root.style.setProperty('--cfg-bg-border', styles.bgBorder)

    // Fonts
    root.style.setProperty('--cfg-font-family', styles.fontFamily)
    root.style.setProperty('--cfg-base-font-size', `${styles.baseFontSize}px`)
    root.style.setProperty('--cfg-h1-size', `${styles.h1Size}px`)
    root.style.setProperty('--cfg-h2-size', `${styles.h2Size}px`)
    root.style.setProperty('--cfg-h3-size', `${styles.h3Size}px`)
    root.style.setProperty('--cfg-small-text-size', `${styles.smallTextSize}px`)
    root.style.setProperty('--cfg-font-weight', styles.fontWeight)

    // Сохраняем в localStorage
    localStorage.setItem('dutystom-styles', JSON.stringify(styles))
  }, [styles])

  const updateStyle = (key, value) => {
    setStyles(prev => ({ ...prev, [key]: value }))
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const resetStyles = () => {
    setStyles(defaultStyles)
    localStorage.removeItem('dutystom-styles')
  }

  const copyCSS = () => {
    const css = `/* DUTYSTOM Style Configuration */
:root {
  /* Header */
  --header-height: ${styles.headerHeight}px;
  --logo-height: ${styles.logoHeight}px;
  --search-height: ${styles.searchHeight}px;
  --action-btn-size: ${styles.actionBtnSize}px;

  /* Categories */
  --category-width: ${styles.categoryWidth}px;
  --category-height: ${styles.categoryHeight}px;
  --category-icon-size: ${styles.categoryIconSize}px;
  --category-font-size: ${styles.categoryFontSize}px;
  --category-gap: ${styles.categoryGap}px;

  /* Product Cards */
  --card-padding: ${styles.cardPadding}px;
  --qty-btn-size: ${styles.qtyBtnSize}px;
  --cart-btn-height: ${styles.cartBtnHeight}px;
  --price-font-size: ${styles.priceFontSize}px;

  /* Hero */
  --hero-height: ${styles.heroHeight}px;
  --hero-title-size: ${styles.heroTitleSize}px;
  --hero-subtitle-size: ${styles.heroSubtitleSize}px;
  --hero-padding: ${styles.heroPadding}px;

  /* Disclaimer */
  --disclaimer-padding: ${styles.disclaimerPadding}px;
  --disclaimer-title-size: ${styles.disclaimerTitleSize}px;
  --disclaimer-text-size: ${styles.disclaimerTextSize}px;

  /* Footer */
  --footer-padding: ${styles.footerPadding}px;
  --footer-font-size: ${styles.footerFontSize}px;
  --footer-btn-height: ${styles.footerBtnHeight}px;

  /* Colors */
  --color-primary: ${styles.colorPrimary};
  --color-primary-dark: ${styles.colorPrimaryDark};
  --color-accent: ${styles.colorAccent};
  --color-beige: ${styles.colorBeige};
  --color-beige-dark: ${styles.colorBeigeDark};
  --color-beige-light: ${styles.colorBeigeLight};

  /* Background */
  --bg-page: ${styles.bgPage};
  --bg-cards: ${styles.bgCards};
  --bg-border: ${styles.bgBorder};

  /* Fonts */
  --font-family: ${styles.fontFamily};
  --base-font-size: ${styles.baseFontSize}px;
  --h1-size: ${styles.h1Size}px;
  --h2-size: ${styles.h2Size}px;
  --h3-size: ${styles.h3Size}px;
  --small-text-size: ${styles.smallTextSize}px;
  --font-weight: ${styles.fontWeight};
}`
    navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportJSON = () => {
    const json = JSON.stringify(styles, null, 2)
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Компонент слайдера
  const Slider = ({ label, value, min, max, step = 1, onChange, unit = 'px' }) => (
    <div className="cfg-control">
      <div className="cfg-control-header">
        <span className="cfg-label">{label}</span>
        <span className="cfg-value">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cfg-slider"
      />
    </div>
  )

  // Компонент выбора цвета
  const ColorPicker = ({ label, value, onChange }) => (
    <div className="cfg-control cfg-color-control">
      <span className="cfg-label">{label}</span>
      <div className="cfg-color-wrapper">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="cfg-color-input"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="cfg-color-text"
        />
      </div>
    </div>
  )

  // Компонент выбора шрифта
  const FontSelect = ({ label, value, onChange }) => (
    <div className="cfg-control cfg-font-control">
      <span className="cfg-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cfg-select"
      >
        <option value="Inter">Inter</option>
        <option value="Roboto">Roboto</option>
        <option value="Open Sans">Open Sans</option>
        <option value="Montserrat">Montserrat</option>
        <option value="Poppins">Poppins</option>
        <option value="Nunito">Nunito</option>
        <option value="Lato">Lato</option>
        <option value="Source Sans Pro">Source Sans Pro</option>
        <option value="PT Sans">PT Sans</option>
        <option value="Raleway">Raleway</option>
      </select>
    </div>
  )

  // Секция с аккордеоном
  const Section = ({ title, name, children }) => (
    <div className={`cfg-section ${expandedSections[name] ? 'expanded' : ''}`}>
      <button className="cfg-section-header" onClick={() => toggleSection(name)}>
        <span>{expandedSections[name] ? '▼' : '▶'} {title}</span>
      </button>
      {expandedSections[name] && (
        <div className="cfg-section-content">
          {children}
        </div>
      )}
    </div>
  )

  if (!isOpen) {
    return (
      <button className="cfg-toggle-btn" onClick={() => setIsOpen(true)}>
        🎨
      </button>
    )
  }

  return (
    <div className={`style-configurator ${isMinimized ? 'minimized' : ''}`}>
      <div className="cfg-header">
        <h3>🎨 Style Configurator</h3>
        <div className="cfg-header-btns">
          <button onClick={() => setIsMinimized(!isMinimized)} title="Свернуть">
            {isMinimized ? '□' : '─'}
          </button>
          <button onClick={() => setIsOpen(false)} title="Закрыть">×</button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="cfg-content">
            <Section title="Header" name="header">
              <Slider label="Высота" value={styles.headerHeight} min={60} max={120} onChange={v => updateStyle('headerHeight', v)} />
              <Slider label="Логотип" value={styles.logoHeight} min={40} max={80} onChange={v => updateStyle('logoHeight', v)} />
              <Slider label="Search" value={styles.searchHeight} min={36} max={60} onChange={v => updateStyle('searchHeight', v)} />
              <Slider label="Кнопки" value={styles.actionBtnSize} min={40} max={64} onChange={v => updateStyle('actionBtnSize', v)} />
            </Section>

            <Section title="Категории" name="categories">
              <Slider label="Ширина" value={styles.categoryWidth} min={80} max={160} onChange={v => updateStyle('categoryWidth', v)} />
              <Slider label="Высота" value={styles.categoryHeight} min={60} max={120} onChange={v => updateStyle('categoryHeight', v)} />
              <Slider label="Иконка" value={styles.categoryIconSize} min={20} max={48} onChange={v => updateStyle('categoryIconSize', v)} />
              <Slider label="Шрифт" value={styles.categoryFontSize} min={10} max={18} onChange={v => updateStyle('categoryFontSize', v)} />
              <Slider label="Gap" value={styles.categoryGap} min={4} max={24} onChange={v => updateStyle('categoryGap', v)} />
            </Section>

            <Section title="Карточки товаров" name="cards">
              <Slider label="Padding" value={styles.cardPadding} min={8} max={24} onChange={v => updateStyle('cardPadding', v)} />
              <Slider label="+/- кнопки" value={styles.qtyBtnSize} min={28} max={48} onChange={v => updateStyle('qtyBtnSize', v)} />
              <Slider label="Корзина btn" value={styles.cartBtnHeight} min={36} max={56} onChange={v => updateStyle('cartBtnHeight', v)} />
              <Slider label="Цена шрифт" value={styles.priceFontSize} min={14} max={26} onChange={v => updateStyle('priceFontSize', v)} />
            </Section>

            <Section title="Hero баннер" name="hero">
              <Slider label="Высота" value={styles.heroHeight} min={200} max={400} onChange={v => updateStyle('heroHeight', v)} />
              <Slider label="Заголовок" value={styles.heroTitleSize} min={24} max={56} onChange={v => updateStyle('heroTitleSize', v)} />
              <Slider label="Подзаголовок" value={styles.heroSubtitleSize} min={12} max={24} onChange={v => updateStyle('heroSubtitleSize', v)} />
              <Slider label="Padding" value={styles.heroPadding} min={20} max={60} onChange={v => updateStyle('heroPadding', v)} />
            </Section>

            <Section title="Disclaimer" name="disclaimer">
              <Slider label="Padding" value={styles.disclaimerPadding} min={8} max={30} onChange={v => updateStyle('disclaimerPadding', v)} />
              <Slider label="Заголовок" value={styles.disclaimerTitleSize} min={12} max={20} onChange={v => updateStyle('disclaimerTitleSize', v)} />
              <Slider label="Текст" value={styles.disclaimerTextSize} min={10} max={16} onChange={v => updateStyle('disclaimerTextSize', v)} />
            </Section>

            <Section title="Footer" name="footer">
              <Slider label="Padding" value={styles.footerPadding} min={20} max={60} onChange={v => updateStyle('footerPadding', v)} />
              <Slider label="Шрифт" value={styles.footerFontSize} min={12} max={18} onChange={v => updateStyle('footerFontSize', v)} />
              <Slider label="Кнопки" value={styles.footerBtnHeight} min={36} max={60} onChange={v => updateStyle('footerBtnHeight', v)} />
            </Section>

            <Section title="Фон" name="background">
              <ColorPicker label="Страница" value={styles.bgPage} onChange={v => updateStyle('bgPage', v)} />
              <ColorPicker label="Карточки" value={styles.bgCards} onChange={v => updateStyle('bgCards', v)} />
              <ColorPicker label="Бордеры" value={styles.bgBorder} onChange={v => updateStyle('bgBorder', v)} />
            </Section>

            <Section title="Цвета" name="colors">
              <ColorPicker label="Primary" value={styles.colorPrimary} onChange={v => updateStyle('colorPrimary', v)} />
              <ColorPicker label="Primary Dark" value={styles.colorPrimaryDark} onChange={v => updateStyle('colorPrimaryDark', v)} />
              <ColorPicker label="Accent" value={styles.colorAccent} onChange={v => updateStyle('colorAccent', v)} />
              <ColorPicker label="Beige" value={styles.colorBeige} onChange={v => updateStyle('colorBeige', v)} />
              <ColorPicker label="Beige Dark" value={styles.colorBeigeDark} onChange={v => updateStyle('colorBeigeDark', v)} />
              <ColorPicker label="Beige Light" value={styles.colorBeigeLight} onChange={v => updateStyle('colorBeigeLight', v)} />
            </Section>

            <Section title="Шрифты" name="fonts">
              <FontSelect label="Шрифт" value={styles.fontFamily} onChange={v => updateStyle('fontFamily', v)} />
              <Slider label="Base размер" value={styles.baseFontSize} min={14} max={20} onChange={v => updateStyle('baseFontSize', v)} />
              <Slider label="H1" value={styles.h1Size} min={24} max={48} onChange={v => updateStyle('h1Size', v)} />
              <Slider label="H2" value={styles.h2Size} min={18} max={36} onChange={v => updateStyle('h2Size', v)} />
              <Slider label="H3" value={styles.h3Size} min={16} max={28} onChange={v => updateStyle('h3Size', v)} />
              <Slider label="Мелкий текст" value={styles.smallTextSize} min={10} max={16} onChange={v => updateStyle('smallTextSize', v)} />
              <Slider label="Font weight" value={styles.fontWeight} min={300} max={700} step={100} unit="" onChange={v => updateStyle('fontWeight', v)} />
            </Section>
          </div>

          <div className="cfg-footer">
            <button className="cfg-btn cfg-btn-reset" onClick={resetStyles}>
              Reset
            </button>
            <button className="cfg-btn cfg-btn-copy" onClick={copyCSS}>
              {copied ? '✓ Скопировано!' : 'Copy CSS'}
            </button>
            <button className="cfg-btn cfg-btn-export" onClick={exportJSON}>
              JSON
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default StyleConfigurator
