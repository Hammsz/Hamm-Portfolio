"use client";

import { type ReactNode, useEffect, useRef } from "react";

const LOADING_GUARD_TIMEOUT_MS = 5000;
const READY_LOADER_STATES = new Set(["handoff", "done", "fallback", "reduced"]);

type HeroMotionProps = {
  children: ReactNode;
  className?: string;
};

export default function HeroMotion({ children, className }: HeroMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    let disposed = false;
    let entrancePlayed = root.dataset.heroMotionFallback === "visible";
    let setupPending = false;
    let setupRequested = false;
    let setupVersion = 0;
    let loadingGuardTimer: number | undefined;
    let animationContext: gsap.Context | undefined;
    let responsiveContext: gsap.MatchMedia | undefined;
    root.dataset.heroMotionMounted = "true";

    const loaderIsReady = () => {
      const loaderState = root.dataset.loader;
      return !loaderState || READY_LOADER_STATES.has(loaderState);
    };

    const clearLoadingGuard = () => {
      if (loadingGuardTimer !== undefined) {
        window.clearTimeout(loadingGuardTimer);
        loadingGuardTimer = undefined;
      }
    };

    const armLoadingGuard = () => {
      if (loadingGuardTimer !== undefined || root.dataset.heroMotionFallback === "visible") {
        return;
      }

      loadingGuardTimer = window.setTimeout(() => {
        loadingGuardTimer = undefined;
        if (disposed || root.dataset.motion !== "loading") return;

        entrancePlayed = true;
        root.dataset.heroMotionFallback = "visible";
      }, LOADING_GUARD_TIMEOUT_MS);
    };

    const teardownAnimation = () => {
      setupVersion += 1;
      responsiveContext?.revert();
      animationContext?.revert();
      responsiveContext = undefined;
      animationContext = undefined;
    };

    const setupAnimation = async () => {
      if (setupPending) {
        setupRequested = true;
        return;
      }

      if (animationContext || root.dataset.motion !== "ready" || !loaderIsReady()) return;

      setupPending = true;
      const currentSetupVersion = setupVersion;

      try {
        const { gsap } = await import("gsap");

        if (
          disposed ||
          currentSetupVersion !== setupVersion ||
          root.dataset.motion !== "ready" ||
          !loaderIsReady()
        ) {
          return;
        }

        animationContext = gsap.context(() => {
          responsiveContext = gsap.matchMedia();
          responsiveContext.add(
            {
              mobile: "(max-width: 767px)",
              reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (mediaContext) => {
              const { mobile, reduceMotion } = mediaContext.conditions as {
                mobile: boolean;
                reduceMotion: boolean;
              };

              if (reduceMotion) return;

              const microcopy = section.querySelector<HTMLElement>('[data-hero="microcopy"]');
              const microcopyItems = section.querySelectorAll<HTMLElement>('[data-hero="microcopy-item"]');
              const wordmark = section.querySelector<HTMLElement>('[data-hero="wordmark"]');
              const socials = section.querySelector<HTMLElement>('[data-hero="socials"]');
              const socialLines = section.querySelectorAll<HTMLElement>("[data-social-rail-line]");
              const socialItems = section.querySelectorAll<HTMLElement>('[data-hero="socials"] li');
              if (!microcopy || !wordmark || !socials) return;

              const entranceTargets = [microcopy, wordmark, socials];
              let scrollTimeline: gsap.core.Timeline | undefined;

              const createScrollResponse = () => {
                scrollTimeline?.kill();
                scrollTimeline = gsap
                  .timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: {
                      id: "hero-scroll-response",
                      trigger: section,
                      start: "top top",
                      end: "bottom top",
                      scrub: mobile ? 0.25 : 0.4,
                      invalidateOnRefresh: true,
                    },
                  })
                  .to(wordmark, { yPercent: mobile ? -3 : -6, scale: 0.99 }, 0)
                  .to(microcopy, { y: mobile ? -7 : -14, opacity: 0.82 }, 0)
                  .to(socials, { y: mobile ? -5 : -10, opacity: 0.78 }, 0);
              };

              if (entrancePlayed || window.scrollY > 8) {
                entrancePlayed = true;
                createScrollResponse();
                return () => scrollTimeline?.kill();
              }

              entrancePlayed = true;
              gsap.set(entranceTargets, { willChange: "transform, opacity" });

              const entranceTimeline = gsap
                .timeline({
                  defaults: { ease: "power3.out" },
                  onComplete: () => {
                    gsap.set(entranceTargets, { clearProps: "willChange" });
                    createScrollResponse();
                  },
                })
                .from(microcopyItems, { opacity: 0, y: 12, duration: 0.58, stagger: 0.08 }, 0.16)
                .from(
                  socialLines,
                  {
                    scaleX: mobile ? 0 : 1,
                    scaleY: mobile ? 1 : 0,
                    transformOrigin: mobile ? "50% 50%" : "50% 0%",
                    duration: 0.52,
                    stagger: 0.05,
                  },
                  0.22,
                )
                .from(
                  socialItems,
                  {
                    opacity: 0,
                    x: mobile ? 0 : 10,
                    y: mobile ? 8 : 0,
                    duration: 0.42,
                    stagger: 0.06,
                  },
                  0.26,
                )
                .from(
                  wordmark,
                  {
                    opacity: 0,
                    yPercent: mobile ? 14 : 20,
                    scale: mobile ? 0.985 : 0.97,
                    transformOrigin: "50% 100%",
                    duration: 1,
                    ease: "power4.out",
                  },
                  0.3,
                );

              return () => {
                entranceTimeline.kill();
                scrollTimeline?.kill();
                gsap.set(entranceTargets, { clearProps: "willChange" });
              };
            },
            section,
          );
        }, section);
      } catch (error) {
        if (!disposed && currentSetupVersion === setupVersion) {
          entrancePlayed = true;
          root.dataset.heroMotionFallback = "visible";
          console.error("Hero motion failed to initialize; static hero content remains available.", error);
        }
      } finally {
        setupPending = false;

        if (setupRequested && !disposed) {
          setupRequested = false;
          void setupAnimation();
        }
      }
    };

    const syncWithRuntime = () => {
      if (root.dataset.heroMotionFallback === "visible") entrancePlayed = true;

      if (!loaderIsReady()) return;

      if (root.dataset.motion === "ready") {
        clearLoadingGuard();
        void setupAnimation();
        return;
      }

      if (root.dataset.motion === "loading") {
        if (root.dataset.loader === "handoff" || root.dataset.loader === "done") {
          entrancePlayed = true;
          root.dataset.heroMotionFallback = "visible";
        }
        teardownAnimation();
        armLoadingGuard();
        return;
      }

      clearLoadingGuard();
      if (root.dataset.motion === "reduced" || root.dataset.motion === "native") {
        entrancePlayed = true;
      }
      teardownAnimation();
    };

    const runtimeObserver = new MutationObserver(syncWithRuntime);
    runtimeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-motion", "data-loader", "data-hero-motion-fallback"],
    });
    syncWithRuntime();

    return () => {
      disposed = true;
      runtimeObserver.disconnect();
      clearLoadingGuard();
      teardownAnimation();
      delete root.dataset.heroMotionMounted;
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" className={className} aria-labelledby="hero-heading">
      {children}
    </section>
  );
}
