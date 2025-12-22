import './CategoryIconsDemo.css'
import { categoryIcons } from '../components/CategoryIcons/CategoryIcons'

const categories = [
  { name: 'Имплантаты', slug: 'implants' },
  { name: 'Компоненты', slug: 'components' },
  { name: 'Костные материалы', slug: 'bone' },
  { name: 'Мембраны', slug: 'membrane' },
  { name: 'Расходники', slug: 'supplies' }
]

function CategoryIconsDemo() {
  return (
    <div className="icons-demo">
      <h1 className="icons-demo-title">SVG иконки категорий</h1>
      <p className="icons-demo-subtitle">Векторные иконки - работают на любом фоне</p>

      <div className="style-section">
        <div className="style-header">
          <h2>На teal фоне (как в категориях)</h2>
        </div>
        <div className="icons-row">
          {categories.map(cat => {
            const IconComponent = categoryIcons[cat.slug]
            return (
              <div key={cat.slug} className="icon-preview">
                <div className="icon-box">
                  <IconComponent />
                </div>
                <span className="icon-label">{cat.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="style-section">
        <div className="style-header">
          <h2>На светлом фоне</h2>
        </div>
        <div className="icons-row">
          {categories.map(cat => {
            const IconComponent = categoryIcons[cat.slug]
            return (
              <div key={cat.slug} className="icon-preview">
                <div className="icon-box-light">
                  <IconComponent />
                </div>
                <span className="icon-label">{cat.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CategoryIconsDemo
