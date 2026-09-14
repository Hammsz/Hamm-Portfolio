import { portfolioData } from "@/data/portfolio";
import StatementMotion from "@/components/motion/StatementMotion";
import SplitText from "@/components/ui/SplitText";
import styles from "./SectionWords.module.css";

export default function SectionWords() {
  return (
    <StatementMotion className={styles.section}>
      {portfolioData.statements.map((statement, index) => (
        <article
          className={styles.panel}
          data-statement-scene
          data-tone={index === 1 ? "light" : "purple"}
          key={statement}
        >
          <span className={styles.sceneIndex} aria-hidden="true">0{index + 1} / 03</span>
          <h2 data-statement-heading><SplitText text={statement} /></h2>
        </article>
      ))}
    </StatementMotion>
  );
}
