import { AiCaseStudyRoute, getAiCaseStudyMetadata } from "@/components/portfolio/ai-case-study-route";

const projectSlug = "email-threat-detection";

export const metadata = getAiCaseStudyMetadata(projectSlug);

export default function ProjectPage() {
  return <AiCaseStudyRoute slug={projectSlug} />;
}
