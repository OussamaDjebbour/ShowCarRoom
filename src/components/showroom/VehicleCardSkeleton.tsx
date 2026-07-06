import { Skeleton } from "@/components/ui/skeleton";

/**
 * VehicleCardSkeleton — mirrors the composition of <VehicleCard /> so the grid
 * doesn't shift when real data arrives. Uses the same `surface-card` utility.
 */
export function VehicleCardSkeleton() {
  return (
    <div className="surface-card flex flex-col" aria-hidden="true">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />

      <div className="flex items-start justify-between gap-4 px-6 pt-6">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3 w-52" />
        </div>
        <div className="w-24 space-y-2 text-right">
          <Skeleton className="ml-auto h-3 w-10" />
          <Skeleton className="ml-auto h-5 w-24" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-hairline px-6 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-hairline p-6">
        <Skeleton className="h-11 flex-1" />
        <Skeleton className="h-11 w-32" />
      </div>
    </div>
  );
}
