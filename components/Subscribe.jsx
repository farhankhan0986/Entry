"use client";
import { toast } from "sonner";
import { Mail, Download, Send } from "lucide-react";
import { FaTelegram } from "react-icons/fa6";
import { useState } from "react";

const isValidEmail = (val) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true);

    // Trigger PDF download
    const link = document.createElement("a");
    link.href = "/2026_Tech_Career_Roadmap.pdf";
    link.download = "2026_Tech_Career_Roadmap.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("You're subscribed! Your PDF is downloading now 🎉");
    setEmail("");
  };

  return (
    <section className="my-20 p-8 md:p-12 bg-(--card)/10 border border-(--border) rounded-[48px] text-center shadow-sm">

      {/* PDF Lead Magnet Badge */}
      <div className="inline-flex items-center gap-2 bg-(--accent)/10 border border-(--accent)/30 text-(--accent) text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
        <Download size={12} />
        Free Download
      </div>

      <div className="w-20 h-20 bg-(--background) rounded-2xl flex items-center justify-center mx-auto mb-6 text-(--accent) border border-(--border) shadow-sm">
        <Mail size={32} />
      </div>

      <h3 className="text-3xl font-bold mb-3 text-(--foreground)">
        Get The 2026 Tech Career Roadmap
      </h3>

      <p className="text-(--muted) mb-2 max-w-md mx-auto italic text-lg">
        A free PDF guide — the skills, salaries, and strategies to level up your tech career in 2026.
      </p>

      <p className="text-sm text-(--muted)/70 mb-8 max-w-sm mx-auto">
        Drop your email and we'll send it straight to your inbox.
      </p>

      {submitted ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-14 h-14 rounded-full bg-(--accent)/10 flex items-center justify-center text-(--accent)">
            <Download size={24} />
          </div>
          <p className="font-bold text-(--foreground)">Your roadmap is downloading!</p>
          <p className="text-sm text-(--muted) italic">Check your downloads folder for the PDF.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              placeholder="Enter your email"
              className={`flex-1 bg-(--input) border rounded-2xl px-6 h-14 py-3 outline-none focus:ring-2 transition-all ${emailError
                  ? "border-red-500 focus:ring-red-400/20"
                  : "border-(--border) focus:ring-(--accent)/20"
                }`}
            />
            <button
              onClick={handleSubscribe}
              className="btn-primary h-14 px-8 cursor-pointer rounded-full whitespace-nowrap flex items-center gap-2"
            >
              <Send size={15} />
              Get Free PDF
            </button>
          </div>
          {emailError && (
            <p className="text-sm text-red-500 font-medium text-left px-2">
              {emailError}
            </p>
          )}
        </div>
      )}

      {/* Telegram CTA */}
      <div className="mt-10 pt-8 border-t border-(--border)">
        <p className="text-sm text-(--muted) mb-4 italic">
          Want daily updates on blogs & world news?
        </p>
        <a
          href="https://t.me/TheEntryJournal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-(--border) text-sm font-bold uppercase tracking-widest hover:border-[#229ED9] hover:text-[#229ED9] hover:bg-[#229ED9]/5 transition-all duration-300"
        >
          <FaTelegram size={18} style={{ color: "#229ED9" }} />
          Join Our Telegram Group
        </a>
      </div>
    </section>
  );
}