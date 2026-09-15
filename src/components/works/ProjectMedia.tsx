import BrandMark from "@/components/brand/BrandMark";
import styles from "../Works.module.css";

type ProjectMediaProps = {
  index: number;
  project: {
    title: string;
    type: string;
    meta: string;
  };
  secondary?: boolean;
};

export default function ProjectMedia({ index, project, secondary = false }: ProjectMediaProps) {
  const classes = [
    styles.media,
    secondary ? styles.secondaryMedia : styles.primaryMedia,
  ].join(" ");

  return (
    <div
      className={classes}
      data-variant={index + 1}
      data-works={secondary ? undefined : "visual"}
      data-works-secondary={secondary ? "" : undefined}
      aria-label={`${project.title} replaceable media placeholder`}
      aria-hidden={secondary || undefined}
    >
      <div className={styles.mediaPlane} data-project-media-plane>
        <span className={styles.mediaNumber} aria-hidden="true">0{index + 1}</span>
        {secondary ? (
          <BrandMark className={styles.mediaMark} tone="light" decorative />
        ) : (
          <div className={styles.mediaFrame}>
            <span>{project.type}</span>
            <strong>{project.title}</strong>
            <span>{project.meta}</span>
          </div>
        )}
        <span className={styles.mediaStatus}>Project media pending</span>
      </div>
    </div>
  );
}
