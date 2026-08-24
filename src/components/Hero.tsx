import { portfolioData } from "@/data/portfolio";

export default function Hero() {
  const { person } = portfolioData;

  return (
    <section id="home" aria-labelledby="home-heading" className="hero section">
      <div className="site-container hero-inner">
        <div className="hero-kicker">
          <span className="section-label">{person.role}</span>
          <span className="hero-location">Based in {person.location}</span>
        </div>
        <div className="hero-visual" aria-hidden="true"><span>01</span></div>
        <h1 id="home-heading" className="display-title hero-title">{person.name}</h1>
        <div className="hero-bottom">
          <p className="hero-tagline">{person.tagline}</p>
          <a className="text-link" href="#about">Explore profile <span aria-hidden="true">↘</span></a>
        </div>
        <div className="social-rail" aria-label="Social links">
          <span className="social-line" aria-hidden="true" />
          {portfolioData.socialLinks.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
        </div>
      </div>
    </section>
  );
}
