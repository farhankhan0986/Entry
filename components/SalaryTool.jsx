"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, IndianRupee, DollarSign } from "lucide-react";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps / SRE Engineer",
  "Data Scientist",
  "ML / AI Engineer",
  "Mobile Developer",
  "Product Manager",
  "UI/UX Designer",
  "QA / Test Engineer",
  "Cloud Architect",
  "Cybersecurity Analyst",
];

const EXPERIENCE = [
  { label: "0–1 yrs (Fresher)", value: "0-1" },
  { label: "1–3 yrs (Junior)", value: "1-3" },
  { label: "3–5 yrs (Mid)", value: "3-5" },
  { label: "5–10 yrs (Senior)", value: "5-10" },
  { label: "10+ yrs (Lead/Principal)", value: "10+" },
];

// Salary data in LPA (India) and USD/year (Global)
const SALARY_DATA = {
  india: {
    "Frontend Developer":      { "0-1": [3,5,8],    "1-3": [6,10,16],  "3-5": [12,18,28],  "5-10": [20,30,45],  "10+": [35,50,80]  },
    "Backend Developer":       { "0-1": [3,6,9],    "1-3": [7,12,18],  "3-5": [14,22,32],  "5-10": [22,35,50],  "10+": [40,58,90]  },
    "Full Stack Developer":    { "0-1": [4,7,10],   "1-3": [8,13,20],  "3-5": [15,24,36],  "5-10": [25,38,55],  "10+": [42,62,95]  },
    "DevOps / SRE Engineer":   { "0-1": [4,7,11],   "1-3": [9,14,22],  "3-5": [16,26,40],  "5-10": [28,42,65],  "10+": [50,70,110] },
    "Data Scientist":          { "0-1": [5,8,12],   "1-3": [10,16,25], "3-5": [18,28,42],  "5-10": [30,45,70],  "10+": [55,75,120] },
    "ML / AI Engineer":        { "0-1": [6,10,15],  "1-3": [12,20,30], "3-5": [22,35,52],  "5-10": [38,58,90],  "10+": [65,90,140] },
    "Mobile Developer":        { "0-1": [3,5,8],    "1-3": [6,10,16],  "3-5": [12,20,30],  "5-10": [20,32,48],  "10+": [36,52,80]  },
    "Product Manager":         { "0-1": [5,8,12],   "1-3": [10,16,24], "3-5": [18,28,42],  "5-10": [30,48,70],  "10+": [52,75,120] },
    "UI/UX Designer":          { "0-1": [3,5,8],    "1-3": [6,9,14],   "3-5": [10,16,24],  "5-10": [18,26,40],  "10+": [30,45,70]  },
    "QA / Test Engineer":      { "0-1": [3,4,7],    "1-3": [5,8,12],   "3-5": [9,14,20],   "5-10": [14,22,32],  "10+": [24,36,55]  },
    "Cloud Architect":         { "0-1": [5,8,12],   "1-3": [10,16,24], "3-5": [20,32,48],  "5-10": [35,55,85],  "10+": [60,85,130] },
    "Cybersecurity Analyst":   { "0-1": [4,6,10],   "1-3": [8,13,20],  "3-5": [15,24,36],  "5-10": [26,40,60],  "10+": [45,65,100] },
  },
  global: {
    "Frontend Developer":      { "0-1": [55,70,90],    "1-3": [70,90,115],  "3-5": [90,115,145],  "5-10": [120,150,185],  "10+": [160,200,260]  },
    "Backend Developer":       { "0-1": [60,75,95],    "1-3": [75,100,125], "3-5": [100,130,165], "5-10": [135,165,205],  "10+": [175,220,280]  },
    "Full Stack Developer":    { "0-1": [60,78,100],   "1-3": [80,105,130], "3-5": [105,135,170], "5-10": [140,175,215],  "10+": [180,230,290]  },
    "DevOps / SRE Engineer":   { "0-1": [65,85,110],   "1-3": [90,115,145], "3-5": [120,155,195], "5-10": [160,200,250],  "10+": [210,265,330]  },
    "Data Scientist":          { "0-1": [75,95,120],   "1-3": [100,130,165],"3-5": [135,170,215], "5-10": [175,220,275],  "10+": [230,285,360]  },
    "ML / AI Engineer":        { "0-1": [90,115,145],  "1-3": [120,155,195],"3-5": [160,200,255], "5-10": [210,265,335],  "10+": [280,350,440]  },
    "Mobile Developer":        { "0-1": [55,72,92],    "1-3": [72,95,120],  "3-5": [95,125,158],  "5-10": [130,162,200],  "10+": [165,210,265]  },
    "Product Manager":         { "0-1": [70,90,115],   "1-3": [95,125,160], "3-5": [130,165,210], "5-10": [170,215,270],  "10+": [225,285,360]  },
    "UI/UX Designer":          { "0-1": [50,65,82],    "1-3": [65,85,108],  "3-5": [85,110,140],  "5-10": [115,145,182],  "10+": [150,190,240]  },
    "QA / Test Engineer":      { "0-1": [45,58,75],    "1-3": [60,78,100],  "3-5": [80,105,132],  "5-10": [105,135,170],  "10+": [140,175,220]  },
    "Cloud Architect":         { "0-1": [80,105,135],  "1-3": [110,145,185],"3-5": [150,190,240], "5-10": [195,250,310],  "10+": [260,325,405]  },
    "Cybersecurity Analyst":   { "0-1": [60,78,100],   "1-3": [80,108,138], "3-5": [110,145,185], "5-10": [150,190,240],  "10+": [200,255,320]  },
  },
};

