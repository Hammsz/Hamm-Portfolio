import styles from "../Works.module.css";

type ProjectMediaProps = {
  index: number;
  project: {
    title: string;
    type: string;
    meta: string;
  };
};

export default function ProjectMedia({ index, project }: ProjectMediaProps) {
  return (
    <div
      className={styles.media}
      data-variant={index + 1}
      data-works="visual"
      aria-label={`${project.title} replaceable media placeholder`}
    >
      <div className={styles.mediaPlane} data-project-media-plane>
        <span className={styles.mediaNumber} aria-hidden="true">0{index + 1}</span>
        <div className={styles.mediaFrame}>
          <span>{project.type}</span>
          <strong>{project.title}</strong>
          <span>{project.meta}</span>
        </div>
        <span className={styles.mediaStatus}>Project media pending</span>
      </div>
    </div>
  );
}
