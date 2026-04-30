import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-(--background) flex flex-col items-center justify-center text-center p-6 font-playfair">
      <div className="space-y-6">
        <h1 className="text-9xl font-bold text-(--accent) opacity-10">404</h1>
        <h2 className="text-4xl font-bold text-(--accent)">Page Lost in the Archives</h2>
        <p className="text-lg text-(--muted) italic max-w-sm mx-auto">
          It seems this entry has been misplaced or never written. Let’s head back to the main collection.
        </p>
        <Link
          href="/"
          className="inline-block btn-primary px-8 py-4 rounded-full mt-8"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}