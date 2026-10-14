"use client";

import { useState } from "react";
import { examples, type ExampleKey, type RoleTab } from "@/lib/content";
import Reveal from "./Reveal";
import Work from "./Work";

// 포트폴리오는 한 번에 한 가지로만 거른다: 전체 / 역할 탭 / 위에서 누른 예시
export type WorkFilter = "all" | RoleTab | ExampleKey;

// 예시(맡길 수 있는 일)와 포트폴리오를 잇는다:
// 예시를 누르면 포트폴리오가 그 종류로 걸러지고 그 위치로 내려간다.
export default function Catalog() {
  const [filter, setFilter] = useState<WorkFilter>("all");

  return (
    <>
      <section
        id="services"
        className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36"
      >
        <div className="mb-8 md:mb-10">
          <Reveal>
            <h2 className="display-ko text-[clamp(1.75rem,3.1vw,2.75rem)]">
              작업 분야
            </h2>
          </Reveal>
        </div>

        <ul className="border-t border-line">
          {examples.map((e) => {
            return (
              <li key={e.key} className="border-b border-line">
                <a
                  href="#work"
                  onClick={() => setFilter(e.key)}
                  className="group grid items-baseline gap-x-8 gap-y-2 py-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] md:py-6"
                >
                  <h3 className="display-ko text-[clamp(1.25rem,2vw,1.75rem)] transition-transform duration-500 group-hover:translate-x-2">
                    {e.label}
                  </h3>
                  <p className="max-w-xl text-[16px] leading-relaxed text-ink-soft">
                    {e.desc}
                  </p>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <Work filter={filter} onFilter={setFilter} />
    </>
  );
}
