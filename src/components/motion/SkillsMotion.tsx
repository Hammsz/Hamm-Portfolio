"use client";

import { type ReactNode, useEffect, useRef } from "react";

type SkillsMotionProps = {
  children: ReactNode;
};

export default function SkillsMotion({ children }: SkillsMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    let disposed = false;
    let entrancePlayed = false;
    let setupPending = false;
    let setupRequested = false;
    let setupVersion = 0;
    let animationContext: gsap.Context | undefined;
    let responsiveContext: gsap.MatchMedia | undefined;

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
              tablet: "(min-width: 768px) and (max-width: 1068px)",
              desktop: "(min-width: 1069px)",
              reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (mediaContext) => {
              const { mobile, tablet, reduceMotion } = mediaContext.conditions as {
                mobile: boolean;
                tablet: boolean;
                desktop: boolean;
                reduceMotion: boolean;
              };

              if (reduceMotion) return;

              const introParts = section.querySelectorAll<HTMLElement>(
                '[data-skills="intro"] > *',
              );
              const categoryControls = section.querySelectorAll<HTMLElement>(
                "[data-skills-tab]",
              );
              const panels = section.querySelectorAll<HTMLElement>(
                "[data-skills-panel]",
              );
              const skillItems = section.querySelectorAll<HTMLElement>(
                "[data-skills-item]",
              );

              if (
                !introParts.length ||
                !categoryControls.length ||
                !panels.length ||
                !skillItems.length
              ) {
                return;
              }

              const targets = [
                ...introParts,
                ...categoryControls,
                ...panels,
                ...skillItems,
              ];
              const clearEntranceStyles = () => {
                gsap.set(targets, {
                  clearProps: "opacity,transform,transformOrigin,willChange",
                });
              };

              if (entrancePlayed || section.getBoundingClientRect().top < 0) {
                entrancePlayed = true;
                clearEntranceStyles();
                return;
              }

              const entranceTimeline = gsap
                .timeline({
                  defaults: { ease: "power3.out" },
                  scrollTrigger: {
                    id: "skills-entrance",
                    trigger: section,
                    start: mobile ? "top 86%" : tablet ? "top 81%" : "top 77%",
                    toggleActions: "play none none none",
                    once: true,
                  },
                  onStart: () => {
                    entrancePlayed = true;
                    gsap.set(targets, { willChange: "transform, opacity" });
                  },
                  onComplete: clearEntranceStyles,
                })
                .from(introParts, {
                  opacity: 0,
                  y: mobile ? 22 : tablet ? 30 : 38,
                  duration: mobile ? 0.52 : 0.7,
                  stagger: mobile ? 0.07 : 0.1,
                })
                .from(
                  categoryControls,
                  {
                    opacity: 0,
                    y: mobile ? 14 : 20,
                    duration: mobile ? 0.44 : 0.56,
                    stagger: mobile ? 0.055 : 0.08,
                  },
                  mobile ? 0.2 : 0.3,
                )
                .from(
                  panels,
                  {
                    opacity: 0,
                    y: mobile ? 24 : tablet ? 30 : 36,
                    scale: mobile ? 1 : tablet ? 0.985 : 0.975,
                    transformOrigin: "50% 100%",
                    duration: mobile ? 0.62 : 0.76,
                    stagger: mobile ? 0.07 : 0.11,
                  },
                  mobile ? 0.38 : 0.5,
                )
                .from(
                  skillItems,
                  {
                    opacity: 0,
                    y: mobile ? 12 : 16,
                    duration: mobile ? 0.4 : 0.48,
                    stagger: mobile ? 0.016 : 0.028,
                  },
                  mobile ? 0.56 : 0.7,
                );

              return () => {
                entranceTimeline.kill();
                clearEntranceStyles();
              };
            },
            section,
          );
        }, section);
      } catch (error) {
        if (!disposed && currentSetupVersion === setupVersion) {
          console.error(
            "Skills motion failed to initialize; static skills remain available.",
            error,
          );
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
      if (root.dataset.motion === "ready") {
        void setupAnimation();
        return;
      }

      if (root.dataset.motion === "reduced" || root.dataset.motion === "native") {
        entrancePlayed = true;
      }

      teardownAnimation();
    };

    const motionStateObserver = new MutationObserver(syncWithMotionProvider);
    motionStateObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    syncWithMotionProvider();

    return () => {
      disposed = true;
      motionStateObserver.disconnect();
      teardownAnimation();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="skills-section section-band"
      aria-labelledby="skills-heading"
    >
      {children}
    </section>
  );
}
