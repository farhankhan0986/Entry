export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)] animate-pulse">

      {/* Breadcrumbs skeleton */}
      <nav className="container mx-auto px-4 pt-12 max-w-7xl flex items-center gap-2">
        <div className="h-3 w-10 bg-[var(--border)] rounded-full" />
        <div className="h-3 w-2 bg-[var(--border)] rounded-full" />
        <div className="h-3 w-14 bg-[var(--border)] rounded-full" />
        <div className="h-3 w-2 bg-[var(--border)] rounded-full" />
        <div className="h-3 w-40 bg-[var(--border)] rounded-full" />
      </nav>

      <article className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left share column (desktop) */}
          <aside className="hidden xl:flex flex-col gap-4 shrink-0">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-[var(--border)] rounded-full" />
            ))}
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Category badge */}
            <div className="mb-6">
              <div className="h-6 w-24 bg-[var(--border)] rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-3 mb-8">
              <div className="h-10 w-full bg-[var(--border)] rounded-xl" />
              <div className="h-10 w-4/5 bg-[var(--border)] rounded-xl" />
              <div className="h-10 w-3/5 bg-[var(--border)] rounded-xl" />
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--border)]" />
                <div className="h-4 w-28 bg-[var(--border)] rounded-full" />
              </div>
              <div className="h-4 w-24 bg-[var(--border)] rounded-full" />
              <div className="h-4 w-20 bg-[var(--border)] rounded-full" />
            </div>

            {/* Interaction bar */}
            <div className="flex gap-4 mt-4 mb-10">
              <div className="h-8 w-20 bg-[var(--border)] rounded-full" />
              <div className="h-8 w-20 bg-[var(--border)] rounded-full" />
            </div>

            {/* Banner image */}
            <div className="w-full h-[300px] md:h-[500px] mb-12 rounded-[40px] bg-[var(--border)]" />

            {/* Article body paragraphs */}
            <div className="max-w-3xl space-y-4">
              {/* Drop-cap first line */}
              <div className="flex gap-3 items-start">
                <div className="h-16 w-12 bg-[var(--border)] rounded-lg shrink-0" />
                <div className="flex-1 space-y-2 pt-2">
                  <div className="h-5 w-full bg-[var(--border)] rounded-full" />
                  <div className="h-5 w-11/12 bg-[var(--border)] rounded-full" />
                  <div className="h-5 w-4/5 bg-[var(--border)] rounded-full" />
                </div>
              </div>

              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-full bg-[var(--border)] rounded-full" />
                  <div className="h-5 w-[95%] bg-[var(--border)] rounded-full" />
                  <div className="h-5 w-[80%] bg-[var(--border)] rounded-full" />
                </div>
              ))}

              {/* Section heading */}
              <div className="pt-8">
                <div className="h-8 w-64 bg-[var(--border)] rounded-xl" />
              </div>

              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-full bg-[var(--border)] rounded-full" />
                  <div className="h-5 w-[90%] bg-[var(--border)] rounded-full" />
                  <div className="h-5 w-[75%] bg-[var(--border)] rounded-full" />
                </div>
              ))}

              {/* Author footer card */}
              <div className="mt-16 pt-10 border-t border-[var(--border)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/10">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-[var(--border)]" />
                    <div className="space-y-2">
                      <div className="h-6 w-32 bg-[var(--border)] rounded-full" />
                      <div className="h-4 w-24 bg-[var(--border)] rounded-full" />
                    </div>
                  </div>
                  <div className="h-11 w-36 bg-[var(--border)] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[350px] shrink-0">
            <div className="space-y-12">

              {/* Table of contents skeleton */}
              <div className="p-8 bg-[var(--card)]/10 border border-[var(--border)] rounded-[32px]">
                <div className="h-4 w-28 bg-[var(--border)] rounded-full mb-6" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-[var(--border)] rounded-full" style={{ width: `${70 + i * 5}%` }} />
                  ))}
                </div>
              </div>

              {/* Related stories skeleton */}
              <div className="space-y-6">
                <div className="h-4 w-28 bg-[var(--border)] rounded-full ml-2" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 items-center p-2">
                    <div className="h-20 w-20 bg-[var(--border)] rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-[var(--border)] rounded-full" />
                      <div className="h-4 w-3/4 bg-[var(--border)] rounded-full" />
                      <div className="h-3 w-16 bg-[var(--border)] rounded-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
