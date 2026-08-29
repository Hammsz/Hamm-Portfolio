type SplitTextProps = {
  text: string;
};

export default function SplitText({ text }: SplitTextProps) {
  return (
    <span className="statement-text" aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span className="statement-char" aria-hidden="true" key={`${character}-${index}`}>
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </span>
  );
}
