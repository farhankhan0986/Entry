import Link from "next/link";
import {
  BookOpen,
  Feather,
  Globe,
  Users,
  Sparkles,
  ArrowRight,
  Star,
  Layers,
  Mic,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "About Entry — Where Every Story Finds Its Home",
  description: "Entry is a modern editorial platform where authentic voices publish meaningful stories. Discover what Entry is, what we believe, and how to join our growing community of writers and readers.",
  alternates: { canonical: "https://entry-azure.vercel.app/about" },
  openGraph: {
    type: "website",
    url: "https://entry-azure.vercel.app/about",
    siteName: "Entry",
    title: "About Entry — Where Every Story Finds Its Home",
    description: "Entry is a modern editorial platform where authentic voices publish meaningful stories. Discover what Entry is, what we believe, and how to join our growing community of writers and readers.",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Entry — Where Every Story Finds Its Home",
    description: "Entry is a modern editorial platform where authentic voices publish meaningful stories. Discover what Entry is, what we believe, and how to join our growing community of writers and readers.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

const pillars = [
  {
    icon: Feather,
    title: "Authentic Writing",
    desc: "Every piece published on Entry carries a human voice. No fluff, no filler — just genuine thought.",
  },
  {
    icon: Globe,
    title: "Global Stories",
    desc: "Voices from every corner of the world. Countries, cultures, and perspectives that expand your view.",
  },
  {
    icon: Zap,
    title: "Diverse Topics",
    desc: "From AI and technology to mysteries, psychology, biographies, and personal growth — Entry covers it all.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Entry is built for readers and writers alike. Engage, explore, and share the stories that move you.",
  },
  {
    icon: Layers,
    title: "Rich Categories",
    desc: "Curated sections like Facts, Mysteries, Countries, Biographies, and Psychology — each a world of its own.",
  },
  {
    icon: Mic,
    title: "Open Platform",
    desc: "Have a story to tell? Entry's write feature invites you to publish and share your own perspective.",
  },
];

const categories = [
  { name: "Facts", href: "/facts", color: "var(--accent)" },
  { name: "Mysteries", href: "/mysteries", color: "var(--accent)" },
  { name: "Countries", href: "/countries", color: "var(--accent)" },
  { name: "Biographies", href: "/biographies", color: "var(--accent)" },
  { name: "Psychology", href: "/psychology", color: "var(--accent)" },
  { name: "Technology", href: "/technology", color: "var(--accent)" },
  { name: "Science", href: "/science", color: "var(--accent)" },
  { name: "Culture", href: "/culture", color: "var(--accent)" },
  { name: "Philosophy", href: "/philosophy", color: "var(--accent)" },
  { name: "Journal", href: "/journal", color: "var(--accent)" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">

      {/* HERO */}
      <header className="container mx-auto px-6 pt-28 pb-20">
        <div className="flex items-center gap-2 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-xs mb-6">
          <Star size={13} fill="currentColor" />
          <span>Our Story</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.88] mb-8 max-w-4xl">
          What is{" "}
          <span className="text-[var(--accent)]">Entry</span>
          <span className="text-[var(--accent)]">?</span>
        </h1>

        <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-3xl">
          "Where thoughts find words, emotions meet understanding, and every
          story feels a little less alone."
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/journal"
            className="btn-primary flex items-center gap-2 px-8 py-3"
          >
            Browse Journal <ArrowRight size={16} />
          </Link>
          <Link
            href="/write"
            className="flex items-center gap-2 px-8 py-3 rounded-full border border-[var(--border)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            Start Writing <Feather size={16} />
          </Link>
        </div>
      </header>

      {/* DIVIDER */}
      <div className="container mx-auto px-6">
        <div className="h-[1px] w-full bg-gradient-to-r from-[var(--border)] via-[var(--accent)]/30 to-transparent" />
      </div>

      {/* MISSION SECTION */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen size={22} className="text-[var(--accent)]" />
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--muted)]">
              Our Mission
            </h2>
          </div>
          <p className="text-4xl md:text-5xl font-bold leading-tight">
            A sanctuary for{" "}
            <span className="text-[var(--accent)] italic">authentic</span> voices
            and creative minds.
          </p>
          <div className="space-y-4 text-lg text-[var(--muted)] leading-relaxed">
            <p>
              <strong className="text-[var(--accent)]">Entry</strong> was
              born from a simple belief: that meaningful writing deserves a
              meaningful home. In a world flooded with noise, we set out to
              build a place where depth wins over speed, and substance wins over
              spectacle.
            </p>
            <p>
              We publish stories across a wide spectrum — from the science of
              the human mind to forgotten corners of world history, from
              fascinating facts to the greatest unsolved mysteries on Earth.
              Entry is where curiosity lives.
            </p>
            <p>
              Every article is an entry point into something bigger. A new
              idea, a new country, a new understanding of yourself and the world
              around you.
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[36px] p-10 space-y-8 shadow-sm">
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--muted)]">
            Entry at a Glance
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: "6+", label: "Curated Categories" },
              { stat: "∞", label: "Stories to Discover" },
              { stat: "2026", label: "Year Founded" },
              { stat: "Open", label: "Platform for All" },
            ].map(({ stat, label }) => (
              <div
                key={label}
                className="p-6 bg-[var(--background)] rounded-2xl border border-[var(--border)]"
              >
                <span className="block text-3xl font-bold text-[var(--accent)]">
                  {stat}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)] mt-1 block">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted)] leading-relaxed italic">
              "We believe the best stories are the ones that make you think a
              little differently — about the world, and about yourself."
            </p>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="container mx-auto px-6">
        <div className="h-[1px] w-full bg-gradient-to-r from-[var(--border)] via-[var(--accent)]/30 to-transparent" />
      </div>

      {/* PILLARS / WHAT WE STAND FOR */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-xs mb-4">
            <Sparkles size={14} fill="currentColor" />
            <span>What We Stand For</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Built on six principles.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-7 rounded-3xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/50 hover:shadow-md transition-all duration-300 group"
            >
              <Icon
                size={24}
                className="mb-4 text-[var(--accent)] group-hover:scale-110 transition-transform duration-300"
              />
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="container mx-auto px-6">
        <div className="h-[1px] w-full bg-gradient-to-r from-[var(--border)] via-[var(--accent)]/30 to-transparent" />
      </div>

      {/* CATEGORIES */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-xs mb-4">
              <Globe size={13} />
              <span>Explore</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Every category is a{" "}
              <span className="italic text-[var(--accent)]">universe</span>.
            </h2>
          </div>
          <p className="text-[var(--muted)] italic max-w-sm leading-relaxed text-lg">
            Six curated spaces covering everything from ancient history to
            modern psychology — all in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="px-6 py-3 rounded-full border border-[var(--border)] text-sm font-semibold uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-300"
            >
              {name}
            </Link>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="container mx-auto px-6">
        <div className="h-[1px] w-full bg-gradient-to-r from-[var(--border)] via-[var(--accent)]/30 to-transparent" />
      </div>

      {/* CTA SECTION */}
      <section className="container mx-auto px-6 py-24 flex flex-col items-center text-center space-y-6">
        <div className="flex items-center gap-2 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-xs">
          <Feather size={13} />
          <span>Your Entry Awaits</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
          Every great story starts with a single line.
        </h2>
        <p className="text-lg text-[var(--muted)] max-w-xl leading-relaxed italic opacity-80">
          Whether you are here to read, explore, or write — Entry is your
          space. Join a growing community of curious minds and authentic voices.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/journal" className="btn-primary flex items-center gap-2 px-10 py-4">
            Start Reading <ArrowRight size={16} />
          </Link>
          <Link
            href="/write"
            className="flex items-center gap-2 px-10 py-4 rounded-full border border-[var(--border)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            Start Writing <Feather size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}