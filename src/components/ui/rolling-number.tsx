import type { CSSProperties } from "react";
import styles from "./rolling-number.module.scss";

interface RollingNumberProps {
  value: number;
  suffix?: string;
}

export function RollingNumber({ value, suffix = "" }: RollingNumberProps) {
  return (
    <span
      className={styles.number}
      data-counter
      aria-label={`${value}${suffix}`}
    >
      <span className={styles.digits} aria-hidden="true">
        {String(value)
          .split("")
          .map((digit, index) => (
            <span key={index} className={styles.slot}>
              <span
                className={styles.track}
                style={{ "--end-digit": Number(digit) + 10 } as CSSProperties}
              >
                {Array.from({ length: Number(digit) + 11 }, (_, step) => (
                  <span key={step}>{step % 10}</span>
                ))}
              </span>
            </span>
          ))}
      </span>
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}
