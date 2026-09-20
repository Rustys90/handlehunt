import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HandleForge collects, uses, and shares information when you scan handles or browse the marketplace.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-3xl mx-auto font-sans">
      <nav className="flex flex-wrap gap-4 text-sm text-white/50 mb-8">
        <Link href="/" className="hover:text-white">Home</Link>
        <Link href="/#scanner" className="hover:text-white">Scanner</Link>
        <Link href="/#marketplace" className="hover:text-white">Marketplace</Link>
        <Link href="/terms" className="hover:text-white">Terms</Link>
        <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
      </nav>
      <h1 className="text-4xl mt-2 mb-2" style={{ fontFamily: "Italiana, serif" }}>Privacy Policy</h1>
      <p className="text-white/50 text-sm mb-10">Last updated: September 20, 2026</p>
      <div className="space-y-6 text-white/80 text-[15px] leading-relaxed">
        <p>
          HandleForge ("we", "us") operates a website that provides Instagram username availability
          <strong className="text-white/90"> estimates</strong> and third-party marketplace listings.
          We are independent and not affiliated with Meta Platforms, Inc. or Instagram.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">1. Information we collect</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Usernames you submit to the single-check or exhaustive scanner.</li>
          <li>Technical data: IP address, browser type, device, approximate region, and request logs needed to operate and secure the service.</li>
          <li>Local browser storage on your device for scan progress (stored on your device, not required for an account).</li>
          <li>Optional messages you send via Telegram or other contact channels you choose.</li>
        </ul>
        <p>We do not require an account for the public scanner. We do not intentionally collect payment card numbers on this site.</p>

        <h2 className="text-white text-xl font-semibold pt-2">2. How we use information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To run availability estimates and show results.</li>
          <li>To improve reliability, prevent abuse and rate-limit abuse.</li>
          <li>To operate hosting, security, and basic analytics.</li>
          <li>To respond if you contact us.</li>
          <li>To comply with law or enforce our Terms.</li>
        </ul>

        <h2 className="text-white text-xl font-semibold pt-2">3. Sharing</h2>
        <p>
          We do not sell personal information. We may share data with infrastructure providers
          (for example hosting such as Vercel) under their terms, or when required by law,
          or to protect rights and safety. Marketplace transactions are arranged off-site
          (e.g. Telegram) between buyers and sellers; those platforms have their own policies.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">4. Cookies and local storage</h2>
        <p>
          We may use essential cookies or local storage for site function and scan progress.
          You can clear browser storage at any time. Third-party embeds (if added later) may set their own cookies.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">5. Retention</h2>
        <p>
          Server logs are retained only as long as needed for operations, security, and legal requirements.
          Scan progress in local storage remains until you clear it.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">6. International processing</h2>
        <p>
          Servers and vendors may process data in the United States or other countries.
          By using the site you understand information may be transferred across borders.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">7. Children</h2>
        <p>HandleForge is not directed at children under 13. We do not knowingly collect their data.</p>

        <h2 className="text-white text-xl font-semibold pt-2">8. Your choices</h2>
        <p>
          You may stop using the site, clear local storage, and contact us via Telegram to ask questions about data we control.
          Depending on your region, you may have rights to access or deletion of personal data we hold.
        </p>

        <h2 className="text-white text-xl font-semibold pt-2">9. Changes</h2>
        <p>We may update this policy. The "Last updated" date will change when we do. Continued use means you accept the current version.</p>

        <h2 className="text-white text-xl font-semibold pt-2">10. Contact</h2>
        <p>Telegram: <a className="text-red-400 hover:underline" href="https://t.me/rareinsta" target="_blank" rel="noreferrer">t.me/rareinsta</a></p>

        <p className="text-white/50 text-sm pt-4">This policy is informational and not legal advice.</p>
      </div>
    </main>
  );
}
