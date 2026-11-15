import { AiCaseStudyRoute, getAiCaseStudyMetadata } from "@/components/portfolio/ai-case-study-route";

const projectSlug = "tennis-performance";

export const metadata = getAiCaseStudyMetadata(projectSlug);

export default function ProjectPage() {
  return <AiCaseStudyRoute slug={projectSlug} />;
}