const TIPS = {
  "Frontend Developer": ["Master React + TypeScript", "Learn Next.js & performance optimization", "Build a strong portfolio with live projects"],
  "Backend Developer": ["Add system design expertise", "Contribute to open-source", "Get AWS/GCP certified"],
  "Full Stack Developer": ["Specialize in one stack deeply", "Learn DevOps basics (Docker, CI/CD)", "Build SaaS products as side projects"],
  "DevOps / SRE Engineer": ["Get Kubernetes CKA certified", "Learn Terraform & IaC", "Study SLOs and incident management"],
  "Data Scientist": ["Publish on Kaggle or research papers", "Learn MLOps", "Master SQL + Python + domain knowledge"],
  "ML / AI Engineer": ["Build LLM applications", "Study transformer architectures", "Publish models on HuggingFace"],
  "Mobile Developer": ["Learn both iOS & Android", "Master state management", "Publish apps with real users"],
  "Product Manager": ["Get PMP or PSPO certified", "Build data analysis skills (SQL)", "Lead cross-functional projects"],
  "UI/UX Designer": ["Add motion design to your skillset", "Master Figma + prototyping", "Build a case study portfolio"],
  "QA / Test Engineer": ["Learn automation (Playwright/Cypress)", "Study performance testing", "Transition into SDET role"],
  "Cloud Architect": ["Get AWS Solutions Architect Pro", "Master multi-cloud strategy", "Study FinOps practices"],
  "Cybersecurity Analyst": ["Get CISSP or CEH certified", "Build a home lab for practice", "Specialize in cloud security"],
};

export default function SalaryTool() {
  const [role, setRole] = useState("");
  const [exp, setExp] = useState("");
  const [region, setRegion] = useState("india");
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    if (!role || !exp) return;
    const data = SALARY_DATA[region][role][exp];
    setResult({ min: data[0], median: data[1], max: data[2] });
  };

  const isIndia = region === "india";
  const unit = isIndia ? "LPA" : "K USD/yr";
  const Symbol = isIndia ? IndianRupee : DollarSign;

  // percentile band: 0=low, 1=mid, 2=high
  const getMarketStatus = () => {
    if (!result) return null;
    const range = result.max - result.min;
    const midLow = result.min + range * 0.33;
    const midHigh = result.min + range * 0.67;
    // We show where median sits in market — always "At Market" for median
    // But we can show the range context
    return "At Market";
  };

  return (
    <div className="space-y-8">
      {/* Region toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Region:</span>
        <div className="flex gap-2">
          {[{ val: "india", label: "🇮🇳 India (LPA)" }, { val: "global", label: "🌍 Global (USD)" }].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => { setRegion(val); setResult(null); }}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all cursor-pointer ${
                region === val
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Your Role</label>
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); setResult(null); }}
            className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/20 cursor-pointer appearance-none"
          >
            <option value="">Select a role...</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Experience Level</label>
          <select
            value={exp}
            onChange={(e) => { setExp(e.target.value); setResult(null); }}
            className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/20 cursor-pointer appearance-none"
          >
            <option value="">Select experience...</option>
            {EXPERIENCE.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={handleCheck}
        disabled={!role || !exp}
        id="salary-check-btn"
        className="btn-primary h-12 px-10 rounded-full flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm font-bold tracking-widest uppercase"
      >
        <TrendingUp size={16} /> Check My Salary
      </button>

      {/* Result Card */}
      {result && (
        <div className="border border-[var(--border)] rounded-3xl p-8 bg-[var(--card)]/10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-1">{role}</p>
              <p className="text-sm text-[var(--muted)] italic">{EXPERIENCE.find(e => e.value === exp)?.label} · {isIndia ? "India" : "Global"}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-bold">
              <Minus size={12} /> At Market
            </span>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-center">
            {[
              { label: "Minimum", val: result.min, sub: "Entry point" },
              { label: "Median", val: result.median, sub: "Market rate", highlight: true },
              { label: "Maximum", val: result.max, sub: "Top performers" },
            ].map(({ label, val, sub, highlight }) => (
              <div
                key={label}
                className={`p-4 rounded-2xl border ${
                  highlight
                    ? "border-[var(--accent)] bg-[var(--accent)]/5"
                    : "border-[var(--border)] bg-[var(--background)]"
                }`}
              >
                <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mb-1">{label}</p>
                <p className={`text-2xl font-bold ${highlight ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                  {isIndia ? `${val}` : `$${val}K`}
                </p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5">{isIndia ? "LPA" : "USD/yr"}</p>
                <p className="text-[10px] text-[var(--muted)] italic mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* Visual bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest">
              <span>{isIndia ? `${result.min} LPA` : `$${result.min}K`}</span>
              <span className="text-[var(--accent)]">Median: {isIndia ? `${result.median} LPA` : `$${result.median}K`}</span>
              <span>{isIndia ? `${result.max} LPA` : `$${result.max}K`}</span>
            </div>
            <div className="relative h-3 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                style={{
                  width: "100%",
                  background: `linear-gradient(to right, var(--muted), var(--accent), var(--foreground))`,
                  opacity: 0.7,
                }}
              />
              {/* Median marker */}
              <div
                className="absolute top-0 h-full w-1 bg-[var(--accent)] rounded-full shadow"
                style={{
                  left: `${((result.median - result.min) / (result.max - result.min)) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <p className="text-xs text-[var(--muted)] italic text-center">
              Salary range for {role} with {EXPERIENCE.find(e => e.value === exp)?.label}
            </p>
          </div>

          {/* Tips */}
          {TIPS[role] && (
            <div className="border-t border-[var(--border)] pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
                How to move toward the top:
              </p>
              <ul className="space-y-2">
                {TIPS[role].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-[var(--foreground)]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
