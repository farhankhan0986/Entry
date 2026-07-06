import { NextResponse } from "next/server";

// ── POST /api/unsplash/track-download ────────────────────────────────────────
// Unsplash API guidelines require pinging a photo's `download_location`
// whenever it's actually used (not just previewed in search results).
// Fire-and-forget from the client right when a photo is inserted.
export async function POST(request) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey || accessKey === "your_unsplash_access_key_here") {
    return NextResponse.json({ ok: false }, { status: 501 });
  }

  try {
    const { downloadLocation } = await request.json();
    if (!downloadLocation || !downloadLocation.startsWith("https://api.unsplash.com/")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/unsplash/track-download]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
