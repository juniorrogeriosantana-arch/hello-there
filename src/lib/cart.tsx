import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { product_id: string; name: string; price: number; image_url: string | null; quantity: number };
type Cart = {
  items: CartItem[];
  add: (i: Omit<CartItem, "quantity">) => void;
  setQty: (id: string, q: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};
const Ctx = createContext<Cart | null>(null);
const KEY = "glz-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, ready]);

  const value: Cart = {
    items,
    add: (i) => setItems((p) => {
      const ex = p.find((x) => x.product_id === i.product_id);
      return ex ? p.map((x) => x.product_id === i.product_id ? { ...x, quantity: Math.min(20, x.quantity + 1) } : x) : [...p, { ...i, quantity: 1 }];
    }),
    setQty: (id, q) => setItems((p) => p.map((x) => x.product_id === id ? { ...x, quantity: Math.max(1, Math.min(20, q)) } : x)),
    remove: (id) => setItems((p) => p.filter((x) => x.product_id !== id)),
    clear: () => setItems([]),
    count: items.reduce((a, b) => a + b.quantity, 0),
    subtotal: items.reduce((a, b) => a + b.price * b.quantity, 0),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
