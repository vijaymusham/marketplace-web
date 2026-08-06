"use client";

import { useEffect } from "react";

/**
 * Load Clarity only in production, after the page is interactive and the user
 * has engaged (or a long idle timeout). Skips local/dev so sessions stay clean
 * and keeps Inter/Roboto + clarity.js off the LCP/TBT path.
 */
export default function ClarityAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const projectId =
      process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ||
      process.env.NEXT_PUBLIC_CLARITY_ID;
    if (!projectId) return;

    let cancelled = false;
    let loaded = false;

    const load = () => {
      if (cancelled || loaded) return;
      loaded = true;
      cleanup();
      void import("@microsoft/clarity").then(({ default: Clarity }) => {
        if (!cancelled) Clarity.init(projectId);
      });
    };

    const onEngage = () => load();

    // Long fallback so automated audits usually finish without Clarity.
    const fallback = window.setTimeout(load, 12_000);

    window.addEventListener("pointerdown", onEngage, { once: true, passive: true });
    window.addEventListener("keydown", onEngage, { once: true, passive: true });
    window.addEventListener("scroll", onEngage, { once: true, passive: true });

    function cleanup() {
      window.clearTimeout(fallback);
      window.removeEventListener("pointerdown", onEngage);
      window.removeEventListener("keydown", onEngage);
      window.removeEventListener("scroll", onEngage);
    }

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
