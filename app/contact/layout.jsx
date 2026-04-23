export const metadata = {
  title: "Contact Us | Entry",
  description: "Reach out to the Entry editorial team. Whether you have a story idea, feedback, a partnership proposal, or simply want to connect — we'd love to hear from you.",
  alternates: { canonical: "https://entry-azure.vercel.app/contact" },
  openGraph: {
    type: "website",
    url: "https://entry-azure.vercel.app/contact",
    siteName: "Entry",
    title: "Contact Us | Entry",
    description: "Reach out to the Entry editorial team. Whether you have a story idea, feedback, a partnership proposal, or simply want to connect — we'd love to hear from you.",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Entry",
    description: "Reach out to the Entry editorial team. Whether you have a story idea, feedback, a partnership proposal, or simply want to connect — we'd love to hear from you.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default function ContactLayout({ children }) {
  return children;
}
