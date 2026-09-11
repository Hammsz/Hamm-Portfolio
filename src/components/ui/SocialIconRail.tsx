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
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (platform === "linkedin") {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <rect x="3" y="9" width="4" height="12" />
        <path d="M11 21V9h4v2c1-1.5 2.5-2.25 4-1.75 1.5.5 2 2 2 4.25V21h-4v-6.5c0-1.5-.5-2.25-1.75-2.25S15 13 15 14.5V21Z" />
        <circle cx="5" cy="5" r="2" />
      </svg>
    );
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.7-1.6 6.7-7.25A5.7 5.7 0 0 0 19.2 3.3 5.3 5.3 0 0 0 19 .3S17.8 0 15 1.8a13.4 13.4 0 0 0-6 0C6.2 0 5 .3 5 .3a5.3 5.3 0 0 0-.2 3A5.7 5.7 0 0 0 3.3 7.3c0 5.6 3.4 6.8 6.7 7.2A4.8 4.8 0 0 0 9 18v4" />
      <path d="M9 19c-3 .9-3-1.5-4-2" />
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
