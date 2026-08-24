const statements = ["You focus", "I handle", "It flows"];

export default function SectionWords() {
  return (
    <section className="statement-section" aria-label="Working approach">
      {statements.map((statement, index) => (
        <div className={`statement-row statement-row-${index + 1}`} key={statement}>
          <p>{statement}</p>
        </div>
      ))}
    </section>
  );
}