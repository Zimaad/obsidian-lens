import type { Metadata } from "next";
import { Outfit, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const fontOutfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fontGeist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const fontGeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hiatus-three.vercel.app"), 
  title: {
    default: "Hiatus | Find the gaps. Skip the noise.",
    template: "%s | Hiatus"
  },
  description: "Identify unexplored research gaps with Hiatus. Our agentic AI autonomously maps research fields, detects contradictions, and surfaces latent trends across thousands of papers.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hiatus | AI Research Gap Finder",
    description: "Map the unknown. Detect research contradictions and surface unexplored gaps with autonomous AI agents.",
    url: "https://hiatus-three.vercel.app",
    siteName: "Hiatus",
    images: ["/opengraph-image"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hiatus | AI Research Gap Finder",
    description: "Find the gaps. Skip the noise. Map research fields autonomously with Hiatus.",
    images: ["/opengraph-image"],
  },
  verification: {
    google: "yr2ccKxMOJIxIWUXMF7_7wOnmghet4IuDybjdBOqZI8",
  },
  icons: {
    icon: "/icon.png",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontOutfit.variable} ${fontGeist.variable} ${fontGeistMono.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background text-primary font-body">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

