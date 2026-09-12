"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Loader.module.css";

const PRESENTATION_DURATION_MS = 1050;
const COMPLETE_HOLD_DURATION_MS = 100;
const MOSAIC_DURATION_MS = 650;
const EXIT_DURATION_MS = 380;
const MOSAIC_CELL_COUNT = 24;

type LoaderSequenceProps = {
  signature: ReactNode;
};

export default function LoaderSequence({ signature }: LoaderSequenceProps) {
  const [mounted, setMounted] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const overlay = overlayRef.current;
    const progress = progressRef.current;

    if (!overlay || !progress) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let completeTimer = 0;
    let exitTimer = 0;
    let mosaicTimer = 0;
    let disposed = false;

    const writeProgress = (value: number) => {
      const roundedValue = Math.min(100, Math.max(0, Math.round(value)));
      progress.textContent = String(roundedValue);
      overlay.setAttribute("aria-valuenow", String(roundedValue));
    };

    const handoff = (reduced = false) => {
      writeProgress(100);
      root.dataset.loader = reduced ? "reduced" : "handoff";
      overlay.dataset.phase = "handoff";
      overlay.dataset.exiting = "true";

      exitTimer = window.setTimeout(
        () => {
          if (disposed) return;
          root.dataset.loader = reduced ? "reduced" : "done";
          setMounted(false);
        },
        reduced ? 40 : EXIT_DURATION_MS,
      );
    };

    const beginMosaic = () => {
      writeProgress(100);
      root.dataset.loader = "mosaic";
      overlay.dataset.phase = "mosaic";
      mosaicTimer = window.setTimeout(() => handoff(), MOSAIC_DURATION_MS);
    };

    const holdComplete = () => {
      writeProgress(100);
      root.dataset.loader = "complete";
      overlay.dataset.phase = "complete";
      completeTimer = window.setTimeout(beginMosaic, COMPLETE_HOLD_DURATION_MS);
    };

    if (reduceMotion) {
      handoff(true);
    } else {
      root.dataset.loader = "active";
      overlay.dataset.phase = "loading";
      const startedAt = performance.now();

      const update = (now: number) => {
        const progressValue = ((now - startedAt) / PRESENTATION_DURATION_MS) * 100;
        writeProgress(progressValue);

        if (progressValue >= 100) {
          holdComplete();
          return;
        }

        animationFrame = window.requestAnimationFrame(update);
      };

      animationFrame = window.requestAnimationFrame(update);
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(completeTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(mosaicTimer);
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
      <div className={styles.gridLineLayer} aria-hidden="true">
        {Array.from({ length: MOSAIC_CELL_COUNT }, (_, index) => (
          <span className={styles.gridLineCell} key={index} />
        ))}
      </div>
      <div className={styles.mosaic} aria-hidden="true">
        {Array.from({ length: MOSAIC_CELL_COUNT }, (_, index) => (
          <span className={styles.mosaicCell} key={index} />
        ))}
      </div>
      <div className={styles.centerpiece}>
        <div className={styles.signatureReveal}>{signature}</div>
        <p className={styles.status}>Portfolio / Edition 01</p>
        <div className={styles.progress} aria-hidden="true">
          <span ref={progressRef}>0</span>
          <span className={styles.percent}>%</span>
        </div>
      </div>
    </div>
  );
}
