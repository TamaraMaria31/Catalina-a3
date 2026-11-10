import { useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { formatPrice } from "../../utils/format";

const INITIAL_ORDERS = [
  { id: 583920, customer: "Marina Silva", date: "02/09/2026", status: "Entregue", total: 3899.9 },
  { id: 583455, customer: "Beatriz Alves", date: "18/08/2026", status: "Em transporte", total: 449.8 },
  { id: 583201, customer: "Juliana Pires", date: "10/08/2026", status: "Processando", total: 1899.9 },
  { id: 582990, customer: "Camila Rocha", date: "29/07/2026", status: "Entregue", total: 799.9 },
];

const STATUS_OPTIONS = ["Processando", "Em transporte", "Entregue", "Cancelado"];


const statusColor = {
  Entregue: "text-catalina-sage",
  "Em transporte": "text-catalina-gold",
  Processando: "text-[#4A4A3E]",
  Cancelado: "text-[#B23A3A]",
};

export default function AdminOrders() {
  usePageTitle("Pedidos");
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const updateStatus = (id, status) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  return (
    <div className="min-h-screen bg-catalina-cream text-catalina-text ">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <h1 className="text-[26px] mb-8">Pedidos</h1>

        <div className="bg-white border border-catalina-sand rounded-sm overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-catalina-sand text-left text-catalina-muted">
                <th className="p-4 font-normal">Pedido</th>
                <th className="p-4 font-normal">Cliente</th>
                <th className="p-4 font-normal">Data</th>
                <th className="p-4 font-normal">Total</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-catalina-sand last:border-0">
                  <td className="p-4">#{o.id}</td>
                  <td className="p-4">{o.customer}</td>
                  <td className="p-4 text-catalina-muted">{o.date}</td>
                  <td className="p-4">{formatPrice(o.total)}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`border border-catalina-border rounded-sm px-2 py-1.5 text-[12px] bg-transparent ${statusColor[o.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
