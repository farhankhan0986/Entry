"use client";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { useState } from "react";

const isValidEmail = (val) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

export default function Subscribe() {
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
    toast.success("You're subscribed! Welcome.");
    setEmail("");
  };

  return (
    <section className="my-20 p-8 md:p-12 bg-(--card)/10 border border-(--border) rounded-[48px] text-center shadow-sm">
      <div className="w-16 h-16 bg-(--background) rounded-full flex items-center justify-center mx-auto mb-6 text-(--accent) border border-(--border)">
        <Mail size={28} />
      </div>

      <h3 className="text-3xl font-bold mb-4 text-(--foreground)">
        Join the Newsletter
      </h3>

      <p className="text-(--muted) mb-8 max-w-md mx-auto italic text-lg">
        Weekly stories on design, tech, and travel directly to your inbox.
      </p>

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
            className={`flex-1 bg-(--input) border rounded-2xl px-6 h-14 py-3 outline-none focus:ring-2 transition-all ${
              emailError
                ? "border-red-500 focus:ring-red-400/20"
                : "border-(--border) focus:ring-(--accent)/20"
            }`}
          />

          <button
            onClick={handleSubscribe}
            className="btn-primary h-14 px-10 cursor-pointer rounded-full whitespace-nowrap"
          >
            Subscribe
          </button>
        </div>

        {emailError && (
          <p className="text-sm text-red-500 font-medium text-left px-2">
            {emailError}
          </p>
        )}
      </div>
    </section>
  );
}