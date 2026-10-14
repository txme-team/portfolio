"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
};

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Word-by-word masked reveal for large headings
export function RevealText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
            // 마스크가 글리프 위아래를 자르지 않도록 여유를 주고 margin으로 상쇄
            paddingBlock: "0.14em",
            marginBlock: "-0.14em",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
