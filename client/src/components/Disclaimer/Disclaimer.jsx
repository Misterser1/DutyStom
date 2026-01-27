import { useLanguage } from '../../contexts/LanguageContext'
import './Disclaimer.css'

function Disclaimer() {
  const { language } = useLanguage()

  const content = {
    ru: {
      title: '© 2013-2025 ООО «DUTYSTOM». Все права защищены.',
      text: 'Обращаем Ваше внимание на то, что данный Сайт носит исключительно информационный (ознакомительный) характер, предназначенный для профессионального использования работниками здравоохранения, и ни при каких условиях информационные материалы и цены, размещенные на сайте, не являются публичной офертой, определяемой положениями Ст.437 Гражданского кодекса РФ. Указанные на сайте цены, комплектации, технические характеристики и инструкции могут быть изменены в любое время без предварительного уведомления пользователей. Представленная на Сайте информация о товарах не означает, что данный товар есть в наличии для продажи. Оттенок цвета изделий может отличаться от представленного на Сайте изображения. Для получения подробной информации, пожалуйста, свяжитесь с менеджерами компании'
    },
    en: {
      title: '© 2013-2025 DUTYSTOM LLC. All rights reserved.',
      text: 'Please note that this Website is for informational purposes only, intended for professional use by healthcare professionals, and under no circumstances do the information materials and prices posted on the site constitute a public offer as defined by Article 437 of the Civil Code of the Russian Federation. Prices, configurations, technical specifications and instructions indicated on the site may be changed at any time without prior notice to users. Information about products presented on the Site does not mean that the product is in stock for sale. The color shade of products may differ from the image on the Site. For more information, please contact our company managers'
    }
  }

  return (
    <div className="disclaimer">
      <div className="disclaimer-content">
        <div className="disclaimer-title">{content[language].title}</div>
        <div className="disclaimer-text">
          {content[language].text} <span className="disclaimer-contact">info@dutystom.ru</span> <span className="disclaimer-contact">+7 930-950-88-87</span>
        </div>
      </div>
    </div>
  )
}

export default Disclaimer
