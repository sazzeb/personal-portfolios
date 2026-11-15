import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageBanner } from "@/components/ui/page-banner";
import { ContactSection } from "@/components/sections/contact-section";
import { GlowCard } from "@/components/ui/glow-card";

export const metadata: Metadata = { title: "Contact" };

const contactMethods = [
  {
    icon: MapPin,
    title: "Address",
    label: "3891 Ranchview Dr. Richardson",
    href: undefined,
  },
  {
    icon: Mail,
    title: "E-mail",
    label: "example@gmail.com",
    href: "mailto:example@gmail.com",
  },
  {
    icon: Phone,
    title: "Call Me",
    label: "01245789321",
    href: "tel:01245789321",
  },
] as const;

export default function ContactPage() {
  return (
    <main id="main-content" className="section-space-bottom">
      <PageBanner title="Contact" />
      <section
        className="site-container section-space"
        aria-label="Contact information"
      >
        <div className="grid gap-[30px] md:grid-cols-3">
          {contactMethods.map(({ icon: Icon, title, label, href }) => (
            <GlowCard key={title} className="px-5 py-[50px] text-center">
              <Icon size={32} className="mx-auto mb-6 text-accent" />
              <h2 className="mb-4 font-display text-[32px] font-bold">
                {title}
              </h2>
              {href ? <a href={href}>{label}</a> : <p>{label}</p>}
            </GlowCard>
          ))}
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
