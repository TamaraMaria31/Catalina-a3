import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { PRODUCTS } from "../data/mockProducts";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import ProductImage from "../components/product/ProductImage";
import FavoriteButton from "../components/product/FavoriteButton";
import usePageTitle from "../hooks/usePageTitle";
import { formatPrice } from "../utils/format";


export default function Favorites() {
  usePageTitle("Favoritos");
  const { ids, error } = useFavorites();
  const { user } = useAuth();
  const products = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="min-h-[70vh] bg-catalina-cream text-catalina-text ">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-end justify-between mb-2">
          <h1 className="text-[26px]">Meus favoritos</h1>
          <p className="text-[13px] text-catalina-muted">{products.length} {products.length === 1 ? "produto" : "produtos"}</p>
        </div>

        {!user && (
          <p className="text-[13px] text-catalina-muted mb-8">
            Seus favoritos estão salvos neste aparelho.{" "}
            <Link to="/login" className="text-catalina-sage underline">Entre</Link> ou{" "}
            <Link to="/cadastro" className="text-catalina-sage underline">crie uma conta</Link> para guardá-los na sua conta.
          </p>
        )}
        {user && <div className="mb-8" />}

        {error && <p className="text-[13px] text-[#B23A3A] mb-6">{error}</p>}

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={40} strokeWidth={1.25} className="text-catalina-sage mx-auto mb-4" />
            <p className="text-[16px] mb-2">Você ainda não favoritou nenhum produto</p>
            <p className="text-[13px] text-catalina-muted mb-6">Toque no coração de um produto para guardá-lo aqui.</p>
            <Link to="/produtos/vestidos" className="bg-catalina-green text-white text-[13px] tracking-wide px-7 py-3 rounded-xl hover:bg-catalina-greenDark transition-colors">
              EXPLORAR PRODUTOS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {products.map((p) => (
              <Link key={p.id} to={`/produto/${p.id}`} className="group">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <ProductImage src={p.localImage} query={p.imageQuery} alt={p.name} />
                  <FavoriteButton productId={p.id} />
                </div>
                <div className="pt-3">
                  <p className="text-[15px]">{p.name}</p>
                  <p className="text-[15px] text-catalina-sage mt-0.5">{formatPrice(p.price)}</p>
                  <div className="flex items-center gap-1 mt-1 text-catalina-gold">
                    <Star size={13} fill="currentColor" strokeWidth={0} />
                    <span className="text-xs text-catalina-muted">{p.rating} ({p.reviews})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
