import type { Metadata } from "next";
import { aiProjects } from "@/data/ai-projects";
import { AiCaseStudyPage } from "./ai-case-study-page";

function getProject(slug: string) {
  const project = aiProjects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Unknown AI case study: ${slug}`);
  return project;
}

export function getAiCaseStudyMetadata(slug: string): Metadata {
  const project = getProject(slug);
  return { title: project.title, description: project.description };
}

export function AiCaseStudyRoute({ slug }: { slug: string }) {
  return (
    <main id="main-content">
      <AiCaseStudyPage project={getProject(slug)} />
    </main>
  );
}
