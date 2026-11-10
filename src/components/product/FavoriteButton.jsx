import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";

/**
 * variant "overlay": botão redondo sobre a foto do card (posicionado no canto).
 * variant "square": botão quadrado ao lado de "Adicionar ao carrinho".
 */
export default function FavoriteButton({ productId, variant = "overlay" }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(productId);

  const handleClick = (e) => {
    // Os cards ficam dentro de um <Link>; sem isto, o clique abriria o produto.
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
  };

  const label = active ? "Remover dos favoritos" : "Adicionar aos favoritos";

  if (variant === "square") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        aria-pressed={active}
        className={`w-11 h-11 flex-shrink-0 rounded-xl border flex items-center justify-center transition-colors ${
          active ? "border-catalina-green text-catalina-green bg-catalina-sand" : "border-catalina-border text-[#4A4A3E] hover:border-catalina-green"
        }`}
      >
        <Heart size={16} fill={active ? "currentColor" : "none"} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={active}
      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-catalina-green hover:bg-white transition-colors"
    >
      <Heart size={16} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
