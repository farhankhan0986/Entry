// app/login/page.jsx — Server Component
import { signIn } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Sign In | Entry",
  description: "Sign in to Entry to write, comment, and publish your stories.",
};

export default async function LoginPage({ searchParams }) {
  // If already signed in, redirect to dashboard
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const sp = await searchParams;
  const callbackUrl = sp?.callbackUrl || "/dashboard";

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 font-playfair">

      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--accent)]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl font-bold text-[var(--foreground)] tracking-tighter">
              Entry<span className="text-[var(--accent)]">.</span>
            </h1>
          </Link>
          <p className="mt-3 text-[var(--muted)] italic text-sm">
            Your journal. Your voice.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--card)]/30 backdrop-blur-xl border border-[var(--border)] rounded-[2rem] p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Welcome back</h2>
          <p className="text-[var(--muted)] text-sm mb-8">
            Sign in to write stories, join the conversation, and manage your entries.
          </p>

          <div className="space-y-4">
            {/* Google */}
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: callbackUrl });
              }}
              className="w-full"
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 border border-gray-200 rounded-xl px-6 py-4 font-bold text-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 active:scale-[0.98]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>

            {/* GitHub */}
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: callbackUrl });
              }}
              className="w-full"
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-[#24292e] text-white rounded-xl px-6 py-4 font-bold text-sm hover:bg-[#1a1e22] hover:shadow-md transition-all duration-200 active:scale-[0.98]"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
                Continue with GitHub
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <p className="text-center text-xs text-[var(--muted)]">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-[var(--accent)] hover:underline">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            ← Continue reading without signing in
          </Link>
        </div>
      </div>
    </div>
  );
}