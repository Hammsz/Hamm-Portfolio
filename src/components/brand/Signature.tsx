import Image from "next/image";
import type { BrandAssetSource } from "./BrandMark";
import styles from "./BrandPrimitives.module.css";

export const SIGNATURE_ASSET_SLOTS = {
  black: "/brand/ilham-signature-black.svg",
  white: "/brand/ilham-signature-white.svg",
} as const;

type SignatureProps = {
  sources?: Partial<Record<keyof typeof SIGNATURE_ASSET_SLOTS, BrandAssetSource>>;
  variant?: keyof typeof SIGNATURE_ASSET_SLOTS;
  className?: string;
  decorative?: boolean;
  label?: string;
  priority?: boolean;
};

export default function Signature({
  sources,
  variant = "black",
  className,
  decorative = false,
  label = "Ilham signature",
  priority = false,
}: SignatureProps) {
  const source = sources?.[variant];
  const classes = [styles.asset, styles.signature, className].filter(Boolean).join(" ");

  if (!source) {
    return (
      <span
        className={`${classes} ${styles.assetFallback}`}
        data-brand-asset="signature"
        data-brand-asset-status="missing"
        data-signature-root=""
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : label}
        role={decorative ? undefined : "img"}
      >
        <span aria-hidden="true">Signature asset pending</span>
      </span>
    );
  }

  return (
    <span
      className={classes}
      data-brand-asset="signature"
      data-brand-asset-status="ready"
      data-signature-root=""
      aria-hidden={decorative || undefined}
    >
      <Image
        className={styles.assetImage}
        data-signature-source=""
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
