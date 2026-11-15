import type { CSSProperties, HTMLAttributes } from "react";

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "fade" | "zoom";
  order?: number;
}

export function Reveal({
  children,
  variant = "fade",
  order = 1,
  style,
  ...props
}: RevealProps) {
  return (
    <div
      {...props}
      data-reveal={variant}
      style={{ "--reveal-order": order, ...style } as CSSProperties}
    >
      {children}
    </div>
  );
}
