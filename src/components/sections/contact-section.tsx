import { ContactForm } from "@/components/contact/contact-form";
import { GlowCard } from "@/components/ui/glow-card";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./contact-section.module.scss";

export function ContactSection() {
  return (
    <section className="section-space" id="contact">
      <div className="site-container">
        <GlowCard className={styles.card}>
          <div className={styles.grid}>
            <SectionHeading
              eyebrow="Get in touch"
              align="left"
              className={styles.heading}
              description={
                "ished fact that a reader will be distrol acted bioiiy desig " +
                "ished fact that a reader will acted ished fact that a reader " +
                "will be distrol acted"
              }
            >
              Elevate your brand with Me
            </SectionHeading>
            <ContactForm />
          </div>
        </GlowCard>
      </div>
    </section>
  );
}
