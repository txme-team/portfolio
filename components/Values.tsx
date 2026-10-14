"use client";

import Image from "next/image";
import { values } from "@/lib/content";
import Reveal from "./Reveal";

// 세 가지 소구점. 넓은 화면에서는 아이콘 · 제목 · 설명의 줄을 세 칸이 맞춰 쓴다(subgrid).
export default function Values() {
  return (
    <section className="bg-paper-alt">
      <div className="mx-auto grid max-w-[1600px] gap-x-12 gap-y-14 px-5 py-24 md:px-10 md:py-36 lg:grid-cols-3 lg:grid-rows-[repeat(3,auto)] lg:gap-y-0">
        {values.map((v, i) => (
          <Reveal
            key={v.title}
            delay={i * 0.08}
            className="lg:row-span-3 lg:grid lg:grid-rows-subgrid"
          >
            <div>
              <Image
                src={v.icon}
                width={400}
                height={400}
                alt=""
                sizes="128px"
                className="-ml-[1.125rem] h-32 w-32"
              />
            </div>
            <h2 className="display-ko pt-4 text-[clamp(1.25rem,1.7vw,1.5rem)]">
              {v.title}
            </h2>
            <p className="pt-3 text-[16px] leading-relaxed text-ink-soft">
              {v.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
