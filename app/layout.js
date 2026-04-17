import "./globals.css";
import Navbar from "@/components/Navbar";
import { Saira_Stencil_One } from "next/font/google";
import { Arvo } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"

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
  title: "Entry",
  description: "A place to share your thoughts and ideas",
  metadataBase: new URL("https://entry-azure.vercel.app"),
  applicationName: "Entry",
  appleWebApp: {
    title: "Entry",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${saira.variable} ${arvo.variable} ${playfair.variable}`} data-scroll-behavior="smooth" style={{ scrollBehavior: 'smooth' }} suppressHydrationWarning>
      <meta name="apple-mobile-web-app-title" content="Entry" />
      <body
        className={`min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Navbar />
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
        </ThemeProvider>
      </body>
    </html>
  );
}