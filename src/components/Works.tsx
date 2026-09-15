import { portfolioData } from "@/data/portfolio";

import WorksMotion from "@/components/motion/WorksMotion";
import ProjectMedia from "@/components/works/ProjectMedia";
import styles from "./Works.module.css";

export default function Works() {
  return (
    <WorksMotion className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.heading} data-works="heading">
          <p className={styles.eyebrow}>03 / Selected work</p>
          <h2 id="works-heading">Project stories need room to breathe.</h2>
          <p className={styles.headingCopy}>
            These are intentionally marked as draft placeholders. Replace them with verified Muhammad Ilham projects before publishing.
          </p>
        </div>
        <div className={styles.list}>
          {portfolioData.projects.map((project, index) => (
            <article className={styles.project} data-works-project key={project.title}>
              <div className={styles.primaryStack}>
                <ProjectMedia index={index} project={project} />
                <div className={styles.projectCopy} data-works="copy">
                  <div className={styles.projectKicker} data-works-copy-item>
                    <p>{project.type}</p>
                    <span>0{index + 1} / 03</span>
                  </div>
                  <h3 data-works-copy-item>{project.title}</h3>
                  <p data-works-copy-item>{project.description}</p>
                  <dl className={styles.projectMeta} data-works-copy-item>
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
                    className={styles.stack}
                    data-works-copy-item
                    aria-label={`${project.title} draft stack`}
                  >
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <ProjectMedia index={index} project={project} secondary />
            </article>
          ))}
        </div>
      </div>
    </WorksMotion>
  );
}
