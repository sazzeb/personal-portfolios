import type { Metadata } from "next";
import { PageBanner } from "@/components/ui/page-banner";
import { Statistics } from "@/components/sections/statistics";
import { Skills } from "@/components/sections/skills";
import { EducationExperience } from "@/components/sections/education-experience";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = { title: "About Me" };

export default function AboutPage() {
  return (
    <main id="main-content" className="section-space-bottom">
      <PageBanner title="About Me" />
      <div className="section-space">
        <Statistics />
      </div>
      <Skills />
      <EducationExperience />
      <ContactSection />
    </main>
  );
}
