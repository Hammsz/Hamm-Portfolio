"use client";

import { type ReactNode, useEffect, useRef } from "react";

const READY_LOADER_STATES = new Set(["handoff", "done", "fallback", "reduced"]);

type HeroBrandMotionProps = {
  children: ReactNode;
  className?: string;
};

export default function HeroBrandMotion({
  children,
  className,
}: HeroBrandMotionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = wrapper?.closest<HTMLElement>("section");
    if (!wrapper || !section) return;

    const root = document.documentElement;
    let disposed = false;
    let setupPending = false;
    let animationContext: gsap.Context | undefined;
    let responsiveContext: gsap.MatchMedia | undefined;

    const loaderIsReady = () => {
      const loaderState = root.dataset.loader;
      return !loaderState || READY_LOADER_STATES.has(loaderState);
    };

    const teardown = () => {
      responsiveContext?.revert();
      animationContext?.revert();
      responsiveContext = undefined;
      animationContext = undefined;
    };

    const setup = async () => {
      if (
        setupPending ||
        animationContext ||
        root.dataset.motion !== "ready" ||
        !loaderIsReady()
      ) {
        return;
      }

      setupPending = true;

      try {
        const { gsap } = await import("gsap");
        if (disposed || root.dataset.motion !== "ready" || !loaderIsReady()) return;

        animationContext = gsap.context(() => {
          responsiveContext = gsap.matchMedia();
          responsiveContext.add(
            {
              mobile: "(max-width: 767px)",
              reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (mediaContext) => {
              const { mobile, reduceMotion } = mediaContext.conditions as {
                mobile: boolean;
                reduceMotion: boolean;
              };

              if (reduceMotion) return;

              const scrollTween = gsap.to(wrapper, {
                y: mobile ? -9 : -18,
                rotate: mobile ? 0 : -0.3,
                ease: "none",
                scrollTrigger: {
                  id: "hero-brand-scroll-response",
                  trigger: section,
                  start: "top top",
                  end: "bottom top",
                  scrub: mobile ? 0.25 : 0.4,
                  invalidateOnRefresh: true,
                },
              });

              let entranceTween: gsap.core.Tween | undefined;
              if (window.scrollY <= 8 && root.dataset.heroMotionFallback !== "visible") {
                entranceTween = gsap.from(wrapper, {
                  clipPath: "inset(0 0 100% 0)",
                  opacity: 0,
                  y: mobile ? 18 : 28,
                  scale: 0.975,
                  duration: 0.9,
                  ease: "power4.out",
                });
              }

              return () => {
                entranceTween?.kill();
                scrollTween.kill();
              };
            },
            wrapper,
          );
        }, wrapper);
      } catch (error) {
        console.error("Hero brand motion failed; the static mark remains visible.", error);
      } finally {
        setupPending = false;
      }
    };

    const sync = () => {
      if (root.dataset.motion === "ready" && loaderIsReady()) {
        void setup();
      } else if (root.dataset.motion !== "loading") {
        teardown();
      }
    };

    const observer = new MutationObserver(sync);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-motion", "data-loader", "data-hero-motion-fallback"],
    });
    sync();

    return () => {
      disposed = true;
      observer.disconnect();
      teardown();
    };
  }, []);

  return (
    <div className={className} data-hero-brand-motion="" ref={wrapperRef}>
      {children}
    </div>
  );
}
