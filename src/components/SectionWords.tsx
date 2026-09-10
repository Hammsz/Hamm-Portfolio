import { portfolioData } from "@/data/portfolio";
import StatementMotion from "@/components/motion/StatementMotion";
import SplitText from "@/components/ui/SplitText";

export default function SectionWords() {
  return (
    <StatementMotion>
      {portfolioData.statements.map((statement, index) => (
        <article
          className="statement-panel"
          data-statement-scene
          data-tone={index === 1 ? "light" : "purple"}
          key={statement}
        >
          <h2 data-statement-heading>
            <SplitText text={statement} />
          </h2>
        </article>
      ))}
    </StatementMotion>
  );
}
