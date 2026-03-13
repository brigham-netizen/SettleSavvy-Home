'use client';

export default function DashboardSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 mt-10 animate-pulse">
      {/* Address header */}
      <div className="text-center space-y-2">
        <div className="h-3 w-24 bg-gray-200 rounded mx-auto" />
        <div className="h-7 w-80 bg-gray-200 rounded mx-auto" />
        <div className="h-3 w-40 bg-gray-200 rounded mx-auto" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-4 bg-gray-200 rounded-full" />
            </div>
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-9 w-28 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-48 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-44 bg-gray-200 rounded-xl" />
          <div className="h-9 w-28 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
