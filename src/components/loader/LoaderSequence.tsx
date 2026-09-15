"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Loader.module.css";

const MOSAIC_CELL_COUNT = 48;

type LoaderSequenceProps = {
  signature: ReactNode;
};

export default function LoaderSequence({ signature }: LoaderSequenceProps) {
  const [mounted, setMounted] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<Array<HTMLSpanElement | null>>([]);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const overlay = overlayRef.current;
    const counter = counterRef.current;
    const progressBar = progressBarRef.current;
    const signatureElement = signatureRef.current;

    if (!overlay || !counter || !progressBar || !signatureElement) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let reducedTimer = 0;
    let safetyTimer = 0;
    let timeline: gsap.core.Timeline | undefined;
    let exitTween: gsap.core.Tween | undefined;

    const writeProgress = (value: number) => {
      const progress = Math.min(100, Math.max(0, Math.floor(value)));
      counter.textContent = `${String(progress).padStart(2, "0")}%`;
      progressBar.style.width = `${progress}%`;
      overlay.setAttribute("aria-valuenow", String(progress));
    };

    const finish = (reduced = false) => {
      if (disposed) return;
      writeProgress(100);
      root.dataset.loader = reduced ? "reduced" : "done";
      setMounted(false);
    };

    if (reduceMotion) {
      root.dataset.loader = "reduced";
      writeProgress(100);
      overlay.dataset.phase = "reduced";
      reducedTimer = window.setTimeout(() => finish(true), 120);
    } else {
      root.dataset.loader = "active";
      overlay.dataset.phase = "loading";
      writeProgress(0);

      if (disposed) return;

      const blocks = blocksRef.current.filter(
        (block): block is HTMLSpanElement => Boolean(block),
      );
      const progressState = { value: 0 };

      gsap.set(signatureElement, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
      });
      gsap.set(blocks, { scaleY: 1 });

      timeline = gsap.timeline({
        onComplete: () => {
          if (disposed) return;

          root.dataset.loader = "handoff";
          overlay.dataset.phase = "handoff";
          exitTween = gsap.to(overlay, {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut",
            onComplete: () => finish(),
          });
        },
      });

      timeline.to(
        signatureElement,
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        0,
      );
      timeline.to(
        progressState,
        {
          value: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => writeProgress(progressState.value),
        },
        0,
      );
      timeline.to(
        signatureElement,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.5,
          ease: "power2.inOut",
        },
        0.2,
      );
      timeline.add(() => {
        root.dataset.loader = "mosaic";
        overlay.dataset.phase = "mosaic";
      }, 2);
      timeline.to(
        blocks,
        {
          scaleY: 0,
          stagger: { amount: 0.8, from: "random" },
          duration: 0.6,
          ease: "power3.inOut",
        },
        2,
      );

      safetyTimer = window.setTimeout(() => finish(), 6000);
    }

    return () => {
      disposed = true;
      window.clearTimeout(reducedTimer);
      window.clearTimeout(safetyTimer);
      timeline?.kill();
      exitTween?.kill();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.loader}
      data-site-loader=""
      role="progressbar"
      aria-label="Opening portfolio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      data-phase="loading"
    >
      <div className={styles.blocks} aria-hidden="true">
        {Array.from({ length: MOSAIC_CELL_COUNT }, (_, index) => (
          <span
            className={styles.block}
            key={index}
            ref={(element) => {
              blocksRef.current[index] = element;
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.signatureReveal} ref={signatureRef}>
          {signature}
        </div>
        <div className={styles.counter} ref={counterRef} translate="no">
          00%
        </div>
        <p className={styles.loadingText}>Loading Experience</p>
        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressBar} ref={progressBarRef} />
        </div>
      </div>
    </div>
  );
}
