"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // 같은 페이지 안의 앵커 링크("#work", "/#work")는 부드럽게 스크롤
    const handleClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest(
        'a[href*="#"]'
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const url = new URL(target.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname) return;
      const id = url.hash;
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -20 });
      }
    };
    // capture 단계에서 먼저 가로채야 next/link 의 기본 해시 이동(즉시 점프)을 막을 수 있다
    document.addEventListener("click", handleClick, true);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleClick, true);
      lenis.destroy();
    };
  }, []);

  return null;
}
