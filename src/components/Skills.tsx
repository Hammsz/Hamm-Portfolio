import { portfolioData } from "@/data/portfolio";

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="section"
    >
      <div className="site-container skills-grid">
        <div>
          <p className="section-label">Skills</p>
          <h2 id="skills-heading" className="section-title">Tools for building the first version.</h2>
        </div>
        <div className="skill-groups">
          {Object.entries(portfolioData.skills).map(([group, skills]) => (
            <article key={group} className="skill-group">
              <h3>{group}</h3>
              <ul>
                {skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
