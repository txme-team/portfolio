"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full border-b border-white/40 bg-transparent py-3 text-[16px] text-paper placeholder:text-white/50 outline-none transition-colors focus:border-lime";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-white/15 p-8 text-center" role="status">
        <p className="display-ko text-[1.5rem] text-lime">문의가 전달됐습니다.</p>
        <p className="mt-3 text-[14px] leading-relaxed text-white/60">
          남겨주신 연락처로 빠르게 회신드리겠습니다.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="hover-line mt-6 text-[14px] font-medium text-white/70"
        >
          다른 문의 남기기 →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block">
          <span className="label text-white/75">이름</span>
          <input
            name="name"
            required
            maxLength={40}
            autoComplete="name"
            placeholder="홍길동"
            className={field}
          />
        </label>
        <label className="block">
          <span className="label text-white/75">회사</span>
          <input
            name="company"
            required
            maxLength={80}
            autoComplete="organization"
            placeholder="회사명"
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className="label text-white/75">연락처</span>
        <input
          name="contact"
          required
          maxLength={120}
          autoComplete="email"
          placeholder="이메일 또는 전화번호"
          className={field}
        />
      </label>

      <label className="block">
        <span className="label text-white/75">내용</span>
        <textarea
          name="message"
          required
          maxLength={2800}
          rows={4}
          placeholder="만들고 싶은 것, 일정, 예산 등을 편하게 적어주세요."
          className={`${field} resize-none`}
        />
      </label>

      {/* 허니팟: 사람에게는 보이지 않는 필드 */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-col items-center gap-4 pt-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 rounded-full bg-lime px-7 py-3.5 text-[16px] font-semibold text-ink transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
        >
          {status === "sending" ? "보내는 중…" : "문의 보내기"}
          <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </button>
        {status === "error" && (
          <p role="alert" className="text-center text-[14px] leading-relaxed text-white/70">
            전송에 실패했습니다.{" "}
            <a href={`mailto:${profile.email}`} className="text-lime underline underline-offset-4">
              {profile.email}
            </a>
            로 보내주세요.
          </p>
        )}
      </div>
    </form>
  );
}
