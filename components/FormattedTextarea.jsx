"use client";

import { useState } from 'react';

export default function FormattedTextarea() {
  const [value, setValue] = useState("");

  return (
    <div className="relative w-full">
      {/* 1. The Actual Textarea */}
      <textarea
        name="content"
        required
        rows={12}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-2xl px-6 py-6 text-[var(--foreground)] text-lg leading-relaxed focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all resize-none font-playfair"
      />

      {/* 2. The "Placeholder/Instruction" Overlay */}
      {!value && (
        <div className="absolute top-0 left-0 w-full p-8 pointer-events-none select-none">
          <p className="font-bold text-[var(--muted)] italic text-lg mb-6">Begin your journey here...</p>
          
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] opacity-60 space-y-2">
            <p>Formatting Guide:</p>
            <ul className="space-y-1">
              <li className="flex gap-2"><span>1. Use ##</span> <span>for Heading</span></li>
              <li className="flex gap-2"><span>2. Use ###</span> <span>for Subheading</span></li>
              <li className="flex gap-2"><span>3. Use **</span> <span>for Bold Text</span></li>
              <li className="flex gap-2"><span>4. Use -</span> <span>for Bullet Points</span></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}