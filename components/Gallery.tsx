"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ProjectImage } from "@/lib/content";

// 상세 페이지 오른쪽 칸의 이미지 영역.
// 대표 이미지 한 장 + 전체 화면을 한눈에 보는 썸네일 격자. 누르면 크게 보기(라이트박스).
// 모바일 화면 묶음(phones)은 한 줄에 나란히.
export default function Gallery({
  images,
  kind,
  title,
}: {
  images: ProjectImage[];
  kind?: "phones";
  title: string;
}) {
  // 이미지가 아직 없는 프로젝트: 들어올 자리만 같은 크기로 잡아 둔다
  if (images.length === 0) return <Placeholder kind={kind} title={title} />;
  return <Media images={images} kind={kind} />;
}

function Placeholder({ kind, title }: { kind?: "phones"; title: string }) {
  if (kind === "phones") {
    return (
      <ul aria-label={`${title} 화면 이미지 준비 중`} className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <li
            key={i}
            className={`aspect-[375/812] rounded-xl border border-dashed border-line bg-paper-2 ${i > 2 ? "hidden sm:block" : ""}`}
          />
        ))}
      </ul>
    );
  }
  return (
    <div aria-label={`${title} 화면 이미지 준비 중`}>
      <div className="grid aspect-[2/1] w-full place-items-center rounded-xl border border-dashed border-line bg-paper-2">
        <span className="text-[14px] text-muted">이미지 준비 중</span>
      </div>
      <ul className="mt-3 grid grid-cols-4 gap-2 lg:gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i} className="aspect-video rounded-md border border-dashed border-line bg-paper-2" />
        ))}
      </ul>
    </div>
  );
}

function Media({ images, kind }: { images: ProjectImage[]; kind?: "phones" }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);

  // 틀의 비율은 프로젝트 안에서 고정한다(첫 이미지 기준, 2:1 ~ 16:10 사이).
  // 넘길 때마다 크기가 바뀌지 않게 하기 위해서다.
  const first = images[0];
  const frame = Math.min(0.625, Math.max(0.5, first.h / first.w));
  const current = images[index];
  // 틀보다 훨씬 긴 웹 화면은 윗부분만 보여 주고, 나머지는 크게 보기에서 확인.
  // 모바일 화면(폭 600px 이하)은 자르지 않고 통째로 보여 준다.
  const cropped = current.w > 600 && current.h / current.w > frame * 1.25;

  return (
    <>
      {kind === "phones" ? (
        <ul
          className={`grid grid-cols-3 gap-3 lg:gap-4 ${
            images.length === 6 ? "sm:grid-cols-6" : "sm:grid-cols-5"
          }`}
        >
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setZoom(i)}
                aria-label={`${i + 1}번째 화면 크게 보기`}
                className="block w-full overflow-hidden rounded-xl border border-line bg-paper transition-colors hover:border-ink"
              >
                <Image
                  src={img.src}
                  width={img.w}
                  height={img.h}
                  alt={img.alt}
                  sizes="(min-width: 1024px) 160px, 30vw"
                  loading={i < 3 ? "eager" : "lazy"}
                  className="h-auto w-full"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setZoom(index)}
            aria-label="이미지 크게 보기"
            style={{ aspectRatio: `1 / ${frame}` }}
            className="group relative block w-full overflow-hidden rounded-xl border border-line bg-paper-2"
          >
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="(min-width: 1024px) 60vw, 95vw"
              loading="eager"
              className={cropped ? "object-cover object-top" : "object-contain"}
            />
            {cropped && (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-paper to-transparent"
              />
            )}
            <span className="absolute bottom-3 right-3 rounded-full border border-line bg-paper/95 px-3 py-1 text-[13px] font-medium transition-colors group-hover:border-ink">
              크게 보기
            </span>
          </button>

          {images.length > 1 && (
            <ul className="mt-3 grid grid-cols-4 gap-2 lg:gap-3">
              {images.map((img, i) => (
                <li key={img.src}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`${i + 1}번째 이미지 보기`}
                    aria-current={i === index}
                    className={`relative block aspect-video w-full overflow-hidden rounded-md border bg-paper-2 transition-opacity ${
                      i === index ? "border-ink" : "border-line opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 200px, 24vw"
                      className="object-cover object-top"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {current.caption && (
            <p className="mt-3 text-[14px] text-muted">{current.caption}</p>
          )}
        </div>
      )}

      {zoom !== null && (
        <Lightbox images={images} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} />
      )}
    </>
  );
}

function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: ProjectImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const count = images.length;
  const img = images[index];

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    // 열려 있는 동안 ← → 키는 프로젝트 이동이 아니라 이미지 이동에 쓴다 (ProjectNav가 이 표시를 본다)
    document.body.dataset.lightbox = "open";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndex((index - 1 + count) % count);
      if (e.key === "ArrowRight") onIndex((index + 1) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      delete document.body.dataset.lightbox;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, count, onIndex, onClose]);

  const btn =
    "grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-ink/60 text-paper transition-colors hover:border-white";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="이미지 크게 보기"
      data-lenis-prevent
      onClick={onClose}
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink/90 px-4 pb-10 pt-16 backdrop-blur-sm md:px-10"
    >
      <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 md:px-10">
        <span className="label text-white/70">
          {index + 1} / {count}
        </span>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {count > 1 && (
            <>
              <button type="button" className={btn} aria-label="이전 이미지" onClick={() => onIndex((index - 1 + count) % count)}>
                ←
              </button>
              <button type="button" className={btn} aria-label="다음 이미지" onClick={() => onIndex((index + 1) % count)}>
                →
              </button>
            </>
          )}
          <button type="button" className={btn} aria-label="닫기" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <Image
        key={img.src}
        src={img.src}
        width={img.w}
        height={img.h}
        alt={img.alt}
        sizes="94vw"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: `min(${img.w}px, 1400px, 100%)` }}
        className="mx-auto h-auto w-full rounded-lg bg-paper"
      />
    </div>
  );
}
