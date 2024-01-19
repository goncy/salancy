import {Skeleton} from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div>
          <Skeleton className="h-10 w-56" />
        </div>
      </div>
      <Skeleton className="h-[600px]" />
    </section>
  );
}
