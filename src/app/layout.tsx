import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "HandleHunt — Find Rare Instagram Usernames",
  description: "Scan short Instagram handles, check availability, and browse rare usernames. Not affiliated with Meta or Instagram.",
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@400;600&family=Marck+Script&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
