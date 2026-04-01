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
  title: "Obsidian Lens | Research Gap Finder",
  description: "Harness an autonomous agentic workflow that reads thousands of papers, detects latent contradictions, and visualizes the frontiers of human knowledge.",
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

