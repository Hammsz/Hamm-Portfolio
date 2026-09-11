"use client";

import { useEffect, useRef } from "react";
import { createInteractionAudio } from "@/lib/interactionAudio";
import styles from "./GlobalInteractions.module.css";

const PRECISE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  'input[type="button"]:not([disabled])',
  'input[type="submit"]:not([disabled])',
  'input[type="reset"]:not([disabled])',
  "summary",
  '[role="button"]',
].join(",");

export default function GlobalInteractions() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const precisePointer = window.matchMedia(PRECISE_POINTER_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const audio = createInteractionAudio();
    let animationFrame = 0;
    let currentX = -24;
    let currentY = -24;
    let targetX = currentX;
    let targetY = currentY;

    const animateCursor = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.1) {
        animationFrame = window.requestAnimationFrame(animateCursor);
      } else {
        animationFrame = 0;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!precisePointer.matches || reducedMotion.matches) return;

      targetX = event.clientX;
      targetY = event.clientY;
      cursor.dataset.visible = "true";
      cursor.dataset.interactive = String(
        event.target instanceof Element && Boolean(event.target.closest(INTERACTIVE_SELECTOR)),
      );

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animateCursor);
      }
    };

    const handlePointerLeave = () => {
      cursor.dataset.visible = "false";
      cursor.dataset.interactive = "false";
    };

    const handleClick = (event: MouseEvent) => {
      if (!precisePointer.matches || !(event.target instanceof Element)) return;

      const target = event.target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      if (!target || target.matches(':disabled, [aria-disabled="true"]')) return;
      audio.play();
    };

    const handleCapabilityChange = () => {
      if (!precisePointer.matches || reducedMotion.matches) {
        cursor.dataset.visible = "false";
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("click", handleClick, true);
    precisePointer.addEventListener("change", handleCapabilityChange);
    reducedMotion.addEventListener("change", handleCapabilityChange);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("click", handleClick, true);
      precisePointer.removeEventListener("change", handleCapabilityChange);
      reducedMotion.removeEventListener("change", handleCapabilityChange);
      window.cancelAnimationFrame(animationFrame);
      audio.dispose();
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      className={styles.cursor}
      data-visible="false"
      ref={cursorRef}
    />
  );
}
