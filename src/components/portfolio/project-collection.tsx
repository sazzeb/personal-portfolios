import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/portfolio";
import { aiProjects } from "@/data/ai-projects";
import { ProjectCard } from "./project-card";
import { Reveal } from "@/components/ui/reveal";
import styles from "./project-collection.module.scss";

export function ProjectCollection({ layout = "default" }: { layout?: string }) {
  const featured = projects.find((project) => project.deferred);
  const employers = projects.filter((project) => !project.deferred);

  return (
    <div className={styles.collection}>
      <h2 className={styles.employerHeading}>
        Professional Experience Projects
      </h2>
      {featured ? (
        <Reveal>
          <article className={styles.featured} id="ai-machine-learning-project">
            <div className={styles.featuredCopy}>
              <p className={styles.eyebrow}>
                Featured Project · AI & Machine Learning
              </p>
              <h3>
                <Link
                  className={styles.bannerLink}
                  href={`/projects/${featured.slug}`}
                >
                  {featured.title}
                </Link>
              </h3>
              <p className={styles.summary}>
                From sensor data to predictive insights. Exploring
                aircraft-engine remaining useful life with deep learning and the
                NASA C-MAPSS dataset.
              </p>
              <ul className={styles.tags} aria-label="Featured project methods">
                <li>PyTorch</li>
                <li>MLP · LSTM · TCN</li>
                <li>Predictive Maintenance</li>
              </ul>
              <p className={styles.note}>
                Explore {aiProjects.length} projects with outcomes and source code.
              </p>
              <span className={styles.detailsLink} aria-hidden="true">
                View Project Details →
              </span>
            </div>
            <figure className={styles.result}>
              <Image
                src="/images/project/ai-previews/rul-example.svg"
                width={800}
                height={480}
                alt="Illustrative machine learning result: predicted engine remaining useful life compared with a reference curve"
                sizes="(max-width: 991px) 90vw, 50vw"
                unoptimized
              />
              <figcaption>
                Illustrative result preview · Not measured project results
              </figcaption>
            </figure>
          </article>
        </Reveal>
      ) : null}
      <div>
        <div className={styles.employers} data-layout={layout}>
          {employers.map((project, index) => (
            <Reveal key={project.slug} order={index + 1}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
