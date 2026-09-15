"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import SkillsMotion from "@/components/motion/SkillsMotion";
import styles from "./Skills.module.css";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(portfolioData.skillGroups[0].id);

  return (
    <SkillsMotion className={styles.section}>
      <div className={styles.pin} data-skills-pin>
        <div className={styles.inner}>
          <div className={styles.intro} data-skills="intro">
            <p className={styles.eyebrow}>04 / Skills</p>
            <h2 id="skills-heading">Tools arranged around the work.</h2>
            <p>Choose a category directly, or let the desktop scroll progression move through the set.</p>
          </div>
          <div className={styles.board}>
            <div
              className={styles.tabs}
              data-lenis-prevent-horizontal
              aria-label="Skill categories"
            >
              {portfolioData.skillGroups.map((group, index) => {
                const isActive = group.id === activeCategory;

                return (
                  <button
                    aria-pressed={isActive}
                    className={styles.tab}
                    data-active={isActive}
                    data-skills-tab
                    key={group.id}
                    onClick={() => setActiveCategory(group.id)}
                    type="button"
                  >
                    <span>0{index + 1}</span>
                    {group.label}
                  </button>
                );
              })}
            </div>
            <ul
              aria-label="Technical skills"
              className={styles.techGrid}
              data-skills-panel
            >
              {portfolioData.skillGroups.flatMap((group) =>
                group.skills.map((skill) => (
                  <li
                    data-active={group.id === activeCategory}
                    data-category={group.id}
                    data-skills-item
                    key={`${group.id}-${skill}`}
                  >
                    {skill}
                  </li>
                )),
              )}
            </ul>
          </div>
        </div>
      </div>
    </SkillsMotion>
  );
}
