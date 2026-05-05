import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — NOVA THREADS" }] }),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/account` },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/account" });
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/account` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="glass-strong rounded-2xl p-8">
        <h1 className="font-display text-3xl">{mode === "signin" ? "Welcome back" : "Join NOVA"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to your account." : "Create your account to start shopping."}
        </p>
        <button onClick={google} className="mt-6 w-full px-4 py-3 rounded-md glass hover:text-primary">
          Continue with Google
        </button>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            value={email} onChange={(e) => setEmail(e.target.value)}
            type="email" required placeholder="Email"
            className="w-full px-4 py-3 rounded-md bg-background/50 border border-border focus:border-primary focus:outline-none"
          />
          <input
            value={password} onChange={(e) => setPassword(e.target.value)}
            type="password" required minLength={6} placeholder="Password"
            className="w-full px-4 py-3 rounded-md bg-background/50 border border-border focus:border-primary focus:outline-none"
          />
          <button disabled={loading} className="w-full px-4 py-3 rounded-md gradient-neon text-primary-foreground font-medium disabled:opacity-50">
            {loading ? "Loading…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
