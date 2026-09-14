"use client";

import { type ReactNode, useEffect, useRef } from "react";

type WorksMotionProps = {
  children: ReactNode;
  className?: string;
};

export default function WorksMotion({ children, className }: WorksMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    let disposed = false;
    let headingPlayed = false;
    const playedVisuals = new WeakSet<HTMLElement>();
    const playedCopies = new WeakSet<HTMLElement>();
    let setupPending = false;
    let setupRequested = false;
    let setupVersion = 0;
    let animationContext: gsap.Context | undefined;
    let responsiveContext: gsap.MatchMedia | undefined;

    const markEntrancesPlayed = () => {
      headingPlayed = true;
      section.querySelectorAll<HTMLElement>("[data-works-project]").forEach((card) => {
        const visual = card.querySelector<HTMLElement>('[data-works="visual"]');
        const copy = card.querySelector<HTMLElement>('[data-works="copy"]');

        if (visual) playedVisuals.add(visual);
        if (copy) playedCopies.add(copy);
      });
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
              tablet: "(min-width: 768px) and (max-width: 1068px)",
              desktop: "(min-width: 1069px)",
              reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (mediaContext) => {
              const { mobile, tablet, desktop, reduceMotion } = mediaContext.conditions as {
                mobile: boolean;
                tablet: boolean;
                desktop: boolean;
                reduceMotion: boolean;
              };

              if (reduceMotion) return;

              const headingParts = section.querySelectorAll<HTMLElement>(
                '[data-works="heading"] > *',
              );
              const cards = section.querySelectorAll<HTMLElement>("[data-works-project]");

              if (!headingParts.length || !cards.length) return;

              const headingTargets = [...headingParts];
              const clearHeadingStyles = () => {
                gsap.set(headingTargets, {
                  clearProps: "opacity,transform,willChange",
                });
              };

              let headingTimeline: gsap.core.Timeline | undefined;
              if (headingPlayed || section.getBoundingClientRect().top < 0) {
                headingPlayed = true;
                clearHeadingStyles();
              } else {
                headingTimeline = gsap.timeline({
                  defaults: { ease: "power3.out" },
                  scrollTrigger: {
                    id: "works-heading-entrance",
                    trigger: headingParts[0],
                    start: mobile ? "top 88%" : tablet ? "top 84%" : "top 80%",
                    toggleActions: "play none none none",
                    once: true,
                  },
                  onStart: () => {
                    headingPlayed = true;
                    gsap.set(headingTargets, { willChange: "transform, opacity" });
                  },
                  onComplete: clearHeadingStyles,
                }).from(headingParts, {
                  opacity: 0,
                  y: mobile ? 20 : tablet ? 26 : 34,
                  duration: mobile ? 0.55 : 0.68,
                  stagger: mobile ? 0.06 : 0.09,
                });
              }

              const visualTimelines: gsap.core.Timeline[] = [];
              const copyTimelines: gsap.core.Timeline[] = [];
              const parallaxTweens: gsap.core.Tween[] = [];

              cards.forEach((card, index) => {
                const visual = card.querySelector<HTMLElement>('[data-works="visual"]');
                const copy = card.querySelector<HTMLElement>('[data-works="copy"]');
                const copyItems = card.querySelectorAll<HTMLElement>(
                  "[data-works-copy-item]",
                );
                const mediaPlane = card.querySelector<HTMLElement>(
                  "[data-project-media-plane]",
                );

                if (!visual || !copy || !copyItems.length) return;

                const copyTargets = [...copyItems];
                const clearVisualStyles = () => {
                  gsap.set(visual, {
                    clearProps: "opacity,transform,transformOrigin,clipPath,willChange",
                  });
                };
                const clearCopyStyles = () => {
                  gsap.set(copyTargets, {
                    clearProps: "opacity,transform,willChange",
                  });
                };

                if (playedVisuals.has(visual) || visual.getBoundingClientRect().top < 0) {
                  playedVisuals.add(visual);
                  clearVisualStyles();
                } else {
                  const visualTimeline = gsap
                    .timeline({
                      defaults: { ease: "power4.out" },
                      scrollTrigger: {
                        id: `works-visual-${index + 1}`,
                        trigger: visual,
                        start: mobile ? "top 88%" : tablet ? "top 84%" : "top 82%",
                        toggleActions: "play none none none",
                        once: true,
                      },
                      onStart: () => {
                        playedVisuals.add(visual);
                        visual.style.willChange = "transform, opacity, clip-path";
                      },
                      onComplete: clearVisualStyles,
                    })
                    .from(visual, {
                      opacity: 0,
                      y: mobile ? 44 : tablet ? 54 : 72,
                      scale: mobile ? 0.97 : tablet ? 0.96 : 0.94,
                      clipPath: mobile
                        ? "inset(10% 0 90% 0)"
                        : tablet
                          ? "inset(12% 0 88% 0)"
                          : "inset(14% 0 86% 0)",
                      transformOrigin: "50% 100%",
                      duration: mobile ? 0.78 : tablet ? 0.9 : 1.05,
                    });

                  visualTimelines.push(visualTimeline);
                }

                if (playedCopies.has(copy) || copy.getBoundingClientRect().top < 0) {
                  playedCopies.add(copy);
                  clearCopyStyles();
                } else {
                  const copyTimeline = gsap
                    .timeline({
                      defaults: { ease: "power3.out" },
                      scrollTrigger: {
                        id: `works-copy-${index + 1}`,
                        trigger: copy,
                        start: mobile ? "top 86%" : tablet ? "top 82%" : "top 76%",
                        toggleActions: "play none none none",
                        once: true,
                      },
                      onStart: () => {
                        playedCopies.add(copy);
                        gsap.set(copyTargets, { willChange: "transform, opacity" });
                      },
                      onComplete: clearCopyStyles,
                    })
                    .from(copyItems, {
                      opacity: 0,
                      y: mobile ? 20 : tablet ? 24 : 30,
                      duration: mobile ? 0.52 : tablet ? 0.6 : 0.68,
                      stagger: mobile ? 0.05 : 0.07,
                    });

                  copyTimelines.push(copyTimeline);
                }

                if (desktop && mediaPlane) {
                  const parallaxTween = gsap.fromTo(
                    mediaPlane,
                    { yPercent: -3 },
                    {
                      yPercent: 3,
                      ease: "none",
                      scrollTrigger: {
                        id: `works-media-parallax-${index + 1}`,
                        trigger: visual,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.45,
                        invalidateOnRefresh: true,
                      },
                    },
                  );
                  parallaxTweens.push(parallaxTween);
                }
              });

              return () => {
                headingTimeline?.kill();
                visualTimelines.forEach((timeline) => timeline.kill());
                copyTimelines.forEach((timeline) => timeline.kill());
                parallaxTweens.forEach((tween) => tween.kill());
                clearHeadingStyles();

                cards.forEach((card) => {
                  const visual = card.querySelector<HTMLElement>('[data-works="visual"]');
                  const copyTargets = card.querySelectorAll<HTMLElement>(
                    "[data-works-copy-item]",
                  );

                  if (visual) {
                    gsap.set(visual, {
                      clearProps: "opacity,transform,transformOrigin,clipPath,willChange",
                    });
                  }

                  gsap.set(copyTargets, {
                    clearProps: "opacity,transform,willChange",
                  });
                });
              };
            },
            section,
          );
        }, section);
      } catch (error) {
        if (!disposed && currentSetupVersion === setupVersion) {
          console.error(
            "Works motion failed to initialize; static projects remain available.",
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
        markEntrancesPlayed();
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
      id="works"
      className={className}
      aria-labelledby="works-heading"
    >
      {children}
    </section>
  );
}
