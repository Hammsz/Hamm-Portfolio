import AboutMotion from "@/components/motion/AboutMotion";
import AboutPortrait from "@/components/about/AboutPortrait";
import { portfolioData } from "@/data/portfolio";
import styles from "./About.module.css";

export default function About() {
  const { fullName, person } = portfolioData;

  return (
    <AboutMotion className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.heading} data-about="heading">
          <h2 id="about-heading">About Me</h2>
        </div>
        <div className={styles.layout} data-about="layout">
          <article
            className={styles.copy}
            data-about="copy"
            aria-label={`${fullName} profile`}
          >
            <div className={styles.body} data-about="body">
              {person.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <a
              className={styles.cta}
              data-about="cta"
              href={`mailto:${person.contactEmail}`}
            >
              <span>Contact Me</span>
            </a>
          </article>
          <AboutPortrait fullName={fullName} />
        </div>
      </div>
    </AboutMotion>
  );
}
