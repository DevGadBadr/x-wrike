import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-9 w-48 rounded-xl" />
        <Skeleton className="h-4 w-80 max-w-full rounded-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-28 rounded-3xl" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
        <Skeleton className="h-[640px] rounded-3xl" />
      </div>
    </div>
  );
}
