"use client";

import { type ReactNode, useEffect, useRef } from "react";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

type StatementMotionProps = {
  children: ReactNode;
};

type CharacterOffset = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

const getCharacterOffset = (
  sceneIndex: number,
  characterIndex: number,
  tablet: boolean,
): CharacterOffset => {
  const direction = characterIndex % 2 === 0 ? -1 : 1;
  const travelScale = tablet ? 0.58 : 1;

  if (sceneIndex === 0) {
    return {
      x: direction * (30 + (characterIndex % 4) * 12) * travelScale,
      y: ((characterIndex % 3) - 1) * 86 * travelScale,
      rotation: direction * (4 + (characterIndex % 3) * 2) * travelScale,
      scale: tablet ? 0.9 : 0.84,
    };
  }

  if (sceneIndex === 1) {
    return {
      x: ((characterIndex % 5) - 2) * 34 * travelScale,
      y: (characterIndex % 2 === 0 ? -96 : 112) * travelScale,
      rotation: direction * 7 * travelScale,
      scale: tablet ? 0.91 : 0.85,
    };
  }

  return {
    x: direction * (36 + (characterIndex % 3) * 16) * travelScale,
    y: (104 + (characterIndex % 3) * 20) * travelScale,
    rotation: direction * (5 + (characterIndex % 2) * 2) * travelScale,
    scale: tablet ? 0.9 : 0.82,
  };
};

