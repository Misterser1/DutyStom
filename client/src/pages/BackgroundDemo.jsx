import './BackgroundDemo.css'

const patterns = [
  {
    id: 1,
    name: 'Вариант 1: Мягкое мерцание',
    description: 'Плавно мерцающие бирюзовые точки',
    className: 'pattern-1'
  },
  {
    id: 2,
    name: 'Вариант 2: Искры',
    description: 'Бирюзовые и бежевые искры с пульсацией',
    className: 'pattern-2'
  },
  {
    id: 3,
    name: 'Вариант 3: Звёздочки',
    description: 'Мигающие звёздочки двух цветов',
    className: 'pattern-3'
  },
  {
    id: 4,
    name: 'Вариант 4: Пульсирующие капли',
    description: 'Мягкие пульсирующие круги',
    className: 'pattern-4'
  },
  {
    id: 5,
    name: 'Вариант 5: Волшебная пыль',
    description: 'Парящие частички с лёгким движением',
    className: 'pattern-5'
  }
]

function BackgroundDemo() {
  return (
    <div className="background-demo">
      <h1>Мерцающие блёстки</h1>
      <p className="subtitle">Выберите вариант анимированного фона для белых областей сайта</p>

      <div className="patterns-grid">
        {patterns.map(pattern => (
          <div key={pattern.id} className="pattern-card">
            <div className="pattern-header">
              <h3>{pattern.name}</h3>
              <p>{pattern.description}</p>
            </div>
            <div className={`pattern-preview ${pattern.className}`}>
              <div className="demo-product-card">
                <div className="brand">DIO</div>
                <div className="name">DIO UF II HSA</div>
                <div className="price">2 500 P</div>
                <div className="btn">В корзину</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BackgroundDemo
