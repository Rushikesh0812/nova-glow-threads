import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV: { label: string; category?: string }[] = [
  { label: "Shop" },
  { label: "Men", category: "mens-tops" },
  { label: "Women", category: "womens-tops" },
  { label: "Accessories", category: "accessories" },
  { label: "Sale", category: "sale" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [path]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong" : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 -ml-2 text-foreground/80 hover:text-foreground"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex size-8 items-center justify-center rounded-md gradient-neon text-primary-foreground font-bold">
            N
            <span className="absolute inset-0 rounded-md blur-md opacity-60 gradient-neon -z-10" />
          </span>
          <span className="font-display text-lg tracking-tight">
            NOVA<span className="text-gradient">THREADS</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-foreground/75 ml-6">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative hover:text-foreground transition-colors"
              activeOptions={{ exact: false }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link to="/search" className="p-2 text-foreground/80 hover:text-foreground" aria-label="Search">
            <Search className="size-5" />
          </Link>
          <Link
            to={user ? "/account" : "/auth"}
            className="p-2 text-foreground/80 hover:text-foreground"
            aria-label="Account"
          >
            <UserIcon className="size-5" />
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="relative p-2 text-foreground/80 hover:text-foreground"
            aria-label="Cart"
          >
            <ShoppingBag className="size-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full gradient-neon text-[10px] font-bold text-primary-foreground grid place-items-center"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass-strong border-t border-border"
          >
            <nav className="flex flex-col p-4 gap-3">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="py-2 text-foreground/80 hover:text-foreground">
                  {n.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
