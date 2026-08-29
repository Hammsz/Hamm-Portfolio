import { portfolioData } from "@/data/portfolio";
import SplitText from "@/components/ui/SplitText";

export default function SectionWords() {
  return (
    <section id="statement" className="statement-section" aria-label="Working statement">
      {portfolioData.statements.map((statement, index) => (
        <article className="statement-panel" data-tone={index === 1 ? "light" : "purple"} key={statement}>
          <h2>
            <SplitText text={statement} />
          </h2>
        </article>
      ))}
    </section>
  );
}
