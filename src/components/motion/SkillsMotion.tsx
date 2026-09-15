"use client";

import { type ReactNode, useEffect, useRef } from "react";

type SkillsMotionProps = {
  children: ReactNode;
  className?: string;
};

export default function SkillsMotion({ children, className }: SkillsMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    let disposed = false;
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
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

        if (
          disposed ||
          currentSetupVersion !== setupVersion ||
          root.dataset.motion !== "ready"
        ) {
          return;
        }

        gsap.registerPlugin(ScrollTrigger);

        animationContext = gsap.context(() => {
          responsiveContext = gsap.matchMedia();
          responsiveContext.add(
            {
              allViewports: "(min-width: 0px)",
              reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (mediaContext) => {
              const { reduceMotion } = mediaContext.conditions as {
                reduceMotion: boolean;
              };
              const categories = Array.from(
                section.querySelectorAll<HTMLElement>("[data-skills-category]"),
              );
              const tags = Array.from(
                section.querySelectorAll<HTMLElement>("[data-skills-item]"),
              );

              if (!categories.length || !tags.length) return;

              const categoryNames = categories.map(
                (category) => category.dataset.category?.toLowerCase() ?? "",
              );
              const initialCategory = categoryNames[0];
              const labels = tags
                .map((tag) => tag.querySelector<HTMLElement>("span"))
                .filter((label): label is HTMLElement => Boolean(label));
              const inactiveBorder = "rgba(123, 47, 247, 0.6)";
              const activeBorder = "rgb(123, 47, 247)";
              let activeCategory = initialCategory;
              let activeIndex = -1;

              const setActiveState = (activeCategory: string) => {
                categories.forEach((category) => {
                  const isActive = category.dataset.category === activeCategory;
                  category.dataset.active = String(isActive);
                  if (isActive) category.setAttribute("aria-current", "true");
                  else category.removeAttribute("aria-current");
                });

                tags.forEach((tag) => {
                  tag.dataset.active = String(tag.dataset.category === activeCategory);
                });
              };

              if (reduceMotion) {
                setActiveState(initialCategory);
                return;
              }

              const activateIndex = (nextIndex: number, animate = true) => {
                const boundedIndex = Math.min(
                  categoryNames.length - 1,
                  Math.max(0, nextIndex),
                );

                if (boundedIndex === activeIndex) return;

                activeIndex = boundedIndex;
                activeCategory = categoryNames[boundedIndex];

                const activeCategoryElement = categories[boundedIndex];
                const activeTags = tags.filter(
                  (tag) => tag.dataset.category === activeCategory,
                );

                gsap.killTweensOf([...categories, ...tags, ...labels]);
                setActiveState(activeCategory);
                gsap.set(categories, { opacity: 0.4 });
                gsap.set(tags, {
                  opacity: 0.4,
                  borderColor: inactiveBorder,
                  backgroundColor: "transparent",
                  scale: 1,
                });
                gsap.set(labels, { y: 0 });

                if (!animate) {
                  gsap.set(activeCategoryElement, { opacity: 1 });
                  gsap.set(activeTags, {
                    opacity: 1,
                    borderColor: activeBorder,
                  });
                  return;
                }

                gsap.to(activeCategoryElement, {
                  opacity: 1,
                  duration: 0.4,
                  ease: "power2.out",
                  overwrite: true,
                });
                gsap.to(activeTags, {
                  opacity: 1,
                  borderColor: activeBorder,
                  duration: 0.4,
                  ease: "power2.out",
                  overwrite: true,
                });
              };

              activateIndex(0, false);

              const stepDuration = 0.55;
              const progression = gsap.to(
                {},
                {
                  duration: categoryNames.length * stepDuration,
                  ease: "none",
                  scrollTrigger: {
                    id: "skills-category-progression",
                    trigger: section,
                    start: "top 8%",
                    end: `+=${categoryNames.length * stepDuration * 100}%`,
                    scrub: true,
                    pin: true,
                    invalidateOnRefresh: true,
                    onUpdate: (trigger) => {
                      const nextIndex = Math.min(
                        categoryNames.length - 1,
                        Math.floor(trigger.progress * categoryNames.length),
                      );
                      activateIndex(nextIndex);
                    },
                    onLeave: () => activateIndex(categoryNames.length - 1),
                    onLeaveBack: () => activateIndex(0),
                  },
                },
              );

              const enterHandlers = new Map<HTMLElement, EventListener>();
              const leaveHandlers = new Map<HTMLElement, EventListener>();

              tags.forEach((tag) => {
                const label = tag.querySelector<HTMLElement>("span");
                const hoverTargets = label ? [tag, label] : [tag];

                const handleEnter: EventListener = () => {
                  const isActive = tag.dataset.category === activeCategory;
                  gsap.killTweensOf(hoverTargets);
                  gsap.to(tag, {
                    scale: 1.08,
                    opacity: isActive ? 1 : 0.4,
                    borderColor: isActive ? activeBorder : inactiveBorder,
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.05)"
                      : "transparent",
                    duration: 0.25,
                    ease: "back.out(1.5)",
                    overwrite: true,
                  });
                  if (label) {
                    gsap.to(label, {
                      y: -2,
                      duration: 0.25,
                      ease: "back.out(1.5)",
                    });
                  }
                };

                const handleLeave: EventListener = () => {
                  const isActive = tag.dataset.category === activeCategory;
                  gsap.killTweensOf(hoverTargets);
                  gsap.to(tag, {
                    scale: 1,
                    opacity: isActive ? 1 : 0.4,
                    borderColor: isActive ? activeBorder : inactiveBorder,
                    backgroundColor: "transparent",
                    duration: 0.25,
                    ease: "power2.out",
                    overwrite: true,
                  });
                  if (label) {
                    gsap.to(label, {
                      y: 0,
                      duration: 0.25,
                      ease: "power2.out",
                    });
                  }
                };

                tag.addEventListener("mouseenter", handleEnter);
                tag.addEventListener("mouseleave", handleLeave);
                enterHandlers.set(tag, handleEnter);
                leaveHandlers.set(tag, handleLeave);
              });

              return () => {
                progression.scrollTrigger?.kill();
                progression.kill();
                gsap.killTweensOf([...categories, ...tags]);
                gsap.set([...categories, ...tags], {
                  clearProps: "opacity,transform,backgroundColor,borderColor",
                });
                gsap.set(labels, { clearProps: "transform" });
                tags.forEach((tag) => {
                  const enterHandler = enterHandlers.get(tag);
                  const leaveHandler = leaveHandlers.get(tag);
                  if (enterHandler) tag.removeEventListener("mouseenter", enterHandler);
                  if (leaveHandler) tag.removeEventListener("mouseleave", leaveHandler);
                });
                setActiveState(initialCategory);
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
      className={className}
      aria-labelledby="skills-heading"
    >
      {children}
    </section>
  );
}
