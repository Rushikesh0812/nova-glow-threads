import { createFileRoute } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { money } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — NOVA THREADS" }] }),
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 grid lg:grid-cols-[1fr_360px] gap-10">
      <div>
        <h1 className="font-display text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stripe payments coming next. For now this is a preview of the flow.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Order placed (demo)");
            clear();
          }}
          className="mt-8 space-y-6"
        >
          <Section title="Shipping">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Full name" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Street address" className="sm:col-span-2" />
              <Input placeholder="City" />
              <Input placeholder="Postal code" />
            </div>
          </Section>
          <Section title="Payment">
            <Input placeholder="Card number" />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Input placeholder="MM / YY" />
              <Input placeholder="CVC" />
            </div>
          </Section>
          <button className="w-full px-6 py-3.5 rounded-md gradient-neon text-primary-foreground font-medium glow-neon">
            Place order · {money(total)}
          </button>
        </form>
      </div>
      <aside className="glass-strong rounded-2xl p-6 h-fit sticky top-24">
        <h2 className="font-display">Order summary</h2>
        <div className="mt-4 space-y-3 max-h-72 overflow-y-auto">
          {items.map((i) => (
            <div key={i.productId + i.size + i.color} className="flex gap-3 text-sm">
              <img src={i.image} className="size-12 rounded-md object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <p className="truncate">{i.name}</p>
                <p className="text-xs text-muted-foreground">× {i.quantity}</p>
              </div>
              <span className="font-mono">{money(i.price * i.quantity)}</span>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-muted-foreground">Cart is empty.</p>}
        </div>
        <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
          <Row label="Subtotal" value={money(subtotal)} />
          <Row label="Shipping" value={shipping ? money(shipping) : "Free"} />
          <Row label="Tax" value={money(tax)} />
          <Row label="Total" value={money(total)} bold />
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-sm uppercase tracking-widest mb-3">{title}</h3>
      {children}
    </div>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full px-4 py-3 rounded-md bg-background/50 border border-border focus:border-primary focus:outline-none ${props.className ?? ""}`} />;
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-mono text-base pt-2" : "text-muted-foreground"}`}>
      <span>{label}</span><span className={bold ? "" : "font-mono"}>{value}</span>
    </div>
  );
}
