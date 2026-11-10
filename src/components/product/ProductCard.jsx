import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import ProductImage from "./ProductImage";
import FavoriteButton from "./FavoriteButton";
import { formatPrice } from "../../utils/format";

/** Cartão de produto usado na home, na listagem e nos favoritos. */
export default function ProductCard({ product, showStyle = true }) {
  return (
    <Link to={`/produto/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <ProductImage src={product.localImage} query={product.imageQuery} alt={product.name} />
        <FavoriteButton productId={product.id} />
        {showStyle && (
          <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[11px] text-catalina-text">
            {product.style}
          </span>
        )}
      </div>
      <div className="pt-3">
        <h3 className="text-[21px] leading-tight">{product.name}</h3>
        <p className="mt-0.5 text-[15px] text-catalina-sage">{formatPrice(product.price)}</p>
        {product.reviews > 0 && (
          <div className="mt-1 flex items-center gap-1 text-catalina-gold">
            <Star size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            <span className="text-xs text-catalina-muted">
              {product.rating} ({product.reviews})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
