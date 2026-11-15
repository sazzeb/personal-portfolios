import styles from "./social-links.module.scss";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/samuel-eko/",
    path:
      "M6 8H2v14h4V8ZM4 2a2.3 2.3 0 1 0 0 4.6A2.3 2.3 0 0 0 4 2ZM22 " +
      "13.7C22 9.5 19.7 8 17 8a4.2 4.2 0 0 0-3.8 2.1V8.3H9.3V22h4v-7.6" +
      "c0-2 1-3 2.5-3 1.6 0 2.2 1.1 2.2 3V22h4v-8.3Z",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/ekosamuel7/",
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
