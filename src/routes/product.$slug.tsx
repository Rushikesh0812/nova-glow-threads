import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, Star, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/products/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — NOVA THREADS` },
          { name: "description", content: loaderData.product.description ?? "Premium futuristic apparel." },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:image", content: loaderData.product.images[0] ?? "" },
        ]
      : [],
  }),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add, setOpen } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(product.colors[0] ?? null);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState<Product[]>([]);
  const onSale = product.compare_at_price && Number(product.compare_at_price) > Number(product.price);
  const inStock = product.stock_quantity > 0;

  useEffect(() => {
    fetchProducts({ category: product.category, limit: 8 }).then((r) =>
      setRelated(r.filter((p) => p.id !== product.id).slice(0, 4)),
    );
  }, [product.id, product.category]);

  const addToCart = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      price: Number(product.price),
      size,
      color,
      quantity: qty,
    });
    setOpen(true);
    toast.success("Added to cart");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="grid grid-cols-[80px_1fr] gap-4">
          <div className="flex flex-col gap-3">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square rounded-lg overflow-hidden border ${activeImg === i ? "border-primary" : "border-border"}`}
              >
                <img src={img} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[4/5] rounded-xl overflow-hidden glass"
          >
            <img src={product.images[activeImg]} alt={product.name} className="size-full object-cover" />
          </motion.div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs">
            {product.is_new && <span className="px-2 py-0.5 glass-strong rounded-full font-mono uppercase tracking-wider">New</span>}
            {onSale && <span className="px-2 py-0.5 rounded-full gradient-neon text-primary-foreground font-mono uppercase tracking-wider">Sale</span>}
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <Star className="size-4 fill-primary text-primary" />
              {Number(product.rating_average).toFixed(1)} <span className="text-muted-foreground">({product.rating_count})</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${inStock ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
              {inStock ? "In stock" : "Sold out"}
            </span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl">{money(Number(product.price))}</span>
            {onSale && (
              <span className="text-muted-foreground line-through font-mono">
                {money(Number(product.compare_at_price))}
              </span>
            )}
          </div>
          <p className="mt-5 text-muted-foreground">{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm mb-2">Color: <span className="text-muted-foreground">{color}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-3 py-1.5 rounded-md text-sm ${color === c ? "border-primary text-primary" : "border-border text-foreground/80"} border glass`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-sm mb-2">Size: <span className="text-muted-foreground">{size}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 px-3 py-2 rounded-md text-sm ${size === s ? "border-primary text-primary" : "border-border text-foreground/80"} border glass`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center glass rounded-md">
              <button className="p-2.5 hover:text-primary" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                <Minus className="size-4" />
              </button>
              <span className="px-3 tabular-nums">{qty}</span>
              <button className="p-2.5 hover:text-primary" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                <Plus className="size-4" />
              </button>
            </div>
            <button
              disabled={!inStock}
              onClick={addToCart}
              className="flex-1 px-6 py-3.5 rounded-md gradient-neon text-primary-foreground font-medium glow-neon hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to cart · {money(Number(product.price) * qty)}
            </button>
            <button className="p-3.5 rounded-md glass-strong hover:text-primary" aria-label="Wishlist" onClick={() => toast("Saved to wishlist")}>
              <Heart className="size-5" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            <Perk icon={Truck} label="Free shipping over $150" />
            <Perk icon={RotateCcw} label="30-day returns" />
            <Perk icon={ShieldCheck} label="Authentic guarantee" />
          </div>

          <div className="mt-10 space-y-3">
            <Accordion title="Description" defaultOpen>
              <p className="text-muted-foreground text-sm">{product.description}</p>
            </Accordion>
            <Accordion title="Materials & Care">
              <p className="text-muted-foreground text-sm">
                Premium engineered fabric. Machine wash cold inside out. Tumble dry low. Do not bleach.
              </p>
            </Accordion>
            <Accordion title="Shipping">
              <p className="text-muted-foreground text-sm">
                Free worldwide express shipping on orders over $150. Standard 3–5 business days.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-2xl md:text-4xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function Perk({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="glass rounded-lg p-3 flex items-start gap-2">
      <Icon className="size-4 text-primary shrink-0" />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-lg">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-medium">{title}</span>
        <Plus className={`size-4 transition-transform ${open ? "rotate-45" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
