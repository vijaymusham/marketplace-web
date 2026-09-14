"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { scrollToTop, setLenis } from "@/lib/lenis";

/**
 * Defers Lenis + GSAP until after first paint / idle so they stay off the LCP/TBT path.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirstPath = useRef(true);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const boot = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });

      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      const onTick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute("href");
        if (id && id.length > 1) {
          e.preventDefault();
          const el = document.querySelector(id);
          if (el) lenis.scrollTo(el as HTMLElement, { offset: -80 });
        }
      };
      document.addEventListener("click", onClick);

      cleanup = () => {
        document.removeEventListener("click", onClick);
        gsap.ticker.remove(onTick);
        setLenis(null);
        lenis.destroy();
      };
    };

    const start = () => {
      void boot();
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(start, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId != null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId != null) clearTimeout(timeoutId);
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }
    scrollToTop();
  }, [pathname]);

  return <>{children}</>;
}
