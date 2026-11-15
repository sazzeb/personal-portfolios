import Image from "next/image";
import type { ReactNode } from "react";
import { classNames } from "@/lib/class-names";
import { sammyImage } from "@/lib/assets";
import { Reveal } from "./reveal";
import styles from "./section-heading.module.scss";

interface SectionHeadingProps {
  eyebrow: string;
  children: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  children,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div className={classNames(styles.heading, styles[align], className)}>
      <Reveal>
        <p className={styles.eyebrow}>{eyebrow}</p>
      </Reveal>
      <Reveal order={2}>
        <h2 className={styles.title}>{children}</h2>
      </Reveal>
      {description ? (
        <Reveal order={3}>
          <p className={styles.description}>{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function LineHeading({ children }: { children: ReactNode }) {
  return (
    <Reveal className={styles.lineHeading}>
      <h2>{children}</h2>
      <Image
        src={sammyImage("custom-line/custom-line.png")}
        width={81}
        height={6}
        alt=""
        aria-hidden="true"
      />
    </Reveal>
  );
}
