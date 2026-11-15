import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { sammy } from "@/config/sammy";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";
import styles from "./site-footer.module.scss";

const footerLinks = [
  { label: "About Me", href: "/about" },
  { label: "Service", href: "/services" },
  { label: "Contact Me", href: "/contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="site-container">
        <div className={styles.main}>
          <div className={styles.introduction}>
            <Logo />
            <p className={styles.tagline}>
              <strong>Let’s Build</strong> Intelligent Solutions
            </p>
            <p className={styles.profile}>
              AI &amp; machine learning, full-stack development, and cloud
              engineering by Eko Samuel.
            </p>
            <a className={styles.emailLink} href={`mailto:${sammy.contact.email}`}>
              {sammy.contact.email} <Mail size={18} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.quickLinks}>
            <h2>Quick Link</h2>
            <ul>
              {footerLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.contact}>
            <h2>Contact</h2>
            <ul>
              <li>
                <span className={styles.contactIcon}>
                  <Mail size={16} />
                </span>
                <a href={`mailto:${sammy.contact.email}`}>{sammy.contact.email}</a>
              </li>
              <li>
                <span className={styles.contactIcon}>
                  <MapPin size={16} />
                </span>
                <span>{sammy.contact.address}</span>
              </li>
            </ul>
            <SocialLinks />
          </div>
        </div>
        <div className={styles.copyright}>
          <p>
            ©<Link href="/">{sammy.name}</Link> 2026 | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
