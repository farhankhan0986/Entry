import { NextResponse } from "next/server";
import AuthorStats from "@/models/AuthorStats";
import { dbConnect } from "@/lib/db";
import { headers } from "next/headers";

async function getIP() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const real = h.get("x-real-ip");
  return forwarded ? forwarded.split(",")[0].trim() : (real ?? "127.0.0.1");
}

// GET /api/author-stats?authorId=xxx
// Returns { followers, hasFollowed }
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const authorId = searchParams.get("authorId");
  if (!authorId) {
    return NextResponse.json({ followers: 0, hasFollowed: false });
  }
  try {
    await dbConnect();
    const ip = await getIP();
    const doc = await AuthorStats.findOne({ authorId }).lean();
    const payload = doc
      ? { followers: doc.followers, hasFollowed: doc.followerIps.includes(ip) }
      : { followers: 0, hasFollowed: false };

    return NextResponse.json(payload, {
      headers: {
        // CDN caches for 30s; stale data served for up to 60s while revalidating.
        // POST (follow/unfollow) must NOT be cached — only GET is affected here.
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json({ followers: 0, hasFollowed: false });
  }
}

// POST /api/author-stats   body: { authorId, baseFollowers }
// Toggles follow/unfollow and returns updated { followers, hasFollowed }
export async function POST(request) {
  const { authorId, baseFollowers = 0 } = await request.json();
  if (!authorId) {
    return NextResponse.json({ error: "authorId required" }, { status: 400 });
  }
  try {
    await dbConnect();
    const ip = await getIP();

    // Upsert: create with baseFollowers on first interaction
    let doc = await AuthorStats.findOne({ authorId });
    if (!doc) {
      doc = await AuthorStats.create({
        authorId,
        followers: baseFollowers,
        followerIps: [],
      });
    }

    const alreadyFollowing = doc.followerIps.includes(ip);

    if (alreadyFollowing) {
      // Unfollow
      doc.followerIps = doc.followerIps.filter((i) => i !== ip);
      doc.followers = Math.max(0, doc.followers - 1);
    } else {
      // Follow
      doc.followerIps.push(ip);
      doc.followers += 1;
    }

    await doc.save();

    return NextResponse.json({
      followers: doc.followers,
      hasFollowed: !alreadyFollowing,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
