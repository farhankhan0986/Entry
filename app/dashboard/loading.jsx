import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair animate-pulse">
      {/* ─── Full-Width Header Banner ──────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-[var(--card)]/10" />
        <div className="relative container mx-auto px-6 py-10 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            
            {/* Left: User Skeleton */}
            <div className="flex items-center gap-6">
              <div className="w-[72px] h-[72px] rounded-[18px] bg-[var(--muted)]/20" />
              <div>
                <div className="h-3 w-32 bg-[var(--muted)]/20 rounded mb-2"></div>
                <div className="h-8 w-48 bg-[var(--muted)]/20 rounded mb-2"></div>
                <div className="h-4 w-40 bg-[var(--muted)]/20 rounded"></div>
              </div>
            </div>

            {/* Right: CTA Skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-32 bg-[var(--muted)]/20 rounded-xl"></div>
              <div className="h-11 w-12 bg-[var(--muted)]/20 rounded-xl"></div>
            </div>
          </div>

          {/* Stats Row Skeleton */}
          <div className="mt-10">
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[var(--card)]/20 border border-[var(--border)] rounded-2xl p-5 h-[140px] flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--muted)]/20"></div>
                  <div>
                    <div className="h-8 w-16 bg-[var(--muted)]/20 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-[var(--muted)]/20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Skeleton ────────────────────────────────────────── */}
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex gap-8">
          {/* Sidebar Skeleton */}
          <aside className="hidden md:flex flex-col gap-2 w-52 shrink-0">
            <div className="h-3 w-24 bg-[var(--muted)]/20 rounded px-4 mb-2"></div>
            <div className="h-10 w-full bg-[var(--muted)]/20 rounded-xl mb-1"></div>
            <div className="h-10 w-full bg-[var(--muted)]/20 rounded-xl"></div>
            <div className="mt-6 px-4">
              <div className="h-px bg-[var(--border)]" />
            </div>
            <div className="mt-6 px-4 space-y-4">
               <div className="h-3 w-24 bg-[var(--muted)]/20 rounded"></div>
               <div className="h-4 w-32 bg-[var(--muted)]/20 rounded"></div>
               <div className="h-4 w-32 bg-[var(--muted)]/20 rounded"></div>
            </div>
          </aside>

          {/* Main panel Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-6 w-32 bg-[var(--muted)]/20 rounded mb-2"></div>
                <div className="h-4 w-24 bg-[var(--muted)]/20 rounded"></div>
              </div>
              <div className="h-5 w-24 bg-[var(--muted)]/20 rounded hidden md:block"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[var(--card)]/10 border border-[var(--border)] rounded-2xl overflow-hidden h-[340px]">
                  <div className="w-full h-44 bg-[var(--muted)]/20"></div>
                  <div className="p-5 space-y-3">
                     <div className="h-5 w-full bg-[var(--muted)]/20 rounded"></div>
                     <div className="h-5 w-3/4 bg-[var(--muted)]/20 rounded mb-4"></div>
                     <div className="h-3 w-1/2 bg-[var(--muted)]/20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
