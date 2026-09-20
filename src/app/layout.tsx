import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HandleForge — Find Rare Instagram Usernames",
  description:
    "Scan short Instagram handles, check availability, and browse rare usernames on the HandleForge marketplace. Availability estimates only — not affiliated with Meta or Instagram.",
  keywords: [
    "HandleForge",
    "instagram username",
    "rare handles",
    "username availability",
    "short instagram names",
    "handle marketplace",
  ],
  openGraph: {
    title: "HandleForge — Rare Instagram Usernames",
    description:
      "Forge rare short Instagram handles. Live scan, availability estimates, marketplace via Telegram.",
    type: "website",
    siteName: "HandleForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "HandleForge — Rare Instagram Usernames",
    description: "Forge rare short Instagram handles. Live scan and marketplace.",
  },
  robots: { index: true, follow: true },
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "HandleForge",
              description:
                "Scan short Instagram handles, estimate availability, and browse rare usernames on the marketplace.",
              applicationCategory: "BusinessApplication",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
