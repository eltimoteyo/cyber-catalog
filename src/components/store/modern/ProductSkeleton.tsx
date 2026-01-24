export default function ProductSkeleton() {
  return (
    <div className="group relative animate-pulse">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-3 border border-gray-100">
        <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200"></div>
      </div>
      <div>
        <div className="flex justify-between items-start mb-1 gap-2">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-20 mt-1"></div>
      </div>
    </div>
  );
}
