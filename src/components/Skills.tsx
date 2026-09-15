import SkillsMotion from "@/components/motion/SkillsMotion";
import { portfolioData } from "@/data/portfolio";
import styles from "./Skills.module.css";

export default function Skills() {
  const orderedSkills = portfolioData.skillOrder.flatMap((skill) => {
    const group = portfolioData.skillGroups.find((candidate) =>
      (candidate.skills as readonly string[]).includes(skill),
    );

    return group ? [{ category: group.id, label: skill }] : [];
  });

  return (
    <SkillsMotion className={styles.section}>
      <h2 className={styles.title} id="skills-heading">
        SKILLS
      </h2>
      <div className={styles.layout}>
        <ul className={styles.categories} aria-label="Skill categories">
          {portfolioData.skillGroups.map((group, index) => (
            <li
              aria-current={index === 0 ? "true" : undefined}
              data-active={index === 0}
              data-category={group.id}
              data-skills-category
              key={group.id}
            >
              <p>{group.label}</p>
            </li>
          ))}
        </ul>
        <div className={styles.skillsRight}>
          <ul className={styles.techGrid} aria-label="Technical skills">
            {orderedSkills.map((skill) => (
              <li
                data-active={skill.category === portfolioData.skillGroups[0].id}
                data-category={skill.category}
                data-skills-item
                key={skill.label}
              >
                <span>{skill.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SkillsMotion>
  );
}
