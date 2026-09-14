import styles from "../Services.module.css";

type ServiceSymbolProps = { index: number };

export default function ServiceSymbol({ index }: ServiceSymbolProps) {
  return (
    <span className={styles.symbol} data-symbol={index + 1} aria-hidden="true">
      <span />
      <span />
    </span>
  );
}
