"use client";

import { type ReactNode, useEffect, useRef } from "react";

type ServicesMotionProps = {
  children: ReactNode;
  className?: string;
};

export default function ServicesMotion({ children, className }: ServicesMotionProps) {
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
      delete section.dataset.servicesMotion;
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
              desktop: "(min-width: 1000px)",
              reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (mediaContext) => {
              const { desktop, reduceMotion } = mediaContext.conditions as {
                desktop: boolean;
                reduceMotion: boolean;
              };

              const intro = section.querySelector<HTMLElement>(
                "[data-services-intro]",
              );
              const pin = section.querySelector<HTMLElement>("[data-services-pin]");
              const track = section.querySelector<HTMLElement>("[data-services-track]");
              const progress = section.querySelector<HTMLElement>(
                "[data-services-progress]",
              );

              if (!intro || !pin || !track) return;

              if (reduceMotion) {
                section.style.backgroundColor = "#17151a";
                section.style.color = "#f5f5f5";

                return () => {
                  section.style.backgroundColor = "";
                  section.style.color = "";
                };
              }

              section.dataset.servicesMotion = "active";

              const introTween = gsap.to(section, {
                "--services-intro-opacity": 1,
                ease: "none",
                scrollTrigger: {
                  id: "services-intro",
                  trigger: section,
                  start: "top 80%",
                  end: "top 20%",
                  scrub: true,
                },
              });

              const themeTween = gsap.to(section, {
                backgroundColor: "#17151a",
                color: "#f5f5f5",
                duration: 0.8,
                ease: "power2.inOut",
                scrollTrigger: {
                  id: "services-theme",
                  trigger: section,
                  start: "top 20%",
                  toggleActions: "play none none reverse",
                },
              });

              if (!desktop) {
                return () => {
                  introTween.scrollTrigger?.kill();
                  introTween.kill();
                  themeTween.scrollTrigger?.kill();
                  themeTween.kill();
                  section.style.removeProperty("--services-intro-opacity");
                  gsap.set(section, { clearProps: "backgroundColor,color" });
                  delete section.dataset.servicesMotion;
                };
              }

              const horizontalDistance = () =>
                Math.max(
                  0,
                  track.scrollWidth - window.innerWidth + window.innerWidth * 0.15,
                );

              const horizontalTween = gsap.to(track, {
                x: () => -horizontalDistance(),
                ease: "none",
                scrollTrigger: {
                  id: "services-horizontal",
                  trigger: pin,
                  start: "top 20%",
                  end: () => `+=${horizontalDistance()}`,
                  pin: true,
                  pinSpacing: true,
                  scrub: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  onUpdate: (trigger) => {
                    if (progress) {
                      progress.style.width = `${trigger.progress * 100}%`;
                    }
                  },
                  onEnter: () => {
                    track.style.willChange = "transform";
                  },
                  onEnterBack: () => {
                    track.style.willChange = "transform";
                  },
                  onLeave: () => {
                    track.style.willChange = "";
                  },
                  onLeaveBack: () => {
                    track.style.willChange = "";
                  },
                },
              });

              return () => {
                introTween.scrollTrigger?.kill();
                introTween.kill();
                themeTween.scrollTrigger?.kill();
                themeTween.kill();
                horizontalTween.scrollTrigger?.kill();
                horizontalTween.kill();
                section.style.removeProperty("--services-intro-opacity");
                gsap.set(section, { clearProps: "backgroundColor,color" });
                gsap.set(track, { clearProps: "transform,willChange" });
                if (progress) {
                  progress.style.width = "";
                }
                delete section.dataset.servicesMotion;
              };
            },
            section,
          );
        }, section);
      } catch (error) {
        if (!disposed && currentSetupVersion === setupVersion) {
          console.error(
            "Services motion failed to initialize; static services remain available.",
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
      id="services"
      className={className}
      aria-labelledby="services-heading"
    >
      {children}
    </section>
  );
}
