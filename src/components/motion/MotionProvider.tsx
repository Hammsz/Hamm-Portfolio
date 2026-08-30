"use client";

import { type ReactNode, useEffect } from "react";

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
    let disposed = false;
    let setupId = 0;
    let teardownMotion: (() => void) | undefined;

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
        const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
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

        const lenis = new Lenis({
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

        const scheduleRefresh = () => {
          window.cancelAnimationFrame(refreshFrame);
          refreshFrame = window.requestAnimationFrame(() => {
            lenis.resize();
            ScrollTrigger.refresh();
          });
        };

        const handleVisibilityChange = () => {
          if (document.hidden) {
            lenis.stop();
            detachTicker();
            return;
          }

          lenis.start();
          attachTicker();
          scheduleRefresh();
        };

        ScrollTrigger.addEventListener("refresh", resizeLenis);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        gsap.ticker.lagSmoothing(0);

        if (document.hidden) {
          lenis.stop();
        } else {
          attachTicker();
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
        };
      } catch (error) {
        if (!disposed && currentSetupId === setupId) {
          root.dataset.motion = "native";
          console.error("Motion foundation failed to initialize; native scrolling remains available.", error);
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
      teardownMotion?.();
      delete root.dataset.motion;
    };
  }, []);

  return children;
}
