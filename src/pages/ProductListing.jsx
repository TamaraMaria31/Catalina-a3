import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { getProductsByCategory, CATEGORIES } from "../data/mockProducts";
import ProductCard from "../components/product/ProductCard";
import usePageTitle from "../hooks/usePageTitle";

const PRICE_RANGES = [
  { label: "Até R$ 500", test: (p) => p <= 500 },
  { label: "R$ 500 – R$ 2.000", test: (p) => p > 500 && p <= 2000 },
  { label: "Acima de R$ 2.000", test: (p) => p > 2000 },
];
const SORT_OPTIONS = ["Mais relevantes", "Menor preço", "Maior preço", "Melhor avaliados"];

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 text-[13px] text-[#4A4A3E] cursor-pointer select-none">
      <span
        className={`w-4 h-4 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "bg-catalina-green border-catalina-green" : "border-catalina-border"}`}
        onClick={onChange}
      >
        {checked && <span className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
      </span>
      <span onClick={onChange}>{label}</span>
    </label>
  );
}

export default function ProductListing() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const busca = searchParams.get("busca") || "";

  const categoryInfo = CATEGORIES.find((c) => c.slug === category);
  usePageTitle(categoryInfo ? categoryInfo.label : "Produtos");
  const baseProducts = getProductsByCategory(category);

  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [visible, setVisible] = useState(24);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const styles = [...new Set(baseProducts.map((p) => p.style))];

  const toggle = (value, list, setList) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filtered = useMemo(() => {
    let result = baseProducts.filter((p) => {
      if (busca && !p.name.toLowerCase().includes(busca.toLowerCase())) return false;
      if (selectedStyles.length && !selectedStyles.includes(p.style)) return false;
      if (selectedPriceRange !== null && !PRICE_RANGES[selectedPriceRange].test(p.price)) return false;
      return true;
    });
    if (sort === "Menor preço") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "Maior preço") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "Melhor avaliados") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [baseProducts, busca, selectedStyles, selectedPriceRange, sort]);

  const activeFilterCount = selectedStyles.length + (selectedPriceRange !== null ? 1 : 0);
  const clearAll = () => {
    setSelectedStyles([]);
    setSelectedPriceRange(null);
  };

  const FiltersPanel = (
    <div>
      <div className="border-b border-catalina-sand py-5">
        <p className="text-[13px] tracking-wide mb-3">Estilo</p>
        <div className="flex flex-col gap-2.5">
          {styles.map((s) => (
            <Checkbox key={s} label={s} checked={selectedStyles.includes(s)} onChange={() => toggle(s, selectedStyles, setSelectedStyles)} />
          ))}
        </div>
      </div>
      <div className="border-b border-catalina-sand py-5">
        <p className="text-[13px] tracking-wide mb-3">Preço</p>
        <div className="flex flex-col gap-2.5">
          {PRICE_RANGES.map((r, i) => (
            <Checkbox key={r.label} label={r.label} checked={selectedPriceRange === i} onChange={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)} />
          ))}
        </div>
      </div>
      {activeFilterCount > 0 && (
        <button onClick={clearAll} className="text-[12px] text-catalina-sage underline mt-4">Limpar filtros ({activeFilterCount})</button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-catalina-cream text-catalina-text">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <p className="text-[12px] text-catalina-muted mb-1">Produtos {categoryInfo && `/ ${categoryInfo.label}`}</p>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[26px]">{categoryInfo ? categoryInfo.label : "Produtos"}</h1>
          <p className="text-[13px] text-catalina-muted hidden sm:block">{filtered.length} produtos</p>
        </div>

        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2 text-[13px] border border-catalina-border px-4 py-2 rounded-xl">
            <SlidersHorizontal size={14} /> Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-10">
          <aside className="hidden lg:block">{FiltersPanel}</aside>

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-black/30 lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-xs bg-catalina-cream p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[15px]">Filtros</p>
                  <button onClick={() => setMobileFiltersOpen(false)} aria-label="Fechar"><X size={20} /></button>
                </div>
                {FiltersPanel}
                <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-catalina-green text-white text-[13px] py-3 rounded-xl mt-6">
                  Ver {filtered.length} produtos
                </button>
              </div>
            </div>
          )}

          <div>
            <div className="hidden sm:flex justify-end mb-5">
              <div className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none text-[13px] border border-catalina-border rounded-xl pl-3 pr-8 py-2 bg-white cursor-pointer focus:outline-none focus:border-catalina-green">
                  {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-catalina-muted" />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[15px] mb-2">Nenhum produto encontrado</p>
                <p className="text-[13px] text-catalina-muted mb-5">Tente ajustar ou limpar os filtros selecionados.</p>
                <button onClick={clearAll} className="text-[13px] text-catalina-sage underline">Limpar filtros</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-8">
                {filtered.slice(0, visible).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
            {filtered.length > visible && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisible((v) => v + 24)}
                  className="rounded-full border border-catalina-green px-6 py-3 text-[13px] text-catalina-green transition-colors hover:bg-catalina-green hover:text-white"
                >
                  Ver mais ({filtered.length - visible})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
