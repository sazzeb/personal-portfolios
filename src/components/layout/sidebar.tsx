"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, X } from "lucide-react";
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
          src={sammyImage("logo/man.png")}
          width={340}
          height={196}
          alt="Creative freelancer at work"
        />
        <h2>
          Freelancer delivering exceptional Webflow, and Next.js solutions.
        </h2>
        <p>
          I am a skilled freelancer specializing in Webflow development, Figma
          design, and Next.js projects. I deliver creative, dynamic, and
          user-centric web solutions.
        </p>
      </div>
      <ul className={styles.contact}>
        <li>
          <Phone size={22} />
          <div>
            <span>Call Now</span>
            <a href="tel:+92880098670">+92 (8800) - 98670</a>
          </div>
        </li>
        <li>
          <Mail size={22} />
          <div>
            <span>Mail Us</span>
            <a href="mailto:example@info.com">example@info.com</a>
          </div>
        </li>
        <li>
          <MapPin size={22} />
          <div>
            <span>My Address</span>
            <p>66 Broklyant, New York 3269</p>
          </div>
        </li>
      </ul>
      <p className={styles.socialLabel}>find with me</p>
      <SocialLinks />
    </dialog>
  );
}
