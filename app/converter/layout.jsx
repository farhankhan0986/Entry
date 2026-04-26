export const metadata = {
  title: "Text Converter & Formatter Tool | Entry",
  description: "Free online text converter with 20+ transformations: case conversion, Base64 encode/decode, find & replace, slug generator, sort lines, live word count, and more.",
  alternates: { canonical: "https://entry-azure.vercel.app/converter" },
  openGraph: {
    type: "website",
    url: "https://entry-azure.vercel.app/converter",
    siteName: "Entry",
    title: "Text Converter & Formatter Tool | Entry",
    description: "Free online text converter with 20+ transformations: case conversion, Base64 encode/decode, find & replace, slug generator, sort lines, live word count, and more.",
    images: [{ url: "https://entry-azure.vercel.app/text.png", width: 1200, height: 1080 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Converter & Formatter Tool | Entry",
    description: "Free online text converter with 20+ transformations: case conversion, Base64 encode/decode, find & replace, slug generator, sort lines, live word count, and more.",
    images: ["https://entry-azure.vercel.app/text.png"],
  },
};

export default function ConverterLayout({ children }) {
  return children;
}
