import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LogIn, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/siteConfig";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { signIn, session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Already logged in? Bounce to the dashboard.
  React.useEffect(() => {
    if (session) navigate({ to: "/admin", replace: true });
  }, [session, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) {
      setError(
        error.message.includes("Invalid login credentials")
          ? "Email ou mot de passe incorrect."
          : error.message,
      );
      return;
    }
    navigate({ to: "/admin", replace: true });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      {/* Ambient backlight, matching the hero treatment */}
      <div
        aria-hidden="true"
        className="absolute -top-32 start-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-needle/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 end-[-10%] -z-10 h-[380px] w-[380px] rounded-full bg-gold/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="surface-card w-full max-w-md p-8 sm:p-10"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <span
            aria-hidden="true"
            className="mb-4 grid size-12 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display text-base font-semibold text-gold"
          >
            PM
          </span>
          <h1 className="text-h1 text-foreground">Espace propriétaire</h1>
          <p className="text-body-sm text-muted-foreground mt-2">
            {siteConfig.dealership.name}
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="proprietaire@prestigemotors-oran.dz"
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          {error ? (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              <span>{error}</span>
            </div>
          ) : null}

          <Button type="submit" variant="gold" size="lg" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Connexion…
              </>
            ) : (
              <>
                <LogIn aria-hidden />
                Se connecter
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 border-t border-hairline pt-6">
          <Link
            to="/"
            className="text-body-sm text-muted-foreground inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden />
            Retour au site
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
