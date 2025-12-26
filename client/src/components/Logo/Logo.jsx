import './Logo.css'

function Logo({ size = 'medium', className = '' }) {
  // Размеры для разных вариантов
  const sizes = {
    small: { height: 40 },
    medium: { height: 55 },
    large: { height: 75 }
  }

  const { height } = sizes[size] || sizes.medium

  return (
    <img
      src="/images/logo-dutystom.png"
      alt="DUTYSTOM"
      className={`logo-img ${className}`}
      style={{ height: `${height}px`, width: 'auto' }}
    />
  )
}

export default Logo
