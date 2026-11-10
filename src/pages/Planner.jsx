import { useState, useMemo } from "react";
import usePageTitle from "../hooks/usePageTitle";
import { formatPrice } from "../utils/format";

const STYLE_WEIGHTS = {
  Clássico: { vestido: 0.18, traje: 0.08, decoracao: 0.28, flores: 0.1, convites: 0.06, lembrancinhas: 0.06, outros: 0.24 },
  Romântico: { vestido: 0.22, traje: 0.07, decoracao: 0.24, flores: 0.14, convites: 0.05, lembrancinhas: 0.06, outros: 0.22 },
  Minimalista: { vestido: 0.2, traje: 0.09, decoracao: 0.18, flores: 0.08, convites: 0.05, lembrancinhas: 0.05, outros: 0.35 },
  Boho: { vestido: 0.18, traje: 0.07, decoracao: 0.22, flores: 0.16, convites: 0.05, lembrancinhas: 0.07, outros: 0.25 },
};

const LABELS = {
  vestido: "Vestido",
  traje: "Traje",
  decoracao: "Decoração",
  flores: "Flores",
  convites: "Convites",
  lembrancinhas: "Lembrancinhas",
  outros: "Buffet, local e outros",
};


export default function Planner() {
  usePageTitle("Planejador de casamento");
  const [budget, setBudget] = useState(25000);
  const [guests, setGuests] = useState(100);
  const [style, setStyle] = useState("Romântico");
  const [showResult, setShowResult] = useState(false);

  const breakdown = useMemo(() => {
    const weights = STYLE_WEIGHTS[style];
    return Object.entries(weights).map(([key, weight]) => ({
      key,
      label: LABELS[key],
      value: budget * weight,
    }));
  }, [budget, style]);

  const totalAllocated = breakdown.reduce((sum, b) => sum + b.value, 0);
  const perGuest = guests > 0 ? budget / guests : 0;

  return (
    <div className="min-h-screen bg-catalina-cream text-catalina-text ">
      <div className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-[26px] mb-2">Planejador de Casamento</h1>
        <p className="text-[14px] text-catalina-muted mb-8">
          Informe seu orçamento e receba uma sugestão de distribuição por categoria.
        </p>

        <div className="bg-white border border-catalina-sand rounded-sm p-6 mb-8">
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-[13px] text-catalina-muted block mb-2">Orçamento total</label>
              <div className="flex items-center border border-catalina-border rounded-sm px-3">
                <span className="text-[13px] text-catalina-muted mr-1">R$</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
                  className="w-full py-2.5 text-[14px] outline-none bg-transparent"
                />
              </div>
            </div>
            <div>
              <label className="text-[13px] text-catalina-muted block mb-2">Número de convidados</label>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                className="w-full border border-catalina-border rounded-sm px-3 py-2.5 text-[14px] outline-none focus:border-catalina-green"
              />
            </div>
          </div>

          <label className="text-[13px] text-catalina-muted block mb-2">Estilo do casamento</label>
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(STYLE_WEIGHTS).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`text-[13px] px-4 py-2 rounded-sm border transition-colors ${style === s ? "bg-catalina-green border-catalina-green text-white" : "border-catalina-border text-[#4A4A3E] hover:border-catalina-green"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <button onClick={() => setShowResult(true)} className="w-full bg-catalina-green text-white text-[13px] tracking-wide py-3 rounded-sm hover:bg-catalina-greenDark transition-colors">
            GERAR SUGESTÃO
          </button>
        </div>

        {showResult && (
          <div className="bg-white border border-catalina-sand rounded-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[18px]">Seu casamento</h2>
              <p className="text-[13px] text-catalina-muted">{formatPrice(perGuest)} / convidado</p>
            </div>
            <p className="text-[13px] text-catalina-muted mb-6">
              Orçamento: {formatPrice(budget)} · {guests} convidados · Estilo {style}
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {breakdown.map((b) => (
                <div key={b.key}>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span>{b.label}</span>
                    <span className="text-catalina-sage">{formatPrice(b.value)}</span>
                  </div>
                  <div className="h-2 bg-catalina-sand rounded-full overflow-hidden">
                    <div className="h-full bg-catalina-green rounded-full" style={{ width: `${(b.value / budget) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[16px] border-t border-catalina-sand pt-4">
              <span>Total estimado</span>
              <span className="text-catalina-sage">{formatPrice(totalAllocated)}</span>
            </div>
            <p className="text-[12px] text-catalina-muted mt-2">
              Você ainda possui {formatPrice(budget - totalAllocated)} de margem no orçamento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
