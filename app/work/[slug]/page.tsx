import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectNav from "@/components/ProjectNav";
import Gallery from "@/components/Gallery";
import { shownProjects } from "@/lib/content";

const detailed = shownProjects.filter((p) => p.detail);

export const dynamicParams = false;

export function generateStaticParams() {
  return detailed.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = detailed.find((x) => x.slug === slug);
  if (!p?.detail) return {};
  return {
    title: `${p.title} — ${p.subtitle} | Jinmi Oh`,
    description: p.detail.summary,
    openGraph: {
      title: `${p.title} — ${p.subtitle}`,
      description: p.detail.summary,
      images: p.detail.images?.length ? [p.detail.images[0].src] : undefined,
    },
  };
}

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = detailed.findIndex((x) => x.slug === slug);
  const p = detailed[index];
  if (!p?.detail) notFound();
  const d = p.detail;
  const next = detailed[(index + 1) % detailed.length];
  const prev = detailed[(index - 1 + detailed.length) % detailed.length];

  const meta = [
    { k: "기간", v: d.period },
    { k: "역할", v: p.role.join(" · ") },
    ...(d.platform ? [{ k: "유형", v: d.platform }] : []),
    ...(d.award ? [{ k: "수상", v: d.award }] : []),
  ];
  // 이미지가 있거나, 곧 들어올 자리를 잡아 둔 경우 이미지 칸을 쓴다
  const hasImages = (d.images?.length ?? 0) > 0 || !!d.placeholder;

  const identity = (
    <div>
      <Link href="/#work" className="hover-line label text-muted">
        ← All work
      </Link>
      <h1 className="display-ko mt-5 text-[clamp(1.5rem,2.2vw,2rem)]">
        {p.title}
      </h1>
      <p className="mt-1.5 text-[16px] text-muted">{p.subtitle}</p>

      <dl className="mt-6 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-t border-line pt-5 text-[14px]">
        {meta.map((m) => (
          <div key={m.k} className="contents">
            <dt className="text-muted">{m.k}</dt>
            <dd className="font-medium">{m.v}</dd>
          </div>
        ))}
        {d.link && (
          <div className="contents">
            <dt className="text-muted">링크</dt>
            <dd>
              <a
                href={d.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
              >
                {d.link.label} ↗
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );

  const sections = (
    <div className="border-t border-line">
      {d.sections.map((s) => (
        <section key={s.heading} className="border-b border-line py-4">
          <h2 className="text-[14px] font-semibold">{s.heading}</h2>
          <ul className="mt-2 space-y-1.5 text-[16px] leading-relaxed text-ink-soft">
            {s.items.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span
                  aria-hidden
                  className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-ink"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );

  return (
    <>
      <SmoothScroll />
      <Nav />
      {/*
        한 화면에 들어오는 2단 구성.
        이미지가 있으면: 왼쪽 = 제목 · 요약 · 기본 정보 · 항목, 오른쪽 = 이미지(스크롤해도 따라옴)
        이미지가 없으면: 왼쪽 = 제목 · 요약 · 기본 정보(따라옴), 오른쪽 = 항목
        좁은 화면에서는 제목 → 이미지 → 항목 순으로 쌓인다.
      */}
      <main
        id="top"
        className="mx-auto max-w-[1600px] px-5 pb-16 pt-24 md:px-10 md:pb-20 md:pt-[6.5rem]"
      >
        <div className="grid gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 xl:grid-cols-[minmax(0,4.5fr)_minmax(0,7.5fr)] xl:gap-x-16">
          <div className={hasImages ? "lg:col-start-1 lg:row-start-1" : "lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:self-start"}>
            {identity}
          </div>

          {hasImages ? (
            <>
              <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
                <Gallery images={d.images ?? []} kind={d.gallery} title={p.title} />
              </div>
              <div className="lg:col-start-1 lg:row-start-2">{sections}</div>
            </>
          ) : (
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">{sections}</div>
          )}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 md:mt-16">
          <p className="text-[16px] font-medium">비슷한 작업이 필요하신가요?</p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-lime hover:text-ink"
          >
            프로젝트 문의하기
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
        </div>
      </main>
      <ProjectNav
        prev={{ slug: prev.slug, title: prev.title }}
        next={{ slug: next.slug, title: next.title }}
      />
      <Footer />
    </>
  );
}
