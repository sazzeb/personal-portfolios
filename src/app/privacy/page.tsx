import type { Metadata } from "next";
import { PageBanner } from "@/components/ui/page-banner";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <PageBanner title="Privacy Policy" />
      <article className="site-container section-space-both space-y-6">
        <h2 className="font-display text-3xl">Your information</h2>
        <p>
          This portfolio does not use analytics, advertising cookies, or user
          accounts.
        </p>
        <p>
          The enquiry and newsletter forms prepare a draft in your email app.
          Their contents are not stored by this website. Your email provider’s
          privacy terms apply when you send a message.
        </p>
        <p>
          External social links open third-party websites with their own privacy
          policies.
        </p>
      </article>
    </main>
  );
}
