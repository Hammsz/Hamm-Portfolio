"use client";

import { type ReactNode, useEffect, useRef } from "react";

const LOADING_GUARD_TIMEOUT_MS = 5000;

type HeroMotionProps = {
  children: ReactNode;
};

export default function HeroMotion({ children }: HeroMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    let disposed = false;
    let entrancePlayed = root.dataset.heroMotionFallback === "visible";
    root.dataset.heroMotionMounted = "true";
    let setupPending = false;
    let setupRequested = false;
    let setupVersion = 0;
    let loadingGuardTimer: number | undefined;
    let animationContext: gsap.Context | undefined;
    let responsiveContext: gsap.MatchMedia | undefined;

    const clearLoadingGuard = () => {
      if (loadingGuardTimer !== undefined) {
        window.clearTimeout(loadingGuardTimer);
        loadingGuardTimer = undefined;
      }

      delete root.dataset.heroMotionFallback;
    };

    const armLoadingGuard = () => {
      if (
        loadingGuardTimer !== undefined ||
        root.dataset.heroMotionFallback === "visible"
      ) {
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

      if (animationContext || root.dataset.motion !== "ready") return;

      setupPending = true;
      const currentSetupVersion = setupVersion;

      try {
        const { gsap } = await import("gsap");

        if (
          disposed ||
          currentSetupVersion !== setupVersion ||
          root.dataset.motion !== "ready"
        ) {
          return;
        }

        animationContext = gsap.context(() => {
          responsiveContext = gsap.matchMedia();
          responsiveContext.add(
            {
              mobile: "(max-width: 767px)",
              desktop: "(min-width: 768px)",
              reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (mediaContext) => {
              const { mobile, reduceMotion } = mediaContext.conditions as {
                mobile: boolean;
                desktop: boolean;
                reduceMotion: boolean;
              };

              if (reduceMotion) return;

              const meta = section.querySelector<HTMLElement>('[data-hero="meta"]');
              const copy = section.querySelector<HTMLElement>('[data-hero="copy"]');
              const title = section.querySelector<HTMLElement>('[data-hero="title"]');
              const socials = section.querySelector<HTMLElement>('[data-hero="socials"]');
              const socialRule = section.querySelector<HTMLElement>('[data-hero="social-rule"]');
              const socialItems = section.querySelectorAll<HTMLElement>(".social-links-rail > li");

              if (!meta || !copy || !title || !socials || !socialRule) return;

              const entranceTargets = [meta, copy, title, socials];
              let scrollTimeline: gsap.core.Timeline | undefined;

              const createScrollResponse = mediaContext.add("createScrollResponse", () => {
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
                  .to(
                    title,
                    {
                      yPercent: mobile ? -5 : -10,
                      scale: mobile ? 0.99 : 0.975,
                      transformOrigin: "50% 100%",
                    },
                    0,
                  )
                  .to(copy, { y: mobile ? -12 : -24, opacity: mobile ? 0.9 : 0.82 }, 0)
                  .to(meta, { y: mobile ? -8 : -12, opacity: mobile ? 0.86 : 0.75 }, 0)
                  .to(socials, { y: mobile ? -6 : -18, opacity: mobile ? 0.9 : 0.78 }, 0);
              });

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
                .from(meta, { opacity: 0, y: mobile ? 10 : 14, duration: 0.55 }, 0.08)
                .from(copy, { opacity: 0, y: mobile ? 16 : 22, duration: 0.7 }, 0.14)
                .from(
                  socialRule,
                  {
                    scaleX: mobile ? 0 : 1,
                    scaleY: mobile ? 1 : 0,
                    transformOrigin: mobile ? "0% 50%" : "50% 0%",
                    duration: 0.65,
                  },
                  0.22,
                )
                .from(
                  socialItems,
                  {
                    opacity: 0,
                    x: mobile ? 0 : 12,
                    y: mobile ? 8 : 0,
                    duration: 0.5,
                    stagger: 0.07,
                  },
                  0.28,
                )
                .from(
                  title,
                  {
                    opacity: 0,
                    yPercent: mobile ? 18 : 24,
                    scale: mobile ? 0.97 : 0.94,
                    transformOrigin: "50% 100%",
                    duration: 1.1,
                    ease: "power4.out",
                  },
                  0.35,
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

    const syncWithMotionProvider = () => {
      if (root.dataset.heroMotionFallback === "visible") {
        entrancePlayed = true;
      }

      if (root.dataset.motion === "ready") {
        clearLoadingGuard();
        void setupAnimation();
        return;
      }

      if (root.dataset.motion === "loading") {
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

    const motionStateObserver = new MutationObserver(syncWithMotionProvider);
    motionStateObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-motion", "data-hero-motion-fallback"],
    });
    syncWithMotionProvider();

    return () => {
      disposed = true;
      motionStateObserver.disconnect();
      clearLoadingGuard();
      teardownAnimation();
      delete root.dataset.heroMotionMounted;
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" className="hero-section" aria-labelledby="hero-heading">
      {children}
    </section>
  );
}
