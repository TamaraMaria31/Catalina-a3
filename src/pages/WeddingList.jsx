import { useState, useEffect, useCallback } from "react";
import { Link2, Check, Plus, Trash2, Loader2, Gift } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import usePageTitle from "../hooks/usePageTitle";

const SUGGESTIONS = [
  { name: "Jogo de taças de cristal", price: 249.9 },
  { name: "Jogo de cama king size", price: 389.9 },
  { name: "Panela de ferro fundido", price: 459.9 },
  { name: "Cafeteira italiana", price: 199.9 },
  { name: "Contribuição para lua de mel", price: 500.0 },
  { name: "Jogo de toalhas premium", price: 179.9 },
];

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "meu-casamento";
}

export default function WeddingList() {
  usePageTitle("Lista de casamento");
  const { user } = useAuth();
  const [coupleName, setCoupleName] = useState(user ? `${user.name} & convidado(a)` : "Ana & Pedro");
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const slug = slugify(coupleName);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("wedding_list_items")
      .select("*")
      .eq("couple_slug", slug)
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError("Não foi possível carregar a lista do banco de dados.");
      console.error(fetchError);
    } else {
      setListItems(data || []);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const addItem = async (item) => {
    if (listItems.find((i) => i.name === item.name)) return;
    setSaving(true);
    const { data, error: insertError } = await supabase
      .from("wedding_list_items")
      .insert({ couple_slug: slug, name: item.name, price: item.price })
      .select()
      .single();

    if (insertError) {
      setError("Não foi possível salvar o item no banco de dados.");
      console.error(insertError);
    } else {
      setListItems((prev) => [...prev, data]);
    }
    setSaving(false);
  };

  const removeItem = async (id) => {
    setListItems((prev) => prev.filter((i) => i.id !== id));
    const { error: deleteError } = await supabase.from("wedding_list_items").delete().eq("id", id);
    if (deleteError) {
      setError("Não foi possível remover o item no banco de dados.");
      console.error(deleteError);
      loadItems();
    }
  };

  const total = listItems.reduce((sum, i) => sum + Number(i.price), 0);
  const shareUrl = `catalinamarriage.com/lista/${slug}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(`https://${shareUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-catalina-cream text-catalina-text ">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <h1 className="text-[26px] mb-2">Lista de Casamento</h1>
        <p className="text-[14px] text-catalina-muted mb-8">Crie sua lista e compartilhe com quem você ama.</p>

        <div className="bg-white border border-catalina-sand rounded-sm p-6 mb-8">
          <label className="text-[13px] text-catalina-muted block mb-2">Nome do casal</label>
          <input
            value={coupleName}
            onChange={(e) => setCoupleName(e.target.value)}
            onBlur={loadItems}
            className="w-full border border-catalina-border rounded-sm px-3 py-2.5 text-[14px] outline-none focus:border-catalina-green mb-4"
          />
          <div className="flex items-center justify-between bg-catalina-sand rounded-sm px-4 py-3">
            <div className="flex items-center gap-2 text-[13px] text-[#4A4A3E] truncate">
              <Link2 size={14} className="flex-shrink-0" /> <span className="truncate">{shareUrl}</span>
            </div>
            <button onClick={copyLink} className="text-[12px] text-catalina-green flex items-center gap-1 flex-shrink-0 ml-3">
              {copied ? <><Check size={13} /> Copiado</> : "Copiar link"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-[#FBEAEA] border border-[#E3B8B8] text-[#B23A3A] text-[13px] rounded-sm p-4 mb-6">
            {error} Verifique se o Supabase está configurado (veja README).
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-[16px] mb-4">Sugestões para adicionar</h2>
            <div className="flex flex-col gap-3">
              {SUGGESTIONS.map((item) => {
                const added = listItems.find((i) => i.name === item.name);
                return (
                  <div key={item.name} className="flex items-center justify-between border border-catalina-sand rounded-sm p-3">
                    <div className="flex items-center gap-3">
                      <Gift size={20} strokeWidth={1.5} className="text-catalina-sage flex-shrink-0" />
                      <div>
                        <p className="text-[13px]">{item.name}</p>
                        <p className="text-[12px] text-catalina-muted">{item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addItem(item)}
                      disabled={!!added || saving}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${added ? "bg-catalina-sand text-catalina-muted" : "bg-catalina-green text-white hover:bg-catalina-greenDark"}`}
                      aria-label="Adicionar à lista"
                    >
                      {added ? <Check size={14} /> : <Plus size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-[16px] mb-4 flex items-center gap-2">
              Minha lista ({listItems.length})
              {loading && <Loader2 size={14} className="animate-spin text-catalina-muted" />}
            </h2>
            {!loading && listItems.length === 0 ? (
              <p className="text-[13px] text-catalina-muted">Nenhum item adicionado ainda.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {listItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white border border-catalina-sand rounded-sm p-3">
                    <div className="flex items-center gap-3">
                      <Gift size={20} strokeWidth={1.5} className="text-catalina-sage flex-shrink-0" />
                      <p className="text-[13px]">{item.name}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-catalina-muted hover:text-[#B23A3A]" aria-label="Remover">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                {listItems.length > 0 && (
                  <div className="flex justify-between text-[15px] border-t border-catalina-sand pt-3 mt-2">
                    <span>Total da lista</span>
                    <span className="text-catalina-sage">{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
