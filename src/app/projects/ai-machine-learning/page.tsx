import type { Metadata } from "next";
import { AiProjectDetails } from "@/components/portfolio/ai-project-details";
import { PageBanner } from "@/components/ui/page-banner";

export const metadata: Metadata = {
  title: "AI (Machine Learning) Engineer Project",
  description:
    "Explore AI, machine learning, recommendation, image processing, and information retrieval projects by Eko Samuel, with outcomes and source code.",
};

export default function AiProjectsPage() {
  return (
    <main id="main-content">
      <PageBanner title="AI & Machine Learning Projects" />
      <AiProjectDetails />
    </main>
  );
}
