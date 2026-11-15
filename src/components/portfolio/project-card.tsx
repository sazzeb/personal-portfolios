import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { sammyImage } from "@/lib/assets";
import styles from "./project-card.module.scss";

export function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;

  return (
    <article className={styles.card}>
      <Link
        href={href}
        className={styles.imageFrame}
        aria-label={`View ${project.title}`}
      >
        <div className={styles.imageClip}>
          <Image
            src={sammyImage(project.image)}
            width={1939}
            height={1572}
            unoptimized
            alt={project.imageAlt}
            sizes="(max-width: 575px) 90vw, 45vw"
          />
        </div>
      </Link>
      <div className={styles.content}>
        <div>
          <h3>
            <Link href={href}>{project.title}</Link>
          </h3>
          <p>{project.category}</p>
        </div>
        <Link
          href={href}
          className={styles.arrow}
          aria-label={`Explore ${project.title}`}
        >
          <ArrowUpRight
            size={24}
            className={styles.firstArrow}
            aria-hidden="true"
          />
          <ArrowUpRight
            size={24}
            className={styles.secondArrow}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
