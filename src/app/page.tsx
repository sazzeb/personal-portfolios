import { Hero } from "@/components/sections/hero";
import { ServiceGrid } from "@/components/sections/service-grid";
import { Statistics } from "@/components/sections/statistics";
import { Skills } from "@/components/sections/skills";
import { LatestServices } from "@/components/sections/latest-services";
import { EducationExperience } from "@/components/sections/education-experience";
import { ClientLogos } from "@/components/sections/client-logos";
import { LatestPortfolio } from "@/components/sections/latest-portfolio";
import { Expertise } from "@/components/sections/expertise";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactSection } from "@/components/sections/contact-section";
import { BlogSection } from "@/components/sections/blog-section";

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <ServiceGrid />
      <Statistics />
      <Skills />
      <LatestServices />
      <EducationExperience />
      <ClientLogos />
      <LatestPortfolio />
      <Expertise />
      <TestimonialsSection />
      <ContactSection />
      <BlogSection />
    </main>
  );
}
