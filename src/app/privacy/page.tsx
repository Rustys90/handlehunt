import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy — HandleHunt", description: "How HandleHunt collects and uses information." };
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-white/50 hover:text-white">← Home</Link>
      <h1 className="text-4xl mt-6 mb-2" style={{ fontFamily: "Italiana, serif" }}>Privacy Policy</h1>
      <p className="text-white/50 text-sm mb-10">Last updated: September 19, 2026</p>
      <div className="space-y-6 text-white/80 text-[15px] leading-relaxed">
        <p>HandleHunt operates a website for Instagram username availability estimates and third-party marketplace listings.</p>
        <h2 className="text-white text-xl font-semibold">Information we collect</h2>
        <p>Usernames submitted to the scanner, basic analytics, and technical logs. We do not require an account for the public scanner.</p>
        <h2 className="text-white text-xl font-semibold">How we use information</h2>
        <p>To provide estimates, improve the product, prevent abuse, and comply with law. We do not process payment cards; marketplace deals are off-site.</p>
        <h2 className="text-white text-xl font-semibold">Sharing</h2>
        <p>We do not sell personal information. Hosting and analytics providers may process data under their terms.</p>
        <p className="text-white/50 text-sm">This policy is informational, not legal advice. Continued use means you accept the current version.</p>
      </div>
    </main>
  );
}
