import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import './CategoryBanner.css'

// Конфигурация слайдов для разных категорий
const slidesConfig = {
  ru: {
    implants: [
      {
        image: '/images/banners/implants-1.jpg',
        title: 'Премиум имплантаты',
        subtitle: 'От ведущих мировых производителей',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(0,128,128,0.7) 100%)'
      },
      {
        image: '/images/banners/implants-2.jpg',
        title: 'Гарантия качества',
        subtitle: 'Сертифицированная продукция с документами',
        gradient: 'linear-gradient(135deg, rgba(139,115,85,0.85) 0%, rgba(180,160,130,0.7) 100%)'
      },
      {
        image: '/images/banners/implants-3.jpg',
        title: 'Выгодные цены',
        subtitle: 'Прямые поставки без посредников',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(139,115,85,0.7) 100%)'
      }
    ],
    bone: [
      {
        image: '/images/banners/bone-1.jpg',
        title: 'Костные материалы',
        subtitle: 'Ксенографты, аллографты, синтетические материалы',
        gradient: 'linear-gradient(135deg, rgba(139,115,85,0.85) 0%, rgba(180,160,130,0.7) 100%)'
      },
      {
        image: '/images/banners/bone-2.jpg',
        title: 'Проверенные бренды',
        subtitle: 'Bio-Oss, Cerabone, Maxgraft и другие',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(0,128,128,0.7) 100%)'
      },
      {
        image: '/images/banners/bone-3.jpg',
        title: 'Для любых клинических случаев',
        subtitle: 'Широкий выбор объёмов и форм',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(139,115,85,0.7) 100%)'
      }
    ],
    membrane: [
      {
        image: '/images/banners/membrane-1.jpg',
        title: 'Мембраны для регенерации',
        subtitle: 'Резорбируемые и нерезорбируемые',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(0,128,128,0.7) 100%)'
      },
      {
        image: '/images/banners/membrane-2.jpg',
        title: 'НКР и НТР',
        subtitle: 'Направленная костная и тканевая регенерация',
        gradient: 'linear-gradient(135deg, rgba(139,115,85,0.85) 0%, rgba(180,160,130,0.7) 100%)'
      },
      {
        image: '/images/banners/membrane-3.jpg',
        title: 'Премиум качество',
        subtitle: 'Jason, Bio-Gide, Cytoplast',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(139,115,85,0.7) 100%)'
      }
    ],
    default: [
      {
        image: '/images/banners/default-1.jpg',
        title: 'Стоматологические материалы',
        subtitle: 'Всё для успешной имплантации',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(0,128,128,0.7) 100%)'
      },
      {
        image: '/images/banners/default-2.jpg',
        title: 'Доставка по России',
        subtitle: 'Быстрая доставка в любой регион',
        gradient: 'linear-gradient(135deg, rgba(139,115,85,0.85) 0%, rgba(180,160,130,0.7) 100%)'
      },
      {
        image: '/images/banners/default-3.jpg',
        title: 'Консультация специалиста',
        subtitle: 'Поможем подобрать оптимальное решение',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(139,115,85,0.7) 100%)'
      }
    ]
  },
  en: {
    implants: [
      {
        image: '/images/banners/implants-1.jpg',
        title: 'Premium Implants',
        subtitle: 'From leading global manufacturers',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(0,128,128,0.7) 100%)'
      },
      {
        image: '/images/banners/implants-2.jpg',
        title: 'Quality Guarantee',
        subtitle: 'Certified products with documentation',
        gradient: 'linear-gradient(135deg, rgba(139,115,85,0.85) 0%, rgba(180,160,130,0.7) 100%)'
      },
      {
        image: '/images/banners/implants-3.jpg',
        title: 'Competitive Prices',
        subtitle: 'Direct supplies without intermediaries',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(139,115,85,0.7) 100%)'
      }
    ],
    bone: [
      {
        image: '/images/banners/bone-1.jpg',
        title: 'Bone Materials',
        subtitle: 'Xenografts, allografts, synthetic materials',
        gradient: 'linear-gradient(135deg, rgba(139,115,85,0.85) 0%, rgba(180,160,130,0.7) 100%)'
      },
      {
        image: '/images/banners/bone-2.jpg',
        title: 'Trusted Brands',
        subtitle: 'Bio-Oss, Cerabone, Maxgraft and more',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(0,128,128,0.7) 100%)'
      },
      {
        image: '/images/banners/bone-3.jpg',
        title: 'For Any Clinical Case',
        subtitle: 'Wide selection of volumes and forms',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(139,115,85,0.7) 100%)'
      }
    ],
    membrane: [
      {
        image: '/images/banners/membrane-1.jpg',
        title: 'Regeneration Membranes',
        subtitle: 'Resorbable and non-resorbable',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(0,128,128,0.7) 100%)'
      },
      {
        image: '/images/banners/membrane-2.jpg',
        title: 'GBR and GTR',
        subtitle: 'Guided bone and tissue regeneration',
        gradient: 'linear-gradient(135deg, rgba(139,115,85,0.85) 0%, rgba(180,160,130,0.7) 100%)'
      },
      {
        image: '/images/banners/membrane-3.jpg',
        title: 'Premium Quality',
        subtitle: 'Jason, Bio-Gide, Cytoplast',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(139,115,85,0.7) 100%)'
      }
    ],
    default: [
      {
        image: '/images/banners/default-1.jpg',
        title: 'Dental Materials',
        subtitle: 'Everything for successful implantation',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(0,128,128,0.7) 100%)'
      },
      {
        image: '/images/banners/default-2.jpg',
        title: 'Worldwide Delivery',
        subtitle: 'Fast delivery to any region',
        gradient: 'linear-gradient(135deg, rgba(139,115,85,0.85) 0%, rgba(180,160,130,0.7) 100%)'
      },
      {
        image: '/images/banners/default-3.jpg',
        title: 'Expert Consultation',
        subtitle: 'We will help you find the optimal solution',
        gradient: 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(139,115,85,0.7) 100%)'
      }
    ]
  }
}

function CategoryBanner({ category }) {
  const { language } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Получаем слайды для текущей категории или дефолтные
  const langConfig = slidesConfig[language] || slidesConfig.ru
  const slides = langConfig[category] || langConfig.default

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Возобновляем автопроигрывание через 10 секунд после ручного переключения
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  // Автопереключение слайдов
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  // Пауза при наведении
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <div
      className="category-banner"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="banner-slides">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `${slide.gradient}, url(${slide.image})`,
              backgroundColor: '#004d4d'
            }}
          >
            <div className="slide-content">
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Стрелки навигации */}
      <button className="banner-arrow banner-arrow-prev" onClick={prevSlide} aria-label={language === 'en' ? 'Previous slide' : 'Предыдущий слайд'}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button className="banner-arrow banner-arrow-next" onClick={nextSlide} aria-label={language === 'en' ? 'Next slide' : 'Следующий слайд'}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Индикаторы */}
      <div className="banner-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={language === 'en' ? `Slide ${index + 1}` : `Слайд ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default CategoryBanner
