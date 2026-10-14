"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Target = { slug: string; title: string };

// 상세 페이지 좌우에 항상 떠 있는 이전 · 다음 프로젝트 버튼.
// 넓은 화면: 화면 가장자리에 붙은 탭(본문 여백 40px 안에 들어가도록 폭 36px), 올리면 제목이 펼쳐진다.
// 좁은 화면: 여백이 20px뿐이라 본문을 가리지 않게 아래쪽 양 모서리의 원형 버튼.
export default function ProjectNav({ prev, next }: { prev: Target; next: Target }) {
  const router = useRouter();

  // 키보드 ← → 로도 이동
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      // 이미지 크게 보기가 열려 있으면 ← → 는 이미지 이동에 쓰인다
      if (document.body.dataset.lightbox === "open") return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (e.key === "ArrowLeft") router.push(`/work/${prev.slug}`);
      if (e.key === "ArrowRight") router.push(`/work/${next.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev.slug, next.slug]);

  const base =
    "group fixed z-30 flex items-center border border-line bg-paper/95 text-ink shadow-[0_6px_24px_rgba(0,0,0,0.10)] backdrop-blur transition-colors hover:border-ink hover:bg-ink hover:text-paper";
  const label =
    "hidden max-w-0 overflow-hidden whitespace-nowrap text-[14px] font-semibold transition-[max-width,padding] duration-300 md:block md:group-hover:max-w-[16rem]";

  return (
    <nav aria-label="프로젝트 이동">
      <Link
        href={`/work/${prev.slug}`}
        aria-label={`이전 프로젝트: ${prev.title}`}
        className={`${base} bottom-4 left-4 h-11 w-11 justify-center rounded-full md:bottom-auto md:left-0 md:top-1/2 md:h-14 md:w-auto md:min-w-9 md:-translate-y-1/2 md:justify-start md:rounded-none md:rounded-r-xl md:border-l-0 md:px-2.5`}
      >
        <span aria-hidden>←</span>
        <span className={`${label} md:group-hover:pl-2.5 md:group-hover:pr-1`}>{prev.title}</span>
      </Link>

      <Link
        href={`/work/${next.slug}`}
        aria-label={`다음 프로젝트: ${next.title}`}
        className={`${base} bottom-4 right-4 h-11 w-11 justify-center rounded-full md:bottom-auto md:right-0 md:top-1/2 md:h-14 md:w-auto md:min-w-9 md:-translate-y-1/2 md:justify-end md:rounded-none md:rounded-l-xl md:border-r-0 md:px-2.5`}
      >
        <span className={`${label} md:group-hover:pl-1 md:group-hover:pr-2.5`}>{next.title}</span>
        <span aria-hidden>→</span>
      </Link>
    </nav>
  );
}
