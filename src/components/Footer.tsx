import BrandMark from "@/components/brand/BrandMark";
import Signature from "@/components/brand/Signature";
import FooterMotion from "@/components/motion/FooterMotion";
import SocialIconRail from "@/components/ui/SocialIconRail";
import { portfolioData } from "@/data/portfolio";
import styles from "./Footer.module.css";

export default function Footer() {
  const { brandName, person, socialLinks } = portfolioData;

  return (
    <FooterMotion className={styles.footer}>
      <h2 id="contact-heading" className={styles.title} data-footer-title>
        Say Hello!
      </h2>

      <div className={styles.message}>
        <p data-footer-message>Let&apos;s build something great together!</p>
        <form className={styles.form} data-footer-form aria-label="Contact email placeholder">
          <label className={styles.srOnly} htmlFor="contact-email">Email address</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter your email"
            data-footer-input
          />
          <button type="button" aria-disabled="true" aria-describedby="contact-form-status" data-footer-submit>
            Send
          </button>
          <span id="contact-form-status" className={styles.srOnly}>
            Contact submission is pending a verified endpoint.
          </span>
        </form>
      </div>

      <div className={styles.contactRow} data-footer-contact-row>
        <SocialIconRail
          links={socialLinks}
          className={styles.socials}
          label="Social profiles"
        />
        <address className={styles.contactMeta} data-footer-contact-meta>
          <span>{person.emailLabel}</span>
          <span>{person.location}</span>
        </address>
      </div>

      <div className={styles.identity} data-footer-identity>
        <div className={styles.copyright} data-footer-copyright>
          <div>
            <BrandMark className={styles.copyrightMark} decorative />
            <p>© {brandName} | 2026</p>
          </div>
          <p>designed &amp; developed by me</p>
        </div>

        <div className={styles.nameMask} data-footer-mask>
          <div className={styles.wordmark} data-footer-wordmark>{brandName}</div>
          <span className={styles.signatureAnchor} data-footer-signature>
            <Signature className={styles.signature} decorative />
          </span>
        </div>
      </div>
    </FooterMotion>
  );
}
