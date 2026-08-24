import { portfolioData } from "@/data/portfolio";

export default function About() {
  const { person } = portfolioData;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section rule about-section"
    >
      <div className="site-container about-grid">
        <div>
          <p className="section-label">About</p>
          <h2 id="about-heading" className="section-title about-title">A practical frontend profile in progress.</h2>
        </div>
        <div className="about-copy">
          <p>{person.summary}</p>
          <p className="about-availability">{person.availability}</p>
        </div>
      </div>
    </section>
  );
}
