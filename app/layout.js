import "./globals.css";
import Navbar from "@/components/Navbar";
import { Saira_Stencil_One } from "next/font/google";
import { Arvo } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "@/components/Footer";

const saira = Saira_Stencil_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-saira",
});

const arvo = Arvo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-arvo",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-playfair",
});

export const metadata = {
  metadataBase: new URL("https://entry-azure.vercel.app"),
  title: {
    default: "Entry — The Journal",
    template: "%s | Entry",
  },
  description: "A curated journal of stories, ideas, and reflections from a community of writers and thinkers.",
  applicationName: "Entry",
  keywords: ["journal", "blog", "stories", "writing", "entry"],
  authors: [{ name: "Entry", url: "https://entry-azure.vercel.app" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://entry-azure.vercel.app",
    siteName: "Entry",
    title: "Entry — The Journal",
    description: "A curated journal of stories, ideas, and reflections from a community of writers and thinkers.",
    images: [
      {
        url: "https://entry-azure.vercel.app/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Entry — The Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@entryjournal",
    title: "Entry — The Journal",
    description: "A curated journal of stories, ideas, and reflections from a community of writers and thinkers.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${saira.variable} ${arvo.variable} ${playfair.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Navbar />
          <SpeedInsights />
          <Analytics />
          <Toaster position="top-right" richColors toastOptions={{
            classNames: {
              toast: "font-arvo",
              title: "font-arvo",
              description: "font-arvo",
            },
          }} />

          <main className="flex-grow container">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}