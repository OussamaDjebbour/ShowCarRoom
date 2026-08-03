import { createFileRoute } from "@tanstack/react-router";

import { CarForm } from "@/components/admin/CarForm";

export const Route = createFileRoute("/admin/new")({
  component: NewCarPage,
});

function NewCarPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-eyebrow">Nouveau véhicule</p>
        <h1 className="text-display-lg mt-2">Ajouter une voiture</h1>
      </header>
      <CarForm />
    </div>
  );
}
