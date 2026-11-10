import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import ProductImage from "../components/product/ProductImage";
import usePageTitle from "../hooks/usePageTitle";
import { formatPrice } from "../utils/format";


export default function Cart() {
  usePageTitle("Carrinho");
  const { items, removeItem, updateQuantity, applyCoupon, coupon, subtotal, discount, total } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    setCouponMsg(ok ? { type: "ok", text: "Cupom aplicado com sucesso!" } : { type: "error", text: "Cupom inválido." });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-catalina-cream text-catalina-text  flex flex-col items-center justify-center text-center px-5">
        <p className="text-[22px] mb-3">Seu carrinho está vazio</p>
        <p className="text-[14px] text-catalina-muted mb-6">Explore nossas coleções e comece a montar o seu grande dia.</p>
        <Link to="/produtos/vestidos" className="bg-catalina-green text-white text-[13px] tracking-wide px-7 py-3 rounded-sm hover:bg-catalina-greenDark transition-colors">
          EXPLORAR PRODUTOS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-catalina-cream text-catalina-text ">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <h1 className="text-[26px] mb-8">Seu carrinho</h1>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          <div className="flex flex-col gap-5">
            {items.map((item) => (
              <div key={item.key} className="flex items-center gap-4 border-b border-catalina-sand pb-5">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <ProductImage src={item.localImage} query={item.imageQuery} alt={item.name} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px]">{item.name}</p>
                  <p className="text-[12px] text-catalina-muted">
                    {item.size !== "Único" && `Tam: ${item.size} · `}Cor: {item.color}
                  </p>
                  <p className="text-[14px] text-catalina-sage mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center border border-catalina-border rounded-sm">
                  <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-8 h-9 flex items-center justify-center hover:bg-catalina-sand" aria-label="Diminuir">
                    <Minus size={12} />
                  </button>
                  <span className="w-7 text-center text-[13px]">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-8 h-9 flex items-center justify-center hover:bg-catalina-sand" aria-label="Aumentar">
                    <Plus size={12} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.key)} aria-label="Remover" className="text-catalina-muted hover:text-[#B23A3A] transition-colors">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white border border-catalina-sand rounded-sm p-6 h-fit">
            <h2 className="text-[16px] mb-4">Resumo do pedido</h2>

            <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 mb-4">
              <div className="flex items-center flex-1 border border-catalina-border rounded-sm px-2">
                <Tag size={13} className="text-catalina-muted mr-1.5" />
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Cupom de desconto"
                  className="text-[13px] py-2 outline-none w-full bg-transparent"
                />
              </div>
              <button type="submit" className="text-[12px] border border-catalina-green text-catalina-green px-3 py-2 rounded-sm hover:bg-catalina-green hover:text-white transition-colors">
                Aplicar
              </button>
            </form>
            {couponMsg && (
              <p className={`text-[12px] mb-4 ${couponMsg.type === "ok" ? "text-catalina-sage" : "text-[#B23A3A]"}`}>{couponMsg.text}</p>
            )}
            <p className="text-[11px] text-catalina-muted -mt-2 mb-4">Experimente: CATALINA10 ou NOIVA15</p>

            <div className="flex flex-col gap-2 text-[14px] text-[#4A4A3E] border-t border-catalina-sand pt-4">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {coupon && (
                <div className="flex justify-between text-catalina-sage">
                  <span>Desconto ({coupon.code})</span><span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between"><span>Frete</span><span>{subtotal >= 499 ? "Grátis" : "Calculado no checkout"}</span></div>
            </div>

            <div className="flex justify-between text-[18px] border-t border-catalina-sand mt-4 pt-4 mb-6">
              <span>Total</span><span className="text-catalina-sage">{formatPrice(total)}</span>
            </div>

            <button onClick={() => navigate("/checkout")} className="w-full bg-catalina-green text-white text-[13px] tracking-wide py-3 rounded-sm hover:bg-catalina-greenDark transition-colors">
              FINALIZAR COMPRA
            </button>
            <Link to="/produtos/vestidos" className="block text-center text-[12px] text-catalina-sage underline mt-4">
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
