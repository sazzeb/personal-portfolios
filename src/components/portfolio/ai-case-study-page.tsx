import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { AiProject } from "@/data/ai-projects";
import { aiProjects } from "@/data/ai-projects";
import { aiCaseStudies, getAiProjectImages } from "@/data/ai-case-studies";
import { AiMotion } from "./ai-motion";
import { AiResultBanner } from "./ai-result-banner";
import { PlatformLink } from "./platform-link";
import styles from "./ai-case-study-page.module.scss";

export function AiCaseStudyPage({ project }: { project: AiProject }) {
  const study = aiCaseStudies[project.slug];
  const index = aiProjects.findIndex(({ slug }) => slug === project.slug);
  const next = aiProjects[(index + 1) % aiProjects.length];
  const sections = [
    { id: "approach", title: "How the project works", items: study.approach },
    { id: "results", title: "Results & Outcomes", items: project.results },
    {
      id: "importance",
      title: "Why this project matters",
      items: study.importance,
    },
    {
      id: "future",
      title: "Advancing AI & Future Directions",
      items: study.future,
    },
  ];

  return (
    <div className={`site-container ${styles.page}`}>
      <AiMotion>
        <header className={styles.header}>
          <Link className={styles.back} href="/projects/ai-machine-learning">
            <ArrowLeft size={18} /> All AI Projects
          </Link>
          <p className={styles.eyebrow}>
            Case study / {String(index + 1).padStart(2, "0")}
          </p>
          <h1>{project.title}</h1>
          <p className={styles.introduction}>{project.description}</p>
          <ul className={styles.tags} aria-label="Project technologies">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </header>
      </AiMotion>
      <AiMotion>
        <AiResultBanner
          title={project.title}
          images={getAiProjectImages(project)}
        />
      </AiMotion>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <p className={styles.eyebrow}>Inside the project</p>
          <nav aria-label="Case study sections">
            <a href="#overview">Project in detail</a>
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
          <PlatformLink
            href={project.repository}
            label="View Source on GitHub"
          />
        </aside>
        <div className={styles.sections}>
          <AiMotion>
            <section id="overview" className={styles.overview}>
              <p className={styles.eyebrow}>01 / Context & purpose</p>
              <h2>The project in detail</h2>
              {study.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          </AiMotion>
          {sections.map((section, sectionIndex) => (
            <AiMotion key={section.id}>
              <section id={section.id} className={styles.section}>
                <p className={styles.eyebrow}>
                  {String(sectionIndex + 2).padStart(2, "0")} /{" "}
                  {section.id === "future"
                    ? "Potential next steps"
                    : "Engineering perspective"}
                </p>
                <h2>{section.title}</h2>
                {section.id === "future" ? (
                  <p className={styles.futureNote}>
                    Research opportunities and proposed extensions, rather than
                    completed achievements.
                  </p>
                ) : null}
                <ol className={styles.points}>
                  {section.items.map((item, itemIndex) => (
                    <li key={item}>
                      <span aria-hidden="true">
                        {String(itemIndex + 1).padStart(2, "0")}
                      </span>
                      <p>{item}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </AiMotion>
          ))}
        </div>
      </div>
      <AiMotion>
        <Link
          href={`/projects/ai-machine-learning/${next.slug}`}
          className={styles.next}
        >
          <span>Explore the next project</span>
          <strong>{next.title}</strong>
          <ArrowUpRight size={36} aria-hidden="true" />
        </Link>
      </AiMotion>
    </div>
  );
}
