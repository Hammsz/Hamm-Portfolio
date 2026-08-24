import { portfolioData } from "@/data/portfolio";

export default function Footer() {
  const { person } = portfolioData;

  return (
    <footer id="contact" aria-labelledby="contact-heading" className="footer rule section">
      <div className="site-container">
        <div>
          <p className="section-label">Contact</p>
          <h2 id="contact-heading" className="section-title footer-title">Start with a simple hello.</h2>
          <p className="footer-copy">
            Phase 1 uses a placeholder email only. Replace it with Muhammad Ilham&apos;s real contact before publishing.
          </p>
        </div>
        <address className="footer-address not-italic">
          <a href={`mailto:${person.email}`} className="email-link" aria-label={`Email ${person.name}`}>
            {person.email} <span aria-hidden="true">↗</span>
          </a>
        </address>
        <div className="footer-bottom">
          <p>Copyright 2026 Muhammad Ilham. Static portfolio draft.</p>
          <p>Made for the web <span aria-hidden="true">✦</span></p>
        </div>
      </div>
    </footer>
  );
}

