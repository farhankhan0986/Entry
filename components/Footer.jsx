"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)] pt-20 pb-10 font-playfair">
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
              {['Journal', 'Write'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)]">Legal</h4>
            <ul className="space-y-1">
              {['About', 'Privacy', 'Terms', 'Contact' ].map((item) => (
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
              {['Countries', 'Biographies'].map((item) => (
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
            </ul>
          </div>

          {/* Column 6: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--foreground)]">Newsletter</h4>
            <p className="text-xs text-[var(--muted)]">Weekly curated stories delivered to your inbox.</p>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="bg-[var(--input)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-[var(--accent)] outline-none"
              />
              <button onClick={() => toast.success("Subscribed!") && setEmail("")}
              className="bg-[var(--foreground)] text-[var(--background)] hover:text-[var(--foreground)] cursor-pointer px-4 py-2 rounded-lg hover:bg-[var(--accent)] active:scale-95 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)]">
          <p>© 2026 Entry Journal. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/in/farhan-abid-38967a259/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">LinkedIn</a>
            <a href="https://github.com/farhankhan0986" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">GitHub</a>
            {/* <a href="https://x.com/FarhanK70642847" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">Twitter</a> */}
            <a href="https://www.instagram.com/_._farhan__" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}