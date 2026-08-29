import type { SocialLink } from "@/data/portfolio";

type SocialLinksProps = {
  links: SocialLink[];
  className?: string;
};

export default function SocialLinks({ links, className }: SocialLinksProps) {
  return (
    <ul className={className ? `social-links ${className}` : "social-links"}>
      {links.map((link) => (
        <li key={link.label}>
          {link.href ? (
            <a href={link.href}>{link.label}</a>
          ) : (
            <span aria-label={`${link.label} link pending`}>{link.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
