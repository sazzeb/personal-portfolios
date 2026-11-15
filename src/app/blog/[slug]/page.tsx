import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { articles } from "@/data/portfolio";
import { PageBanner } from "@/components/ui/page-banner";
import { DetailLayout } from "@/components/portfolio/detail-layout";
import { DetailLoading } from "@/components/portfolio/detail-loading";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title:
      articles.find((article) => article.slug === slug)?.title ?? "Article",
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <main id="main-content">
      <PageBanner title="Blog Details" />
      <Suspense fallback={<DetailLoading label="Loading article…" />}>
        <ArticleDetails params={params} />
      </Suspense>
    </main>
  );
}

async function ArticleDetails({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <DetailLayout
      title={article.title}
      image={article.image}
      imageAlt={article.imageAlt}
      category="Design & Creativity"
    >
      <p className="text-accent">
        {article.author} · {article.date}
      </p>
      <p>
        A personal portfolio is a collection of your work, achievements, and
        skills. More than a gallery, it is a chance to tell the story behind
        each project and share the thinking that makes your approach your own.
      </p>
      <h3>Make every project tell a story</h3>
      <p>
        Start with the challenge, describe your process, and show the result.
        Choose work that reflects what you enjoy creating, and give each example
        enough space for the details to speak.
      </p>
      <h3>Bring your ideas to life</h3>
      <p>
        Clear typography, thoughtful imagery, and natural interactions help
        people explore your work. A memorable portfolio makes it easy to
        understand what you do and take the next step together.
      </p>
    </DetailLayout>
  );
}
