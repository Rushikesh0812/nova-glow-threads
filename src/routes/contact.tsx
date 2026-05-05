import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
export const Route = createFileRoute("/contact")({
  component: () => (
    <div className="mx-auto max-w-xl px-4 py-20">
      <h1 className="font-display text-5xl">Contact</h1>
      <form
        onSubmit={(e) => { e.preventDefault(); toast.success("Message sent"); }}
        className="mt-8 space-y-3"
      >
        <input required placeholder="Name" className="w-full px-4 py-3 rounded-md bg-background/50 border border-border" />
        <input required type="email" placeholder="Email" className="w-full px-4 py-3 rounded-md bg-background/50 border border-border" />
        <textarea required placeholder="Message" rows={5} className="w-full px-4 py-3 rounded-md bg-background/50 border border-border" />
        <button className="px-6 py-3 rounded-md gradient-neon text-primary-foreground font-medium">Send</button>
      </form>
    </div>
  ),
  head: () => ({ meta: [{ title: "Contact — NOVA THREADS" }] }),
});
