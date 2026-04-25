"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { deleteBlog } from "@/lib/actions/userActions";
import { saveMyProfile } from "@/lib/actions/authorActions";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { getAuthorSlug } from "@/lib/authorUtils";
import {
  PenLine, Trash2, ExternalLink, Calendar,
  LogOut, LayoutDashboard, User, ChevronRight,
  Sparkles, Clock, Globe, TrendingUp, FileText,
  ArrowUpRight, MoreHorizontal, Eye, Hash,
  AtSign, Link2, Code2, Save,
  Plus, X, MapPin, CheckCircle2, Palette,
  PenSquare, BookOpen, TimerReset, CalendarDays
} from "lucide-react";
import { FaInstagram, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

// ─── Utilities ────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function readTime(content = "") {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

// ─── Components ───────────────────────────────────────────────────────────────

function Avatar({ user, size = 64 }) {
  if (user?.image) {
    return (
      <Image
        src={user.image}
        alt={user.name || "User"}
        width={size}
        height={size}
        className="rounded-2xl object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-2xl bg-[var(--accent)] flex items-center justify-center font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {user?.name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="relative overflow-hidden bg-[var(--card)]/20 border border-[var(--border)] rounded-2xl p-5 group hover:border-[var(--accent)]/30 transition-all duration-300">
      {/* subtle gradient blob */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{ background: accent ?? "var(--accent)", opacity: 0.08 }}
      />
      <div className="flex items-start justify-between mb-4">
       <div
  className="relative w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-500"
  style={{
    background: `linear-gradient(135deg, ${accent ?? "var(--accent)"}22, ${accent ?? "var(--accent)"}10)`,
    border: `1px solid ${accent ?? "var(--accent)"}35`,
  }}
>
  <span
    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    style={{
      background: `radial-gradient(circle at top left, ${accent ?? "var(--accent)"}30, transparent 70%)`,
    }}
  />

  <Icon
    size={18}
    className="relative z-10 transition-all duration-700 ease-out group-hover:rotate-[360deg] group-hover:translate-z-12 group-hover:scale-110"
    style={{ color: accent ?? "var(--accent)" }}
  />
</div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{label}</span>
      </div>
      <p className="text-3xl font-bold text-[var(--foreground)] leading-none">{value}</p>
      {sub && <p className="text-xs text-[var(--muted)] mt-1">{sub}</p>}
    </div>
  );
}

function BlogCard({ blog, onDelete }) {
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await onDelete(blog._id);
      setConfirm(false);
      setMenuOpen(false);
    });
  }

  const mins = readTime(blog.content || "");

  return (
    <div className="group relative bg-[var(--card)]/10 border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--accent)]/30 hover:shadow-xl hover:shadow-[var(--accent)]/5 transition-all duration-300">

      {/* Banner */}
      <div className="relative h-44 bg-[var(--border)]/20 overflow-hidden">
        {blog.bannerImage ? (
          <img
            src={blog.bannerImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[var(--border)]/20 to-transparent">
            <FileText size={28} className="text-[var(--muted)]/30" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--muted)]/40 font-bold">No Cover</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[var(--background)]/70 backdrop-blur-sm px-3 py-1 rounded-full text-[var(--accent)] border border-[var(--accent)]/20">
            {blog.category}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm border ${blog.status === "published"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/20"
              : "bg-amber-500/10 text-amber-400 border-amber-400/20"
            }`}>
            {blog.status ?? "published"}
          </span>
        </div>

        {/* 3-dot menu */}
        <div className="absolute bottom-3 right-3">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-8 h-8 rounded-full bg-[var(--background)]/80 backdrop-blur border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <MoreHorizontal size={14} />
          </button>

          {menuOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-36 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-10">
              <Link
                href={`/blog/${blog.slug}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--border)]/30 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Eye size={12} /> View Live
              </Link>
              {!confirm ? (
                <button
                  onClick={() => setConfirm(true)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              ) : (
                <div className="px-4 py-3 space-y-2">
                  <p className="text-[10px] text-red-400 font-bold">Are you sure?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={isPending}
                      className="flex-1 text-[10px] bg-red-500/20 text-red-400 rounded-lg py-1.5 font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                      {isPending ? "..." : "Yes"}
                    </button>
                    <button
                      onClick={() => setConfirm(false)}
                      className="flex-1 text-[10px] bg-[var(--border)]/40 text-[var(--muted)] rounded-lg py-1.5 font-bold hover:bg-[var(--border)] transition-colors"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-bold text-[var(--foreground)] line-clamp-2 leading-snug mb-3 group-hover:text-[var(--accent)] transition-colors text-base">
          {blog.title}
        </h3>

        <div className="flex items-center gap-3 text-[var(--muted)]">
          <span className="flex items-center gap-1 text-[11px]">
            <Clock size={10} /> {mins} min read
          </span>
          <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar size={10} /> {timeAgo(blog.createdAt)}
          </span>
        </div>

        {/* View link */}
        <Link
          href={`/blog/${blog.slug}`}
          target="_blank"
          className="mt-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Read Story <ArrowUpRight size={11} />
        </Link>
      </div>
    </div>
  );
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

function SidebarLink({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active
          ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
          : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/20"
        }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardClient({ data }) {
  const { user, blogs, totalPosts, profile: initialProfile } = data;
  const [activeTab, setActiveTab] = useState("entries");
  const [blogList, setBlogList] = useState(blogs);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Recently";

  async function handleDelete(blogId) {
    await deleteBlog(blogId);
    setBlogList(prev => prev.filter(b => b._id !== blogId));
  }

  const totalWords = blogList.reduce((acc, b) => {
    return acc + (b.content?.trim().split(/\s+/).length ?? 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair">

      {/* ─── Full-Width Header Banner ──────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[var(--border)]">
        {/* Background noise/texture effect */}
        <div className="absolute inset-0 bg-[var(--card)]/10" />
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[var(--accent)]/8 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[var(--accent)]/5 blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative container mx-auto px-6 py-10 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

            {/* Left: User */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="p-0.5 rounded-[18px] bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/30">
                  <Avatar user={user} size={72} />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[var(--background)]" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent)] mb-1">
                  Writer Dashboard
                </p>
                <h1 className="text-3xl font-bold text-[var(--foreground)] leading-tight">
                  {user.name}
                </h1>
                <p className="text-sm text-[var(--muted)] mt-1">{user.email}</p>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/write"
                className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-lg hover:shadow-[var(--accent)]/20"
              >
                <PenLine size={15} /> New Entry
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign out"
                className="flex items-center gap-2 border border-[var(--border)] text-[var(--muted)] px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:border-red-400/50 hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>

          {/* ─── Stats Row ──────────────────────────────────────────────────── */}
          <div className="mt-10">
  {/* Desktop / Tablet */}
  <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      icon={PenSquare}
      label="Total Entries"
      value={totalPosts}
      sub={
        totalPosts === 1
          ? "1 story published"
          : `${totalPosts} stories published`
      }
      accent="#ef4444"
    />

    <StatCard
      icon={BookOpen}
      label="Words Written"
      value={
        totalWords > 1000
          ? `${(totalWords / 1000).toFixed(1)}k`
          : totalWords
      }
      sub="across all entries"
      accent="#6366f1"
    />

    <StatCard
      icon={TimerReset}
      label="Avg. Read Time"
      value={
        totalPosts > 0
          ? `${Math.round(totalWords / totalPosts / 200)}m`
          : "—"
      }
      sub="per entry"
      accent="#10b981"
    />

    <StatCard
      icon={CalendarDays}
      label="Member Since"
      value={joinDate.split(" ")[0]}
      sub={joinDate.split(" ")[1] ?? ""}
      accent="#f59e0b"
    />
  </div>

  {/* Mobile Professional Scroll Cards */}
  <div className="sm:hidden overflow-x-auto pb-2">
    <div className="flex gap-3 min-w-max pr-1">
      {[
  {
    icon: PenSquare,
    label: "Entries",
    value: totalPosts,
    sub: `${totalPosts} stories`,
    accent: "#ef4444",
  },
  {
    icon: BookOpen,
    label: "Words",
    value:
      totalWords > 1000
        ? `${(totalWords / 1000).toFixed(1)}k`
        : totalWords,
    sub: "written",
    accent: "#3b82f6",
  },
  {
    icon: TimerReset,
    label: "Avg Read",
    value:
      totalPosts > 0
        ? `${Math.round(totalWords / totalPosts / 200)}m`
        : "—",
    sub: "per story",
    accent: "#10b981",
  },
  {
    icon: CalendarDays,
    label: "Joined",
    value: joinDate.split(" ")[0],
    sub: joinDate.split(" ")[1] ?? "",
    accent: "#f59e0b",
  },
].map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="w-[160px] shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${item.accent}20` }}
              >
                <Icon size={15} style={{ color: item.accent }} />
              </div>

              <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-[var(--muted)]">
                {item.label}
              </span>
            </div>

            <p className="text-xl font-extrabold text-[var(--foreground)] leading-none">
              {item.value}
            </p>

            <p className="text-[11px] text-[var(--muted)] mt-2">
              {item.sub}
            </p>
          </div>
        );
      })}
    </div>
  </div>
</div>
        </div>
      </div>

      {/* ─── Main Content: Sidebar + Content ──────────────────────────────── */}
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex gap-8">

          {/* ── Sidebar ── */}
          <aside className="hidden md:flex flex-col gap-2 w-52 shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--muted)] px-4 mb-2">
              Navigation
            </p>
            <SidebarLink
              icon={BookOpen}
              label="My Entries"
              active={activeTab === "entries"}
              onClick={() => setActiveTab("entries")}
            />
            <SidebarLink
              icon={User}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />

            <div className="mt-6 px-4">
              <div className="h-px bg-[var(--border)]" />
            </div>

            <div className="mt-6 px-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--muted)]">
                Quick Actions
              </p>
              <Link
                href="/write"
                className="flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <PenLine size={13} /> Write a Story
              </Link>
              <Link
                href="/journal"
                className="flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Globe size={13} /> Browse Journal
              </Link>
              <Link
                href="/discovery"
                className="flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Sparkles size={13} /> Discovery Tool
              </Link>
            </div>

            {/* Mini profile card */}
            <div className="mt-auto pt-8">
              <div className="border border-[var(--border)] rounded-2xl p-4 bg-[var(--card)]/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar user={user} size={28} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--foreground)] truncate">{user.name}</p>
                    <p className="text-[10px] text-emerald-400 font-bold">● Active</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-red-400 transition-colors py-1.5 border-t border-[var(--border)] mt-2 pt-2"
                >
                  <LogOut size={10} /> Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main panel ── */}
          <div className="flex-1 min-w-0">

            {/* Mobile tabs */}
            <div className="md:hidden flex gap-1 mb-6 border-b border-[var(--border)]">
              {[
                { id: "entries", label: "Entries", icon: BookOpen },
                { id: "profile", label: "Profile", icon: User },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] border-b-2 transition-all -mb-px ${activeTab === tab.id
                        ? "border-[var(--accent)] text-[var(--accent)]"
                        : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                  >
                    <Icon size={13} /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* ── Entries Tab ─────────────────────────────────────────── */}
            {activeTab === "entries" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">My Entries</h2>
                    <p className="text-sm text-[var(--muted)] mt-0.5">
                      {blogList.length > 0
                        ? `${blogList.length} ${blogList.length === 1 ? "story" : "stories"} published`
                        : "No stories yet"}
                    </p>
                  </div>
                  <Link
                    href="/write"
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-[var(--accent)] hover:gap-3 transition-all"
                  >
                    Write New <ChevronRight size={14} />
                  </Link>
                </div>

                {blogList.length === 0 ? (
                  /* Empty state */
                  <div className="border-2 border-dashed border-[var(--border)] rounded-3xl py-20 px-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-5">
                      <PenLine size={28} className="text-[var(--accent)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No entries yet</h3>
                    <p className="text-[var(--muted)] text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                      Your published stories will appear here. Start writing and share your thoughts with the world.
                    </p>
                    <Link
                      href="/write"
                      className="inline-flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
                    >
                      <PenLine size={14} /> Write Your First Entry
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {blogList.map(blog => (
                      <BlogCard key={blog._id} blog={blog} onDelete={handleDelete} />
                    ))}

                    {/* "Write new" card */}
                    <Link
                      href="/write"
                      className="group border-2 border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center justify-center gap-3 py-12 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PenLine size={20} className="text-[var(--accent)]" />
                      </div>
                      <span className="text-sm font-bold text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                        New Entry
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ── Profile Tab ─────────────────────────────────────────── */}
            {activeTab === "profile" && (
              <ProfileEditor
                user={user}
                initialProfile={initialProfile}
                totalPosts={totalPosts}
                blogList={blogList}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Editor ───────────────────────────────────────────────────────────

function ProfileEditor({ user, initialProfile, totalPosts, blogList }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const tagInputRef = useRef(null);

  const authorSlug = getAuthorSlug(user.name);

  const [form, setForm] = useState({
    tagline: initialProfile?.tagline || "",
    bio: initialProfile?.bio || "",
    location: initialProfile?.location || "",
    website: initialProfile?.website || "",
    twitter: initialProfile?.twitter || "",
    linkedin: initialProfile?.linkedin || "",
    instagram: initialProfile?.instagram || "",
    github: initialProfile?.github || "",
    tags: initialProfile?.tags || [],
    accentColor: initialProfile?.accentColor || "#dc2626", // Default to crimson red
  });

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Recently";

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setSaved(false);
  }

  function addTag(e) {
    if ((e.key === "Enter" || e.key === ",") && tagInputRef.current) {
      e.preventDefault();
      const val = tagInputRef.current.value.trim().replace(/,$/, "");
      if (val && !form.tags.includes(val) && form.tags.length < 8) {
        set("tags", [...form.tags, val]);
        tagInputRef.current.value = "";
      }
    }
  }

  function removeTag(tag) {
    set("tags", form.tags.filter(t => t !== tag));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveMyProfile(form);
      if (result?.success) {
        setSaved(true);
        toast.success("Profile saved! Changes are live on your author page.");
      } else {
        toast.error(result?.error || "Failed to save profile");
      }
    });
  }

  const inputClass = "w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:border-[var(--accent)]/60 focus:ring-1 focus:ring-[var(--accent)]/20 transition-all";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">Author Profile</h2>
          <p className="text-sm text-[var(--muted)] mt-0.5">This appears on your public author page</p>
        </div>
        <Link
          href={`/authors/${authorSlug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] border border-[var(--accent)]/30 px-3 py-2 rounded-xl hover:bg-[var(--accent)]/10 transition-all"
        >
          <Eye size={12} /> View Profile
        </Link>
      </div>

      {/* Profile preview card */}
      <div className="bg-[var(--card)]/15 border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[var(--accent)]/20 via-[var(--accent)]/10 to-transparent relative">
          <div className="absolute -bottom-8 left-6">
            <div className="p-0.5 rounded-2xl bg-[var(--background)] shadow-lg">
              <Avatar user={user} size={56} />
            </div>
          </div>
        </div>
        <div className="pt-12 px-6 pb-5">
          <h3 className="text-xl font-bold text-[var(--foreground)]">{user.name}</h3>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {form.tagline || <span className="italic opacity-50">No tagline yet</span>}
          </p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-3 py-1 rounded-full">
              Verified Writer
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-3 py-1 rounded-full">
              {totalPosts} {totalPosts === 1 ? "article" : "articles"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Form fields ── */}

      {/* Tagline */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Tagline</label>
        <input
          type="text"
          maxLength={120}
          placeholder="e.g. Indie Developer · Travel Writer · Coffee Enthusiast"
          value={form.tagline}
          onChange={e => set("tagline", e.target.value)}
          className={inputClass}
        />
        <p className="text-[10px] text-[var(--muted)]">Shown below your name. Max 120 chars. ({form.tagline.length}/120)</p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Bio</label>
        <textarea
          rows={4}
          maxLength={800}
          placeholder="Tell readers a bit about yourself — your background, what you write about, why it matters."
          value={form.bio}
          onChange={e => set("bio", e.target.value)}
          className={inputClass + " resize-none leading-relaxed"}
        />
        <p className="text-[10px] text-[var(--muted)]">Max 800 chars. ({form.bio.length}/800)</p>
      </div>

      {/* Location + Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
            <MapPin size={11} /> Location
          </label>
          <input
            type="text"
            maxLength={80}
            placeholder="Mumbai, India"
            value={form.location}
            onChange={e => set("location", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
            <Globe size={11} /> Website
          </label>
          <input
            type="url"
            maxLength={200}
            placeholder="https://yoursite.com"
            value={form.website}
            onChange={e => set("website", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Social Handles */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Social Profiles</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { field: "twitter", icon: FaTwitter, placeholder: "username (without @)", label: "X / Twitter" },
            { field: "instagram", icon: FaInstagram, placeholder: "username", label: "Instagram" },
            { field: "linkedin", icon: FaLinkedin, placeholder: "linkedin.com/in/yourname", label: "LinkedIn" },
            { field: "github", icon: FaGithub, placeholder: "github username", label: "GitHub" },
          ].map(({ field, icon: Icon, placeholder, label }) => (
            <div key={field} className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                <Icon size={13} />
              </div>
              <input
                type="text"
                maxLength={100}
                placeholder={placeholder}
                value={form[field]}
                onChange={e => set(field, e.target.value)}
                className={inputClass + " pl-9"}
                aria-label={label}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Expertise Tags</label>
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-3 focus-within:border-[var(--accent)]/60 focus-within:ring-1 focus-within:ring-[var(--accent)]/20 transition-all">
          <div className="flex flex-wrap gap-2 mb-2">
            {form.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-3 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <input
            ref={tagInputRef}
            type="text"
            placeholder={form.tags.length < 8 ? "Type a tag and press Enter (max 8)" : "Max 8 tags reached"}
            disabled={form.tags.length >= 8}
            onKeyDown={addTag}
            className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none"
          />
        </div>
        <p className="text-[10px] text-[var(--muted)]">Press Enter or comma to add. These appear as colored tags on your author page.</p>
      </div>

      {/* Accent Color */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
          <Palette size={11} /> Profile Accent Color
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={form.accentColor}
            onChange={e => set("accentColor", e.target.value)}
            className="w-14 h-14 p-1 rounded-xl cursor-pointer bg-[var(--background)] border border-[var(--border)]"
          />
          <div className="flex flex-wrap gap-2">
            {["#dc2626", "#6366f1", "#0891b2", "#059669", "#d97706", "#7c3aed", "#be123c", "#0f766e"].map(color => (
              <button
                key={color}
                type="button"
                onClick={() => set("accentColor", color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${form.accentColor === color ? 'border-[var(--foreground)] scale-110 shadow-lg' : 'border-transparent shadow-sm'}`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
        <p className="text-[10px] text-[var(--muted)]">Choose a color for your profile banner and badges.</p>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4 pt-2">
        <button
          id="save-profile-btn"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-7 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-lg disabled:opacity-60"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : saved ? (
            <CheckCircle2 size={14} />
          ) : (
            <Save size={14} />
          )}
          {isPending ? "Saving…" : saved ? "Saved!" : "Save Profile"}
        </button>
        <Link
          href={`/authors/${authorSlug}`}
          target="_blank"
          className="text-xs font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
        >
          <ExternalLink size={11} /> Preview author page
        </Link>
      </div>

      {/* Sign out */}
      <div className="pt-4 border-t border-[var(--border)]">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 border border-red-400/30 text-red-400 hover:bg-red-500/5 hover:border-red-400/50 rounded-2xl py-4 font-bold text-sm uppercase tracking-widest transition-all"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}
