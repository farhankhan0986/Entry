"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, ImageOff } from "lucide-react";

/**
 * Compact Unsplash search + grid picker. Drop-in for anywhere that needs
 * "search a stock photo, pick one" — used by the banner image field and
 * the content image modal in FormattedTextarea. Selection is reported via
 * onSelect(photo); the parent decides what to do with the URL (and pings
 * /api/unsplash/track-download once the photo is actually used, per
 * Unsplash's API guidelines).
 */
export default function UnsplashPicker({ onSelect, selectedId }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  function runSearch(term) {
    const q = term.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setSearched(true);

    fetch(`/api/unsplash/search?q=${encodeURIComponent(q)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Search failed.");
        setResults(data.results || []);
      })
      .catch((err) => {
        setResults([]);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 500);
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); clearTimeout(debounceRef.current); runSearch(query); } }}
          placeholder="Search Unsplash — e.g. mountains, coffee, city night"
          className="w-full pl-9 pr-4 py-2.5 bg-[var(--input)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
        />
        {loading && (
          <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent)] animate-spin" />
        )}
      </div>

      {/* Results */}
      {error && (
        <p className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
      )}

      {!error && searched && !loading && results.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-6 text-[var(--muted)]">
          <ImageOff size={20} className="opacity-50" />
          <p className="text-xs">No photos found. Try another search.</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-1.5 max-h-56 overflow-y-auto pr-0.5">
            {results.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => onSelect(photo)}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedId === photo.id
                    ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                    : "border-transparent hover:border-[var(--accent)]/50"
                }`}
                style={{ backgroundColor: photo.color || "var(--border)" }}
                title={`Photo by ${photo.photographer.name} on Unsplash`}
              >
                <img
                  src={photo.thumb}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.photographer.name}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[9px] text-[var(--muted)] text-center">
            Photos via{" "}
            <a
              href="https://unsplash.com/?utm_source=entry&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--accent)]"
            >
              Unsplash
            </a>
          </p>
        </>
      )}
    </div>
  );
}
