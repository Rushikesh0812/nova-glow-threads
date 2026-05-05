import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-md gradient-neon text-primary-foreground font-bold">
              N
            </span>
            <span className="font-display text-lg">
              NOVA<span className="text-gradient">THREADS</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Wearable futures. Engineered fabrics. Designed in orbit.
          </p>
          <div className="mt-6 flex gap-3 text-foreground/70">
            <a href="#" aria-label="Instagram" className="hover:text-foreground"><Instagram className="size-4" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-foreground"><Twitter className="size-4" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-foreground"><Youtube className="size-4" /></a>
          </div>
        </div>
        <FooterCol title="Shop" links={[
          { to: "/shop", label: "All" },
          { to: "/shop?category=mens-tops", label: "Men" },
          { to: "/shop?category=womens-tops", label: "Women" },
          { to: "/shop?category=accessories", label: "Accessories" },
          { to: "/shop?category=sale", label: "Sale" },
        ]} />
        <FooterCol title="Company" links={[
          { to: "/about", label: "About" },
          { to: "/contact", label: "Contact" },
          { to: "/faq", label: "FAQ" },
        ]} />
        <FooterCol title="Help" links={[
          { to: "/shipping", label: "Shipping & Returns" },
          { to: "/privacy", label: "Privacy" },
          { to: "/terms", label: "Terms" },
        ]} />
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NOVA THREADS. All rights reserved.</p>
          <p className="font-mono tracking-wider">VISA · MC · AMEX · APPLE PAY</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm uppercase tracking-widest text-foreground/90">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="hover:text-foreground transition-colors">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
