import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "./reveal";
import styles from "./page-banner.module.scss";

export function PageBanner({ title }: { title: string }) {
  return (
    <section className={styles.banner}>
      <div className="site-container">
        <Reveal>
          <h1>{title}</h1>
        </Reveal>
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
      </div>
    </section>
  );
}
