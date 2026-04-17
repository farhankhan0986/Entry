import Link from "next/link";
import { Scale, Edit3, UserCheck, AlertCircle, ArrowRight, BookOpen } from "lucide-react";

export default function TermsPage() {
  const guidelines = [
    { id: "account", title: "Member Conduct", icon: <UserCheck size={20} /> },
    { id: "content", title: "Content Ownership", icon: <Edit3 size={20} /> },
    { id: "liability", title: "Limitation of Liability", icon: <AlertCircle size={20} /> },
    { id: "termination", title: "Termination", icon: <Scale size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)] selection:bg-[var(--accent)]/20">
      {/* 1. HERO SECTION */}
      <header className="container flex items-center justify-center mx-auto px-6 pt-24 pb-16 border-b border-[var(--border)]">
        <div className="max-w-5xl">
          <div className="flex items-center gap-3 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-xs mb-6">
            <BookOpen size={16} />
            <span>The Rules of the Entry</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
            Terms of <br /> Service<span className="text-[var(--accent)]">.</span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl">
            "By entering this space, you agree to treat every word with respect, every story with integrity, and every user with dignity."
          </p>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="container mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-1/4 h-fit sticky top-32 hidden lg:block">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] mb-8">Navigation</h4>
          <nav className="flex flex-col gap-6">
            {guidelines.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                className="group flex items-center gap-4 text-[var(--foreground)]/60 hover:text-[var(--accent)] transition-all"
              >
                <span className="h-[1px] w-4 bg-[var(--border)] group-hover:w-8 group-hover:bg-[var(--accent)] transition-all" />
                <span className="font-bold text-sm uppercase tracking-widest">{item.title}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Terms Content */}
        <div className="flex-1 max-w-3xl space-y-24">
          
          {/* Section 1: Ownership */}
          <section id="content" className="scroll-m-32">
            <h2 className="text-4xl font-bold mb-8">01. Intellectual Property</h2>
            <div className="space-y-6 text-lg md:text-xl text-[var(--muted)] leading-relaxed italic opacity-90">
              <p>
                What you write is yours. You retain full ownership of all the content you publish on <span className="text-[var(--foreground)] font-bold not-italic">Entry</span>. 
              </p>
              <p>
                By posting, you grant us a non-exclusive, worldwide license to display your work within the platform so your readers can discover and engage with it. We will never sell your stories to third parties.
              </p>
            </div>
          </section>

          {/* Section 2: Conduct */}
          <section id="account" className="scroll-m-32">
            <h2 className="text-4xl font-bold mb-8">02. Community Standards</h2>
            <div className="space-y-6 text-lg md:text-xl text-[var(--muted)] leading-relaxed italic opacity-90">
              <p>
                This is a sanctuary for authentic expression. We do not tolerate hate speech, harassment, or the promotion of violence. 
              </p>
              <p>
                We reserve the right to remove any content that violates these standards to ensure that <span className="text-[var(--foreground)] font-bold not-italic">Entry</span> remains a safe space for all voices.
              </p>
            </div>
          </section>

          {/* Section 3: Liability */}
          <section id="liability" className="scroll-m-32">
            <h2 className="text-4xl font-bold mb-8">03. Limitation of Liability</h2>
            <div className="space-y-6 text-lg md:text-xl text-[var(--muted)] leading-relaxed italic opacity-90">
              <p>
                The stories shared here are the perspectives of individual authors. We provide the platform "as is" and are not responsible for the accuracy or consequences of any content posted by users.
              </p>
            </div>
          </section>

          {/* Section 4: Termination */}
          <section id="termination" className="scroll-m-32">
            <h2 className="text-4xl font-bold mb-8">04. Closing Your Entry</h2>
            <div className="space-y-6 text-lg md:text-xl text-[var(--muted)] leading-relaxed italic opacity-90">
              <p>
                You are free to leave at any time. If you choose to delete your account, we will remove your personal data and entries from our active servers, though some remnants may exist in encrypted backups for a limited time.
              </p>
            </div>
          </section>

          {/* Final Call to Action */}
          <footer className="pt-20 border-t border-[var(--border)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-[var(--card)] border border-[var(--border)] rounded-[40px] p-10 shadow-sm">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">Ready to contribute?</h3>
                <p className="text-[var(--muted)] italic">Your first entry is waiting.</p>
              </div>
              <Link href="/write" className="btn-primary px-10 py-4 rounded-full flex items-center gap-2 whitespace-nowrap">
                New Entry <ArrowRight size={18} />
              </Link>
            </div>
            <p className="text-center mt-12 text-[var(--muted)] text-xs uppercase tracking-[0.3em] font-bold">
              Last Updated: April 17, 2026
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}