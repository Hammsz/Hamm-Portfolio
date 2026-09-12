"use client";

import {
  type ReactNode,
  type TransitionEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Clock from "@/components/Clock";
import type { BrandTone } from "@/components/brand/BrandMark";
import type { NavigationItem } from "@/data/portfolio";
import { scrollToSection, setPageScrollLocked } from "@/lib/interactionEvents";
import MenuOverlay from "./MenuOverlay";
import styles from "./Header.module.css";

const MENU_EXIT_DURATION = 500;
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

type HeaderInteractionsProps = {
  brandName: string;
  menuWords: readonly string[];
  navigation: readonly NavigationItem[];
  signature: ReactNode;
  tone: BrandTone;
};

function focusSection(target: `#${string}`) {
  const section = document.querySelector<HTMLElement>(target);
  if (!section) return;

  const hadTabIndex = section.hasAttribute("tabindex");
  section.setAttribute("tabindex", "-1");
  section.focus({ preventScroll: true });

  if (!hadTabIndex) {
    section.addEventListener("blur", () => section.removeAttribute("tabindex"), {
      once: true,
    });
  }
}

export default function HeaderInteractions({
  brandName,
  menuWords,
  navigation,
  signature,
  tone,
}: HeaderInteractionsProps) {
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const openingFrameRef = useRef<number | undefined>(undefined);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingTargetRef = useRef<`#${string}` | undefined>(undefined);
  const restoreFocusRef = useRef(false);

  const finishClose = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = undefined;
    setIsMenuMounted(false);
    setPageScrollLocked(false);

    const target = pendingTargetRef.current;
    pendingTargetRef.current = undefined;

    if (target) {
      focusSection(target);
      scrollToSection(target);
    }
  }, []);

  const closeMenu = useCallback(
    (target?: `#${string}`) => {
      if (!isMenuMounted) return;

      pendingTargetRef.current = target;
      restoreFocusRef.current = !target;
      setIsMenuOpen(false);

      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(finishClose, MENU_EXIT_DURATION);
    },
    [finishClose, isMenuMounted],
  );

  const openMenu = () => {
    if (isMenuMounted || menuWords.length === 0) return;

    setWordIndex((previousIndex) => {
      if (menuWords.length === 1) return 0;
      const offset = 1 + Math.floor(Math.random() * (menuWords.length - 1));
      return (previousIndex + offset) % menuWords.length;
    });
    setIsMenuMounted(true);
    setPageScrollLocked(true);

    window.cancelAnimationFrame(openingFrameRef.current ?? 0);
    openingFrameRef.current = window.requestAnimationFrame(() => {
      setIsMenuOpen(true);
      closeButtonRef.current?.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !overlayRef.current) return;

      const focusable = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute("hidden"));

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu, isMenuOpen]);

  useEffect(() => {
    if (isMenuMounted || !restoreFocusRef.current) return;

    restoreFocusRef.current = false;
    menuButtonRef.current?.focus({ preventScroll: true });
  }, [isMenuMounted]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    if (isMenuMounted) {
      header.dataset.scrollHidden = "false";
      return;
    }

    let lastScrollY = window.scrollY;
    let frame = 0;

    const syncSurfaceTone = () => {
      const sampleY = Math.min(
        Math.max(header.getBoundingClientRect().height / 2, 1),
        window.innerHeight - 1,
      );
      const surface = document
        .elementsFromPoint(window.innerWidth / 2, sampleY)
        .find(
          (element) =>
            !element.closest("[data-site-header]") &&
            (element.tagName === "SECTION" || element.tagName === "FOOTER"),
        );

      if (!surface) return;

      const channels = getComputedStyle(surface).backgroundColor.match(/[\d.]+/g);
      if (!channels || channels.length < 3) return;

      const [red, green, blue] = channels.slice(0, 3).map(Number);
      const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      header.dataset.surface = luminance < 128 ? "dark" : "light";
    };

    const syncHeader = () => {
      frame = 0;
      const nextScrollY = Math.max(window.scrollY, 0);
      const delta = nextScrollY - lastScrollY;

      if (nextScrollY <= 88) {
        header.dataset.scrollHidden = "false";
      } else if (Math.abs(delta) >= 5) {
        header.dataset.scrollHidden = String(delta > 0);
      }

      lastScrollY = nextScrollY;
      syncSurfaceTone();
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(syncHeader);
    };

    header.dataset.scrollHidden = "false";
    syncSurfaceTone();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [isMenuMounted]);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(openingFrameRef.current ?? 0);
      window.clearTimeout(closeTimerRef.current);
      if (document.documentElement.dataset.menuOpen === "true") {
        setPageScrollLocked(false);
      }
    },
    [],
  );

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      !isMenuOpen &&
      event.currentTarget === event.target &&
      event.propertyName === "transform"
    ) {
      finishClose();
    }
  };

  return (
    <header
      className={styles.header}
      data-menu-open={isMenuMounted}
      data-site-header=""
      data-tone={tone}
      ref={headerRef}
    >
      <div className={styles.bar} data-header-bar="">
        <div className={styles.leftSlot}>
          <button
            aria-controls="site-menu"
            aria-expanded={isMenuMounted}
            aria-label="Open menu"
            className={styles.menuTrigger}
            onClick={openMenu}
            ref={menuButtonRef}
            tabIndex={isMenuMounted ? -1 : undefined}
            type="button"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <a
          aria-label={`${brandName} home`}
          className={styles.signatureLink}
          draggable={false}
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("#home");
          }}
          tabIndex={isMenuMounted ? -1 : undefined}
        >
          {signature}
        </a>

        <div className={styles.rightSlot}>
          <div className={styles.clock}>
            <Clock />
          </div>
        </div>
      </div>

      {isMenuMounted ? (
        <MenuOverlay
          brandName={brandName}
          closeButtonRef={closeButtonRef}
          isOpen={isMenuOpen}
          navigation={navigation}
          onClose={() => closeMenu()}
          onNavigate={closeMenu}
          onTransitionEnd={handleTransitionEnd}
          overlayRef={overlayRef}
          word={menuWords[wordIndex] ?? menuWords[0]}
        />
      ) : null}
    </header>
  );
}
