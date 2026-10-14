"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/content";

// 페이지에 나오는 순서, 섹션 제목과 같은 말로
const links = [
  { label: "작업 분야", href: "/#services" },
  { label: "포트폴리오", href: "/#work" },
  { label: "소개", href: "/#about" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 메뉴가 열린 동안 뒤 페이지 스크롤 잠금 + Esc로 닫기
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          scrolled && !open
            ? "bg-paper/80 backdrop-blur-md border-b border-line"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
          <Link
            href="/#top"
            onClick={() => setOpen(false)}
            className="flex items-baseline gap-2 leading-none"
          >
            <span className="text-[16px] font-extrabold tracking-tight">
              {profile.name}
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-9">
            <ul className="hidden items-center gap-7 md:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover-line text-[14px] font-medium tracking-tight text-ink-soft"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-paper transition-colors hover:bg-lime hover:text-ink"
            >
              문의하기
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Link>

            {/* 모바일 햄버거 */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative grid h-9 w-9 place-items-center rounded-full border border-line md:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ${
                  open ? "rotate-45" : "-translate-y-[3.5px]"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ${
                  open ? "-rotate-45" : "translate-y-[3.5px]"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-paper px-5 pb-10 pt-28 md:hidden"
          >
            <ul>
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-b border-line"
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display-ko flex items-center justify-between py-5 text-[1.75rem]"
                  >
                    {l.label}
                    <span className="text-xl text-muted">→</span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="space-y-1 text-[14px] text-muted">
              <p className="label">Contact</p>
              <a href={`mailto:${profile.email}`} className="block text-[16px] font-medium text-ink">
                {profile.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
