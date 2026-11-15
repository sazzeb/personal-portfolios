import { careerExperience, statistics } from "@/data/experience";
import { GlowCard } from "@/components/ui/glow-card";
import { Reveal } from "@/components/ui/reveal";
import { RollingNumber } from "@/components/ui/rolling-number";
import styles from "./statistics.module.scss";

export function Statistics() {
  return (
    <section
      className={styles.section}
      aria-label="Experience and achievements"
      id="about"
    >
      <div className="site-container">
        <div className={styles.grid}>
          <Reveal>
            <GlowCard className={styles.experience}>
              <div className={styles.years}>
                <p className={styles.number}>
                  <RollingNumber
                    value={careerExperience.years}
                    suffix={careerExperience.suffix}
                  />
                </p>
                <h2>
                  Years Of
                  <br /> experience
                </h2>
              </div>
              <p className={styles.description}>
                {careerExperience.description}
              </p>
            </GlowCard>
          </Reveal>
          <div className={styles.statistics}>
            {statistics.map(({ value, suffix, label }, index) => (
              <Reveal key={label} order={index + 1}>
                <GlowCard className={styles.statistic}>
                  <p className={styles.value}>
                    <RollingNumber value={value} suffix={suffix} />
                  </p>
                  <p className={styles.label}>{label}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
