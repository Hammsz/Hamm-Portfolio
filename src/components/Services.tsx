import { portfolioData } from "@/data/portfolio";

import ServicesMotion from "@/components/motion/ServicesMotion";
import ServiceSymbol from "@/components/services/ServiceSymbol";
import styles from "./Services.module.css";

export default function Services() {
  return (
    <ServicesMotion className={styles.section} pinClassName={styles.pin}>
      <div className={styles.inner}>
        <div className={styles.heading} data-services-heading>
          <p className={styles.eyebrow}>02 / Services</p>
          <h2 id="services-heading">Building clear digital foundations.</h2>
          <p className={styles.intro}>Five focused ways to move an interface from idea to a dependable first release.</p>
        </div>
        <div
          className={styles.viewport}
          data-services-viewport
          data-lenis-prevent-horizontal
          aria-label="Draft service list"
        >
          <div className={styles.track} data-services-track>
            {portfolioData.services.map((service, index) => (
              <article className={styles.card} data-services-card key={service.number}>
                <div className={styles.cardTop}>
                  <p className={styles.number}>{service.number}</p>
                  <ServiceSymbol index={index} />
                </div>
                <div className={styles.cardCopy}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ServicesMotion>
  );
}
