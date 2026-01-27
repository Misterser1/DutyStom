import Cart from '../components/Cart/Cart'
import { useLanguage } from '../contexts/LanguageContext'

function CartPage() {
  const { t } = useLanguage()

  return (
    <div className="cart-page">
      <h1 className="page-title">{t('cart.title')}</h1>
      <Cart />
    </div>
  )
}

export default CartPage
