"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  examples,
  roleTabs,
  shownProjects,
  type Project,
  type RoleTab,
} from "@/lib/content";
import type { WorkFilter } from "./Catalog";
import Reveal from "./Reveal";

export default function Work({
  filter,
  onFilter,
}: {
  filter: WorkFilter;
  onFilter: (f: WorkFilter) => void;
}) {
  // 탭은 역할(기획 · 디자인 · 개발). 위 예시 목록에서 넘어온 경우에만 그 종류가 칩으로 붙는다
  const tabs: { key: WorkFilter; label: string }[] = [
    { key: "all", label: "전체" },
    ...roleTabs.map((r) => ({ key: r as WorkFilter, label: r })),
  ];
  const isRole = (roleTabs as readonly string[]).includes(filter);
  const example = examples.find((e) => e.key === filter);
  const shown =
    filter === "all"
      ? shownProjects
      : isRole
        ? shownProjects.filter((p) => p.role.includes(filter as RoleTab))
        : shownProjects.filter((p) => example && p.types.includes(example.key));

  return (
    <section id="work" className="bg-paper-alt">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="mb-8 md:mb-10">
          <Reveal>
            <h2 className="display-ko text-[clamp(1.75rem,3.1vw,2.75rem)]">
              포트폴리오
            </h2>
          </Reveal>

          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label="맡은 역할"
          >
            {tabs.map((f) => {
              const on = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onFilter(f.key)}
                  className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
                    on
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink-soft hover:border-ink"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
            {example && (
              <button
                type="button"
                aria-pressed
                aria-label={`${example.label} 필터 해제`}
                onClick={() => onFilter("all")}
                className="rounded-full border border-ink bg-ink px-4 py-2 text-[14px] font-medium text-paper"
              >
                {example.label} <span className="ml-1 opacity-60">✕</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{
                duration: 0.8,
                delay: (i % 4) * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {p.detail ? (
                <Link href={`/work/${p.slug}`} className="group block">
                  <Card p={p} />
                </Link>
              ) : (
                <Card p={p} />
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ p }: { p: Project }) {
  return (
    <>
      <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl border border-line bg-paper">
        <Cover p={p} />
        <div className="absolute left-4 top-4 label text-ink/50">{p.year}</div>
      </div>

      <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
      <p className="mt-0.5 text-[14px] text-muted">{p.subtitle}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {p.role.map((r) => (
          <span
            key={r}
            className="rounded-full border border-line px-2.5 py-0.5 text-[13px] font-medium text-ink-soft"
          >
            {r}
          </span>
        ))}
      </div>
    </>
  );
}

function Cover({ p }: { p: Project }) {
  // 이미지가 없는 프로젝트는 타이포 타일
  if (!p.cover) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="display-ko px-4 text-center text-[clamp(1.5rem,2.4vw,2rem)] text-ink/85">
          {p.title}
        </span>
      </div>
    );
  }

  // 정사각형 썸네일이 타일을 꽉 채운다
  return (
    <Image
      src={p.cover.src}
      alt={p.cover.alt}
      fill
      sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
    />
  );
}
