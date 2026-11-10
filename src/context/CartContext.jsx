import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { computeTotals, findCoupon } from "../utils/pricing";

const CartContext = createContext(null);
const STORAGE_KEY = "catalina_cart";

function loadItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadItems);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* armazenamento indisponível: o carrinho segue só em memória */
    }
  }, [items]);

  const addItem = (product, { size, color, quantity = 1 } = {}) => {
    setItems((prev) => {
      const key = `${product.id}-${size}-${color}`;
      if (prev.some((item) => item.key === key)) {
        return prev.map((item) => (item.key === key ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          localImage: product.localImage,
          imageQuery: product.imageQuery,
          size,
          color,
          quantity,
        },
      ];
    });
  };

  const removeItem = (key) => setItems((prev) => prev.filter((item) => item.key !== key));

  const updateQuantity = (key, quantity) =>
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item)));

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  /** Aplica um cupom. Retorna true se o código existe. */
  const applyCoupon = (code) => {
    const found = findCoupon(code);
    setCoupon(found);
    return Boolean(found);
  };

  const totals = useMemo(() => computeTotals(items, coupon), [items, coupon]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, applyCoupon, coupon, ...totals }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
