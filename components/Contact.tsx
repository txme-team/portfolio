"use client";

import Reveal from "./Reveal";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink text-paper">
      {/* 한 단, 가운데 정렬: 제목 → 설명 → 폼 */}
      <div className="mx-auto max-w-[40rem] px-5 py-24 md:py-36">
        <Reveal>
          <h2 className="display-ko text-center text-[clamp(1.75rem,3.1vw,2.75rem)]">
            문의
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-md text-center text-[16px] leading-relaxed text-white/60">
            아이디어만 있어도 좋습니다. 무엇을 만들고 싶은지 들려주시면,
            어떻게 현실로 만들지 함께 그려드립니다.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 md:mt-14">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
