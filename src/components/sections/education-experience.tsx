import Image from "next/image";
import { education, experience } from "@/data/experience";
import { sammyImages } from "@/data/sammy-images";
import { sammyImage } from "@/lib/assets";
import { GlowCard } from "@/components/ui/glow-card";
import { Reveal } from "@/components/ui/reveal";
import { LineHeading, SectionHeading } from "@/components/ui/section-heading";
import styles from "./education-experience.module.scss";

export function EducationExperience() {
  return (
    <section className="section-space" id="experience">
      <div className="site-container">
        <SectionHeading
          eyebrow="Education & Experience"
          description="An engineering foundation, enterprise software experience since 2016, and ongoing graduate study in artificial intelligence."
        >
          Engineering Experience
          <br /> with an AI Focus
        </SectionHeading>
        <LineHeading>Education</LineHeading>
        <div className={styles.education}>
          {education.map(({ title, years, description }, index) => (
            <Reveal key={`${title}-${index}`} order={index + 1}>
              <GlowCard className={styles.card}>
                <h3>{title}</h3>
                <p className={styles.years}>{years}</p>
                <p className={styles.description}>{description}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
        <div className={styles.experiences}>
          <div className={styles.history}>
            <LineHeading>Experiences</LineHeading>
            {experience.map(({ company, role, years, description }, index) => (
              <Reveal key={company} order={index + 1} className={styles.job}>
                <p className={styles.eyebrow}>{years}</p>
                <h3>{company}</h3>
                <p className={styles.role}>{role}</p>
                <p className={styles.jobDescription}>{description}</p>
              </Reveal>
            ))}
          </div>
          <Reveal variant="zoom" className={styles.image}>
            <Image
              src={sammyImage(sammyImages.experience.path)}
              width={sammyImages.experience.width}
              height={sammyImages.experience.height}
              unoptimized
              alt={sammyImages.experience.alt}
              sizes="(max-width: 991px) 90vw, 45vw"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
