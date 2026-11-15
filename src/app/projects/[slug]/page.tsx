import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { projects } from "@/data/portfolio";
import { experienceProjects } from "@/data/project-experiences";
import { sammy } from "@/config/sammy";
import { PageBanner } from "@/components/ui/page-banner";
import { DetailLayout } from "@/components/portfolio/detail-layout";
import { DetailLoading } from "@/components/portfolio/detail-loading";
import { PlatformLink } from "@/components/portfolio/platform-link";
import { ProjectBanner } from "@/components/portfolio/project-banner";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return experienceProjects.map(({ slug }) => ({ slug }));
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
  const project = experienceProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <DetailLayout
      title={project.title}
      image={project.image}
      imageAlt={project.imageAlt}
      imageWidth={project.imageWidth}
      imageHeight={project.imageHeight}
      category={project.category}
      banner={
        <ProjectBanner
          key={project.slug}
          title={project.title}
          slides={[
            {
              src: project.image,
              alt: project.imageAlt,
              width: project.imageWidth ?? 1290,
              height: project.imageHeight ?? 720,
            },
            ...project.screenshots.map((image, index) => ({
              src: image.path,
              alt: `${project.title} platform view ${index + 2}`,
              width: image.width,
              height: image.height,
            })),
          ]}
        />
      }
      detailsTitle="Experience Details"
      facts={[
        { label: "Company / Platform", value: project.title },
        { label: "Job Title", value: project.role },
        { label: "Period", value: project.period },
        { label: "Engineer", value: sammy.name },
      ]}
      sidebarAction={
        <PlatformLink href={project.platform} label={project.platformLabel} />
      }
    >
      <p className="text-accent">
        {project.role} · {project.period}
      </p>
      <PlatformLink href={project.platform} label={project.platformLabel} />
      <h3>About the Company & Platform</h3>
      <p>{project.companyAbout}</p>
      <h3>My Role & Contribution</h3>
      <p>{project.summary}</p>
      <ul>
        {project.contributions.map((item) => (
          <li key={item}>
            <CheckCircle2 size={20} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <h3>Improvements & Achievements</h3>
      <p>Outcomes reported in my CV for this role:</p>
      <ul>
        {project.achievements.map((item) => (
          <li key={item}>
            <CheckCircle2 size={20} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <h3>Technologies Used</h3>
      <p>{project.technologies}</p>
    </DetailLayout>
  );
}
