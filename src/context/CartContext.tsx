import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/types";

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "nova_cart_v1";

export const itemKey = (i: Pick<CartItem, "productId" | "size" | "color">) =>
  `${i.productId}__${i.size ?? ""}__${i.color ?? ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    return {
      items,
      open,
      setOpen,
      count,
      subtotal,
      add: (item) =>
        setItems((curr) => {
          const k = itemKey(item);
          const existing = curr.find((c) => itemKey(c) === k);
          if (existing) {
            return curr.map((c) =>
              itemKey(c) === k ? { ...c, quantity: c.quantity + item.quantity } : c,
            );
          }
          return [...curr, item];
        }),
      remove: (key) => setItems((curr) => curr.filter((c) => itemKey(c) !== key)),
      setQty: (key, qty) =>
        setItems((curr) =>
          curr
            .map((c) => (itemKey(c) === key ? { ...c, quantity: Math.max(1, qty) } : c))
            .filter((c) => c.quantity > 0),
        ),
      clear: () => setItems([]),
    };
  }, [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
};
