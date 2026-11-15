import Image from "next/image";
import { aiProjects } from "@/data/ai-projects";
import { ButtonLink } from "@/components/ui/button";
import { AiMotion } from "./ai-motion";
import { PlatformLink } from "./platform-link";
import styles from "./ai-project-details.module.scss";

export function AiProjectDetails() {
  return (
    <section className="section-space-both" aria-labelledby="ai-projects-title">
      <div className="site-container">
        <header className={styles.header}>
          <p className="text-accent">Research · Engineering · Applied AI</p>
          <h2 id="ai-projects-title">AI (Machine Learning) Engineer Project</h2>
          <p>
            {aiProjects.length} projects exploring prediction, classification,
            recommendations, image protection, and information retrieval.
            Explore the approach, recorded results, and source code for each
            project.
          </p>
        </header>
        <nav className={styles.navigation} aria-label="AI project list">
          {aiProjects.map((project, index) => (
            <a key={project.slug} href={`#${project.slug}`}>
              {String(index + 1).padStart(2, "0")} ·{" "}
              {project.title.split(" | ")[0]}
            </a>
          ))}
        </nav>
        <div className={styles.projects}>
          {aiProjects.map((project, index) => (
            <AiMotion key={project.slug} order={index}>
              <article
                id={project.slug}
                className={styles.project}
                aria-labelledby={`${project.slug}-title`}
              >
                <div className={styles.copy}>
                  <p className={styles.number}>
                    Project {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 id={`${project.slug}-title`}>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul
                    className={styles.tags}
                    aria-label="Technologies and methods"
                  >
                    {project.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                  <h4>Results & Outcomes</h4>
                  <ul className={styles.results}>
                    {project.results.map((result) => (
                      <li key={result}>{result}</li>
                    ))}
                  </ul>
                  <div className={styles.actions}>
                    <ButtonLink
                      href={`/projects/ai-machine-learning/${project.slug}`}
                    >
                      View More Details
                    </ButtonLink>
                    <PlatformLink
                      href={project.repository}
                      label="View Project on GitHub"
                    />
                  </div>
                </div>
                <figure className={styles.figure}>
                  <a
                    href={`/images/project/ai-results/${project.image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={`/images/project/ai-results/${project.image}`}
                      alt={project.caption}
                      width={project.imageWidth}
                      height={project.imageHeight}
                      sizes="(max-width: 991px) 90vw, 45vw"
                      unoptimized
                    />
                    <span className="sr-only">
                      Open full-size result image (opens in a new tab)
                    </span>
                  </a>
                  <figcaption>{project.caption}</figcaption>
                </figure>
              </article>
            </AiMotion>
          ))}
        </div>
      </div>
    </section>
  );
}
