import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { fetchCategories, fetchProducts } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

const searchSchema = z.object({
  category: z.string().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "rating"]).optional(),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => searchSchema.parse(s),
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop — NOVA THREADS" },
      { name: "description", content: "Browse the full NOVA THREADS collection. Filter by category, price, and more." },
    ],
  }),
});

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ category: search.category }).then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, [search.category]);

  const filtered = useMemo(() => {
    let out = [...products];
    if (search.min) out = out.filter((p) => Number(p.price) >= Number(search.min));
    if (search.max) out = out.filter((p) => Number(p.price) <= Number(search.max));
    switch (search.sort) {
      case "price-asc": out.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price-desc": out.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "rating": out.sort((a, b) => Number(b.rating_average) - Number(a.rating_average)); break;
    }
    return out;
  }, [products, search.min, search.max, search.sort]);

  const update = (patch: Partial<typeof search>) =>
    navigate({ search: (prev: typeof search) => ({ ...prev, ...patch }) });

  const activeCat = categories.find((c) => c.slug === search.category);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary">
          {activeCat ? "Category" : "All products"}
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-6xl">
          {activeCat ? activeCat.name : "The collection"}
        </h1>
        {activeCat?.description && (
          <p className="mt-3 text-muted-foreground max-w-xl">{activeCat.description}</p>
        )}
      </motion.div>

      <div className="mt-10 grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className={filtersOpen ? "block" : "hidden lg:block"}>
          <FilterPanel categories={categories} search={search} update={update} />
        </aside>

        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-md glass text-sm"
            >
              <SlidersHorizontal className="size-4" /> Filters
            </button>
            <p className="text-sm text-muted-foreground">{filtered.length} products</p>
            <select
              value={search.sort ?? "newest"}
              onChange={(e) => update({ sort: e.target.value as typeof search.sort })}
              className="px-3 py-2 rounded-md glass text-sm bg-transparent"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-xl glass animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass rounded-xl p-10 text-center">
              <p className="font-display text-xl">No products match your filters.</p>
              <button
                onClick={() => navigate({ search: {} })}
                className="mt-4 px-4 py-2 rounded-md gradient-neon text-primary-foreground"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  categories, search, update,
}: {
  categories: Category[];
  search: z.infer<typeof searchSchema>;
  update: (patch: Partial<z.infer<typeof searchSchema>>) => void;
}) {
  return (
    <div className="glass rounded-xl p-5 space-y-6 sticky top-24">
      <div>
        <h3 className="font-display text-sm uppercase tracking-widest mb-3">Category</h3>
        <ul className="space-y-1.5 text-sm">
          <li>
            <button
              onClick={() => update({ category: undefined })}
              className={!search.category ? "text-primary" : "text-muted-foreground hover:text-foreground"}
            >
              All
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => update({ category: c.slug })}
                className={search.category === c.slug ? "text-primary" : "text-muted-foreground hover:text-foreground"}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-display text-sm uppercase tracking-widest mb-3">Price</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={search.min ?? ""}
            onChange={(e) => update({ min: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-2 rounded-md bg-background/50 border border-border text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={search.max ?? ""}
            onChange={(e) => update({ max: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-2 rounded-md bg-background/50 border border-border text-sm"
          />
        </div>
      </div>
    </div>
  );
}
