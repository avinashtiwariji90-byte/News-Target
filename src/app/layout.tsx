import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "News Target | न्यूज़ टारगेट - Verified Digital News Network",
  description: "India's premier digital news channel featuring verified reporting across Madhya Pradesh, Bhopal, National Politics, and Global Affairs. Government-verified.",
  keywords: ["News", "India", "Madhya Pradesh", "Bhopal", "Politics", "News Target"],
  authors: [{ name: "News Target Editorial Board" }],
  openGraph: {
    title: "News Target | Verified Digital News Network",
    description: "India's premier digital news channel. Government-verified journalism.",
    url: "https://newstarget.in",
    siteName: "News Target",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
