import * as React from "react";
import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { Loader as Loader2, LogOut, LayoutDashboard, ExternalLink } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Admin layout route — the protected shell for /admin and its children.
 *
 * While the session is loading we show a centered spinner. If there is no
 * session, we redirect to /admin/login. When authenticated, we render the
 * admin chrome (top bar) + <Outlet />.
 */
export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-hairline bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display text-sm font-semibold text-gold"
            >
              PM
            </span>
            <div className="leading-tight">
              <div className="font-display text-base font-semibold text-foreground">
                Administration
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {siteConfig.dealership.shortName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin">
                <LayoutDashboard aria-hidden />
                Inventaire
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden />
                Voir le site
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate({ to: "/admin/login", replace: true });
              }}
            >
              <LogOut aria-hidden />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
