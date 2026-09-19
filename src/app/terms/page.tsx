import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of Use — HandleHunt", description: "Terms governing use of HandleHunt." };
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-white/50 hover:text-white">← Home</Link>
      <h1 className="text-4xl mt-6 mb-2" style={{ fontFamily: "Italiana, serif" }}>Terms of Use</h1>
      <p className="text-white/50 text-sm mb-10">Last updated: September 19, 2026</p>
      <div className="space-y-6 text-white/80 text-[15px] leading-relaxed">
        <p>By using HandleHunt you agree to these Terms.</p>
        <h2 className="text-white text-xl font-semibold">What we are</h2>
        <p>A discovery and listing venue. Not Meta or Instagram. Results are estimates from public signals.</p>
        <h2 className="text-white text-xl font-semibold">Marketplace</h2>
        <p>Buy links may open Telegram. We do not process payments, hold escrow, or transfer accounts.</p>
        <h2 className="text-white text-xl font-semibold">Instagram rules</h2>
        <p>Instagram Terms restrict buying or selling accounts and usernames. Third-party deals can lead to bans. You are responsible for compliance.</p>
        <h2 className="text-white text-xl font-semibold">Liability</h2>
        <p>THE SERVICE IS PROVIDED AS IS. WE ARE NOT LIABLE FOR LOST HANDLES, FAILED PURCHASES, OR ACCOUNT BANS TO THE MAXIMUM EXTENT PERMITTED BY LAW.</p>
      </div>
    </main>
  );
}
