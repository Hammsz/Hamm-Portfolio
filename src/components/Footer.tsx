import { portfolioData } from "@/data/portfolio";
import SocialLinks from "@/components/ui/SocialLinks";

export default function Footer() {
  const { brandName, fullName, person, socialLinks } = portfolioData;

  return (
    <footer id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="section-shell contact-shell">
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="eyebrow">Contact</p>
            <h2 id="contact-heading"><span>Say Hello!</span></h2>
            <p>
              Static contact structure for {fullName}. Add verified contact details and a real submission flow in a later approved phase.
            </p>
            <address>
              <span>{person.emailLabel}</span>
              <span>{person.location}</span>
            </address>
          </div>
          <form className="contact-form" aria-label="Static contact form placeholder">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" placeholder="Your name" />
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows={5} placeholder="Write a short message" />
            <button type="button">Submission pending</button>
          </form>
        </div>
        <nav className="footer-socials" aria-label="Social profile placeholders">
          <SocialLinks links={socialLinks} />
        </nav>
        <div className="closing-name-track" aria-hidden="true">
          <span>{brandName}</span>
        </div>
        <div className="footer-bottom">
          <p>Copyright 2026 {fullName}. Static portfolio draft.</p>
          <p>No external form, audio, API, or tracking in Phase 1.7.</p>
        </div>
      </div>
    </footer>
  );
}
