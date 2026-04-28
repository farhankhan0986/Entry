import React from "react";

export default function Loading() {
  return (
    <div className="w-full mx-auto mt-10 py-10 container px-6 lg:px-0">
      {/* Header Section Skeleton */}
      <div className="text-center mb-16 space-y-4">
        <div className="h-14 w-64 md:w-96 bg-[var(--muted)]/20 animate-pulse rounded-lg mx-auto"></div>
        <div className="h-6 w-full max-w-xl bg-[var(--muted)]/20 animate-pulse rounded mx-auto mt-4"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="w-[80%] lg:w-[60%] mx-auto mb-10 flex flex-col gap-4">
        <div className="w-full h-12 bg-[var(--muted)]/20 animate-pulse rounded-xl"></div>
        <div className="flex justify-center gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-16 bg-[var(--muted)]/20 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden h-[380px] p-4 m-2 flex flex-col">
            <div className="w-full h-48 bg-[var(--muted)]/20 animate-pulse rounded-2xl mb-4"></div>
            <div className="space-y-3 flex-grow">
              <div className="h-6 bg-[var(--muted)]/20 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-[var(--muted)]/20 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-[var(--muted)]/20 animate-pulse rounded w-5/6"></div>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border)]/50 flex justify-between">
              <div className="h-3 bg-[var(--muted)]/20 animate-pulse rounded w-16"></div>
              <div className="h-3 bg-[var(--muted)]/20 animate-pulse rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
