import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { projects } from "@/data/portfolio";
import { PageBanner } from "@/components/ui/page-banner";
import { DetailLayout } from "@/components/portfolio/detail-layout";
import { DetailLoading } from "@/components/portfolio/detail-loading";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title:
      projects.find((project) => project.slug === slug)?.title ?? "Project",
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <main id="main-content">
      <PageBanner title="Project Details" />
      <Suspense fallback={<DetailLoading label="Loading project…" />}>
        <ProjectDetails params={params} />
      </Suspense>
    </main>
  );
}

async function ProjectDetails({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <DetailLayout
      title={project.title}
      image={project.image}
      imageAlt={project.imageAlt}
      category={project.category}
    >
      <p>
        Thoughtful design starts with understanding the people who will use it.
        This portfolio project brings together research, visual identity, and
        digital craftsmanship in one consistent experience.
      </p>
      <ul>
        {["Ui/visual Design", "App Development", "Software Developer"].map(
          (item) => (
            <li key={item}>
              <CheckCircle2 size={20} />
              {item}
            </li>
          ),
        )}
      </ul>
      <h3>Elevate Your Business with IT Solutions</h3>
      <p>
        From the first concept to the final details, every element has a clear
        purpose. Responsive layouts and considered interactions make the
        experience feel natural on every screen.
      </p>
    </DetailLayout>
  );
}
