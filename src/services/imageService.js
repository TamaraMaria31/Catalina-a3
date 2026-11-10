// Serviço de imagens usando a API gratuita do Pexels.
// Crie uma chave grátis em https://www.pexels.com/api/ (sem cartão, sem custo)
// e coloque em um arquivo .env na raiz do projeto:
//   VITE_PEXELS_API_KEY=sua_chave_aqui
//
// Se a chave não estiver configurada, ou a busca falhar, a função retorna
// null e o componente ProductImage usa automaticamente o emoji como fallback.

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PEXELS_URL = "https://api.pexels.com/v1/search";

// Cache em memória para não repetir a mesma busca várias vezes na sessão.
const cache = new Map();

export async function fetchImageUrl(query) {
  if (!PEXELS_API_KEY) return null;
  if (cache.has(query)) return cache.get(query);

  try {
    const res = await fetch(
      `${PEXELS_URL}?query=${encodeURIComponent(query)}&per_page=1&orientation=square`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );
    if (!res.ok) throw new Error(`Pexels respondeu ${res.status}`);
    const data = await res.json();
    const url = data.photos?.[0]?.src?.large || null;
    cache.set(query, url);
    return url;
  } catch (err) {
    console.warn("Não foi possível buscar imagem no Pexels:", err.message);
    cache.set(query, null);
    return null;
  }
}
