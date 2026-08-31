"use client";

import { type ReactNode, useEffect, useRef } from "react";

type ServicesMotionProps = {
  children: ReactNode;
};

export default function ServicesMotion({ children }: ServicesMotionProps) {
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
              desktop: "(min-width: 768px)",
              reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (mediaContext) => {
              const { desktop, reduceMotion } = mediaContext.conditions as {
                desktop: boolean;
                reduceMotion: boolean;
              };

              const pin = section.querySelector<HTMLElement>("[data-services-pin]");
              const viewport = section.querySelector<HTMLElement>(
                "[data-services-viewport]",
              );
              const track = section.querySelector<HTMLElement>("[data-services-track]");

              if (!pin || !viewport || !track || !desktop || reduceMotion) return;

              section.dataset.servicesMotion = "active";

              const horizontalDistance = () =>
                Math.max(0, track.scrollWidth - viewport.clientWidth);

              const horizontalTween = gsap.to(track, {
                x: () => -horizontalDistance(),
                ease: "none",
                scrollTrigger: {
                  id: "services-horizontal",
                  trigger: pin,
                  start: "top top",
                  end: () => `+=${horizontalDistance()}`,
                  pin: true,
                  pinSpacing: true,
                  scrub: 0.6,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
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
                horizontalTween.scrollTrigger?.kill();
                horizontalTween.kill();
                gsap.set(track, { clearProps: "transform,willChange" });
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
      className="services-section section-band"
      aria-labelledby="services-heading"
    >
      <div className="services-pin" data-services-pin>
        {children}
      </div>
    </section>
  );
}
