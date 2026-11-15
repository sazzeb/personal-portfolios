import { projects } from "@/data/portfolio";
import { sectionDescription } from "@/data/services";
import { ProjectCard } from "@/components/portfolio/project-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./latest-portfolio.module.scss";

export function LatestPortfolio({
  showHeading = true,
}: {
  showHeading?: boolean;
}) {
  return (
    <section
      className="section-space"
      id="portfolio"
      aria-label="Selected projects"
    >
      <div className="site-container">
        {showHeading ? (
          <SectionHeading
            eyebrow="Latest Portfolio"
            description={sectionDescription}
            className={styles.heading}
          >
            Transforming Ideas into
            <br /> Exceptional
          </SectionHeading>
        ) : null}
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <Reveal key={project.slug} order={index + 1}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
