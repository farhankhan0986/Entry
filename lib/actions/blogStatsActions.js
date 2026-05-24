"use server";

import BlogStats from "@/models/BlogStats";
import dbConnect from "../db";
import { headers } from "next/headers";

/**
 * Helper to get IP safely
 */
async function getIP() {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    
    // Fallback IP for local dev if headers are missing
    let ip = forwarded ? forwarded.split(",")[0] : realIp;
    if (!ip) {
        ip = "127.0.0.1";
    }
    return ip;
}

export async function getBlogStats(slug) {
    if (!slug) return { views: 0, likes: 0, hasLiked: false };

    try {
        await dbConnect();
        const ip = await getIP();
        const stats = await BlogStats.findOne({ slug }).lean();

        if (!stats) {
            return { views: 0, likes: 0, hasLiked: false };
        }

        const hasLiked = stats.likedIps.includes(ip);
        
        return {
            views: stats.views,
            likes: stats.likes,
            hasLiked,
        };
    } catch (error) {
        console.error("Error fetching blog stats:", error);
        return { views: 0, likes: 0, hasLiked: false };
    }
}

export async function incrementView(slug) {
    if (!slug) return { views: 0, likes: 0, hasLiked: false };

    try {
        await dbConnect();
        const ip = await getIP();

        // Find the stats record or create if it doesn't exist
        const updatedStats = await BlogStats.findOneAndUpdate(
            { slug },
            {
                $setOnInsert: { slug, likes: 0 },
                $addToSet: { viewedIps: ip }
            },
            { returnDocument: 'after', upsert: true }
        );

        // We manually recount the views based on array size, or we use $inc.
        // It's safer to use $addToSet and then update the count if it was added.
        // But an easier way is just doing this two-step to ensure accuracy:
        let views = updatedStats.views;
        
        // Let's ensure the views count reflects the unique viewedIps correctly
        // Or simpler, let's just make views = viewedIps.length
        views = updatedStats.viewedIps.length;

        // Keep the database consistent
        if (updatedStats.views !== views) {
            await BlogStats.updateOne({ slug }, { views });
        }

        const hasLiked = updatedStats.likedIps.includes(ip);

        return {
            views,
            likes: updatedStats.likes,
            hasLiked,
        };
    } catch (error) {
        console.error("Error incrementing view:", error);
        return { views: 0, likes: 0, hasLiked: false };
    }
}

export async function toggleLike(slug) {
    if (!slug) throw new Error("Slug is required");

    try {
        await dbConnect();
        const ip = await getIP();

        const stats = await BlogStats.findOne({ slug });
        
        // If no stats document exists yet, we should probably create one
        if (!stats) {
            const newStats = await BlogStats.create({
                slug,
                views: 0,
                likes: 1, // First like!
                likedIps: [ip],
                viewedIps: []
            });
            return {
                views: newStats.views,
                likes: newStats.likes,
                hasLiked: true
            };
        }

        const hasLiked = stats.likedIps.includes(ip);
        
        if (hasLiked) {
            // Unlike
            stats.likedIps = stats.likedIps.filter(savedIp => savedIp !== ip);
            stats.likes = Math.max(0, stats.likes - 1);
        } else {
            // Like
            stats.likedIps.push(ip);
            stats.likes += 1;
        }

        await stats.save();

        return {
            views: stats.views || stats.viewedIps.length,
            likes: stats.likes,
            hasLiked: !hasLiked
        };
    } catch (error) {
        console.error("Error toggling like:", error);
        throw error;
    }
}
