import Link from "next/link";
import { sammy } from "@/config/sammy";
import styles from "./sammy-logo.module.scss";

export function Logo() {
  return (
    <Link href="/" aria-label={`${sammy.name} home`} className={styles.logo}>
      <svg viewBox="0 0 32 40" fill="none" aria-hidden="true">
        <path
          d="M26 7H12a7 7 0 0 0 0 14h8a6 6 0 0 1 0 12H6"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
      <span>{sammy.name}</span>
    </Link>
  );
}
