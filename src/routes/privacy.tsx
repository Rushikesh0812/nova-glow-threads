import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/privacy")({
  component: () => (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="font-display text-5xl">Privacy</h1>
      <p className="mt-6 text-muted-foreground">We respect your privacy. We collect only what we need to fulfill orders and improve your experience.</p>
    </div>
  ),
  head: () => ({ meta: [{ title: "Privacy — NOVA THREADS" }] }),
});
