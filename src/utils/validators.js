/** Mantém só os dígitos e aplica a máscara 00000-000. */
export function formatCep(value) {
  const digits = String(value).replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function isValidCep(value) {
  return /^\d{5}-?\d{3}$/.test(String(value).trim());
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
}

/** Nome com pelo menos duas palavras, como em "Ana Souza". */
export function isValidFullName(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length >= 2;
}
