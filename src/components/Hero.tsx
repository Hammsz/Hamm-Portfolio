import { portfolioData } from "@/data/portfolio";
import HeroMotion from "@/components/motion/HeroMotion";
import SocialLinks from "@/components/ui/SocialLinks";

export default function Hero() {
  const { brandName, person, socialLinks } = portfolioData;

  return (
    <HeroMotion>
      <div className="hero-shell section-shell">
        <div className="hero-meta" data-hero="meta" aria-label="Profile summary">
          <span>{person.role}</span>
          <span>{person.location}</span>
        </div>
        <div className="hero-copy" data-hero="copy">
          <p>{person.tagline}</p>
          <a className="text-button" href="#works">
            View draft work
          </a>
        </div>
        <h1 id="hero-heading" className="hero-title" data-hero="title">
          {brandName}
        </h1>
        <nav className="hero-socials" data-hero="socials" aria-label="Social profile placeholders">
          <span className="social-rule" data-hero="social-rule" aria-hidden="true" />
          <SocialLinks links={socialLinks} className="social-links-rail" />
        </nav>
      </div>
    </HeroMotion>
  );
}
