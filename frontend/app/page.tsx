import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hiatus | Find the gaps. Skip the noise.",
    description: "Map the unknown. Our agentic AI autonomously maps research fields, detects contradictions, and surfaces latent trends across thousands of papers.",
    openGraph: {
      title: "Hiatus | AI Research Gap Finder",
      description: "Find the gaps. Skip the noise. Map research fields autonomously with Hiatus.",
    }
  };
}

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Hiatus",
    "description": "An agentic AI research tool that autonomously maps research fields, detects contradictions, and surfaces unexplored research gaps.",
    "applicationCategory": "ResearchApplication",
    "operatingSystem": "Web",
    "offers": [
      {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "name": "Free"
      },
      {
        "@type": "Offer",
        "price": "18",
        "priceCurrency": "USD",
        "name": "Pro"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingClient />
    </>
  );
}
