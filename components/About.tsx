"use client";

import Image from "next/image";
import { profile, career, profileLinks, videos } from "@/lib/content";
import Reveal from "./Reveal";

// 구성: 맨 위에 이름 · 링크, 그 아래를 같은 폭으로 좌우로 나눈다(넓은 화면).
// 왼쪽 = 경력, 오른쪽 = 영상. 좁은 화면에서는 한 줄로 쌓인다.
// 강의 · 발표(content.ts 의 talks)는 지금은 보여주지 않는다.
export default function About() {
  return (
    <section id="about">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        {/* 이름 · 글 · 프로필 링크 */}
        <div>
          <Reveal>
            <h2 className="display-ko text-[clamp(1.75rem,3.1vw,2.75rem)]">
              {profile.nameKo}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-5 flex flex-wrap gap-2">
              {profileLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-paper py-1.5 pl-1.5 pr-4 text-[14px] font-semibold transition-colors hover:border-ink"
                  >
                    {l.image && (
                      <Image
                        src={l.image}
                        width={28}
                        height={28}
                        alt=""
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    )}
                    {l.label}
                    <span className="text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-16 gap-y-14 md:mt-16 xl:grid-cols-2">
          {/* 경력 */}
          <div>
            <p className="label mb-4 text-muted">Career</p>
            <ul className="border-t border-line">
              {career.map((c, i) => (
                <li key={c.company} className="border-b border-line">
                  <Reveal delay={i * 0.04}>
                    <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-x-5 gap-y-2 py-5 md:grid-cols-[2.75rem_minmax(0,1fr)_auto]">
                      <Logo src={c.logo} name={c.company} />
                      <div>
                        <h3 className="text-[17px] font-bold leading-snug tracking-tight">
                          {c.company}
                        </h3>
                        <p className="mt-0.5 text-[14px] font-semibold text-ink-soft">
                          {c.role}
                        </p>
                      </div>
                      <span className="label col-start-2 whitespace-nowrap text-muted md:col-start-auto md:text-right">
                        {c.period}
                      </span>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* 영상: 작은 썸네일 + 제목, 한 줄에 하나씩 */}
            <p className="label mb-4 text-muted">Video</p>
            <ul className="border-t border-line">
              {videos.map((v, i) => (
                <li key={v.href} className="border-b border-line">
                  <Reveal delay={i * 0.04}>
                    <a
                      href={v.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-5 py-4"
                    >
                      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-paper-2 sm:w-32">
                        {v.image && (
                          <Image
                            src={v.image}
                            alt=""
                            fill
                            sizes="128px"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[16px] font-semibold leading-snug">
                          {v.label}
                        </h3>
                        {v.note && (
                          <p className="mt-1 text-[14px] text-muted">
                            {v.note}
                          </p>
                        )}
                      </div>
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Logo({ src, name }: { src?: string; name: string }) {
  if (!src) {
    // 로고가 없는 항목(프리랜서)은 같은 자리에 머리글자만
    return (
      <span
        aria-hidden
        className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-paper text-[16px] font-bold text-muted"
      >
        {name.charAt(0)}
      </span>
    );
  }
  return (
    <Image
      src={src}
      width={44}
      height={44}
      alt={`${name} 로고`}
      className="h-11 w-11 rounded-xl border border-line bg-paper object-cover"
    />
  );
}
