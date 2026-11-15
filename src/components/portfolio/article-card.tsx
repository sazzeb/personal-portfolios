import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight, UserRound } from "lucide-react";
import type { Article } from "@/types/portfolio";
import { sammyImage } from "@/lib/assets";
import styles from "./article-card.module.scss";

export function ArticleCard({ article }: { article: Article }) {
  const href = `/blog/${article.slug}`;

  return (
    <article className={styles.card}>
      <div className={styles.image}>
        <Link href={href} aria-label={`Read ${article.title}`}>
          <Image
            src={sammyImage(article.image)}
            width={410}
            height={294}
            unoptimized
            alt={article.imageAlt}
            sizes="(max-width: 575px) 90vw, (max-width: 991px) 45vw, 30vw"
          />
        </Link>
        <ul className={styles.metadata}>
          <li>
            <UserRound size={14} aria-hidden="true" />
            {article.author}
          </li>
          <li>
            <CalendarDays size={14} aria-hidden="true" />
            {article.date}
          </li>
        </ul>
      </div>
      <div className={styles.content}>
        <h3>
          <Link href={href}>{article.title}</Link>
        </h3>
        <Link href={href} className={styles.readMore}>
          Read More <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
