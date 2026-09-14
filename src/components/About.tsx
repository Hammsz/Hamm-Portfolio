import AboutMotion from "@/components/motion/AboutMotion";
import AboutPortrait from "@/components/about/AboutPortrait";
import { portfolioData } from "@/data/portfolio";
import styles from "./About.module.css";

export default function About() {
  const { brandName, fullName, person } = portfolioData;

  return (
    <AboutMotion className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.heading} data-about="heading">
          <p className={styles.eyebrow}>01 / About</p>
          <h2 id="about-heading">About</h2>
        </div>
        <div className={styles.layout} data-about="layout">
          <article
            className={styles.copy}
            data-about="copy"
            aria-label={`${fullName} profile draft`}
          >
            <p className={styles.lead} data-about="body">{person.summary}</p>
            <p className={styles.note} data-about="detail">
              {person.availability}
            </p>
            <a className={styles.cta} data-about="cta" href="#contact">
              <span>Start a conversation</span>
              <span aria-hidden="true">↘</span>
            </a>
          </article>
          <AboutPortrait brandName={brandName} fullName={fullName} />
        </div>
      </div>
    </AboutMotion>
  );
}
