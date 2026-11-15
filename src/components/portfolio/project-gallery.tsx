"use client";

import { useSearchParams } from "next/navigation";
import { projects } from "@/data/portfolio";
import { ProjectCard } from "./project-card";
import { Reveal } from "@/components/ui/reveal";
import styles from "./project-gallery.module.scss";

export function ProjectGallery() {
  const searchParams = useSearchParams();
  const layout = searchParams.get("layout") ?? "default";

  return (
    <div className={styles.gallery} data-layout={layout}>
      {projects.map((project, index) => (
        <Reveal key={project.slug} order={index + 1}>
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </div>
  );
}
