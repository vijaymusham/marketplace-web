import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToTop(options?: { immediate?: boolean }) {
  const immediate = options?.immediate ?? false;

  if (lenis) {
    lenis.scrollTo(0, { immediate, duration: 1.2 });
    return;
  }

  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}
