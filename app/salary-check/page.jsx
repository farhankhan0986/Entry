import SalaryTool from "@/components/SalaryTool";
import Link from "next/link";
import { ArrowLeft, TrendingUp, BarChart2, Globe, IndianRupee, Lightbulb, Users } from "lucide-react";

export const metadata = {
  title: "Tech Salary Comparison Tool | Know Your Market Value | Entry",
  description:
    "Check tech salaries for your role and experience level. Compare Frontend, Backend, ML, DevOps, Data Science pay in India (LPA) and globally (USD). Free, no sign-up.",
  alternates: { canonical: "https://entry-azure.vercel.app/salary-check" },
  openGraph: {
    type: "website",
    url: "https://entry-azure.vercel.app/salary-check",
    siteName: "Entry",
    title: "Tech Salary Comparison Tool | Know Your Market Value | Entry",
    description:
      "Check tech salaries for your role and experience level. Compare Frontend, Backend, ML, DevOps, Data Science pay in India and globally. Free, no sign-up.",
    images: [{ url: "https://entry-azure.vercel.app/salary-check.png", width: 1200, height: 1080 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Salary Comparison Tool | Entry",
    description: "Check tech salaries for your role and experience level. Compare pay in India and globally.",
    images: ["https://entry-azure.vercel.app/salary-check.png"],
  },
};

const stats = [
  { icon: Users, value: "12+", label: "Tech Roles" },
  { icon: BarChart2, value: "5", label: "Experience Levels" },
  { icon: Globe, value: "2", label: "Regions Covered" },
  { icon: IndianRupee, value: "2026", label: "Data Updated" },
];

export default function SalaryCheckPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">
      {/* Hero */}
      <header className="container mx-auto px-6 pt-16 pb-12">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={14} /> Back to Journal
        </Link>

        <div className="w-full flex flex-col items-center justify-center mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-[var(--accent)]" />
            <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-[var(--accent)] leading-none">
              Salary Intelligence
            </p>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
            Salary
            <br />
            <span className="text-[var(--accent)]">Check</span>
            <span className="text-[var(--muted)]">.</span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl">
            Select your role and experience level to see where you stand in the
            market — in India or globally.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--card)]/10 text-center"
            >
              <Icon size={18} className="text-[var(--accent)] mb-2 mx-auto" />
              <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
              <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">{label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Tool */}
      <main className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--card)]/10 border border-[var(--border)] rounded-[40px] p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                <BarChart2 size={18} className="text-[var(--accent)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold leading-none">Salary Explorer</h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Select role & experience to see market data
                </p>
              </div>
            </div>
            <SalaryTool />
          </div>

          {/* Disclaimer */}
          <div className="mt-8 flex items-start gap-3 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]/5">
            <Lightbulb size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              <strong className="text-[var(--foreground)]">Data Note:</strong> Salary ranges are based on 2025–2026 market research across major job platforms and industry reports. India figures are in Lakhs Per Annum (LPA). Global figures are in USD/year. Actual compensation varies by company, city, skills, and negotiation.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
