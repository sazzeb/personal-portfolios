import type { Metadata } from "next";
import { Suspense } from "react";
import { PageBanner } from "@/components/ui/page-banner";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main id="main-content" className="section-space-bottom">
      <PageBanner title="Projects" />
      <section className="section-space" aria-label="Portfolio projects">
        <div className="site-container">
          <Suspense fallback={<p>Loading projects…</p>}>
            <ProjectGallery />
          </Suspense>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
