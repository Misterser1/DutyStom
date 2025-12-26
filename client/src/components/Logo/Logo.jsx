import './Logo.css'

function Logo({ size = 'medium', className = '' }) {
  // Размеры для разных вариантов
  const sizes = {
    small: { fontSize: '16px' },
    medium: { fontSize: '24px' },
    large: { fontSize: '32px' }
  }

  const style = sizes[size] || sizes.medium

  return (
    <div className={`logo-text ${className}`} style={style}>
      DUTYSTOM
    </div>
  )
}

export default Logo
