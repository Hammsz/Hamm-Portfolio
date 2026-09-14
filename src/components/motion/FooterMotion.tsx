"use client";

import { type ReactNode, useEffect, useRef } from "react";

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
    let context: gsap.Context | undefined;

    const setup = async () => {
      if (context || root.dataset.motion !== "ready") return;

      try {
        const { gsap } = await import("gsap");
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
                  toggleActions: "play none none none",
                  once: true,
                },
              },
            );
          }
        }, footer);
      } catch (error) {
        console.error("Footer motion failed; static content remains available.", error);
      }
    };

    const sync = () => {
      if (root.dataset.motion === "ready") void setup();
      else if (root.dataset.motion !== "loading") {
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
      context?.revert();
    };
  }, []);

  return (
    <footer ref={footerRef} id="contact" className={className} aria-labelledby="contact-heading">
      {children}
    </footer>
  );
}
