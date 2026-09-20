import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important disclaimer: HandleForge is independent of Meta/Instagram; availability results are estimates only.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-3xl mx-auto">
      <nav className="flex flex-wrap gap-4 text-sm text-white/50 mb-8">
        <Link href="/" className="hover:text-white">Home</Link>
        <Link href="/#scanner" className="hover:text-white">Scanner</Link>
        <Link href="/#marketplace" className="hover:text-white">Marketplace</Link>
        <Link href="/privacy" className="hover:text-white">Privacy</Link>
        <Link href="/terms" className="hover:text-white">Terms</Link>
      </nav>
      <h1 className="text-4xl mt-2 mb-2" style={{ fontFamily: "Italiana, serif" }}>Disclaimer</h1>
      <p className="text-white/50 text-sm mb-10">Last updated: September 20, 2026</p>
      <div className="space-y-6 text-white/80 text-[15px] leading-relaxed">
        <h2 className="text-white text-xl font-semibold">No affiliation</h2>
        <p>
          HandleForge is an independent project. It is not affiliated with, endorsed by, sponsored by, or associated with
          Meta Platforms, Inc., Instagram, or any of their subsidiaries. Instagram is a trademark of Meta Platforms, Inc.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">Availability estimates</h2>
        <p>
          Any "available", "taken", or confidence score shown by HandleForge is an automated estimate based on publicly
          observable signals. It is not confirmation from Instagram that a username can be registered, transferred, or kept.
          Names can be reserved, restricted, shadow-blocked, or taken between the time of a check and any action you take.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">No professional advice</h2>
        <p>
          Content on this site is for general information only. It is not legal, financial, or professional advice.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">Third-party deals</h2>
        <p>
          Marketplace listings and Telegram conversations are third-party. HandleForge does not guarantee authenticity of
          sellers, ownership of handles, successful transfer, or refunds. Conduct due diligence and use escrow or other
          protections when appropriate.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">External links</h2>
        <p>
          Links to Instagram, Telegram, or other sites are provided for convenience. We are not responsible for their content or policies.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">Limitation</h2>
        <p>
          Use of HandleForge is at your own risk. See our Terms of Use for additional limitations of liability.
        </p>

        <p className="pt-4">
          Questions: <a className="text-red-400 hover:underline" href="https://t.me/rareinsta" target="_blank" rel="noreferrer">t.me/rareinsta</a>
        </p>
      </div>
    </main>
  );
}
