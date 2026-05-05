import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/faq")({
  component: () => (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="font-display text-5xl">FAQ</h1>
      <div className="mt-8 space-y-4">
        {[
          ["When do new drops arrive?", "Roughly every 6 weeks. Subscribe for early access."],
          ["What sizes do you carry?", "XS through XL on apparel; numeric on bottoms and footwear."],
          ["Do you ship internationally?", "Yes — express shipping worldwide."],
        ].map(([q, a]) => (
          <div key={q} className="glass rounded-xl p-5">
            <p className="font-display">{q}</p>
            <p className="text-muted-foreground text-sm mt-2">{a}</p>
          </div>
        ))}
      </div>
    </div>
  ),
  head: () => ({ meta: [{ title: "FAQ — NOVA THREADS" }] }),
});
