import './Logo.css'

function Logo({ size = 'medium', className = '' }) {
  return (
    <div className={`logo-container logo-${size} ${className}`}>
      <img
        src="/images/logo-dutystom.png"
        alt="DUTYSTOM"
        className="logo-image"
      />
    </div>
  )
}

export default Logo
