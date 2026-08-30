"use client";

import { useId, useState } from "react";
import { portfolioData } from "@/data/portfolio";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(portfolioData.skillGroups[0].id);
  const tabPrefix = useId();

  return (
    <section id="skills" className="skills-section section-band" aria-labelledby="skills-heading">
      <div className="section-shell skills-shell">
        <div className="skills-intro">
          <p className="eyebrow">Skills</p>
          <h2 id="skills-heading">A practical matrix for the next build phase.</h2>
        </div>
        <div className="skills-board">
          <div className="skill-tabs" data-lenis-prevent-horizontal aria-label="Skill categories">
            {portfolioData.skillGroups.map((group) => {
              const isActive = group.id === activeCategory;
              const buttonId = tabPrefix + "-" + group.id + "-button";

              return (
                <button
                  className="skill-tab"
                  data-active={isActive}
                  id={buttonId}
                  key={group.id}
                  onClick={() => setActiveCategory(group.id)}
                  type="button"
                  aria-pressed={isActive}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
          <div className="skill-matrix">
            {portfolioData.skillGroups.map((group) => {
              const isActive = group.id === activeCategory;
              const buttonId = tabPrefix + "-" + group.id + "-button";
              const panelId = tabPrefix + "-" + group.id + "-panel";

              return (
                <article
                  aria-labelledby={buttonId}
                  className="skill-panel"
                  data-active={isActive}
                  id={panelId}
                  key={group.id}
                >
                  <h3>{group.label}</h3>
                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
