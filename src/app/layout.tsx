import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "HandleHunt — Rare Instagram Usernames",
  description: "Discover and claim rare short Instagram handles.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Viaoda+Libre&family=Imprima&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
