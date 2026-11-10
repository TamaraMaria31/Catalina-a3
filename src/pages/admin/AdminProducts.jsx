import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES } from "../../data/mockProducts";
import ProductImage from "../../components/product/ProductImage";
import usePageTitle from "../../hooks/usePageTitle";
import { formatPrice } from "../../utils/format";


const EMPTY_FORM = { name: "", category: CATEGORIES[0].slug, price: "", localImage: "" };

export default function AdminProducts() {
  usePageTitle("Produtos (admin)");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({ name: p.name, category: p.category, price: p.price, localImage: p.localImage || "" });
    setEditingId(p.id);
    setShowForm(true);
  };

  const remove = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form, price: Number(form.price) } : p)));
    } else {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      setProducts((prev) => [
        ...prev,
        { id: newId, ...form, price: Number(form.price), style: "Novo", size: ["Único"], color: "—", rating: 0, reviews: 0, description: "" },
      ]);
    }
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-catalina-cream text-catalina-text ">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[26px]">Produtos</h1>
          <button onClick={openNew} className="flex items-center gap-2 bg-catalina-green text-white text-[13px] px-4 py-2.5 rounded-sm hover:bg-catalina-greenDark transition-colors">
            <Plus size={15} /> Novo produto
          </button>
        </div>

        <div className="bg-white border border-catalina-sand rounded-sm overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-catalina-sand text-left text-catalina-muted">
                <th className="p-4 font-normal">Produto</th>
                <th className="p-4 font-normal">Categoria</th>
                <th className="p-4 font-normal">Preço</th>
                <th className="p-4 font-normal">Avaliação</th>
                <th className="p-4 font-normal text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-catalina-sand last:border-0">
                  <td className="p-4 flex items-center gap-3"><span className="relative w-9 h-9 rounded-lg overflow-hidden inline-block"><ProductImage src={p.localImage} alt={p.name} /></span> {p.name}</td>
                  <td className="p-4 capitalize text-catalina-muted">{p.category}</td>
                  <td className="p-4">{formatPrice(p.price)}</td>
                  <td className="p-4 text-catalina-muted">{p.rating ? `${p.rating} (${p.reviews})` : "—"}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(p)} aria-label="Editar" className="text-catalina-sage hover:text-catalina-greenDark"><Pencil size={15} /></button>
                      <button onClick={() => remove(p.id)} aria-label="Excluir" className="text-catalina-muted hover:text-[#B23A3A]"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-5" onClick={() => setShowForm(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="bg-catalina-cream w-full max-w-md rounded-sm p-6 ">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px]">{editingId ? "Editar produto" : "Novo produto"}</h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Fechar"><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input required placeholder="Nome do produto" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border border-catalina-border rounded-sm px-3 py-2.5 text-[14px] outline-none focus:border-catalina-green" />
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="border border-catalina-border rounded-sm px-3 py-2.5 text-[14px] outline-none focus:border-catalina-green">
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
              <input required type="number" step="0.01" placeholder="Preço" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="border border-catalina-border rounded-sm px-3 py-2.5 text-[14px] outline-none focus:border-catalina-green" />
              <input placeholder="Caminho da imagem (ex: /images/products/vestido.jpg)" value={form.localImage} onChange={(e) => setForm((f) => ({ ...f, localImage: e.target.value }))} className="border border-catalina-border rounded-sm px-3 py-2.5 text-[14px] outline-none focus:border-catalina-green" />
            </div>
            <button type="submit" className="w-full bg-catalina-green text-white text-[13px] tracking-wide py-3 rounded-sm hover:bg-catalina-greenDark transition-colors mt-5">
              {editingId ? "SALVAR ALTERAÇÕES" : "CRIAR PRODUTO"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
