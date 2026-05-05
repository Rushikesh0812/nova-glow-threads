import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-7xl text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in orbit</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page drifted out of range.
        </p>
        <Link to="/" className="mt-6 inline-block px-5 py-2.5 rounded-md gradient-neon text-primary-foreground font-medium">
          Return home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NOVA THREADS — Wearable Futures" },
      {
        name: "description",
        content:
          "NOVA THREADS — premium futuristic apparel for men, women and beyond. Engineered fabrics. Designed in orbit.",
      },
      { property: "og:title", content: "NOVA THREADS — Wearable Futures" },
      { property: "og:description", content: "Premium futuristic apparel. Engineered fabrics. Designed in orbit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="pt-16 min-h-screen">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
        <Toaster theme="dark" position="top-center" />
      </CartProvider>
    </AuthProvider>
  );
}
