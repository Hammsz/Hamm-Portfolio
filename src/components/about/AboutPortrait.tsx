import BrandMark from "@/components/brand/BrandMark";
import Signature from "@/components/brand/Signature";
import styles from "../About.module.css";

type AboutPortraitProps = {
  brandName: string;
  fullName: string;
};

export default function AboutPortrait({ brandName, fullName }: AboutPortraitProps) {
  return (
    <figure
      className={styles.portrait}
      data-about="portrait"
      aria-label={`${fullName} portrait media placeholder`}
    >
      <div className={styles.portraitField} aria-hidden="true">
        <span className={styles.portraitIndex}>IH / 14</span>
        <BrandMark className={styles.portraitMark} decorative tone="light" />
        <span className={styles.portraitGrid} />
      </div>
      <Signature className={styles.portraitSignature} decorative tone="light" />
      <figcaption>
        <span>{brandName} / Portrait study</span>
        <span>Media pending</span>
      </figcaption>
    </figure>
  );
}
