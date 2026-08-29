import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Star, Loader as Loader2, Image as ImageIcon } from "lucide-react";

import { useCars, useDeleteCar, useToggleFeatured } from "@/hooks/useCars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPriceDzd, type CarRow, type VehicleStatus } from "@/lib/vehicles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminInventory,
});

const statusLabel: Record<VehicleStatus, string> = {
  disponible: "Disponible",
  reserve: "Réservé",
  vendu: "Vendu",
};

const statusVariant: Record<VehicleStatus, "success" | "gold" | "destructive"> = {
  disponible: "success",
  reserve: "gold",
  vendu: "destructive",
};

function AdminInventory() {
  const { data: cars, isLoading, isError, error } = useCars();
  const deleteCar = useDeleteCar();
  const toggleFeatured = useToggleFeatured();
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow">Gestion</p>
          <h1 className="text-display-lg mt-2">Inventaire</h1>
          <p className="text-body-sm text-muted-foreground mt-2">
            {cars ? `${cars.length} véhicule${cars.length > 1 ? "s" : ""}` : "—"}
          </p>
        </div>
        <Button asChild variant="gold" size="lg">
          <Link to="/admin/new">
            <Plus aria-hidden />
            Ajouter un véhicule
          </Link>
        </Button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
        </div>
      ) : isError ? (
        <div className="surface-card flex flex-col items-center gap-3 p-12 text-center">
          <p className="text-body text-destructive">Impossible de charger l'inventaire.</p>
          <p className="text-body-sm text-muted-foreground">
            Vérifiez votre connexion et réessayez. Si le problème persiste, contactez
            l'administrateur.
          </p>
        </div>
      ) : cars && cars.length === 0 ? (
        <div className="surface-card flex flex-col items-center gap-4 p-12 text-center">
          <ImageIcon className="size-10 text-muted-foreground" aria-hidden />
          <p className="text-body text-muted-foreground">Aucun véhicule pour le moment.</p>
          <Button asChild variant="gold">
            <Link to="/admin/new">
              <Plus aria-hidden />
              Ajouter le premier
            </Link>
          </Button>
        </div>
      ) : (
        <div className="surface-card overflow-hidden">
          {/* Desktop table */}
          <table className="hidden w-full md:table">
            <thead>
              <tr className="border-b border-hairline text-start">
                <th className="p-4 text-caption text-muted-foreground">Image</th>
                <th className="p-4 text-caption text-muted-foreground">Véhicule</th>
                <th className="p-4 text-caption text-muted-foreground">Année</th>
                <th className="p-4 text-caption text-muted-foreground">Prix</th>
                <th className="p-4 text-caption text-muted-foreground">Statut</th>
                <th className="p-4 text-caption text-muted-foreground">Vedette</th>
                <th className="p-4 text-caption text-muted-foreground text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(cars ?? []).map((car) => (
                <CarRowDesktop
                  key={car.id}
                  car={car}
                  pendingDelete={pendingDelete}
                  setPendingDelete={setPendingDelete}
                  onDelete={() => {
                    deleteCar.mutate(car.id);
                    setPendingDelete(null);
                  }}
                  onToggleFeatured={() =>
                    toggleFeatured.mutate({ id: car.id, featured: !car.featured })
                  }
                />
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 p-4 md:hidden">
            {(cars ?? []).map((car) => (
              <CarRowMobile
                key={car.id}
                car={car}
                pendingDelete={pendingDelete}
                setPendingDelete={setPendingDelete}
                onDelete={() => {
                  deleteCar.mutate(car.id);
                  setPendingDelete(null);
                }}
                onToggleFeatured={() =>
                  toggleFeatured.mutate({ id: car.id, featured: !car.featured })
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CarRowDesktop({
  car,
  pendingDelete,
  setPendingDelete,
  onDelete,
  onToggleFeatured,
}: {
  car: CarRow;
  pendingDelete: string | null;
  setPendingDelete: (id: string | null) => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
}) {
  return (
    <tr className="border-b border-hairline last:border-0">
      <td className="p-4">
        {car.images[0] ? (
          <img
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            loading="lazy"
            className="size-16 rounded-lg object-cover"
          />
        ) : (
          <div className="grid size-16 place-items-center rounded-lg bg-muted">
            <ImageIcon className="size-5 text-muted-foreground" aria-hidden />
          </div>
        )}
      </td>
      <td className="p-4">
        <p className="text-eyebrow">{car.brand}</p>
        <p className="text-body mt-0.5 font-medium text-foreground">{car.model}</p>
      </td>
      <td className="p-4 text-data text-sm tabular-nums" dir="ltr">
        {car.year}
      </td>
      <td className="p-4 text-data text-sm text-gold" dir="ltr">
        {formatPriceDzd(car.price_dzd == null ? null : Number(car.price_dzd))}
      </td>
      <td className="p-4">
        <Badge variant={statusVariant[car.status]} size="sm">
          {statusLabel[car.status]}
        </Badge>
      </td>
      <td className="p-4">
        <button
          type="button"
          onClick={onToggleFeatured}
          aria-label={car.featured ? "Retirer des vedettes" : "Mettre en vedette"}
          aria-pressed={car.featured}
          className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star
            className={cn("size-5", car.featured ? "fill-gold text-gold" : "text-muted-foreground")}
            aria-hidden
          />
        </button>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <Button asChild variant="outline" size="icon-sm">
            <Link to="/admin/edit/$slug" params={{ slug: car.slug }} aria-label="Modifier">
              <Pencil />
            </Link>
          </Button>
          {pendingDelete === car.id ? (
            <>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                Confirmer
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setPendingDelete(null)}>
                Annuler
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPendingDelete(car.id)}
              aria-label="Supprimer"
            >
              <Trash2 className="text-destructive" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

function CarRowMobile({
  car,
  pendingDelete,
  setPendingDelete,
  onDelete,
  onToggleFeatured,
}: {
  car: CarRow;
  pendingDelete: string | null;
  setPendingDelete: (id: string | null) => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-hairline p-3">
      {car.images[0] ? (
        <img
          src={car.images[0]}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          className="size-20 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="grid size-20 shrink-0 place-items-center rounded-lg bg-muted">
          <ImageIcon className="size-5 text-muted-foreground" aria-hidden />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-eyebrow">{car.brand}</p>
        <p className="text-body font-medium text-foreground">{car.model}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-data text-xs tabular-nums" dir="ltr">
            {car.year}
          </span>
          <Badge variant={statusVariant[car.status]} size="sm">
            {statusLabel[car.status]}
          </Badge>
          <span className="text-data text-xs text-gold" dir="ltr">
            {formatPriceDzd(car.price_dzd == null ? null : Number(car.price_dzd))}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/edit/$slug" params={{ slug: car.slug }}>
              <Pencil className="size-3.5" />
              Modifier
            </Link>
          </Button>
          <button
            type="button"
            onClick={onToggleFeatured}
            aria-label={car.featured ? "Retirer des vedettes" : "Mettre en vedette"}
            aria-pressed={car.featured}
            className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star
              className={cn(
                "size-5",
                car.featured ? "fill-gold text-gold" : "text-muted-foreground",
              )}
              aria-hidden
            />
          </button>
          {pendingDelete === car.id ? (
            <div className="flex items-center gap-1">
              <Button variant="destructive" size="sm" onClick={onDelete}>
                Confirmer
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setPendingDelete(null)}>
                Annuler
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPendingDelete(car.id)}
              aria-label="Supprimer"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
