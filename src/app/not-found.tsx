import { PageBanner } from "@/components/ui/page-banner";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main-content">
      <PageBanner title="Page not found" />
      <div className="site-container section-space-both text-center">
        <p className="mb-8">The page you’re looking for is unavailable.</p>
        <ButtonLink href="/">Back to Home</ButtonLink>
      </div>
    </main>
  );
}
