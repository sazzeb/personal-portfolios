import type { CSSProperties } from "react";
import { skillGroups } from "@/data/experience";
import { LineHeading } from "@/components/ui/section-heading";
import styles from "./skills.module.scss";

export function Skills() {
  return (
    <section
      className="section-space"
      aria-label="AI, software, and cloud engineering skills"
    >
      <div className="site-container">
        <div className="grid gap-[30px] lg:grid-cols-2">
          {skillGroups.map(({ title, skills }, groupIndex) => (
            <div
              key={title}
              className={groupIndex === 0 ? styles.featured : undefined}
            >
              <LineHeading>{title}</LineHeading>
              <div className={styles.skills}>
                {skills.map(({ label, detail }, index) => (
                  <div key={label} className={styles.skill}>
                    <p>{label}</p>
                    <p className={styles.detail}>{detail}</p>
                    <div className={styles.track} aria-hidden="true">
                      <div
                        className={styles.fill}
                        data-progress
                        style={
                          {
                            width: "100%",
                            "--progress-duration": `${500 + index * 100}ms`,
                            "--progress-delay": `${300 + index * 100}ms`,
                          } as CSSProperties
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
