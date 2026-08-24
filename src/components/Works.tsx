import { portfolioData } from "@/data/portfolio";

export default function Works() {
  return (
    <section
      id="works"
      aria-labelledby="works-heading"
      className="section works-section"
    >
      <div className="site-container">
        <div className="works-intro">
          <p className="section-label">Works</p>
          <h2 id="works-heading" className="section-title">Draft project slots.</h2>
          <p>
            These cards are placeholders for Muhammad Ilham&apos;s future real projects. They intentionally avoid external links and borrowed assets.
          </p>
        </div>
        <div className="project-list">
          {portfolioData.projects.map((project) => (
            <article key={project.title} className="project-item">
              <div>
                <p className="project-type">{project.type}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <ul aria-label={`${project.title} draft stack`} className="project-stack">
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

