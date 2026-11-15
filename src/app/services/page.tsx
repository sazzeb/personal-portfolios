import type { Metadata } from "next";
import { PageBanner } from "@/components/ui/page-banner";
import { ServiceGrid } from "@/components/sections/service-grid";
import { LatestServices } from "@/components/sections/latest-services";
import { Expertise } from "@/components/sections/expertise";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <main id="main-content" className="section-space-bottom">
      <PageBanner title="Services" />
      <ServiceGrid />
      <LatestServices />
      <Expertise />
      <ContactSection />
    </main>
  );
}
