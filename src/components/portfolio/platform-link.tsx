import { ExternalLink } from "lucide-react";
import styles from "./platform-link.module.scss";

interface PlatformLinkProps {
  href: string;
  label: string;
}

export function PlatformLink({ href, label }: PlatformLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      {label}
      <ExternalLink size={18} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
