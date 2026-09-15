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
    const body = document.body;
    let disposed = false;
    let setupPending = false;
    let setupRequested = false;
    let setupVersion = 0;
    let nativeThemeFrame = 0;
    let nativeThemeListening = false;
    let animationContext: gsap.Context | undefined;
    let responsiveContext: gsap.MatchMedia | undefined;

    const setDarkTheme = (active: boolean) => {
      const isActive = body.classList.contains("works-active");
      if (isActive === active && (root.dataset.pageTheme === "dark") === active) return;

      body.classList.toggle("works-active", active);
      if (active) {
        root.dataset.pageTheme = "dark";
      } else {
        delete root.dataset.pageTheme;
      }
      window.dispatchEvent(new CustomEvent("page-theme-change"));
    };

    const syncThemeFromPosition = () => {
      const threshold = window.innerHeight * 0.2;
      setDarkTheme(section.getBoundingClientRect().top <= threshold);
    };

    const scheduleNativeThemeSync = () => {
      if (nativeThemeFrame) return;
      nativeThemeFrame = window.requestAnimationFrame(() => {
        nativeThemeFrame = 0;
        syncThemeFromPosition();
      });
    };

    const startNativeThemeSync = () => {
      if (nativeThemeListening) return;
      nativeThemeListening = true;
      window.addEventListener("scroll", scheduleNativeThemeSync, { passive: true });
      window.addEventListener("resize", scheduleNativeThemeSync);
      syncThemeFromPosition();
    };

    const stopNativeThemeSync = () => {
      if (!nativeThemeListening) return;
      nativeThemeListening = false;
      window.removeEventListener("scroll", scheduleNativeThemeSync);
      window.removeEventListener("resize", scheduleNativeThemeSync);
      window.cancelAnimationFrame(nativeThemeFrame);
      nativeThemeFrame = 0;
    };

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

        animationContext = gsap.context(() => {
          ScrollTrigger.create({
            id: "services-page-theme",
            trigger: section,
            start: "top 20%",
            onEnter: () => setDarkTheme(true),
            onEnterBack: () => setDarkTheme(true),
            onLeaveBack: () => setDarkTheme(false),
            onRefresh: syncThemeFromPosition,
          });

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
                section.style.setProperty("--services-intro-opacity", "1");
                return () => section.style.removeProperty("--services-intro-opacity");
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

              if (!desktop) {
                return () => {
                  introTween.scrollTrigger?.kill();
                  introTween.kill();
                  section.style.removeProperty("--services-intro-opacity");
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
                horizontalTween.scrollTrigger?.kill();
                horizontalTween.kill();
                section.style.removeProperty("--services-intro-opacity");
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

        syncThemeFromPosition();
      } catch (error) {
        if (!disposed && currentSetupVersion === setupVersion) {
          console.error(
            "Services motion failed to initialize; static services remain available.",
            error,
          );
          startNativeThemeSync();
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
        stopNativeThemeSync();
        void setupAnimation();
        return;
      }

      teardownAnimation();
      startNativeThemeSync();
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
      stopNativeThemeSync();
      teardownAnimation();
      setDarkTheme(false);
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
