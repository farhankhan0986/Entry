"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { FaTelegram } from "react-icons/fa6";
import { Download } from "lucide-react";

const isValidEmail = (val) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

export default function Footer() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    // Trigger PDF download
    const link = document.createElement("a");
    link.href = "/2026_Tech_Career_Roadmap.pdf";
    link.download = "2026_Tech_Career_Roadmap.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("You're subscribed! Your PDF is downloading 🎉");
    setEmail("");
  };

  return (
    <footer className="bg-[var(--card)]/10 border-t border-[var(--border)] pt-20 pb-10 font-playfair">
      <div className="container mx-auto px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-bold text-[var(--foreground)]">
              Entry<span className="text-[var(--accent)]">.</span>
            </Link>
            <p className="text-sm text-[var(--muted)] italic leading-relaxed">
              Where thoughts find words, emotions meet understanding, and every story feels a little less alone.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)]">Platform</h4>
            <ul className="space-y-1">
              {['Journal', 'Write', 'Dashboard'].map((item) => (
                <li key={item}>
                  
                  <Link href={`/${item.toLowerCase()}`} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
                <li>
                <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)]">Legal</h4>
            <ul className="space-y-1">
              {['About', 'Privacy', 'Terms', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Pages */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)]">Pages</h4>
            <ul className="space-y-1">
              {['Facts', 'Mysteries', 'Countries', 'Biographies', 'Psychology', 'Technology'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Tools */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)]">Tools</h4>
            <ul className="space-y-1">
              {['Discovery', 'Converter'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/salary-check" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  Salary Check
                </Link>
              </li>
              <li>
                <Link href="/daily-entry" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  Daily Entry
                </Link>
              </li>
              <li>
                <Link href="/focus-timer" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  Focus Timer
                </Link>
              </li>
              <li>
                <Link href="/prompt-optimizer" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  Prompt Optimizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 6: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)]">Newsletter</h4>
            <div className="flex items-center gap-1.5 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest mb-1">
              <Download size={11} />
              Free PDF with Subscription
            </div>
            <p className="text-xs text-[var(--muted)]">Get the <span className="font-bold text-[var(--foreground)]">2026 Tech Career Roadmap</span> PDF — free when you subscribe.</p>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="Email address"
                  className={`bg-[var(--input)]/10 border rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors ${
                    emailError
                      ? "border-red-500 focus:ring-red-400"
                      : "border-[var(--border)]"
                  }`}
                />
                {emailError && (
                  <p className="text-[10px] text-red-500 font-semibold leading-snug">
                    {emailError}
                  </p>
                )}
              </div>
              <button
                id="newsletter-subscribe-btn"
                onClick={handleSubscribe}
                className="bg-[var(--foreground)] text-[var(--background)] hover:text-[var(--foreground)] cursor-pointer px-4 py-2 rounded-lg hover:bg-[var(--accent)] active:scale-95 transition-all flex items-center justify-center gap-1.5 text-sm"
              >
                <Download size={13} /> Get Free PDF
              </button>
            </div>
            <a
              href="https://t.me/TheEntryJournal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[#229ED9] transition-colors font-bold"
            >
              <FaTelegram size={14} style={{ color: "#229ED9" }} />
              Join our Telegram for daily updates
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)]">
          <p>© 2026 Entry Journal. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="https://t.me/TheEntryJournal" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Telegram</a>
            <a href="https://pin.it/2b3GTTUQm" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}