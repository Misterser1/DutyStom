import { createContext, useContext, useState, useEffect } from 'react'

// Переводы UI
import ruLocale from '../locales/ru.json'
import enLocale from '../locales/en.json'

const locales = {
  ru: ruLocale,
  en: enLocale
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Получаем сохранённый язык из localStorage или используем русский по умолчанию
    const saved = localStorage.getItem('dutystom_language')
    return saved || 'ru'
  })

  useEffect(() => {
    // Сохраняем выбранный язык
    localStorage.setItem('dutystom_language', language)
    // Устанавливаем атрибут lang для HTML
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ru' ? 'en' : 'ru')
  }

  // Функция перевода UI строк
  const t = (key) => {
    const keys = key.split('.')
    let value = locales[language]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Возвращаем ключ если перевод не найден
      }
    }

    return value || key
  }

  // Функция получения локализованного значения из объекта продукта
  const getLocalized = (item, field) => {
    if (!item) return ''

    if (language === 'en') {
      // Пробуем получить английскую версию
      const enField = `${field}_en`
      if (item[enField]) {
        return item[enField]
      }
    }

    // Возвращаем русскую версию (по умолчанию)
    return item[field] || ''
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    getLocalized,
    isRussian: language === 'ru',
    isEnglish: language === 'en'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext
