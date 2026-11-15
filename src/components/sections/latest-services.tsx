import Image from "next/image";
import { sectionDescription, serviceHighlights } from "@/data/services";
import { sammyImages } from "@/data/sammy-images";
import { sammyImage } from "@/lib/assets";
import { GlowCard } from "@/components/ui/glow-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./latest-services.module.scss";

export function LatestServices() {
  return (
    <section className="section-space" id="services">
      <div className="site-container">
        <SectionHeading
          eyebrow="AI & Engineering Expertise"
          description={sectionDescription}
        >
          <span className={styles.highlight}>
            AI (Machine Learning) Engineer
          </span>
          <br /> Building Intelligent Solutions
        </SectionHeading>
        <div className={styles.grid}>
          <div className={styles.cards}>
            {serviceHighlights.map(({ title, description }, index) => (
              <Reveal key={title} order={index + 1}>
                <GlowCard
                  className={`${styles.card} ${index === 0 ? styles.featured : ""}`}
                >
                  <h3>
                    <span>0{index + 1}.</span>
                    {title}
                  </h3>
                  <p>{description}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
          <Reveal variant="zoom" className={styles.portrait}>
            <Image
              src={sammyImage(sammyImages.services.path)}
              width={sammyImages.services.width}
              height={sammyImages.services.height}
              unoptimized
              alt={sammyImages.services.alt}
              sizes="(max-width: 991px) 90vw, 45vw"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
