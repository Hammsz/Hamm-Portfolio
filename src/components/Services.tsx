import { portfolioData } from "@/data/portfolio";

import ServicesMotion from "@/components/motion/ServicesMotion";
import ServiceSymbol from "@/components/services/ServiceSymbol";
import styles from "./Services.module.css";

export default function Services() {
  return (
    <ServicesMotion className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.intro} id="services-heading" data-services-intro>
          I build focused digital experiences, from responsive interfaces to
          accessible, performance-ready frontend systems.
        </p>
        <div
          className={styles.pin}
          data-services-pin
          data-lenis-prevent-horizontal
          aria-label="Services"
        >
          <div className={styles.progressTrack} aria-hidden="true">
            <span className={styles.progress} data-services-progress />
          </div>
          <div className={styles.track} data-services-track>
            {portfolioData.services.map((service, index) => (
              <article className={styles.card} data-services-card key={service.number}>
                <div className={styles.cardTop}>
                  <ServiceSymbol index={index} />
                  <p className={styles.number}>{service.number}</p>
                </div>
                <div className={styles.cardCopy}>
                  <h3>{service.title}</h3>
                  <div className={styles.cardBody}>
                    <hr />
                    <p>{service.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ServicesMotion>
  );
}
