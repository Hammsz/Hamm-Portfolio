import GiantWordmark from "@/components/brand/GiantWordmark";
import HeroBrandVisual from "@/components/hero/HeroBrandVisual";
import HeroMotion from "@/components/motion/HeroMotion";
import SocialIconRail from "@/components/ui/SocialIconRail";
import { portfolioData } from "@/data/portfolio";
import styles from "./Hero.module.css";

export default function Hero() {
  const { hero, socialLinks } = portfolioData;

  return (
    <HeroMotion className={styles.hero}>
      <div className={styles.shell}>
        <div className={styles.markAnchor}>
          <HeroBrandVisual className={styles.markReveal} markClassName={styles.mark} />
        </div>
        <div className={styles.microcopy} data-hero="microcopy" aria-label="Introduction">
          <p data-hero="microcopy-item">{hero.microcopyLeft}</p>
          <p data-hero="microcopy-item">{hero.microcopyRight}</p>
        </div>
        <h1 id="hero-heading" className={styles.wordmark} data-hero="wordmark">
          <GiantWordmark
            className={`${styles.wordmarkText} ${styles.desktopWordmark}`}
            label={portfolioData.fullName}
            text={portfolioData.fullName.toUpperCase()}
          />
          <GiantWordmark
            className={`${styles.wordmarkText} ${styles.mobileWordmark}`}
            label={portfolioData.brandName}
            text={portfolioData.brandName.toUpperCase()}
          />
        </h1>
        <div className={styles.socialAnchor} data-hero="socials">
          <SocialIconRail links={socialLinks} className={styles.socialRail} label="Social profiles" />
        </div>
      </div>
    </HeroMotion>
  );
}
