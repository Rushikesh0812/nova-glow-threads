import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/shipping")({
  component: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 prose prose-invert">
      <h1 className="font-display text-5xl">Shipping & Returns</h1>
      <p className="mt-6 text-muted-foreground">Free express worldwide on orders over $150. Standard delivery 3–5 business days. 30-day returns on unworn items.</p>
    </div>
  ),
  head: () => ({ meta: [{ title: "Shipping — NOVA THREADS" }] }),
});
