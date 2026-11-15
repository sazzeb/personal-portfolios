"use client";

import Link from "next/link";
import { BrainCircuit, ChevronRight, Cloud, Code2 } from "lucide-react";
import { useRef } from "react";
import { expertise } from "@/data/services";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./expertise.module.scss";

const icons = { ai: BrainCircuit, code: Code2, cloud: Cloud };

export function Expertise() {
  const listRef = useRef<HTMLDivElement>(null);

  function moveHighlight(element: HTMLElement | null) {
    const list = listRef.current;
    if (!list || !element) return;
    list.style.setProperty("--highlight-top", `${element.offsetTop}px`);
    list.style.setProperty("--highlight-height", `${element.offsetHeight}px`);
    list.dataset.highlight = "true";
  }

  return (
    <section className="section-space" aria-label="Engineering expertise">
      <div className="site-container">
        <SectionHeading eyebrow="Engineering Expertise" align="left">
          AI (Machine Learning) Engineer
          <br /> From Models to Applications
        </SectionHeading>
        <div
          className={styles.list}
          ref={listRef}
          onMouseLeave={() => {
            if (listRef.current) listRef.current.dataset.highlight = "false";
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              event.currentTarget.dataset.highlight = "false";
            }
          }}
        >
          <div className={styles.highlight} aria-hidden="true" />
          {expertise.map(({ title, count, description, icon, slug }, index) => {
            const Icon = icons[icon];
            return (
              <Reveal key={icon} order={index + 1}>
                <article
                  className={styles.row}
                  onMouseEnter={(event) =>
                    moveHighlight(event.currentTarget.parentElement)
                  }
                  onFocus={(event) =>
                    moveHighlight(event.currentTarget.parentElement)
                  }
                >
                  <span className={styles.icon}>
                    <Icon size={34} strokeWidth={1.3} />
                  </span>
                  <div className={styles.title}>
                    <h3>{title}</h3>
                    <p>{count}</p>
                  </div>
                  <p className={styles.description}>{description}</p>
                  <Link className={styles.readMore} href={`/services/${slug}`}>
                    Read More <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
