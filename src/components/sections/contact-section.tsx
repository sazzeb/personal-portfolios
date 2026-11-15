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
                "Connect with Eko Samuel to discuss AI and machine learning, " +
                "full-stack applications, cloud infrastructure, or backend engineering. " +
                "Share your goals, technical challenges, or collaboration ideas, " +
                "and let’s explore how I can help."
              }
            >
              Let’s Build Intelligent, Reliable Software
            </SectionHeading>
            <ContactForm />
          </div>
        </GlowCard>
      </div>
    </section>
  );
}
