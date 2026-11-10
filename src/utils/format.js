/** Formata um número como moeda brasileira (R$ 1.234,50). */
export function formatPrice(value) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Converte um texto em um trecho de URL: "Ana & Pedro" vira "ana-pedro". */
export function slugify(text, fallback = "meu-casamento") {
  const slug = String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || fallback;
}

/** Dias inteiros até uma data (AAAA-MM-DD). Retorna null sem data e 0 se já passou. */
export function daysUntil(dateStr, now = new Date()) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
