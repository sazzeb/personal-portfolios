"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, X } from "lucide-react";
import { sammy } from "@/config/sammy";
import type { RefObject } from "react";
import { navigation } from "@/data/navigation";
import { sammyImage } from "@/lib/assets";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";
import styles from "./sidebar.module.scss";

interface SidebarProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
}

export function Sidebar({ dialogRef, onClose }: SidebarProps) {
  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Navigation and contact information"
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right)
          onClose();
      }}
    >
      <div className={styles.top}>
        <Logo />
        <button
          className={styles.close}
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>
      <nav className={styles.mobileNavigation} aria-label="Mobile navigation">
        {navigation.map(({ label, href, children }) => (
          <div key={label} className={styles.mobileItem}>
            <Link href={href} onClick={onClose}>
              {label}
            </Link>
            {children ? (
              <details>
                <summary aria-label={`Show ${label} pages`}>+</summary>
                <ul>
                  {children.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} onClick={onClose}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </div>
        ))}
      </nav>
      <div className={styles.desktopIntroduction}>
        <Image
          src={sammyImage("sam/05_coding_workstation_background.png")}
          width={1024}
          height={1536}
          alt="Eko Samuel working at his software development workstation"
          sizes="(min-width: 1200px) 380px, 90vw"
        />
        <h2>
          AI (Machine Learning) Engineer
        </h2>
        <p>
          I’m Eko Samuel, a software engineer with over ten years of experience
          building full-stack applications, backend systems, and cloud
          infrastructure. My work combines AI and machine learning with
          practical engineering to solve real-world problems.
        </p>
      </div>
      <ul className={styles.contact}>
        <li>
          <Mail size={22} />
          <div>
            <span>Mail Us</span>
            <a href={`mailto:${sammy.contact.email}`}>{sammy.contact.email}</a>
          </div>
        </li>
        <li>
          <MapPin size={22} />
          <div>
            <span>My Address</span>
            <p>{sammy.contact.address}</p>
          </div>
        </li>
      </ul>
      <p className={styles.socialLabel}>Connect with Eko Samuel</p>
      <SocialLinks />
    </dialog>
  );
}
