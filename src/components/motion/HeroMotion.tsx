"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

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

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.dataset.heroTextState =
      !reduceMotion && !entrancePlayed && window.scrollY <= 8 ? "pending" : "ready";

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
        section.dataset.heroTextState = "ready";
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
              desktop: "(min-width: 768px)",
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
              const wordmarkTexts = Array.from(
                section.querySelectorAll<HTMLElement>('[data-brand-wordmark="giant"]'),
              );
              const socials = section.querySelector<HTMLElement>('[data-hero="socials"]');
              const socialLines = section.querySelectorAll<HTMLElement>("[data-social-rail-line]");
              const socialItems = section.querySelectorAll<HTMLElement>('[data-hero="socials"] li');
              const visibleWordmark = wordmarkTexts.find(
                (element) => element.getClientRects().length > 0,
              );
              if (
                !microcopy ||
                microcopyItems.length < 2 ||
                !wordmark ||
                !visibleWordmark ||
                !socials
              ) {
                section.dataset.heroTextState = "ready";
                return;
              }

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
                section.dataset.heroTextState = "ready";
                createScrollResponse();
                return () => scrollTimeline?.kill();
              }

              entrancePlayed = true;
              gsap.set(entranceTargets, { willChange: "transform, opacity" });

              const wordmarkSplit = new SplitText(visibleWordmark, { type: "chars" });
              const jobSplit = new SplitText(microcopyItems[0], { type: "chars" });
              const messageSplit = new SplitText(microcopyItems[1], { type: "chars" });
              const wordmarkChars = wordmarkSplit.chars as HTMLElement[];
              const firstWordLength =
                visibleWordmark.textContent?.trim().split(/\s+/)[0]?.length ??
                wordmarkChars.length;
              const firstNameChars = wordmarkChars.slice(0, firstWordLength);
              const lastNameChars = wordmarkChars.slice(firstWordLength);
              const textCharacters = [
                ...wordmarkChars,
                ...(jobSplit.chars as HTMLElement[]),
                ...(messageSplit.chars as HTMLElement[]),
              ];

              gsap.set(textCharacters, {
                opacity: 0,
                yPercent: 120,
                rotationX: -90,
                transformOrigin: "50% 100%",
              });
              section.dataset.heroTextState = "animating";

              const socialTimeline = gsap
                .timeline({
                  defaults: { ease: "power3.out" },
                })
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
                );

              const loaderDelay = root.dataset.loader === "handoff" ? 1.6 : 0.6;
              const textTimeline = gsap.timeline({
                delay: loaderDelay,
                onComplete: () => {
                  section.dataset.heroTextState = "ready";
                  gsap.set(entranceTargets, { clearProps: "willChange" });
                  createScrollResponse();
                },
              });

              textTimeline.to(firstNameChars, {
                opacity: 1,
                yPercent: 0,
                rotationX: 0,
                duration: 1.2,
                stagger: 0.04,
                ease: "expo.out",
              });

              if (lastNameChars.length > 0) {
                textTimeline.to(
                  lastNameChars,
                  {
                    opacity: 1,
                    yPercent: 0,
                    rotationX: 0,
                    duration: 1.2,
                    stagger: 0.04,
                    ease: "expo.out",
                  },
                  "-=0.8",
                );
              } else {
                textTimeline.to({}, { duration: 1.36 }, "-=0.8");
              }

              textTimeline.to(
                jobSplit.chars,
                {
                  opacity: 1,
                  yPercent: 0,
                  rotationX: 0,
                  duration: 1,
                  stagger: 0.02,
                  ease: "power3.out",
                },
                "-=0.9",
              );
              textTimeline.to(
                messageSplit.chars,
                {
                  opacity: 1,
                  yPercent: 0,
                  rotationX: 0,
                  duration: 1,
                  stagger: 0.02,
                  ease: "power3.out",
                },
                "-=0.8",
              );

              return () => {
                socialTimeline.kill();
                textTimeline.kill();
                scrollTimeline?.kill();
                wordmarkSplit.revert();
                jobSplit.revert();
                messageSplit.revert();
                section.dataset.heroTextState = "ready";
                gsap.set(entranceTargets, { clearProps: "willChange" });
              };
            },
            section,
          );
        }, section);
      } catch (error) {
        if (!disposed && currentSetupVersion === setupVersion) {
          entrancePlayed = true;
          section.dataset.heroTextState = "ready";
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
        teardownAnimation();
        armLoadingGuard();
        return;
      }

      clearLoadingGuard();
      if (root.dataset.motion === "reduced" || root.dataset.motion === "native") {
        entrancePlayed = true;
        section.dataset.heroTextState = "ready";
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
      delete section.dataset.heroTextState;
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" className={className} aria-labelledby="hero-heading">
      {children}
    </section>
  );
}
