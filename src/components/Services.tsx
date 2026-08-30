import { portfolioData } from "@/data/portfolio";

export default function Services() {
  return (
    <section id="services" className="services-section section-band" aria-labelledby="services-heading">
      <div className="section-shell">
        <div className="section-heading split-heading">
          <p className="eyebrow">Services</p>
          <h2 id="services-heading">Frontend support for clear first launches.</h2>
        </div>
        <div className="services-viewport" data-lenis-prevent-horizontal aria-label="Draft service list">
          <div className="services-track">
            {portfolioData.services.map((service) => (
              <article className="service-card" key={service.number}>
                <p className="item-number">{service.number}</p>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
