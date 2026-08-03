import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, ArrowLeft } from "lucide-react";

import { CarForm } from "@/components/admin/CarForm";
import { useCars } from "@/hooks/useCars";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/edit/$slug")({
  component: EditCarPage,
});

function EditCarPage() {
  const { slug } = Route.useParams();
  const { data: cars, isLoading, isError } = useCars();
  const car = cars?.find((c) => c.slug === slug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-body text-destructive">Véhicule introuvable.</p>
        <Button asChild variant="outline">
          <Link to="/admin">
            <ArrowLeft aria-hidden />
            Retour à l'inventaire
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-eyebrow">Modifier</p>
        <h1 className="text-display-lg mt-2">
          {car.brand} {car.model}
        </h1>
      </header>
      <CarForm car={car} />
    </div>
  );
}
