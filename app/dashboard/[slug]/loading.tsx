import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="rounded-lg border bg-card">
        <div className="flex items-end justify-between border-b px-4 py-3">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-7 w-20" />
          </div>
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="p-4">
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    </>
  );
}
