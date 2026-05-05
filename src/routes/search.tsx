import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  head: () => ({ meta: [{ title: "Search — NOVA THREADS" }] }),
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [all, setAll] = useState<Product[]>([]);
  useEffect(() => { fetchProducts().then(setAll); }, []);
  const results = q.trim()
    ? all.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    : all;

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <h1 className="font-display text-4xl">Search</h1>
      <input
        autoFocus value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Find products…"
        className="mt-6 w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:outline-none text-lg"
      />
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </div>
  );
}
