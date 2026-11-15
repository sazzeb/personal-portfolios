import type { Metadata } from "next";
import { PageBanner } from "@/components/ui/page-banner";
import { ProjectCollection } from "@/components/portfolio/project-collection";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main id="main-content" className="section-space-bottom">
      <PageBanner title="Projects" />
      <section className="section-space" aria-label="Portfolio projects">
        <div className="site-container">
          <ProjectCollection />
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
