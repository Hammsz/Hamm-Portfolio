import { portfolioData } from "@/data/portfolio";

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section"
    >
      <div className="site-container">
        <div className="section-heading">
          <p className="section-label">Services</p>
          <h2 id="services-heading" className="section-title">Focused frontend support.</h2>
        </div>
        <div className="service-list">
          {portfolioData.services.map((service, index) => (
            <article key={service.title} className="service-item">
              <p className="item-number">0{index + 1}</p>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <span className="item-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
