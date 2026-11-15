import { articles } from "@/data/portfolio";
import { ArticleCard } from "@/components/portfolio/article-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function BlogSection({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section
      className="section-space-both"
      id="journal"
      aria-label="Blog and news"
    >
      <div className="site-container">
        {showHeading ? (
          <SectionHeading eyebrow="Blog and news" className="!mb-[60px]">
            Elevating Personal Branding the
            <br /> through Powerful Portfolios
          </SectionHeading>
        ) : null}
        <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.slug} order={index + 1}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
