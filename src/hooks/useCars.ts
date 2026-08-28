import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import type { CarInput, CarRow, Vehicle, Locale } from "@/lib/vehicles";
import { rowToVehicle } from "@/lib/vehicles";

/**
 * Data hooks for the `cars` table. Used by both the public site (read-only)
 * and the admin dashboard (full CRUD). All queries go through the anon-key
 * client; RLS enforces that anon can only SELECT, while the authenticated
 * owner can INSERT/UPDATE/DELETE.
 */

const CARS_KEY = ["cars"] as const;

async function requireAuthenticatedUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Votre session administrateur a expiré. Veuillez vous reconnecter.");
  }
  return data.user;
}

/** Fetch all cars as DB rows (admin list — includes sold/unfeatured). */
export function useCars() {
  return useQuery<CarRow[]>({
    queryKey: CARS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CarRow[];
    },
  });
}

/** Fetch a single car by slug (public detail view). */
export function useCarBySlug(slug: string | undefined) {
  return useQuery<CarRow | null>({
    queryKey: ["cars", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as CarRow | null;
    },
  });
}

/** Fetch featured cars as public `Vehicle` objects (home grid). */
export function useFeaturedVehicles(locale: Locale) {
  return useQuery<Vehicle[]>({
    queryKey: ["cars", "featured", locale],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => rowToVehicle(row as CarRow, locale));
    },
  });
}

/** Fetch all cars as public `Vehicle` objects (full inventory listing). */
export function useAllVehicles(locale: Locale) {
  return useQuery<Vehicle[]>({
    queryKey: ["cars", "all", locale],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => rowToVehicle(row as CarRow, locale));
    },
  });
}

/** Create a new car. */
export function useCreateCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CarInput) => {
      await requireAuthenticatedUser();
      const { data, error } = await supabase.from("cars").insert(input).select().single();
      if (error) throw error;
      return data as CarRow;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CARS_KEY });
      qc.invalidateQueries({ queryKey: ["cars"] });
      toast.success("Véhicule ajouté.");
    },
    onError: (e: Error) => toast.error("Erreur lors de l'ajout : " + e.message),
  });
}

/** Update an existing car by id. */
export function useUpdateCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: CarInput }) => {
      await requireAuthenticatedUser();
      const { data, error } = await supabase
        .from("cars")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as CarRow;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CARS_KEY });
      qc.invalidateQueries({ queryKey: ["cars"] });
      toast.success("Véhicule mis à jour.");
    },
    onError: (e: Error) => toast.error("Erreur lors de la mise à jour : " + e.message),
  });
}

/** Delete a car by id. */
export function useDeleteCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await requireAuthenticatedUser();
      const { error } = await supabase.from("cars").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CARS_KEY });
      qc.invalidateQueries({ queryKey: ["cars"] });
      toast.success("Véhicule supprimé.");
    },
    onError: (e: Error) => toast.error("Erreur lors de la suppression : " + e.message),
  });
}

/** Toggle the featured flag on a car. */
export function useToggleFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      await requireAuthenticatedUser();
      const { error } = await supabase.from("cars").update({ featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CARS_KEY });
      qc.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (e: Error) => toast.error("Erreur : " + e.message),
  });
}
