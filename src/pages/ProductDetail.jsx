import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, Minus, Plus, Truck, RotateCcw, ShieldCheck, ChevronRight } from "lucide-react";
import { getProductById } from "../data/mockProducts";
import { useCart } from "../context/CartContext";
import ProductImage from "../components/product/ProductImage";
import FavoriteButton from "../components/product/FavoriteButton";
import usePageTitle from "../hooks/usePageTitle";
import { formatPrice } from "../utils/format";


const REVIEWS = [
  { name: "Marina S.", rating: 5, comment: "O caimento é impecável, superou minhas expectativas. Atendimento super atencioso durante toda a prova." },
  { name: "Beatriz A.", rating: 5, comment: "Produto lindíssimo, qualidade excelente. Recebi muitos elogios no dia do casamento." },
  { name: "Juliana P.", rating: 4, comment: "Muito bonito, só achei a entrega um pouco demorada. Mas valeu a espera." },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addItem } = useCart();
  usePageTitle(product ? product.name : "Produto não encontrado");

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <p className="text-[18px] mb-4">Produto não encontrado.</p>
        <Link to="/" className="text-catalina-sage underline">Voltar para a home</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.size[0] !== "Único" && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem(product, { size: selectedSize || "Único", color: product.color, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-catalina-cream text-catalina-text">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <p className="text-[12px] text-catalina-muted mb-6 flex items-center gap-1">
          <Link to={`/produtos/${product.category}`}>Produtos</Link> <ChevronRight size={12} /> {product.name}
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden mb-3">
              <ProductImage src={product.localImage} query={product.imageQuery} alt={product.name} />
            </div>
          </div>

          <div>
            <p className="text-[12px] tracking-[0.15em] text-catalina-muted mb-2">{product.style.toUpperCase()}</p>
            <h1 className="text-[28px] mb-2">{product.name}</h1>

            <div className="flex items-center gap-1.5 mb-4 text-catalina-gold">
              <Star size={14} fill="currentColor" strokeWidth={0} />
              <span className="text-[13px] text-[#4A4A3E]">{product.rating}</span>
              <span className="text-[13px] text-catalina-muted">({product.reviews} avaliações)</span>
            </div>

            <p className="text-[26px] text-catalina-sage mb-1">{formatPrice(product.price)}</p>
            <p className="text-[13px] text-catalina-muted mb-6">
              10x de {formatPrice(product.price / 10)} sem juros
            </p>

            <p className="text-[14px] text-[#4A4A3E] leading-relaxed mb-6">{product.description}</p>

            <div className="mb-2">
              <p className="text-[13px] mb-2.5">
                {product.size[0] === "Único" ? "Cor" : "Tamanho"}: <span className="text-[#4A4A3E]">{product.color}</span>
              </p>
              {product.size[0] !== "Único" && (
                <div className="flex flex-wrap gap-2">
                  {product.size.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setSizeError(false); }}
                      className={`min-w-11 h-11 px-3 rounded-xl border text-[13px] transition-colors ${selectedSize === s ? "bg-catalina-green border-catalina-green text-white" : "border-catalina-border text-[#4A4A3E] hover:border-catalina-green"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {sizeError && <p className="text-[12px] text-[#B23A3A] mt-2">Escolha um tamanho antes de continuar.</p>}
            </div>

            <div className="flex items-center gap-4 mt-6 mb-4">
              <div className="flex items-center border border-catalina-border rounded-xl">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center hover:bg-catalina-sand" aria-label="Diminuir">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-[14px]">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-11 flex items-center justify-center hover:bg-catalina-sand" aria-label="Aumentar">
                  <Plus size={14} />
                </button>
              </div>

              <button onClick={handleAddToCart} className="flex-1 bg-catalina-green text-white text-[13px] tracking-wide py-3 rounded-xl hover:bg-catalina-greenDark transition-colors">
                {added ? "Adicionado ✓" : "ADICIONAR AO CARRINHO"}
              </button>

              <FavoriteButton productId={product.id} variant="square" />
            </div>

            {added && (
              <button onClick={() => navigate("/carrinho")} className="text-[13px] text-catalina-sage underline mb-4">
                Ver carrinho e finalizar compra →
              </button>
            )}

            <div className="border-t border-catalina-sand mt-6 pt-6 flex flex-col gap-3 text-[13px] text-[#4A4A3E]">
              <div className="flex items-center gap-3"><Truck size={16} className="text-catalina-sage" /> Frete grátis para compras acima de R$ 499</div>
              <div className="flex items-center gap-3"><RotateCcw size={16} className="text-catalina-sage" /> Troca gratuita em até 15 dias</div>
              <div className="flex items-center gap-3"><ShieldCheck size={16} className="text-catalina-sage" /> Compra 100% segura</div>
            </div>
          </div>
        </div>

        <div className="border-t border-catalina-sand mt-14 pt-10 max-w-2xl">
          <h2 className="text-[20px] mb-6">Avaliações ({product.reviews})</h2>
          <div className="flex flex-col gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="border-b border-catalina-sand pb-6 last:border-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[14px]">{r.name}</p>
                  <div className="flex items-center gap-1 text-catalina-gold">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" strokeWidth={0} />)}
                  </div>
                </div>
                <p className="text-[13px] text-[#4A4A3E] leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