export default function StatementMotion({ children }: StatementMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    const playedMobileScenes = new WeakSet<HTMLElement>();
    let disposed = false;
    let setupPending = false;
    let setupRequested = false;
    let setupVersion = 0;
    let animationContext: gsap.Context | undefined;
    let responsiveContext: gsap.MatchMedia | undefined;

    const markMobileScenesPlayed = () => {
      section.querySelectorAll<HTMLElement>("[data-statement-scene]").forEach((scene) => {
        playedMobileScenes.add(scene);
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
              const { mobile, tablet, reduceMotion } = mediaContext.conditions as {
                mobile: boolean;
                tablet: boolean;
                desktop: boolean;
                reduceMotion: boolean;
              };

              if (reduceMotion) return;

              const scenes = section.querySelectorAll<HTMLElement>(
                "[data-statement-scene]",
              );
              const sceneTimelines: gsap.core.Timeline[] = [];
              const cleanupFrames: number[] = [];

              scenes.forEach((scene, sceneIndex) => {
                const heading = scene.querySelector<HTMLElement>(
                  "[data-statement-heading]",
                );
                const characters = scene.querySelectorAll<HTMLElement>(
                  ".statement-char",
                );

                if (!heading || !characters.length) return;

                const characterTargets = [...characters];
                const targets = [heading, ...characterTargets];
                const clearMotionStyles = () => {
                  gsap.set(targets, {
                    clearProps:
                      "opacity,transform,transformOrigin,translate,rotate,scale,willChange",
                  });
                };
                const setWillChange = () => {
                  heading.style.willChange = "transform";
                  characterTargets.forEach((character) => {
                    character.style.willChange = "transform, opacity";
                  });
                };
                const clearWillChange = () => {
                  heading.style.willChange = "";
                  characterTargets.forEach((character) => {
                    character.style.willChange = "";
                  });
                };
                const clearResolvedRefreshStyles = (trigger: ScrollTrigger) => {
                  if (trigger.progress !== 1) return;

                  cleanupFrames.push(window.requestAnimationFrame(clearMotionStyles));
                };

                if (mobile) {
                  if (
                    playedMobileScenes.has(scene) ||
                    scene.getBoundingClientRect().top < 0
                  ) {
                    playedMobileScenes.add(scene);
                    clearMotionStyles();
                    return;
                  }

                  const mobileTimeline = gsap
                    .timeline({
                      defaults: { ease: "power3.out" },
                      scrollTrigger: {
                        id: `statement-scene-${sceneIndex + 1}`,
                        trigger: scene,
                        start: "top 68%",
                        toggleActions: "play none none none",
                        once: true,
                      },
                      onStart: () => {
                        playedMobileScenes.add(scene);
                        setWillChange();
                      },
                      onComplete: clearMotionStyles,
                    })
                    .from(heading, {
                      scale: 0.97,
                      transformOrigin: "50% 60%",
                      duration: 0.72,
                    })
                    .from(
                      characterTargets,
                      {
                        opacity: 0.18,
                        y: (index) => ((index % 3) - 1) * 28,
                        rotation: (index) => (index % 2 === 0 ? -2 : 2),
                        scale: 0.94,
                        transformOrigin: "50% 70%",
                        duration: 0.64,
                        stagger: 0.035,
                      },
                      0.04,
                    );

                  sceneTimelines.push(mobileTimeline);
                  return;
                }

                if (scene.getBoundingClientRect().bottom <= 0) {
                  clearMotionStyles();
                  return;
                }

                const staggerFrom =
                  sceneIndex === 0 ? "start" : sceneIndex === 1 ? "edges" : "center";
                const sceneTimeline = gsap
                  .timeline({
                    defaults: { ease: "none" },
                    onComplete: clearMotionStyles,
                    onReverseComplete: clearMotionStyles,
                    scrollTrigger: {
                      id: `statement-scene-${sceneIndex + 1}`,
                      trigger: scene,
                      start: tablet ? "top 72%" : "top 68%",
                      end: tablet ? "center 52%" : "center 50%",
                      scrub: tablet ? 0.25 : 0.32,
                      invalidateOnRefresh: true,
                      onEnter: setWillChange,
                      onEnterBack: setWillChange,
                      onLeave: clearWillChange,
                      onLeaveBack: clearWillChange,
                      onRefresh: clearResolvedRefreshStyles,
                      onScrubComplete: (trigger) => {
                        if (trigger.progress === 0 || trigger.progress === 1) {
                          clearMotionStyles();
                        }
                      },
                    },
                  })
                  .fromTo(
                    heading,
                    {
                      scale: tablet ? 0.96 : 0.93,
                      transformOrigin: "50% 60%",
                    },
                    { scale: 1, duration: 0.9 },
                    0,
                  )
                  .fromTo(
                    characterTargets,
                    {
                      opacity: tablet ? 0.18 : 0.1,
                      x: (index) => getCharacterOffset(sceneIndex, index, tablet).x,
                      y: (index) => getCharacterOffset(sceneIndex, index, tablet).y,
                      rotation: (index) =>
                        getCharacterOffset(sceneIndex, index, tablet).rotation,
                      scale: (index) =>
                        getCharacterOffset(sceneIndex, index, tablet).scale,
                      transformOrigin: "50% 70%",
                    },
                    {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      rotation: 0,
                      scale: 1,
                      duration: 0.76,
                      ease: "none",
                      stagger: {
                        each: tablet ? 0.035 : 0.05,
                        from: staggerFrom,
                      },
                    },
                    0.04,
                  );

                sceneTimelines.push(sceneTimeline);
              });

              return () => {
                cleanupFrames.forEach((frame) => window.cancelAnimationFrame(frame));
                sceneTimelines.forEach((timeline) => timeline.kill());
                scenes.forEach((scene) => {
                  const heading = scene.querySelector<HTMLElement>(
                    "[data-statement-heading]",
                  );
                  const characters = scene.querySelectorAll<HTMLElement>(
                    ".statement-char",
                  );

                  if (heading) {
                    gsap.set(heading, {
                      clearProps:
                        "opacity,transform,transformOrigin,translate,rotate,scale,willChange",
                    });
                  }

                  gsap.set(characters, {
                    clearProps:
                      "opacity,transform,transformOrigin,translate,rotate,scale,willChange",
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
            "Statement motion failed to initialize; static statements remain available.",
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
        markMobileScenesPlayed();
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
      id="statement"
      className="statement-section"
      aria-label="Working statement"
    >
      {children}
    </section>
  );
}
