import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";

const NAV_LINKS = [
  { label: "Vestidos", to: "/produtos/vestidos" },
  { label: "Madrinhas", to: "/produtos/madrinhas" },
  { label: "Joias", to: "/produtos/joias" },
  { label: "Véus", to: "/produtos/veus" },
  { label: "Decoração", to: "/produtos/decoracao" },
  { label: "Lista de Casamento", to: "/lista-de-casamento" },
  { label: "Planejador", to: "/planejador" },
];

function CountBadge({ value }) {
  if (!value) return null;
  return (
    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-catalina-green text-white text-[10px] flex items-center justify-center">
      {value}
    </span>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { count: favoriteCount } = useFavorites();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/produtos/vestidos?busca=${encodeURIComponent(query)}`);
      closeMenu();
    }
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  const searchForm = (className) => (
    <form onSubmit={handleSearch} className={className}>
      <Search size={14} className="text-catalina-muted mr-1.5 flex-shrink-0" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
        aria-label="Buscar produtos"
        className="text-[13px] outline-none w-full bg-transparent"
      />
    </form>
  );

  return (
    <>
      <div className="bg-catalina-green text-[#F1ECE1] text-center text-[12px] py-2 px-4 tracking-wide">
        Frete grátis para compras acima de R$ 499
      </div>

      <header className="border-b border-catalina-sand bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
          <button className="lg:hidden text-catalina-text" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex flex-col items-center lg:items-start">
            <span className="text-xl tracking-[0.15em]  text-catalina-text">CATALINA</span>
            <span className="text-[9px] tracking-[0.35em] text-catalina-muted -mt-1">MARRIAGE</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[13px] text-[#4A4A3E] ">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="hover:text-catalina-sage transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-catalina-text">
            {searchForm("hidden xl:flex items-center border border-catalina-border rounded-full px-3 py-1.5 w-40")}

            {user ? (
              <Link to="/minha-conta" aria-label="Minha conta" className="flex items-center gap-1.5 hover:text-catalina-sage transition-colors">
                <User size={18} />
                <span className="text-[12px] hidden lg:inline max-w-24 truncate">{user.name}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" aria-label="Entrar" className="lg:hidden hover:text-catalina-sage transition-colors">
                  <User size={18} />
                </Link>
                <div className="hidden lg:flex items-center gap-3 text-[13px] ">
                  <Link to="/login" className="hover:text-catalina-sage transition-colors">Entrar</Link>
                  <Link to="/cadastro" className="bg-catalina-green text-white px-4 py-1.5 rounded-full hover:bg-catalina-greenDark transition-colors">
                    Criar conta
                  </Link>
                </div>
              </>
            )}

            <Link to="/favoritos" aria-label="Meus favoritos" className="relative hover:text-catalina-sage transition-colors">
              <Heart size={18} />
              <CountBadge value={favoriteCount} />
            </Link>
            <Link to="/carrinho" aria-label="Carrinho" className="relative hover:text-catalina-sage transition-colors">
              <ShoppingBag size={18} />
              <CountBadge value={itemCount} />
            </Link>
          </div>
        </div>

        {menuOpen && (
          <nav className="lg:hidden flex flex-col px-5 pb-5 gap-3 text-sm text-[#4A4A3E]  border-t border-catalina-sand pt-4">
            {searchForm("flex items-center border border-catalina-border rounded-full px-3 py-2 mb-1")}
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="py-1" onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
            <Link to="/favoritos" className="py-1" onClick={closeMenu}>
              Meus favoritos{favoriteCount > 0 && ` (${favoriteCount})`}
            </Link>

            <div className="border-t border-catalina-sand pt-4 mt-1 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/minha-conta" className="py-1" onClick={closeMenu}>Minha conta ({user.name})</Link>
                  <button onClick={handleLogout} className="text-left py-1 text-catalina-muted">Sair</button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={closeMenu} className="flex-1 text-center border border-catalina-green text-catalina-green py-2.5 rounded-full">
                    Entrar
                  </Link>
                  <Link to="/cadastro" onClick={closeMenu} className="flex-1 text-center bg-catalina-green text-white py-2.5 rounded-full">
                    Criar conta
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
