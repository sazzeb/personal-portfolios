import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "@/lib/class-names";
import styles from "./button.module.scss";

interface ButtonContentProps {
  children: ReactNode;
}

function ButtonContent({ children }: ButtonContentProps) {
  return (
    <span className={styles.content}>
      <span>{children}</span>
      <span className={styles.arrows} aria-hidden="true">
        <ArrowRight size={16} className={styles.firstArrow} />
        <ArrowRight size={16} className={styles.secondArrow} />
      </span>
    </span>
  );
}

interface ButtonLinkProps extends ButtonContentProps {
  href: string;
  className?: string;
}

export function ButtonLink({ href, children, className }: ButtonLinkProps) {
  return (
    <Link href={href} className={classNames(styles.button, className)}>
      <ButtonContent>{children}</ButtonContent>
    </Link>
  );
}

export function Button({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={classNames(styles.button, className)}>
      <ButtonContent>{children}</ButtonContent>
    </button>
  );
}
