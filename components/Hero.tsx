"use client";

import { motion } from "framer-motion";
import { hero } from "@/lib/content";
import { RevealText } from "./Reveal";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] flex-col overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32"
    >
      <div id="hero-copy" className="mx-auto my-auto w-full max-w-[1600px] px-5 md:px-10">
        <h1 className="display text-[clamp(2.25rem,5vw,4.5rem)]">
          {hero.headline.map((line, i) => (
            <span key={line} className="block">
              <RevealText text={line} delay={0.1 + i * 0.14} />
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-soft md:mt-6 md:text-[18px]"
        >
          {hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            프로젝트 문의하기
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
