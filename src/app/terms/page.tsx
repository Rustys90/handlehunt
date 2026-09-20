import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of HandleForge scanners, listings, and related services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-3xl mx-auto">
      <nav className="flex flex-wrap gap-4 text-sm text-white/50 mb-8">
        <Link href="/" className="hover:text-white">Home</Link>
        <Link href="/#scanner" className="hover:text-white">Scanner</Link>
        <Link href="/#marketplace" className="hover:text-white">Marketplace</Link>
        <Link href="/privacy" className="hover:text-white">Privacy</Link>
        <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
      </nav>
      <h1 className="text-4xl mt-2 mb-2" style={{ fontFamily: "Italiana, serif" }}>Terms of Use</h1>
      <p className="text-white/50 text-sm mb-10">Last updated: September 20, 2026</p>
      <div className="space-y-6 text-white/80 text-[15px] leading-relaxed">
        <p>By accessing or using HandleForge you agree to these Terms. If you do not agree, do not use the site.</p>

        <h2 className="text-white text-xl font-semibold pt-2">1. What we are</h2>
        <p>
          HandleForge is an independent discovery tool and listing venue for Instagram usernames.
          We provide <strong className="text-white/90">estimates</strong> of public-profile availability and display third-party listings.
          We are <strong className="text-white/90">not</strong> affiliated with, endorsed by, or partnered with Meta Platforms, Inc. or Instagram.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">2. Estimates only</h2>
        <p>
          Scanner and check results are automated guesses based on public signals. They are not official Instagram registration status,
          not a guarantee a name can be claimed, and not legal advice. Always verify on Instagram before paying anyone or changing branding.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">3. Acceptable use</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>No abuse of our APIs or scanners (excessive automated load, circumvention of rate limits).</li>
          <li>No use of the service for fraud, impersonation, harassment, or illegal activity.</li>
          <li>No scraping our site in a way that harms service stability.</li>
          <li>You are responsible for complying with Instagram's Terms and applicable law.</li>
        </ul>

        <h2 className="text-white text-xl font-semibold pt-2">4. Marketplace and Telegram</h2>
        <p>
          "Buy" actions may open third-party channels such as Telegram. HandleForge does not process card payments on-site.
          Deals, transfers, and payments are between you and the counterparty. We do not warrant sellers, stock, or delivery.
          "Out of stock" labels are informational and may lag reality.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">5. Intellectual property</h2>
        <p>
          Site design, branding, and original content belong to HandleForge or its licensors.
          Instagram and related marks belong to their owners. No affiliation is implied by nominative reference.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">6. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not warrant uninterrupted or error-free operation.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">7. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, HandleForge and its operators are not liable for indirect, incidental,
          special, consequential, or punitive damages, or any loss of profits, data, goodwill, or username opportunities
          arising from use of the service or reliance on estimates or listings.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">8. Indemnity</h2>
        <p>
          You agree to indemnify and hold harmless HandleForge from claims arising from your use of the service,
          your deals with third parties, or your violation of these Terms or law.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">9. Changes and termination</h2>
        <p>
          We may change or discontinue features at any time. We may suspend access for abuse.
          Continued use after changes means you accept the updated Terms.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">10. Contact</h2>
        <p>Telegram: <a className="text-red-400 hover:underline" href="https://t.me/rareinsta" target="_blank" rel="noreferrer">t.me/rareinsta</a></p>
      </div>
    </main>
  );
}
