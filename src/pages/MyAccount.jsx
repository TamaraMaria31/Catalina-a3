import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { LogOut, Package, CalendarHeart, ListChecks } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

const MOCK_ORDERS = [
  { id: 583920, date: "02/09/2026", status: "Entregue", total: 3899.9, items: "Vestido Aurora" },
  { id: 583455, date: "18/08/2026", status: "Em transporte", total: 449.8, items: "Buquê Rosé, Tiara Crystal" },
];

const DEFAULT_CHECKLIST = [
  { label: "Escolher vestido", done: true },
  { label: "Escolher decoração", done: true },
  { label: "Enviar convites", done: false },
  { label: "Escolher lembrancinhas", done: false },
  { label: "Contratar fotógrafo", done: false },
  { label: "Escolher música", done: false },
];

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function MyAccount() {
  usePageTitle("Minha conta");
  const { user, loading, logout, updateWeddingDate } = useAuth();
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [dateInput, setDateInput] = useState("");
  const [dateMsg, setDateMsg] = useState(null);

  useEffect(() => {
    setDateInput(user?.weddingDate || "");
  }, [user?.weddingDate]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center  text-catalina-muted text-[14px]">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const days = daysUntil(user.weddingDate);
  const toggleItem = (i) => setChecklist((c) => c.map((item, idx) => (idx === i ? { ...item, done: !item.done } : item)));

  const saveDate = async (e) => {
    e.preventDefault();
    const result = await updateWeddingDate(dateInput);
    setDateMsg(result.error ? { ok: false, text: result.error } : { ok: true, text: "Data salva." });
    setTimeout(() => setDateMsg(null), 2500);
  };

  return (
    <div className="min-h-screen bg-catalina-cream text-catalina-text ">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[24px]">Olá, {user.name}</h1>
            <p className="text-[13px] text-catalina-muted">{user.email}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-[13px] text-catalina-muted hover:text-[#B23A3A] transition-colors">
            <LogOut size={15} /> Sair
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white border border-catalina-sand rounded-sm p-6">
            <div className="flex items-center gap-2 mb-3 text-catalina-sage">
              <CalendarHeart size={18} />
              <p className="text-[15px] text-catalina-text">Contagem regressiva</p>
            </div>
            {user.weddingDate ? (
              <p className="text-[28px] text-catalina-sage mb-1">{days} dias</p>
            ) : (
              <p className="text-[13px] text-catalina-muted mb-3">Defina a data do seu casamento.</p>
            )}
            <form onSubmit={saveDate} className="flex gap-2 mt-3">
              <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="border border-catalina-border rounded-sm px-2 py-1.5 text-[13px] flex-1" />
              <button type="submit" className="text-[12px] border border-catalina-green text-catalina-green px-3 py-1.5 rounded-sm hover:bg-catalina-green hover:text-white transition-colors">
                Salvar
              </button>
            </form>
            {dateMsg && (
              <p className={`text-[12px] mt-2 ${dateMsg.ok ? "text-catalina-sage" : "text-[#B23A3A]"}`}>{dateMsg.text}</p>
            )}
          </div>

          <div className="bg-white border border-catalina-sand rounded-sm p-6">
            <div className="flex items-center gap-2 mb-3 text-catalina-sage">
              <ListChecks size={18} />
              <p className="text-[15px] text-catalina-text">Checklist do casamento</p>
            </div>
            <div className="flex flex-col gap-2">
              {checklist.map((item, i) => (
                <label key={item.label} className="flex items-center gap-2.5 text-[13px] text-[#4A4A3E] cursor-pointer">
                  <input type="checkbox" checked={item.done} onChange={() => toggleItem(i)} className="accent-[#4A5636]" />
                  <span className={item.done ? "line-through text-catalina-muted" : ""}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-catalina-sand rounded-sm p-6">
          <div className="flex items-center gap-2 mb-4 text-catalina-sage">
            <Package size={18} />
            <p className="text-[15px] text-catalina-text">Meus pedidos</p>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_ORDERS.map((o) => (
              <div key={o.id} className="flex items-center justify-between border-b border-catalina-sand pb-3 last:border-0 text-[13px]">
                <div>
                  <p>Pedido #{o.id}</p>
                  <p className="text-catalina-muted">{o.items} · {o.date}</p>
                </div>
                <div className="text-right">
                  <p className={o.status === "Entregue" ? "text-catalina-sage" : "text-catalina-gold"}>{o.status}</p>
                  <p className="text-catalina-muted">{o.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/lista-de-casamento" className="text-[13px] text-catalina-sage underline">Ir para minha lista de casamento →</Link>
        </div>
      </div>
    </div>
  );
}
