"use client";

import { AlignRight } from "lucide-react";
import { classNames } from "@/lib/class-names";
import { useDialog } from "@/hooks/use-dialog";
import { useScrollThreshold } from "@/hooks/use-scroll-threshold";
import { DesktopNavigation } from "./desktop-navigation";
import { Logo } from "./logo";
import { Sidebar } from "./sidebar";
import { SocialLinks } from "./social-links";
import styles from "./site-header.module.scss";

export function SiteHeader() {
  const isSticky = useScrollThreshold(150);
  const { dialogRef, openDialog, closeDialog } = useDialog();

  return (
    <>
      <header className={classNames(styles.header, isSticky && styles.sticky)}>
        <div className={classNames("site-container", styles.container)}>
          <Logo />
          <DesktopNavigation />
          <div className={styles.actions}>
            <div className={styles.social}>
              <SocialLinks />
            </div>
            <button
              className={styles.menuButton}
              onClick={openDialog}
              aria-label="Open menu"
            >
              <AlignRight size={23} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>
      <Sidebar dialogRef={dialogRef} onClose={closeDialog} />
    </>
  );
}
