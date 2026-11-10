import { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);
const KEY = "catalina_favorites";

function readLocal() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(ids) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* armazenamento indisponível: segue só em memória */
  }
}

/**
 * Visitante: favoritos ficam no navegador (localStorage).
 * Logado: favoritos ficam na tabela "favorites" do Supabase; ao entrar,
 * os favoritos que o visitante já tinha são levados para a conta.
 */
export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState(readLocal);
  const [error, setError] = useState(null);
  const remote = Boolean(user && isSupabaseConfigured);

  useEffect(() => {
    if (!user) {
      setIds(readLocal());
      return;
    }
    if (!isSupabaseConfigured) return;

    let active = true;
    (async () => {
      const local = readLocal();
      if (local.length) {
        const { error: mergeError } = await supabase
          .from("favorites")
          .upsert(
            local.map((productId) => ({ user_id: user.id, product_id: productId })),
            { onConflict: "user_id,product_id", ignoreDuplicates: true }
          );
        if (!mergeError) writeLocal([]);
      }
      const { data, error: fetchError } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", user.id);
      if (!active) return;
      if (fetchError) {
        setError("Não foi possível carregar seus favoritos.");
      } else {
        setError(null);
        setIds(data.map((row) => row.product_id));
      }
    })();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const isFavorite = (productId) => ids.includes(productId);

  const toggle = async (productId) => {
    const had = ids.includes(productId);
    const next = had ? ids.filter((i) => i !== productId) : [...ids, productId];
    setIds(next);
    setError(null);

    if (!remote) {
      writeLocal(next);
      return;
    }

    const query = had
      ? supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId)
      : supabase.from("favorites").insert({ user_id: user.id, product_id: productId });
    const { error: saveError } = await query;
    if (saveError) {
      setIds(ids);
      setError("Não foi possível salvar o favorito. Tente novamente.");
    }
  };

  return (
    <FavoritesContext.Provider value={{ ids, count: ids.length, isFavorite, toggle, error }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
