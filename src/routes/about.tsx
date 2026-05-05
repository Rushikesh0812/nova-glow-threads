import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/about")({
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="font-display text-5xl">About NOVA</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        We design clothing for the next decade — engineered fabrics, sculpted silhouettes, neon-tuned details.
        Born in 2026, NOVA THREADS makes wearable futures available today.
      </p>
    </div>
  ),
  head: () => ({ meta: [{ title: "About — NOVA THREADS" }] }),
});
