"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { navigation } from "@/data/navigation";
import styles from "./site-header.module.scss";

export function DesktopNavigation() {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  return (
    <nav className={styles.desktopNavigation} aria-label="Main navigation">
      <ul className={styles.navigationList}>
        {navigation.map(({ label, href, children }) => (
          <li
            key={label}
            className={styles.navigationItem}
            onMouseEnter={() => setExpandedMenu(label)}
            onMouseLeave={() => setExpandedMenu(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setExpandedMenu(null);
              }
            }}
          >
            <div className={styles.navigationLabel}>
              <Link href={href}>{label}</Link>
              {children ? (
                <button
                  aria-label={`Toggle ${label} menu`}
                  aria-expanded={expandedMenu === label}
                  aria-controls={`navigation-${label}`}
                  onClick={() => {
                    setExpandedMenu(expandedMenu === label ? null : label);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setExpandedMenu(null);
                  }}
                >
                  <ChevronDown size={12} />
                </button>
              ) : null}
            </div>
            {children ? (
              <ul
                id={`navigation-${label}`}
                className={styles.dropdown}
                data-open={expandedMenu === label}
              >
                {children.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setExpandedMenu(null)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
