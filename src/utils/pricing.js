/** Regras de preço do carrinho, separadas da interface para poderem ser testadas. */

export const FREE_SHIPPING_FROM = 499;
export const SHIPPING_FEE = 29.9;

/** Cupons válidos e o desconto de cada um (0.1 = 10%). */
export const COUPONS = {
  CATALINA10: 0.1,
  NOIVA15: 0.15,
};

/** Retorna o cupom em maiúsculas com o desconto, ou null se o código não existir. */
export function findCoupon(code) {
  const normalized = String(code || "").trim().toUpperCase();
  const discount = COUPONS[normalized];
  return discount ? { code: normalized, discount } : null;
}

/** Frete grátis a partir de R$ 499 no subtotal. */
export function calcShipping(subtotal) {
  return subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
}

/** Subtotal, desconto, frete e total de uma lista de itens ({ price, quantity }). */
export function computeTotals(items, coupon = null) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon ? subtotal * coupon.discount : 0;
  const shipping = items.length ? calcShipping(subtotal) : 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, discount, shipping, total: subtotal - discount + shipping, itemCount };
}
