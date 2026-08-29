import { portfolioData } from "@/data/portfolio";

export default function About() {
  const { brandName, fullName, person } = portfolioData;

  return (
    <section id="about" className="about-section section-band" aria-labelledby="about-heading">
      <div className="section-shell about-shell">
        <div className="section-heading centered-heading">
          <p className="eyebrow">About</p>
          <h2 id="about-heading">About Me</h2>
        </div>
        <div className="about-layout">
          <article className="about-copy" aria-label={`${fullName} profile draft`}>
            <p>{person.summary}</p>
            <p className="about-note">{person.availability}</p>
            <a className="text-button" href="#contact">
              Start a conversation
            </a>
          </article>
          <figure className="portrait-frame" aria-label={`${fullName} portrait placeholder`}>
            <div className="portrait-mark" aria-hidden="true">{brandName}</div>
            <figcaption>Portrait asset pending</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
