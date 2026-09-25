"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FooterMotionProps = {
  children: ReactNode;
  className?: string;
};

export default function FooterMotion({ children, className }: FooterMotionProps) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const root = document.documentElement;
    let disposed = false;
    let refreshFrame = 0;
    let refreshTimer = 0;
    let context: gsap.Context | undefined;

    const clearScheduledRefresh = () => {
      window.clearTimeout(refreshTimer);
      window.cancelAnimationFrame(refreshFrame);
      refreshTimer = 0;
      refreshFrame = 0;
    };

    const setup = () => {
      if (context || root.dataset.motion !== "ready") return;

      try {
        if (disposed || root.dataset.motion !== "ready") return;

        context = gsap.context(() => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

          const signature = footer.querySelector<HTMLElement>("[data-footer-signature]");

          if (signature) {
            gsap.fromTo(
              signature,
              { clipPath: "inset(0 100% 0 0)", opacity: 0 },
              {
                clipPath: "inset(0 0% 0 0)",
                opacity: 1,
                duration: 1.8,
                ease: "power2.out",
                scrollTrigger: {
                  id: "footer-signature-reveal",
                  trigger: footer,
                  start: "top 10%",
                  invalidateOnRefresh: true,
                  refreshPriority: -100,
                  once: true,
                },
              },
            );
          }
        }, footer);

        void document.fonts.ready.then(() => {
          if (disposed || !context) return;
          refreshTimer = window.setTimeout(() => {
            refreshFrame = window.requestAnimationFrame(() => {
              ScrollTrigger.sort();
              ScrollTrigger.refresh();
            });
          }, 350);
        });
      } catch (error) {
        const signature = footer.querySelector<HTMLElement>("[data-footer-signature]");
        if (signature) {
          signature.style.clipPath = "none";
          signature.style.opacity = "1";
        }
        console.error("Footer motion failed; static content remains available.", error);
      }
    };

    const sync = () => {
      if (root.dataset.motion === "ready") setup();
      else if (root.dataset.motion !== "loading") {
        clearScheduledRefresh();
        context?.revert();
        context = undefined;
      }
    };

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    sync();

    return () => {
      disposed = true;
      observer.disconnect();
      clearScheduledRefresh();
      context?.revert();
    };
  }, []);

  return (
    <footer ref={footerRef} id="contact" className={className} aria-labelledby="contact-heading">
      {children}
    </footer>
  );
}
