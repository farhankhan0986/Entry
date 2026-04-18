import Link from "next/link";
import { Shield, Eye, Lock, Globe, FileText, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function PrivacyPage() {
  const sections = [
    { id: "collection", title: "Information We Collect" },
    { id: "usage", title: "How We Use Data" },
    { id: "protection", title: "Data Protection" },
    { id: "rights", title: "Your Privacy Rights" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)] selection:bg-[var(--accent)]/20">
      {/* 1. HERO SECTION */}
      <header className="container flex items-center justify-center mx-auto px-6 pt-24 pb-16 border-b border-[var(--border)]">
        <div className="max-w-5xl">
          <div className="flex items-center gap-3 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-xs mb-6">
            <Shield size={16} />
            <span>Integrity & Trust</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
            Privacy <br /> Policy<span className="text-[var(--accent)]">.</span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl">
            "We believe your stories are sacred. Our commitment is to ensure your words remain yours, protected by design and transparent by nature."
          </p>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main id="content" className="container mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-1/4 h-fit sticky top-32 hidden lg:block">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] mb-8">On this page</h4>
          <nav className="flex flex-col gap-6">
            {sections.map((section) => (
              <a 
                key={section.id} 
                href={`#${section.id}`}
                className="group flex items-center gap-4 text-[var(--foreground)]/60 hover:text-[var(--accent)] transition-all"
              >
                <span className="h-[1px] w-4 bg-[var(--border)] group-hover:w-8 group-hover:bg-[var(--accent)] transition-all" />
                <span className="font-bold text-sm uppercase tracking-widest">{section.title}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Legal Prose */}
        <div className="flex-1 max-w-3xl space-y-24">
          
          {/* Section 1 */}
          <section id="collection" className="scroll-m-32">
            <div className="flex items-center gap-4 mb-6 text-[var(--accent)]">
              <Eye size={24} />
              <h2 className="text-4xl font-bold">Information We Collect</h2>
            </div>
            <div className="space-y-6 text-lg md:text-xl text-[var(--muted)] leading-relaxed italic opacity-90">
              <p>
                When you create an <span className="text-[var(--foreground)] font-bold not-italic">Entry</span>, we collect the basic essentials: your name, email, and the beautiful narratives you choose to share.
              </p>
              <p>
                We also gather metadata—read times, timestamps, and categories—to help our community discover stories that resonate with them. We do not track your digital footprint beyond our borders.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="usage" className="scroll-m-32">
            <div className="flex items-center gap-4 mb-6 text-[var(--accent)]">
              <Globe size={24} />
              <h2 className="text-4xl font-bold">How We Use Data</h2>
            </div>
            <div className="space-y-6 text-lg md:text-xl text-[var(--muted)] leading-relaxed italic opacity-90">
              <p>
                Your data exists solely to power your experience. We use your information to:
              </p>
              <ul className="list-none space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent)] font-bold">01.</span>
                  <span>Personalize your journal feed and author profile.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent)] font-bold">02.</span>
                  <span>Connect your voice with readers through our newsletter.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent)] font-bold">03.</span>
                  <span>Ensure the security and integrity of our creative platform.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="protection" className="scroll-m-32">
            <div className="flex items-center gap-4 mb-6 text-[var(--accent)]">
              <Lock size={24} />
              <h2 className="text-4xl font-bold">Data Protection</h2>
            </div>
            <div className="space-y-6 text-lg md:text-xl text-[var(--muted)] leading-relaxed italic opacity-90">
              <p>
                We employ industry-standard encryption to protect your drafts and personal details. Our servers are audited regularly to ensure that "Entry" remains a safe sanctuary for free expression.
              </p>
            </div>
          </section>

          {/* Contact Footer */}
          <footer className="pt-20 border-t border-[var(--border)]">
            <div className="bg-[var(--card)]/10 border border-[var(--border)] rounded-[40px] p-10 text-center">
              <h3 className="text-3xl font-bold mb-4">Have Questions?</h3>
              <p className="text-[var(--muted)] italic mb-8 max-w-md mx-auto">
                If you have concerns about your data or wish to export your entries, our team is here to assist.
              </p>
              <a 
                href="mailto:farhankhan080304@gmail.com" 
                className="text-[var(--accent)] font-bold tracking-[0.2em] uppercase text-sm border-b border-[var(--accent)] pb-1 hover:opacity-70 transition-all"
              >
                farhankhan080304@gmail.com
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}