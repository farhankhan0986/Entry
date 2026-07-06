import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

// ── GET /api/unsplash/search?q=mountains&page=1 ──────────────────────────────
// Server-side proxy so the Unsplash Access Key never reaches the browser.
export async function GET(request) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey || accessKey === "your_unsplash_access_key_here") {
    return NextResponse.json(
      { error: "Unsplash isn't configured yet. Add UNSPLASH_ACCESS_KEY to your environment." },
      { status: 501 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  if (!query) {
    return NextResponse.json({ error: "A search term is required." }, { status: 400 });
  }

  // Light per-IP throttling — Unsplash's own demo-tier limit (50 req/hr) is the
  // real ceiling, this just stops a single client hammering our proxy.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (!checkRateLimit(`unsplash:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many searches. Wait a moment and try again." }, { status: 429 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=12&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );

    if (res.status === 403) {
      return NextResponse.json({ error: "Unsplash rate limit reached. Try again later." }, { status: 429 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: "Unsplash search failed." }, { status: 502 });
    }

    const data = await res.json();
    const results = (data.results || []).map((p) => ({
      id: p.id,
      thumb: p.urls.small,
      full: p.urls.regular,
      alt: p.alt_description || p.description || query,
      color: p.color,
      width: p.width,
      height: p.height,
      downloadLocation: p.links.download_location,
      photographer: {
        name: p.user.name,
        profileUrl: `${p.user.links.html}?utm_source=entry&utm_medium=referral`,
      },
    }));

    return NextResponse.json({ results, total: data.total || 0, page });
  } catch (err) {
    console.error("[GET /api/unsplash/search]", err);
    return NextResponse.json({ error: "Unsplash search failed." }, { status: 500 });
  }
}
