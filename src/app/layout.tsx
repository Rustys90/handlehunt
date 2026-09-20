import type { Metadata } from "next";
import "./globals.css";

const SITE = "https://handlehunt-xi-tau.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "HandleHunt \u2014 Find Rare Instagram Usernames",
    template: "%s \u2014 HandleHunt",
  },
  description:
    "Scan short Instagram handles (3\u20134 characters), estimate availability, and browse rare usernames in the marketplace. Independent tool \u2014 not affiliated with Meta or Instagram.",
  keywords: [
    "Instagram username",
    "rare Instagram handles",
    "3 letter Instagram username",
    "4 letter Instagram username",
    "username availability",
    "Instagram handle marketplace",
    "HandleHunt",
  ],
  authors: [{ name: "HandleHunt" }],
  creator: "HandleHunt",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE,
    siteName: "HandleHunt",
    title: "HandleHunt \u2014 Find Rare Instagram Usernames",
    description:
      "Exhaustive short-handle scanner and Telegram marketplace for rare Instagram usernames. Not affiliated with Meta.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HandleHunt \u2014 Rare Instagram Usernames",
    description: "Scan 3/4-character handles and browse listed rares. Independent of Meta/Instagram.",
  },
  alternates: { canonical: SITE },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "HandleHunt",
      description:
        "Find rare short Instagram usernames with exhaustive scanners and a Telegram marketplace.",
      publisher: { "@id": `${SITE}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "HandleHunt",
      url: SITE,
      sameAs: ["https://t.me/rareinsta"],
      description: "Independent Instagram username discovery and marketplace venue.",
    },
    {
      "@type": "WebApplication",
      name: "HandleHunt Scanner",
      url: `${SITE}/#scanner`,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Session-based exhaustive scanner for 3 and 4 character Instagram usernames (a-z, 0-9).",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@400;600&family=Marck+Script&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
