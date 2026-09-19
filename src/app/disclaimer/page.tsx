import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Disclaimer — HandleHunt", description: "Important disclaimers about HandleHunt." };
export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-white/50 hover:text-white">← Home</Link>
      <h1 className="text-4xl mt-6 mb-2" style={{ fontFamily: "Italiana, serif" }}>Disclaimer</h1>
      <p className="text-white/50 text-sm mb-10">Last updated: September 19, 2026</p>
      <div className="space-y-6 text-white/80 text-[15px] leading-relaxed">
        <p className="border border-amber-500/40 bg-amber-500/10 rounded-xl p-4 text-amber-100">
          <strong>Important:</strong> Instagram Terms of Use prohibit buying, selling, or transferring accounts and usernames. Third-party deals can result in bans.
        </p>
        <p>HandleHunt is not affiliated with Meta or Instagram. Scanner results are estimates only. We do not take custody of accounts or funds. Nothing here is legal advice.</p>
      </div>
    </main>
  );
}
