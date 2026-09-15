import BrandMark from "@/components/brand/BrandMark";
import Signature from "@/components/brand/Signature";
import styles from "../About.module.css";

type AboutPortraitProps = {
  fullName: string;
};

export default function AboutPortrait({ fullName }: AboutPortraitProps) {
  return (
    <figure
      className={styles.portrait}
      data-about="portrait"
      aria-label={`${fullName} visual identity`}
    >
      <div className={styles.portraitField} aria-hidden="true">
        <BrandMark className={styles.portraitMark} decorative tone="light" />
      </div>
      <Signature className={styles.portraitSignature} decorative tone="light" />
    </figure>
  );
}
