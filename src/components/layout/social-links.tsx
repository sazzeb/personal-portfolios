import styles from "./social-links.module.scss";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    path:
      "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 " +
      "0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 " +
      "3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 " +
      "2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    path:
      "M6 8H2v14h4V8ZM4 2a2.3 2.3 0 1 0 0 4.6A2.3 2.3 0 0 0 4 2ZM22 " +
      "13.7C22 9.5 19.7 8 17 8a4.2 4.2 0 0 0-3.8 2.1V8.3H9.3V22h4v-7.6" +
      "c0-2 1-3 2.5-3 1.6 0 2.2 1.1 2.2 3V22h4v-8.3Z",
  },
  {
    name: "Twitter",
    href: "https://x.com/",
    path:
      "M23 4.7a9 9 0 0 1-2.6.7 4.6 4.6 0 0 0 2-2.5 9.2 9.2 0 0 1-2.9 " +
      "1.1 4.6 4.6 0 0 0-7.9 4.2A13 13 0 0 1 2.2 3.4a4.6 4.6 0 0 0 " +
      "1.4 6.1 4.5 4.5 0 0 1-2.1-.6 4.6 4.6 0 0 0 3.7 4.6 4.6 4.6 0 0 " +
      "1-2.1.1 4.6 4.6 0 0 0 4.3 3.2A9.3 9.3 0 0 1 1 18.7a13 13 0 0 " +
      "0 20-11c0-.2 0-.4 0-.6a9.3 9.3 0 0 0 2-2.4Z",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    path:
      "M14 22V13h3l.5-3H14V8c0-.9.3-1.5 1.5-1.5H18V3.2A24 24 0 0 " +
      "0 15 3c-3 0-5 1.8-5 5v2H7v3h3v9h4Z",
  },
] as const;

export function SocialLinks() {
  return (
    <div className={styles.links} aria-label="Social profiles">
      {socialLinks.map(({ name, href, path }) => (
        <a
          key={name}
          href={href}
          aria-label={name}
          target="_blank"
          rel="noreferrer"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d={path} fill="currentColor" />
          </svg>
        </a>
      ))}
    </div>
  );
}
