import type { RefObject, TransitionEvent } from "react";
import type { NavigationItem } from "@/data/portfolio";
import styles from "./Header.module.css";

type MenuOverlayProps = {
  brandName: string;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  navigation: readonly NavigationItem[];
  onClose: () => void;
  onNavigate: (target: `#${string}`) => void;
  onTransitionEnd: (event: TransitionEvent<HTMLDivElement>) => void;
  overlayRef: RefObject<HTMLDivElement | null>;
  word: string;
};

export default function MenuOverlay({
  brandName,
  closeButtonRef,
  isOpen,
  navigation,
  onClose,
  onNavigate,
  onTransitionEnd,
  overlayRef,
  word,
}: MenuOverlayProps) {
  return (
    <div
      aria-label="Site menu"
      aria-modal="true"
      className={styles.menuOverlay}
      data-open={isOpen}
      id="site-menu"
      onTransitionEnd={onTransitionEnd}
      ref={overlayRef}
      role="dialog"
    >
      <button
        aria-label="Close menu"
        className={styles.menuClose}
        onClick={onClose}
        ref={closeButtonRef}
        type="button"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <div className={styles.menuInner} data-lenis-prevent>
        <div className={styles.menuMeta}>
          <p>{brandName} / Portfolio</p>
          <p>Navigate the work</p>
        </div>

        <nav className={styles.menuNavigation} aria-label="Primary navigation">
          <ol>
            {navigation.map((item, index) => (
              <li key={item.href}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <a
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(item.href);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <p className={styles.menuWord} aria-hidden="true">
          {word}
        </p>

        <div className={styles.menuFooter}>
          <p>Frontend developer</p>
          <p>Thoughtful interfaces / restrained motion</p>
        </div>
      </div>
    </div>
  );
}
