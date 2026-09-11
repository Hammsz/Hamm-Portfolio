import { portfolioData } from "@/data/portfolio";
import styles from "./BrandPrimitives.module.css";

type GiantWordmarkProps = {
  className?: string;
  label?: string;
};

export default function GiantWordmark({ className, label }: GiantWordmarkProps) {
  const classes = [styles.giantWordmark, className].filter(Boolean).join(" ");

  return (
    <span className={classes} aria-label={label} data-brand-wordmark="giant">
      {portfolioData.brandName}
    </span>
  );
}
