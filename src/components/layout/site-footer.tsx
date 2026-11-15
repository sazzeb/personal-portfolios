import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { sammy } from "@/config/sammy";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { SocialLinks } from "./social-links";
import styles from "./site-footer.module.scss";

const footerLinks = [
  { label: "About Me", href: "/about" },
  { label: "Service", href: "/services" },
  { label: "Contact Me", href: "/contact" },
  { label: "Blog Post", href: "/blog" },
  { label: "Pricing", href: "/contact?subject=Pricing" },
] as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="site-container">
        <div className={styles.main}>
          <div className={styles.introduction}>
            <Logo />
            <p className={styles.tagline}>
              <strong>Get Ready</strong> To Create Great
            </p>
            <NewsletterForm />
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
                <a href="mailto:example@gmail.com">example@gmail.com</a>
              </li>
              <li>
                <span className={styles.contactIcon}>
                  <MapPin size={16} />
                </span>
                <span>3891 Ranchview Dr. Richardson</span>
              </li>
              <li>
                <span className={styles.contactIcon}>
                  <Phone size={16} />
                </span>
                <a href="tel:01245789321">01245789321</a>
              </li>
            </ul>
            <SocialLinks />
          </div>
        </div>
        <div className={styles.copyright}>
          <p>
            ©<Link href="/">{sammy.name}</Link> 2026 | All Rights Reserved
          </p>
          <ul>
            <li>
              <Link href="/terms">Trams &amp; Condition</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
