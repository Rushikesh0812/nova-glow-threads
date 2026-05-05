import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add, setOpen } = useCart();
  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  const quickAdd = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      price: Number(product.price),
      size: product.sizes[0] ?? null,
      color: product.colors[0] ?? null,
      quantity: 1,
    });
    setOpen(true);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative"
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block relative aspect-[4/5] overflow-hidden rounded-xl glass"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_new && (
            <span className="px-2 py-0.5 text-[10px] tracking-widest font-mono uppercase glass-strong rounded-full">
              New
            </span>
          )}
          {onSale && (
            <span className="px-2 py-0.5 text-[10px] tracking-widest font-mono uppercase rounded-full gradient-neon text-primary-foreground">
              Sale
            </span>
          )}
        </div>
        <button
          aria-label="Wishlist"
          onClick={(e) => {
            e.preventDefault();
            toast("Saved to wishlist");
          }}
          className="absolute top-3 right-3 size-9 rounded-full glass-strong grid place-items-center text-foreground/80 hover:text-primary opacity-0 group-hover:opacity-100 transition"
        >
          <Heart className="size-4" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            quickAdd();
          }}
          className="absolute bottom-3 left-3 right-3 py-2.5 rounded-md gradient-neon text-primary-foreground font-medium translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition flex items-center justify-center gap-2"
        >
          <Plus className="size-4" /> Quick add
        </button>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="font-medium truncate block hover:text-primary">
            {product.name}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Star className="size-3 fill-primary text-primary" />
            <span>{Number(product.rating_average).toFixed(1)}</span>
            <span>·</span>
            <span>{product.rating_count}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono">{money(Number(product.price))}</div>
          {onSale && (
            <div className="text-xs text-muted-foreground line-through font-mono">
              {money(Number(product.compare_at_price))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
