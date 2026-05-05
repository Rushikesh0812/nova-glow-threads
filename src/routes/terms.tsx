import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/terms")({
  component: () => (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="font-display text-5xl">Terms</h1>
      <p className="mt-6 text-muted-foreground">By using NOVA THREADS you agree to our terms of service. Be cool to each other.</p>
    </div>
  ),
  head: () => ({ meta: [{ title: "Terms — NOVA THREADS" }] }),
});
