export default function ProductSkeleton() {
  return (
    <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
      <div className="h-44 skeleton" />
      <div className="p-4 flex flex-col gap-3">
        <div>
          <div className="h-3 w-16 skeleton rounded mb-2" />
          <div className="h-4 w-3/4 skeleton rounded" />
        </div>
        <div className="h-6 w-28 skeleton rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-8 skeleton rounded" />
          <div className="h-5 w-8 skeleton rounded" />
        </div>
        <div className="mt-auto pt-3 border-t border-brand-border flex items-center justify-between">
          <div>
            <div className="h-6 w-16 skeleton rounded mb-1" />
            <div className="h-3 w-12 skeleton rounded" />
          </div>
          <div className="h-9 w-20 skeleton rounded-lg" />
        </div>
      </div>
    </div>
  );
}
