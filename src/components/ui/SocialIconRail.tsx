import type { SocialLink } from "@/data/portfolio";
import { portfolioData } from "@/data/portfolio";
import styles from "./SocialIconRail.module.css";

type SocialIconRailProps = {
  links?: readonly SocialLink[];
  className?: string;
  lineBeforeClassName?: string;
  lineAfterClassName?: string;
  label?: string;
};

function SocialIcon({ platform }: Pick<SocialLink, "platform">) {
  if (platform === "instagram") {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="11.25" fill="currentColor" />
        <rect className={styles.iconCutoutStroke} x="6.25" y="6.25" width="11.5" height="11.5" rx="3.2" />
        <circle className={styles.iconCutoutStroke} cx="12" cy="12" r="2.85" />
        <circle className={styles.iconCutoutFill} cx="16.05" cy="7.95" r="0.85" />
      </svg>
    );
  }

  if (platform === "linkedin") {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="11.25" />
        <path className={styles.iconCutoutFill} d="M7.15 9.55h2.05v7H7.15v-7Zm1.03-3.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Zm2.55 3.3h1.97v.96h.03c.28-.52.95-1.13 2.07-1.13 2.21 0 2.62 1.46 2.62 3.35v3.82h-2.05v-3.39c0-.81-.01-1.85-1.13-1.85-1.13 0-1.3.88-1.3 1.79v3.45h-2.21v-7Z" />
      </svg>
    );
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 .7C5.65.7.5 5.97.5 12.47c0 5.2 3.3 9.61 7.86 11.17.58.11.79-.25.79-.57v-2.22c-3.2.71-3.88-1.39-3.88-1.39-.52-1.36-1.28-1.72-1.28-1.72-1.05-.73.08-.72.08-.72 1.16.09 1.77 1.22 1.77 1.22 1.03 1.81 2.7 1.29 3.36.98.1-.77.4-1.29.73-1.59-2.56-.3-5.25-1.31-5.25-5.82 0-1.29.45-2.34 1.18-3.17-.12-.3-.51-1.5.11-3.12 0 0 .97-.32 3.16 1.21A10.7 10.7 0 0 1 12 6.35c.98 0 1.95.14 2.87.4 2.19-1.53 3.15-1.21 3.15-1.21.63 1.62.23 2.82.12 3.12.73.83 1.17 1.88 1.17 3.17 0 4.52-2.7 5.52-5.27 5.81.42.37.79 1.09.79 2.2v3.23c0 .32.21.69.79.57a11.78 11.78 0 0 0 7.88-11.17C23.5 5.97 18.35.7 12 .7Z" />
    </svg>
  );
}

export default function SocialIconRail({
  links = portfolioData.socialLinks,
  className,
  lineBeforeClassName,
  lineAfterClassName,
  label = "Social profiles",
}: SocialIconRailProps) {
  const railClasses = [styles.rail, className].filter(Boolean).join(" ");
  const beforeClasses = [styles.line, styles.lineBefore, lineBeforeClassName].filter(Boolean).join(" ");
  const afterClasses = [styles.line, styles.lineAfter, lineAfterClassName].filter(Boolean).join(" ");

  return (
    <nav className={railClasses} aria-label={label}>
      <span className={beforeClasses} data-social-rail-line="before" aria-hidden="true" />
      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.platform}>
            {link.href ? (
              <a
                className={styles.link}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} (opens in a new tab)`}
              >
                <SocialIcon platform={link.platform} />
              </a>
            ) : (
              <span className={styles.pending} aria-label={`${link.label} link pending`}>
                <SocialIcon platform={link.platform} />
              </span>
            )}
          </li>
        ))}
      </ul>
      <span className={afterClasses} data-social-rail-line="after" aria-hidden="true" />
    </nav>
  );
}
