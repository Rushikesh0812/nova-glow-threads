import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart, itemKey } from "@/context/CartContext";
import { money } from "@/lib/format";

export function CartDrawer() {
  const { open, setOpen, items, setQty, remove, subtotal } = useCart();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-[61] w-full sm:w-[440px] glass-strong flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border/60">
              <h3 className="font-display text-lg flex items-center gap-2">
                <ShoppingBag className="size-4 text-primary" /> Your Cart
              </h3>
              <button onClick={() => setOpen(false)} className="p-2 hover:text-primary" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 grid place-items-center text-center px-6">
                <div>
                  <div className="mx-auto mb-4 size-16 rounded-full grid place-items-center glass">
                    <ShoppingBag className="size-6 text-primary" />
                  </div>
                  <p className="font-display text-lg">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">Discover the latest drops.</p>
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="inline-block mt-6 px-5 py-2.5 rounded-md gradient-neon text-primary-foreground font-medium hover:opacity-90"
                  >
                    Shop now
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {items.map((i) => {
                    const k = itemKey(i);
                    return (
                      <div key={k} className="flex gap-3 glass rounded-lg p-3">
                        <img src={i.image} alt={i.name} className="size-20 object-cover rounded-md" />
                        <div className="flex-1 min-w-0">
                          <Link
                            to="/product/$slug"
                            params={{ slug: i.slug }}
                            onClick={() => setOpen(false)}
                            className="font-medium truncate block hover:text-primary"
                          >
                            {i.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {[i.size, i.color].filter(Boolean).join(" · ")}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center glass rounded-md">
                              <button
                                className="p-1.5 hover:text-primary"
                                onClick={() => setQty(k, i.quantity - 1)}
                                aria-label="Decrease"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="px-2 text-sm tabular-nums">{i.quantity}</span>
                              <button
                                className="p-1.5 hover:text-primary"
                                onClick={() => setQty(k, i.quantity + 1)}
                                aria-label="Increase"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <span className="font-mono text-sm">{money(i.price * i.quantity)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => remove(k)}
                          className="self-start p-1 text-muted-foreground hover:text-destructive"
                          aria-label="Remove"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="p-5 border-t border-border/60 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono">{money(subtotal)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
                  <Link
                    to="/checkout"
                    onClick={() => setOpen(false)}
                    className="block text-center px-5 py-3 rounded-md gradient-neon text-primary-foreground font-medium hover:opacity-90"
                  >
                    Checkout · {money(subtotal)}
                  </Link>
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="block text-center px-5 py-2.5 rounded-md glass text-sm hover:text-primary"
                  >
                    Continue shopping
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
