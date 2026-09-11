export const SCROLL_LOCK_EVENT = "portfolio:scroll-lock";
export const SCROLL_TO_EVENT = "portfolio:scroll-to";

export type ScrollLockDetail = {
  locked: boolean;
};

export type ScrollToDetail = {
  target: `#${string}`;
};

export function setPageScrollLocked(locked: boolean) {
  const root = document.documentElement;

  if (locked) {
    root.dataset.menuOpen = "true";
  } else {
    delete root.dataset.menuOpen;
  }

  window.dispatchEvent(
    new CustomEvent<ScrollLockDetail>(SCROLL_LOCK_EVENT, {
      detail: { locked },
    }),
  );
}

export function scrollToSection(target: `#${string}`) {
  const event = new CustomEvent<ScrollToDetail>(SCROLL_TO_EVENT, {
    cancelable: true,
    detail: { target },
  });

  window.dispatchEvent(event);

  if (!event.defaultPrevented) {
    document.querySelector<HTMLElement>(target)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }
}
