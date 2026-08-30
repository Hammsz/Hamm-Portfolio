"use client";

import { type ReactNode, useEffect, useRef } from "react";

type AboutMotionProps = {
  children: ReactNode;
};

export default function AboutMotion({ children }: AboutMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    let disposed = false;
    let primaryEntrancePlayed = false;
    let copyEntrancePlayed = false;
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

              const headingParts = section.querySelectorAll<HTMLElement>(
                '[data-about="heading"] > *',
              );
              const layout = section.querySelector<HTMLElement>('[data-about="layout"]');
              const portrait = section.querySelector<HTMLElement>('[data-about="portrait"]');
              const body = section.querySelector<HTMLElement>('[data-about="body"]');
              const detail = section.querySelector<HTMLElement>('[data-about="detail"]');
              const cta = section.querySelector<HTMLElement>('[data-about="cta"]');

              if (
                !headingParts.length ||
                !layout ||
                !portrait ||
                !body ||
                !detail ||
                !cta
              ) {
                return;
              }

              const primaryTargets = [...headingParts, portrait];
              const copyTargets = [body, detail, cta];
              const clearPrimaryStyles = () => {
                gsap.set(primaryTargets, {
                  clearProps: "opacity,transform,willChange",
                });
                gsap.set(portrait, { clearProps: "clipPath" });
              };
              const clearCopyStyles = () => {
                gsap.set(copyTargets, {
                  clearProps: "opacity,transform,willChange",
                });
              };
              const sectionPassed = section.getBoundingClientRect().top < 0;

              let primaryTimeline: gsap.core.Timeline | undefined;
              if (primaryEntrancePlayed || sectionPassed) {
                primaryEntrancePlayed = true;
                clearPrimaryStyles();
              } else {
                primaryTimeline = gsap
                  .timeline({
                    defaults: { ease: "power3.out" },
                    scrollTrigger: {
                      id: "about-primary-entrance",
                      trigger: layout,
                      start: mobile ? "top 88%" : "top 85%",
                      toggleActions: "play none none none",
                      once: true,
                    },
                    onStart: () => {
                      primaryEntrancePlayed = true;
                      gsap.set(primaryTargets, {
                        willChange: "transform, opacity",
                      });
                      gsap.set(portrait, {
                        willChange: "transform, opacity, clip-path",
                      });
                    },
                    onComplete: clearPrimaryStyles,
                  })
                  .from(
                    headingParts,
                    {
                      opacity: 0,
                      y: mobile ? 18 : 28,
                      duration: mobile ? 0.6 : 0.7,
                      stagger: 0.09,
                    },
                    0,
                  )
                  .from(
                    portrait,
                    {
                      opacity: 0,
                      y: mobile ? 42 : 68,
                      scale: mobile ? 0.94 : 0.9,
                      clipPath: mobile
                        ? "inset(12% 0 88% 0)"
                        : "inset(18% 0 82% 0)",
                      transformOrigin: "50% 100%",
                      duration: mobile ? 0.95 : 1.15,
                      ease: "power4.out",
                    },
                    0.16,
                  );
              }

              let copyTimeline: gsap.core.Timeline | undefined;
              if (copyEntrancePlayed || sectionPassed) {
                copyEntrancePlayed = true;
                clearCopyStyles();
              } else {
                copyTimeline = gsap
                  .timeline({
                    defaults: { ease: "power3.out" },
                    scrollTrigger: {
                      id: "about-copy-entrance",
                      trigger: body,
                      start: mobile ? "top 86%" : "top 82%",
                      toggleActions: "play none none none",
                      once: true,
                    },
                    onStart: () => {
                      copyEntrancePlayed = true;
                      gsap.set(copyTargets, {
                        willChange: "transform, opacity",
                      });
                    },
                    onComplete: clearCopyStyles,
                  })
                  .from(
                    body,
                    {
                      opacity: 0,
                      y: mobile ? 24 : 36,
                      duration: mobile ? 0.68 : 0.8,
                    },
                    0,
                  )
                  .from(
                    detail,
                    {
                      opacity: 0,
                      y: mobile ? 18 : 24,
                      duration: mobile ? 0.58 : 0.65,
                    },
                    0.18,
                  )
                  .from(
                    cta,
                    {
                      opacity: 0,
                      y: mobile ? 14 : 18,
                      duration: mobile ? 0.5 : 0.55,
                    },
                    0.32,
                  );
              }

              return () => {
                primaryTimeline?.kill();
                copyTimeline?.kill();
                clearPrimaryStyles();
                clearCopyStyles();
              };
            },
            section,
          );
        }, section);
      } catch (error) {
        if (!disposed && currentSetupVersion === setupVersion) {
          console.error(
            "About motion failed to initialize; static content remains available.",
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
        primaryEntrancePlayed = true;
        copyEntrancePlayed = true;
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
      id="about"
      className="about-section section-band"
      aria-labelledby="about-heading"
    >
      {children}
    </section>
  );
}
