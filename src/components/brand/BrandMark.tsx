import Image from "next/image";
import styles from "./BrandPrimitives.module.css";

export const BRAND_MARK_ASSET_SLOTS = {
  black: "/brand/ih14-mark-black.svg",
  white: "/brand/ih14-mark-white.svg",
} as const;

export type BrandAssetSource = {
  src: string;
  width: number;
  height: number;
};

type BrandMarkProps = {
  sources?: Partial<Record<keyof typeof BRAND_MARK_ASSET_SLOTS, BrandAssetSource>>;
  variant?: keyof typeof BRAND_MARK_ASSET_SLOTS;
  className?: string;
  decorative?: boolean;
  label?: string;
  priority?: boolean;
};

export default function BrandMark({
  sources,
  variant = "black",
  className,
  decorative = false,
  label = "IH/14 brand mark",
  priority = false,
}: BrandMarkProps) {
  const source = sources?.[variant];
  const classes = [styles.asset, styles.brandMark, className].filter(Boolean).join(" ");

  if (!source) {
    return (
      <span
        className={`${classes} ${styles.assetFallback}`}
        data-brand-asset="ih14"
        data-brand-asset-status="missing"
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : label}
        role={decorative ? undefined : "img"}
      >
        <span aria-hidden="true">IH/14 asset pending</span>
      </span>
    );
  }

  return (
    <span
      className={classes}
      data-brand-asset="ih14"
      data-brand-asset-status="ready"
      aria-hidden={decorative || undefined}
    >
      <Image
        className={styles.assetImage}
        src={source.src}
        width={source.width}
        height={source.height}
        alt={decorative ? "" : label}
        priority={priority}
        unoptimized
      />
    </span>
  );
}
