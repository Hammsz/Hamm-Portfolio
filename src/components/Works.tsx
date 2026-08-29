import { portfolioData } from "@/data/portfolio";

export default function Works() {
  return (
    <section id="works" className="works-section section-band" aria-labelledby="works-heading">
      <div className="section-shell">
        <div className="works-heading">
          <p className="eyebrow">Works</p>
          <h2 id="works-heading">Selected project slots, ready for real proof.</h2>
          <p>
            These are intentionally marked as draft placeholders. Replace them with verified Muhammad Ilham projects before publishing.
          </p>
        </div>
        <div className="project-list">
          {portfolioData.projects.map((project, index) => (
            <article className="project-card" key={project.title}>
              <div className="project-visual" aria-label={`${project.title} visual placeholder`}>
                <span aria-hidden="true">0{index + 1}</span>
              </div>
              <div className="project-copy">
                <p className="project-type">{project.type}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <dl className="project-meta">
                  <div>
                    <dt>Meta</dt>
                    <dd>{project.meta}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{project.cta}</dd>
                  </div>
                </dl>
                <ul className="project-stack" aria-label={`${project.title} draft stack`}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
