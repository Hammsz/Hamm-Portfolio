"use client";

import type Lenis from "lenis";
import { type ReactNode, useEffect } from "react";
import {
  SCROLL_LOCK_EVENT,
  SCROLL_TO_EVENT,
  type ScrollLockDetail,
  type ScrollToDetail,
} from "@/lib/interactionEvents";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DEFAULT_LAG_THRESHOLD = 500;
const DEFAULT_ADJUSTED_LAG = 33;
let scrollTriggerRegistered = false;

type MotionProviderProps = {
  children: ReactNode;
};

export default function MotionProvider({ children }: MotionProviderProps) {
  useEffect(() => {
    const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    const root = document.documentElement;
    let activeLenis: Lenis | undefined;
    let activeStart: (() => void) | undefined;
    let activeStop: (() => void) | undefined;
    let disposed = false;
    let interactionLocked = root.dataset.menuOpen === "true";
    let setupId = 0;
    let teardownMotion: (() => void) | undefined;

    const handleScrollLock = (event: Event) => {
      interactionLocked = (event as CustomEvent<ScrollLockDetail>).detail.locked;

      if (interactionLocked) {
        activeStop?.();
      } else if (!document.hidden) {
        activeStart?.();
      }
    };

    const handleScrollTo = (event: Event) => {
      const scrollEvent = event as CustomEvent<ScrollToDetail>;
      const target = document.querySelector<HTMLElement>(scrollEvent.detail.target);

      if (!activeLenis || !target || motionPreference.matches) return;

      scrollEvent.preventDefault();
      const headerOffset =
        document.querySelector<HTMLElement>("[data-header-bar]")?.getBoundingClientRect()
          .height ?? 0;

      activeLenis.scrollTo(target, {
        offset: -headerOffset,
        lerp: 0.1,
      });
    };

    window.addEventListener(SCROLL_LOCK_EVENT, handleScrollLock);
    window.addEventListener(SCROLL_TO_EVENT, handleScrollTo);

    const configureMotion = async () => {
      const currentSetupId = ++setupId;

      teardownMotion?.();
      teardownMotion = undefined;

      if (motionPreference.matches) {
        root.dataset.motion = "reduced";
        return;
      }

      root.dataset.motion = "loading";

      try {
        const [{ default: LenisConstructor }, { gsap }, { ScrollTrigger }] =
          await Promise.all([
            import("lenis"),
            import("gsap"),
            import("gsap/ScrollTrigger"),
          ]);

        if (disposed || currentSetupId !== setupId || motionPreference.matches) {
          return;
        }

        if (!scrollTriggerRegistered) {
          gsap.registerPlugin(ScrollTrigger);
          scrollTriggerRegistered = true;
        }

        const lenis = new LenisConstructor({
          autoRaf: false,
          lerp: 0.12,
          respectReducedMotion: true,
          smoothWheel: true,
          stopInertiaOnNavigate: true,
          syncTouch: false,
        });
        let refreshFrame = 0;
        let tickerAttached = false;

        const updateScrollTriggers = () => ScrollTrigger.update();
        const unsubscribeFromScroll = lenis.on("scroll", updateScrollTriggers);
        const updateLenis = (time: number) => lenis.raf(time * 1000);
        const resizeLenis = () => lenis.resize();

        const attachTicker = () => {
          if (tickerAttached) return;
          gsap.ticker.add(updateLenis);
          tickerAttached = true;
        };

        const detachTicker = () => {
          if (!tickerAttached) return;
          gsap.ticker.remove(updateLenis);
          tickerAttached = false;
        };

        const startLenis = () => {
          lenis.start();
          attachTicker();
        };

        const stopLenis = () => {
          lenis.stop();
          detachTicker();
        };

        const scheduleRefresh = () => {
          window.cancelAnimationFrame(refreshFrame);
          refreshFrame = window.requestAnimationFrame(() => {
            lenis.resize();
            ScrollTrigger.refresh();
          });
        };

        const handleVisibilityChange = () => {
          if (document.hidden || interactionLocked) {
            stopLenis();
            return;
          }

          startLenis();
          scheduleRefresh();
        };

        activeLenis = lenis;
        activeStart = startLenis;
        activeStop = stopLenis;

        ScrollTrigger.addEventListener("refresh", resizeLenis);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        gsap.ticker.lagSmoothing(0);

        if (document.hidden || interactionLocked) {
          stopLenis();
        } else {
          startLenis();
          scheduleRefresh();
        }

        root.dataset.motion = "ready";

        teardownMotion = () => {
          window.cancelAnimationFrame(refreshFrame);
          document.removeEventListener("visibilitychange", handleVisibilityChange);
          ScrollTrigger.removeEventListener("refresh", resizeLenis);
          unsubscribeFromScroll();
          detachTicker();
          lenis.destroy();
          gsap.ticker.lagSmoothing(DEFAULT_LAG_THRESHOLD, DEFAULT_ADJUSTED_LAG);

          if (activeLenis === lenis) {
            activeLenis = undefined;
            activeStart = undefined;
            activeStop = undefined;
          }
        };
      } catch (error) {
        if (!disposed && currentSetupId === setupId) {
          root.dataset.motion = "native";
          console.error(
            "Motion foundation failed to initialize; native scrolling remains available.",
            error,
          );
        }
      }
    };

    const handleMotionPreferenceChange = () => {
      void configureMotion();
    };

    motionPreference.addEventListener("change", handleMotionPreferenceChange);
    void configureMotion();

    return () => {
      disposed = true;
      setupId += 1;
      motionPreference.removeEventListener("change", handleMotionPreferenceChange);
      window.removeEventListener(SCROLL_LOCK_EVENT, handleScrollLock);
      window.removeEventListener(SCROLL_TO_EVENT, handleScrollTo);
      teardownMotion?.();
      delete root.dataset.motion;
    };
  }, []);

  return children;
}
