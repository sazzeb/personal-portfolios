import { AiCaseStudyRoute, getAiCaseStudyMetadata } from "@/components/portfolio/ai-case-study-route";

const projectSlug = "automated-essay-grading";

export const metadata = getAiCaseStudyMetadata(projectSlug);

export default function ProjectPage() {
  return <AiCaseStudyRoute slug={projectSlug} />;
}
