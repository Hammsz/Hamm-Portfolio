import { portfolioData } from "@/data/portfolio";

import WorksMotion from "@/components/motion/WorksMotion";

export default function Works() {
  return (
    <WorksMotion>
      <div className="section-shell">
        <div className="works-heading" data-works="heading">
          <p className="eyebrow">Works</p>
          <h2 id="works-heading">Selected project slots, ready for real proof.</h2>
          <p>
            These are intentionally marked as draft placeholders. Replace them with verified Muhammad Ilham projects before publishing.
          </p>
        </div>
        <div className="project-list">
          {portfolioData.projects.map((project, index) => (
            <article className="project-card" data-works-project key={project.title}>
              <div
                className="project-visual"
                data-works="visual"
                aria-label={`${project.title} visual placeholder`}
              >
                <span aria-hidden="true">0{index + 1}</span>
              </div>
              <div className="project-copy" data-works="copy">
                <p className="project-type" data-works-copy-item>{project.type}</p>
                <h3 data-works-copy-item>{project.title}</h3>
                <p data-works-copy-item>{project.description}</p>
                <dl className="project-meta" data-works-copy-item>
                  <div>
                    <dt>Meta</dt>
                    <dd>{project.meta}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{project.cta}</dd>
                  </div>
                </dl>
                <ul
                  className="project-stack"
                  data-works-copy-item
                  aria-label={`${project.title} draft stack`}
                >
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </WorksMotion>
  );
}
