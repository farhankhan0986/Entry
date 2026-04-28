import React from "react";
import { PenLine } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-16 px-4 font-playfair animate-pulse">
      <div className="max-w-2xl mx-auto">
        {/* Header Skeleton */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 text-[var(--accent)] mb-4">
            <PenLine size={16} />
            <span className="text-xs uppercase tracking-[0.3em] font-bold">New Entry</span>
          </div>
          <div className="h-12 w-64 bg-[var(--muted)]/20 rounded-lg mx-auto mb-3"></div>
          <div className="h-1 w-20 bg-[var(--accent)]/50 mx-auto rounded-full" />

          {/* Author chip skeleton */}
          <div className="mt-6 inline-flex items-center gap-3 bg-[var(--card)]/20 border border-[var(--border)] rounded-full px-4 py-2">
            <div className="w-7 h-7 rounded-full bg-[var(--muted)]/20"></div>
            <div className="h-4 w-32 bg-[var(--muted)]/20 rounded"></div>
          </div>
        </header>

        {/* Form Skeleton */}
        <div className="bg-[var(--card)]/10 border border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-sm space-y-10">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-3 w-20 bg-[var(--muted)]/20 rounded ml-1"></div>
            <div className="h-14 w-full bg-[var(--muted)]/20 rounded-lg mt-2"></div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <div className="h-3 w-24 bg-[var(--muted)]/20 rounded ml-1"></div>
            <div className="h-12 w-full bg-[var(--muted)]/20 rounded-xl mt-2"></div>
          </div>

          {/* Banner Image */}
          <div className="space-y-2">
            <div className="h-3 w-28 bg-[var(--muted)]/20 rounded ml-1"></div>
            <div className="h-12 w-full bg-[var(--muted)]/20 rounded-xl mt-2"></div>
            <div className="flex justify-center mt-4 mb-4 items-center">
              <div className="h-3 w-8 bg-[var(--muted)]/20 rounded"></div>
            </div>
            <div className="w-full h-32 bg-[var(--muted)]/20 border-2 border-dashed border-[var(--border)] rounded-2xl"></div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="h-3 w-28 bg-[var(--muted)]/20 rounded ml-1"></div>
            <div className="h-64 w-full bg-[var(--muted)]/20 rounded-xl mt-2"></div>
          </div>

          {/* Submit */}
          <div className="w-full h-16 bg-[var(--muted)]/20 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
