import Image from "next/image";
import styles from "./BrandPrimitives.module.css";

export const BRAND_MARK_SOURCE = "/brand/ih14-mark-black.png";

export type BrandTone = "dark" | "light";

type BrandMarkProps = {
  tone?: BrandTone;
  className?: string;
  decorative?: boolean;
  label?: string;
  priority?: boolean;
};

export default function BrandMark({
  tone = "dark",
  className,
  decorative = false,
  label = "IH/14 brand mark",
  priority = false,
}: BrandMarkProps) {
  const classes = [
    styles.asset,
    styles.brandMark,
    tone === "light" ? styles.toneLight : styles.toneDark,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      data-brand-asset="ih14"
      data-brand-asset-status="ready"
      data-brand-tone={tone}
      aria-hidden={decorative || undefined}
    >
      <Image
        className={styles.assetImage}
        src={BRAND_MARK_SOURCE}
        width={1334}
        height={1179}
        alt={decorative ? "" : label}
        preload={priority}
        unoptimized
      />
    </span>
  );
}
