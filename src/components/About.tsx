import AboutMotion from "@/components/motion/AboutMotion";
import { portfolioData } from "@/data/portfolio";

export default function About() {
  const { brandName, fullName, person } = portfolioData;

  return (
    <AboutMotion>
      <div className="section-shell about-shell">
        <div className="section-heading centered-heading" data-about="heading">
          <p className="eyebrow">About</p>
          <h2 id="about-heading">About Me</h2>
        </div>
        <div className="about-layout" data-about="layout">
          <article
            className="about-copy"
            data-about="copy"
            aria-label={`${fullName} profile draft`}
          >
            <p data-about="body">{person.summary}</p>
            <p className="about-note" data-about="detail">
              {person.availability}
            </p>
            <a className="text-button" data-about="cta" href="#contact">
              Start a conversation
            </a>
          </article>
          <figure
            className="portrait-frame"
            data-about="portrait"
            aria-label={`${fullName} portrait placeholder`}
          >
            <div className="portrait-mark" aria-hidden="true">{brandName}</div>
            <figcaption>Portrait asset pending</figcaption>
          </figure>
        </div>
      </div>
    </AboutMotion>
  );
}
