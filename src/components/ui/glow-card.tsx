"use client";

import type { HTMLAttributes, PointerEvent } from "react";
import { classNames } from "@/lib/class-names";
import styles from "./glow-card.module.scss";

export function GlowCard({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  function updateHighlight(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    element.style.setProperty(
      "--pointer-x",
      `${event.clientX - bounds.left}px`,
    );
    element.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <div
      {...props}
      className={classNames(styles.card, className)}
      onPointerMove={updateHighlight}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
}
