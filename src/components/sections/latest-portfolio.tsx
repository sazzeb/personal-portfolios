import { ProjectCollection } from "@/components/portfolio/project-collection";
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
            eyebrow="Projects & Professional Experience"
            description="Explore my work in tax technology, telecommunications, and industry platforms. AI project details will follow."
            className={styles.heading}
          >
            Engineering Work
            <br /> with Measurable Outcomes
          </SectionHeading>
        ) : null}
        <ProjectCollection />
      </div>
    </section>
  );
}
