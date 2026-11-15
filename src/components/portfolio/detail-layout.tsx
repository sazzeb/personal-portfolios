import Image from "next/image";
import type { ReactNode } from "react";
import { sammy } from "@/config/sammy";
import { sammyImage } from "@/lib/assets";
import { ButtonLink } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { Reveal } from "@/components/ui/reveal";
import styles from "./detail-layout.module.scss";

interface DetailLayoutProps {
  title: string;
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  category: string;
  detailsTitle?: string;
  facts?: readonly { label: string; value: string }[];
  children: ReactNode;
}

export function DetailLayout({
  title,
  image,
  imageAlt,
  imageWidth = 1290,
  imageHeight = 720,
  category,
  detailsTitle = "Project Details",
  facts,
  children,
}: DetailLayoutProps) {
  return (
    <section className="section-space-both">
      <div className="site-container">
        <Reveal variant="zoom" className={styles.heroImage}>
          <Image
            src={sammyImage(image)}
            width={imageWidth}
            height={imageHeight}
            alt={imageAlt}
            sizes="90vw"
            preload
          />
        </Reveal>
        <div className={styles.grid}>
          <article className={styles.article}>
            <Reveal>
              <h2>{title}</h2>
            </Reveal>
            {children}
          </article>
          <aside>
            <GlowCard className={styles.aside}>
              <h2>{detailsTitle}</h2>
              <dl>
                {(
                  facts ?? [
                    { label: "Name", value: title },
                    { label: "Category", value: category },
                    { label: "Designer", value: sammy.name },
                  ]
                ).map(({ label, value }) => (
                  <div key={label}>
                    <dt>{label}:</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <ButtonLink href="/contact">Let’s Talk</ButtonLink>
            </GlowCard>
          </aside>
        </div>
      </div>
    </section>
  );
}
