import Link from "next/link";
import { FaLinkedin, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa6";
import { Coffee, Code, BookOpen, Globe, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">
      <header className="container mx-auto px-6 pt-10 pb-10">
         <header className="container mx-auto px-6 pt-24 pb-16">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
          The Curator<span className="text-[var(--accent)]">.</span>
        </h1>

        <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-3xl">
          "Building at the intersection of AI, software, design, and the human
          narrative."
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="https://dev-vault-alpha.vercel.app/" target="_blank"
            className="flex items-center gap-2 text-sm font-semibold hover:text-[var(--accent)] transition-colors"
          >
            <Globe size={18} /> Portfolio
          </Link>

          <Link
            href="https://github.com/farhankhan0986" target="_blank"
            className="flex items-center gap-2 text-sm font-semibold hover:text-[var(--accent)] transition-colors"
          >
            <FaGithub size={18} /> GitHub
          </Link>

          <Link
            href="https://www.linkedin.com/in/farhan-abid-38967a259/" target="_blank"
            className="flex items-center gap-2 text-sm font-semibold hover:text-[var(--accent)] transition-colors"
          >
            <FaLinkedin size={18} /> LinkedIn
          </Link>
        </div>
      </header>

      </header>

      <main className="container mx-auto px-6 py-12 grid lg:grid-cols-2 mb-10 gap-16 items-start">
        {/* Bio Section */}
        <section className="space-y-8 lg:mt-24">
          <h2 className="text-4xl font-bold">Farhan Abid</h2>
          <div className="text-lg leading-relaxed text-[var(--muted)] space-y-6">
            <p>
              I am a final-year AI & Data Science student based in Lucknow. When I'm not debugging the MERN stack or training models, I'm documenting the process of building the future.
            </p>
            <p>
              <span className="text-[var(--foreground)] font-bold">Entry</span> was born out of a desire to bridge the gap between technical complexity and emotional depth. Whether it's a post about AI Agents or a reflection on personal growth, this is where my thoughts find a permanent home.
            </p>
              <p>
                I believe the future belongs to creators who can think deeply,
                build quickly, and communicate clearly.
              </p>
          </div>
          
          {/* <div className="flex gap-4 pt-6">
            <Link href="https://farhanabid.vercel.app" className="text-xs uppercase tracking-[0.2em] font-bold border-b border-[var(--foreground)] pb-1 hover:text-[var(--accent)] transition-colors">Portfolio</Link>
            <Link href="https://github.com/farhankhan0986" className="text-xs uppercase tracking-[0.2em] font-bold border-b border-[var(--foreground)] pb-1 hover:text-[var(--accent)] transition-colors">GitHub</Link>
            <Link href="https://linkedin.com/in/your-username" className="text-xs uppercase tracking-[0.2em] font-bold border-b border-[var(--foreground)] pb-1 hover:text-[var(--accent)] transition-colors">LinkedIn</Link>
          </div> */}
        </section>

        {/* Tech Stack / Values */}
        <div className="bg-[var(--card)] p-10 rounded-[32px] border border-[var(--border)] shadow-sm space-y-8">
          <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
            <Code className="text-[var(--accent)]" /> The Workshop
          </h3>
          <p className="text-[var(--muted)] italic">
           This platform is built with Next.js, Tailwind CSS, MongoDB, and a
            minimalist design philosophy. It also acts as a sandbox for testing
            AI workflows, automation systems, content engines, and scalable web
            products.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
              <span className="block text-2xl font-bold">MERN</span>
              <span className="text-[10px] uppercase font-bold text-[var(--muted)]">
                Backend + Full Stack
              </span>
            </div>

            <div className="p-5 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
              <span className="block text-2xl font-bold">Next.js</span>
              <span className="text-[10px] uppercase font-bold text-[var(--muted)]">
                Frontend Engine
              </span>
            </div>

            <div className="p-5 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
              <span className="block text-2xl font-bold">AI</span>
              <span className="text-[10px] uppercase font-bold text-[var(--muted)]">
                Automation + Agents
              </span>
            </div>

            <div className="p-5 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
              <span className="block text-2xl font-bold">Design</span>
              <span className="text-[10px] uppercase font-bold text-[var(--muted)]">
                Clean Interfaces
              </span>
            </div>
          </div>
          <div className="pt-4 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Long-term goal: Build impactful products, create a respected
              personal brand, and design systems that help people think better
              and live better.
            </p>
          </div>
        </div>
      </main>
      <article className="container mx-auto px-6 mb-16 max-w-5xl">
        <div className="flex flex-col items-center justify-center border-[var(--border)] pt-10 space-y-6">
            <h3 className="text-5xl font-bold flex items-center gap-3">
              <BookOpen className="text-[var(--accent)]" />
              What is Entry?
            </h3>

            <p className="text-lg text-[var(--muted)] leading-relaxed">
              <span className="font-semibold text-[var(--foreground)]">
                Entry
              </span>{" "}
              is my digital journal and publishing space. It is where code meets
              reflection, and where technical lessons sit beside life lessons.
            </p>

            <p className="text-lg text-[var(--muted)] leading-relaxed">
              Some posts explore AI, development careers, startups, systems, and
              productivity. Others explore identity, ambition, mindset, and the
              realities of building a meaningful life in the modern world.
            </p>

            <p className="text-lg text-[var(--muted)] leading-relaxed">
              Every article is an entry point into how I think, build, and grow.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)]">
              <Coffee className="mb-3 text-[var(--accent)]" />
              <h4 className="font-bold mb-2">Consistency</h4>
              <p className="text-sm text-[var(--muted)]">
                Small progress daily compounds into exceptional results.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)]">
              <Sparkles className="mb-3 text-[var(--accent)]" />
              <h4 className="font-bold mb-2">Creativity</h4>
              <p className="text-sm text-[var(--muted)]">
                Great products are built with logic and imagination together.
              </p>
            </div>
          </div>
          </div>
      </article>
    </div>
  );
}