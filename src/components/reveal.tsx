"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({ children }: { children: ReactNode }) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = element.current;
    if (!target || typeof IntersectionObserver !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      target.dataset.revealed = "true";
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return <div className="reveal" ref={element}>{children}</div>;
}
