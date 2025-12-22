import { useState } from 'react'
import './DisclaimerDemo.css'

const disclaimerText = `Обращаем Ваше внимание на то, что данный Сайт носит исключительно информационный (ознакомительный) характер, предназначенный для профессионального использования работниками здравоохранения, и ни при каких условиях информационные материалы и цены, размещенные на сайте, не являются публичной офертой, определяемой положениями Ст.437 Гражданского кодекса РФ. Указанные на сайте цены, комплектации, технические характеристики и инструкции могут быть изменены в любое время без предварительного уведомления пользователей. Представленная на Сайте информация о товарах не означает, что данный товар есть в наличии для продажи. Оттенок цвета изделий может отличаться от представленного на Сайте изображения.`

function DisclaimerDemo() {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="disclaimer-demo">
      <h1>Юридический текст (Дисклеймер)</h1>
      <p className="demo-description">
        Текст размещается под категориями, над карточками товаров
      </p>

      {/* Вариант 1: Компактный серый */}
      <div className="demo-section">
        <h2>Вариант 1: Компактный серый</h2>
        <p>Нейтральный фон, мелкий текст</p>
        <div className="mock-categories-bar">
          <div className="mock-cat">Имплантаты</div>
          <div className="mock-cat">Компоненты</div>
          <div className="mock-cat">Костные материалы</div>
        </div>
        <div className="disclaimer-v1">
          <div className="disclaimer-title">© 2013-2025 ООО «DUTYSTOM». Все права защищены.</div>
          <div className="disclaimer-text">
            {disclaimerText} Для получения подробной информации, пожалуйста, свяжитесь с менеджерами компании <span className="disclaimer-contact">info@dutystom.ru</span> <span className="disclaimer-contact">+7 930-950-88-87</span>
          </div>
        </div>
        <div className="mock-products">
          <div className="mock-product-card">
            <span className="mock-product-name">DIO UF II HSA</span>
            <span className="mock-product-price">2 500 ₽</span>
          </div>
        </div>
      </div>

      {/* Вариант 2: Градиентная полоса */}
      <div className="demo-section">
        <h2>Вариант 2: Градиентная полоса</h2>
        <p>В цветах сайта, золотые акценты</p>
        <div className="mock-categories-bar">
          <div className="mock-cat">Имплантаты</div>
          <div className="mock-cat">Компоненты</div>
          <div className="mock-cat">Костные материалы</div>
        </div>
        <div className="disclaimer-v2">
          <div className="disclaimer-title">© 2013-2025 ООО «DUTYSTOM». Все права защищены.</div>
          <div className="disclaimer-text">
            {disclaimerText} Для получения подробной информации, пожалуйста, свяжитесь с менеджерами компании <span className="disclaimer-contact">info@dutystom.ru</span> <span className="disclaimer-contact">+7 930-950-88-87</span>
          </div>
        </div>
        <div className="mock-products">
          <div className="mock-product-card">
            <span className="mock-product-name">DIO UF II HSA</span>
            <span className="mock-product-price">2 500 ₽</span>
          </div>
        </div>
      </div>

      {/* Вариант 3: Светлый с рамкой */}
      <div className="demo-section">
        <h2>Вариант 3: Светлый с иконкой</h2>
        <p>Белый фон с рамкой и иконкой информации</p>
        <div className="mock-categories-bar">
          <div className="mock-cat">Имплантаты</div>
          <div className="mock-cat">Компоненты</div>
          <div className="mock-cat">Костные материалы</div>
        </div>
        <div className="disclaimer-v3">
          <div className="disclaimer-title">
            <span className="disclaimer-icon">ℹ️</span>
            © 2013-2025 ООО «DUTYSTOM». Все права защищены.
          </div>
          <div className="disclaimer-text">
            {disclaimerText} Для получения подробной информации, пожалуйста, свяжитесь с менеджерами компании <span className="disclaimer-contact">info@dutystom.ru</span> <span className="disclaimer-contact">+7 930-950-88-87</span>
          </div>
        </div>
        <div className="mock-products">
          <div className="mock-product-card">
            <span className="mock-product-name">DIO UF II HSA</span>
            <span className="mock-product-price">2 500 ₽</span>
          </div>
        </div>
      </div>

      {/* Вариант 4: Минималистичный */}
      <div className="demo-section">
        <h2>Вариант 4: Минималистичный</h2>
        <p>Боковая линия-акцент, очень компактный</p>
        <div className="mock-categories-bar">
          <div className="mock-cat">Имплантаты</div>
          <div className="mock-cat">Компоненты</div>
          <div className="mock-cat">Костные материалы</div>
        </div>
        <div className="disclaimer-v4">
          <div className="disclaimer-text">
            © 2013-2025 ООО «DUTYSTOM». Все права защищены. {disclaimerText} Контакты: <span className="disclaimer-contact">info@dutystom.ru</span> | <span className="disclaimer-contact">+7 930-950-88-87</span>
          </div>
        </div>
        <div className="mock-products">
          <div className="mock-product-card">
            <span className="mock-product-name">DIO UF II HSA</span>
            <span className="mock-product-price">2 500 ₽</span>
          </div>
        </div>
      </div>

      {/* Вариант 5: Сворачиваемый */}
      <div className="demo-section">
        <h2>Вариант 5: Сворачиваемый</h2>
        <p>Можно свернуть/развернуть по клику</p>
        <div className="mock-categories-bar">
          <div className="mock-cat">Имплантаты</div>
          <div className="mock-cat">Компоненты</div>
          <div className="mock-cat">Костные материалы</div>
        </div>
        <div className="disclaimer-v5">
          <div className="disclaimer-v5-header" onClick={() => setExpanded(!expanded)}>
            <div className="disclaimer-v5-title">
              <span>ℹ️</span>
              © 2013-2025 ООО «DUTYSTOM». Правовая информация
            </div>
            <div className="disclaimer-v5-toggle">
              {expanded ? '▲ Свернуть' : '▼ Развернуть'}
            </div>
          </div>
          {expanded && (
            <div className="disclaimer-v5-content">
              <div className="disclaimer-text">
                {disclaimerText} Для получения подробной информации, пожалуйста, свяжитесь с менеджерами компании <span className="disclaimer-contact">info@dutystom.ru</span> <span className="disclaimer-contact">+7 930-950-88-87</span>
              </div>
            </div>
          )}
        </div>
        <div className="mock-products">
          <div className="mock-product-card">
            <span className="mock-product-name">DIO UF II HSA</span>
            <span className="mock-product-price">2 500 ₽</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisclaimerDemo
