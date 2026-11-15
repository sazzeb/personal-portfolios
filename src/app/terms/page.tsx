import type { Metadata } from "next";
import { sammy } from "@/config/sammy";
import { PageBanner } from "@/components/ui/page-banner";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <main id="main-content">
      <PageBanner title="Terms & Conditions" />
      <article className="site-container section-space-both space-y-6">
        <h2 className="font-display text-3xl">About this portfolio</h2>
        <p>
          This is a demonstration of {sammy.name}’s portfolio design. Names,
          projects, statistics, testimonials, and contact details reproduce
          illustrative template content and do not represent an offer of
          professional services.
        </p>
        <p>
          The reference design and demo imagery belong to their respective
          owners. Original template: InversWeb on ThemeForest.
        </p>
      </article>
    </main>
  );
}
