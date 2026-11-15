import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { sammy } from "@/config/sammy";
import { PageBanner } from "@/components/ui/page-banner";
import { ContactSection } from "@/components/sections/contact-section";
import { GlowCard } from "@/components/ui/glow-card";

export const metadata: Metadata = { title: "Contact" };

const contactMethods = [
  {
    icon: MapPin,
    title: "Address",
    label: sammy.contact.address,
    href: undefined,
  },
  {
    icon: Mail,
    title: "E-mail",
    label: sammy.contact.email,
    href: `mailto:${sammy.contact.email}`,
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
        <div className="grid gap-[30px] md:grid-cols-2">
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
