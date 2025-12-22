// SVG иконки категорий - белые контурные
// Работают на любом фоне, цвет через CSS

export const ImplantsIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Коронка */}
    <path d="M20 8 Q32 4 44 8 L46 16 Q32 20 18 16 Z" />
    {/* Абатмент */}
    <rect x="26" y="16" width="12" height="8" rx="1" />
    {/* Имплант */}
    <path d="M27 24 L37 24 L34 56 Q32 60 30 56 Z" />
    {/* Резьба */}
    <line x1="26" y1="32" x2="38" y2="32" />
    <line x1="27" y1="40" x2="37" y2="40" />
    <line x1="28" y1="48" x2="36" y2="48" />
  </svg>
)

export const ComponentsIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Абатмент 1 */}
    <rect x="8" y="16" width="20" height="32" rx="4" />
    <circle cx="18" cy="32" r="5" />
    <line x1="8" y1="24" x2="28" y2="24" />
    {/* Абатмент 2 */}
    <rect x="36" y="20" width="18" height="24" rx="3" />
    <circle cx="45" cy="32" r="4" />
    {/* Винты */}
    <circle cx="14" cy="56" r="4" />
    <line x1="11" y1="56" x2="17" y2="56" />
    <circle cx="30" cy="56" r="4" />
    <line x1="30" y1="53" x2="30" y2="59" />
    <circle cx="46" cy="56" r="3" />
  </svg>
)

export const BoneIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Контейнер */}
    <rect x="14" y="10" width="36" height="44" rx="4" />
    <line x1="14" y1="20" x2="50" y2="20" />
    {/* Гранулы */}
    <circle cx="24" cy="32" r="5" />
    <circle cx="38" cy="30" r="6" />
    <circle cx="28" cy="44" r="5" />
    <circle cx="42" cy="42" r="4" />
    <circle cx="22" cy="50" r="3" />
    <circle cx="38" cy="50" r="3" />
  </svg>
)

export const MembraneIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Лист мембраны */}
    <rect x="8" y="10" width="48" height="44" rx="4" />
    {/* Волны */}
    <path d="M12 20 Q32 14 52 20" />
    <path d="M12 30 Q32 24 52 30" />
    <path d="M12 40 Q32 34 52 40" />
    {/* Вертикали */}
    <line x1="22" y1="14" x2="22" y2="50" opacity="0.4" />
    <line x1="32" y1="12" x2="32" y2="52" opacity="0.4" />
    <line x1="42" y1="14" x2="42" y2="50" opacity="0.4" />
  </svg>
)

export const SuppliesIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Зеркало */}
    <circle cx="18" cy="18" r="10" />
    <circle cx="18" cy="18" r="6" />
    <line x1="26" y1="24" x2="36" y2="34" />
    {/* Зонд */}
    <line x1="46" y1="8" x2="46" y2="34" />
    <circle cx="46" cy="38" r="3" />
    <rect x="44" y="6" width="4" height="6" rx="1" />
    {/* Пинцет */}
    <path d="M8 44 Q6 52 10 60" />
    <path d="M16 44 Q18 52 14 60" />
    <rect x="6" y="42" width="12" height="4" rx="1" />
    {/* Шприц */}
    <rect x="28" y="48" width="28" height="8" rx="2" />
    <rect x="56" y="50" width="6" height="4" rx="2" />
    <rect x="24" y="50" width="6" height="4" />
  </svg>
)

// Маппинг по slug
export const categoryIcons = {
  implants: ImplantsIcon,
  components: ComponentsIcon,
  bone: BoneIcon,
  membrane: MembraneIcon,
  supplies: SuppliesIcon
}

export default categoryIcons
