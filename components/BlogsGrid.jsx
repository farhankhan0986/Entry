"use client";

import Link from "next/link";
import BlogCard from "./BlogCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

// Stagger container: each child fires sequentially
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Individual card: slides up + fades in
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// Header elements animate in from slightly below
const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function BlogsGrid({ blogs, hot, journal }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = useMemo(() => {
    // Use a fallback empty array if blogs is undefined
    const allCategories = (blogs || []).map(b => b.category?.trim()).filter(Boolean);
    return ["All", ...new Set(allCategories)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return (blogs || []).filter((blog) => {
      const matchesSearch =
        !query ||
        blog.title?.toLowerCase().includes(query) ||
        blog.content?.toLowerCase().includes(query) ||
        blog.category?.toLowerCase().includes(query) ||
        blog.authorName?.toLowerCase().includes(query);

      const matchesTag =
        selectedTag === "All" ||
        blog.category?.trim() === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [blogs, searchQuery, selectedTag]);

  return (
    <div className="w-full mx-auto mt-10 py-10">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4 overflow-hidden">
        <motion.h2
          className="text-5xl md:text-6xl font-bold font-playfair text-[var(--foreground)] tracking-tight"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={0}
        >
          {hot ? "Hot Entries" : "The Journal"}
        </motion.h2>

        <motion.p
          className="text-[var(--muted)] font-playfair text-lg max-w-xl mx-auto"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={1}
        >
          {hot ? "These entries are currently making waves in our community." : "Explore the latest thoughts, stories, and entries from our community of creators."}
        </motion.p>

        {hot && (<motion.div
          className="flex items-center justify-center"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={2}
        >
          <Link href="/write" className="btn-primary font-playfair">
            Add More
          </Link>
        </motion.div>)}
      </div>

      {journal && (
        <div className="w-[80%] lg:w-[60%] mx-auto mb-10 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search the journal..."
            className="w-full p-2 border border-[var(--border)] rounded-xl outline-none p-4 font-arvo bg-transparent text-[var(--foreground)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-3 justify-center mb-6">
            <>
              <div className="flex flex-wrap items-center gap-2 font-playfair">
                {/* The Heading Style Label */}
                <h1 className="text-[var(--background)] bg-[var(--foreground)] px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-widest">
                  Categories:
                </h1>

                {/* First 4 Tag Buttons */}
                {tags.slice(0, 4).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`py-1.5 px-4 rounded-lg cursor-pointer text-[10px] font-bold uppercase tracking-widest transition-all border ${selectedTag === tag
                        ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                        : "bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
                      }`}
                  >
                    {tag}
                  </button>
                ))}

                {/* Dropdown for the rest */}
                {tags.length > 4 && (
                  <select
                    value={tags.slice(4).includes(selectedTag) ? selectedTag : ""}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className={`py-1.5 px-3 rounded-lg cursor-pointer text-[10px] font-bold uppercase tracking-widest outline-none border transition-all ${tags.slice(4).includes(selectedTag)
                        ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                        : "bg-[var(--card)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--foreground)]"
                      }`}
                  >
                    <option value="" disabled className="bg-[var(--card)]">More +</option>
                    {tags.slice(4).map(tag => (
                      <option key={tag} value={tag} className="bg-[var(--card)] text-[var(--foreground)]">
                        {tag}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </>
          </div>
        </div>
      )}

      {/* Grid */}
      {filteredBlogs.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog.id ?? blog.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-3xl"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xl text-[var(--muted)] font-playfair mb-6">
            It looks a bit empty here...
          </p>
          <Link href="/write" className="btn-primary font-playfair">
            Create the First Entry
          </Link>
        </motion.div>
      )}
    </div>
  );
}
