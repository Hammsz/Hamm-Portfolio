"use client";

import { useId, useState } from "react";
import { portfolioData } from "@/data/portfolio";
import SkillsMotion from "@/components/motion/SkillsMotion";
import styles from "./Skills.module.css";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(portfolioData.skillGroups[0].id);
  const tabPrefix = useId();
  const activeGroup = portfolioData.skillGroups.find((group) => group.id === activeCategory)
    ?? portfolioData.skillGroups[0];
  const activeButtonId = `${tabPrefix}-${activeGroup.id}-button`;
  const activePanelId = `${tabPrefix}-${activeGroup.id}-panel`;

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
              role="tablist"
            >
              {portfolioData.skillGroups.map((group, index) => {
                const isActive = group.id === activeCategory;
                const buttonId = `${tabPrefix}-${group.id}-button`;
                const panelId = `${tabPrefix}-${group.id}-panel`;

                return (
                  <button
                    aria-controls={panelId}
                    aria-selected={isActive}
                    className={styles.tab}
                    data-active={isActive}
                    data-skills-tab
                    id={buttonId}
                    key={group.id}
                    onClick={() => setActiveCategory(group.id)}
                    role="tab"
                    tabIndex={isActive ? 0 : -1}
                    type="button"
                  >
                    <span>0{index + 1}</span>
                    {group.label}
                  </button>
                );
              })}
            </div>
            <article
              aria-labelledby={activeButtonId}
              className={styles.panel}
              data-skills-panel
              id={activePanelId}
              key={activeGroup.id}
              role="tabpanel"
            >
              <div className={styles.panelHeading}>
                <p data-skills-item>Current field</p>
                <h3 data-skills-item>{activeGroup.label}</h3>
                <p data-skills-item>{activeGroup.summary}</p>
              </div>
              <ul className={styles.skillList}>
                {activeGroup.skills.map((skill, index) => (
                  <li data-skills-item key={skill}>
                    <span>0{index + 1}</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </SkillsMotion>
  );
}
