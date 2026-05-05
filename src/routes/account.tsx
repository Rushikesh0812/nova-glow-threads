import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Account — NOVA THREADS" }] }),
});

function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (!user) return null;
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="font-display text-4xl">Your account</h1>
      <div className="mt-8 glass-strong rounded-2xl p-6">
        <p className="text-sm text-muted-foreground">Signed in as</p>
        <p className="font-mono">{user.email}</p>
        <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
          <Card title="Orders" desc="Your order history will appear here." />
          <Card title="Addresses" desc="Manage your shipping addresses." />
          <Card title="Wishlist" desc="Items you've saved for later." />
        </div>
        <button
          onClick={() => signOut().then(() => navigate({ to: "/" }))}
          className="mt-8 px-5 py-2.5 rounded-md glass hover:text-primary"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="font-display">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}
