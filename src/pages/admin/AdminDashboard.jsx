import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, Users, Package, LayoutGrid, ClipboardList } from "lucide-react";
import { PRODUCTS } from "../../data/mockProducts";
import ProductImage from "../../components/product/ProductImage";
import usePageTitle from "../../hooks/usePageTitle";

const STATS = [
  { label: "Vendas hoje", value: "R$ 4.890", icon: DollarSign },
  { label: "Pedidos", value: "27", icon: ShoppingBag },
  { label: "Clientes", value: "1.248", icon: Users },
  { label: "Produtos", value: String(PRODUCTS.length), icon: Package },
];

export default function AdminDashboard() {
  usePageTitle("Painel");
  return (
    <div className="min-h-screen bg-catalina-cream text-catalina-text ">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[26px]">Catalina Admin</h1>
          <div className="flex gap-3">
            <Link to="/admin/produtos" className="flex items-center gap-2 text-[13px] border border-catalina-border px-4 py-2 rounded-sm hover:border-catalina-green">
              <LayoutGrid size={14} /> Produtos
            </Link>
            <Link to="/admin/pedidos" className="flex items-center gap-2 text-[13px] border border-catalina-border px-4 py-2 rounded-sm hover:border-catalina-green">
              <ClipboardList size={14} /> Pedidos
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-10">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border border-catalina-sand rounded-sm p-5">
              <Icon size={18} className="text-catalina-sage mb-3" />
              <p className="text-[22px]">{value}</p>
              <p className="text-[12px] text-catalina-muted">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-catalina-sand rounded-sm p-6">
          <h2 className="text-[16px] mb-4">Produtos mais vendidos</h2>
          <div className="flex flex-col gap-3">
            {PRODUCTS.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between border-b border-catalina-sand pb-3 last:border-0 text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="text-catalina-muted w-4">{i + 1}.</span>
                  <span className="relative w-9 h-9 rounded-lg overflow-hidden inline-block"><ProductImage src={p.localImage} alt={p.name} /></span>
                  <span>{p.name}</span>
                </div>
                <span className="text-catalina-muted">{p.reviews} vendas</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
