import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Recycle } from "lucide-react";
import { fetchCategories, fetchProducts } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "NOVA THREADS — Wearable Futures" },
      { name: "description", content: "Discover the new collection. Premium futuristic apparel for men, women and beyond." },
    ],
  }),
});

function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchProducts({ featured: true, limit: 8 }).then(setFeatured).catch(() => {});
    fetchProducts({ isNew: true, limit: 8 }).then(setNewArrivals).catch(() => {});
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 grid-bg opacity-50"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-32 lg:pt-36 lg:pb-44">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono tracking-wider uppercase">
              <Sparkles className="size-3 text-primary" /> Drop 02 — Orbital Capsule
            </div>
            <h1 className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
              Wearable
              <br />
              <span className="text-gradient">futures</span>, made
              <br />
              for now.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Engineered fabrics, sculpted silhouettes, neon-tuned details. NOVA THREADS designs
              clothing for the next decade — available today.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="px-6 py-3.5 rounded-md gradient-neon text-primary-foreground font-medium glow-neon hover:opacity-90 transition flex items-center gap-2"
              >
                Shop the collection <ArrowRight className="size-4" />
              </Link>
              <Link to="/about" className="px-6 py-3.5 rounded-md glass-strong hover:text-primary transition">
                Our story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Explore" title="Shop by category" />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to="/shop"
                search={{ category: c.slug }}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl glass"
              >
                {c.image_url && (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-xl">{c.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <div className="flex items-end justify-between">
          <SectionHeader eyebrow="Just landed" title="New arrivals" />
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <div className="flex items-end justify-between">
          <SectionHeader eyebrow="Most loved" title="Trending now" />
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Truck, title: "Free shipping over $150", desc: "Worldwide express on all qualifying orders." },
            { icon: ShieldCheck, title: "30-day returns", desc: "If it's not right, send it back. Easy." },
            { icon: Recycle, title: "Made to last", desc: "Engineered fabrics, repair program included." },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-xl p-6"
            >
              <v.icon className="size-5 text-primary" />
              <h3 className="mt-4 font-display text-lg">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 md:p-16">
          <div
            className="absolute inset-0 -z-10 opacity-60"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-5xl">
                Receive the next <span className="text-gradient">drop</span> first.
              </h2>
              <p className="mt-3 text-muted-foreground max-w-md">
                Join the signal. Early access, behind-the-scenes, and 10% off your first order.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl md:text-5xl tracking-tight">{title}</h2>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          toast.error("Enter a valid email");
          return;
        }
        toast.success("You're on the list. Welcome to NOVA.");
        setEmail("");
      }}
      className="flex flex-col sm:flex-row gap-3"
    >
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="you@orbit.io"
        className="flex-1 px-4 py-3.5 rounded-md bg-background/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Email"
      />
      <button
        type="submit"
        className="px-6 py-3.5 rounded-md gradient-neon text-primary-foreground font-medium hover:opacity-90"
      >
        Subscribe
      </button>
    </form>
  );
}
