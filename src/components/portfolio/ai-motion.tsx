"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function AiMotion({
  children,
  order = 0,
  className,
}: {
  children: ReactNode;
  order?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={
        reducedMotion
          ? undefined
          : {
              opacity: [0.35, 1],
              y: [40, 0],
              filter: ["blur(6px)", "blur(0px)"],
            }
      }
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.75,
        delay: Math.min(order * 0.06, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
