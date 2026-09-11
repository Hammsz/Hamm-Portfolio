import Image from "next/image";
import type { BrandTone } from "./BrandMark";
import styles from "./BrandPrimitives.module.css";

export const SIGNATURE_SOURCE = "/brand/signature-black.png";

type SignatureProps = {
  tone?: BrandTone;
  className?: string;
  decorative?: boolean;
  label?: string;
  priority?: boolean;
};

export default function Signature({
  tone = "dark",
  className,
  decorative = false,
  label = "Ilham signature",
  priority = false,
}: SignatureProps) {
  const classes = [
    styles.asset,
    styles.signature,
    tone === "light" ? styles.toneLight : styles.toneDark,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      data-brand-asset="signature"
      data-brand-asset-status="ready"
      data-brand-tone={tone}
      data-signature-root=""
      aria-hidden={decorative || undefined}
    >
      <Image
        className={styles.assetImage}
        data-signature-source=""
        src={SIGNATURE_SOURCE}
        width={1774}
        height={887}
        alt={decorative ? "" : label}
        preload={priority}
        unoptimized
      />
    </span>
  );
}
