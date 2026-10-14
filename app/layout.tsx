import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://txme.me"),
  title: "오진미 Jinmi Oh — From What If to What's Next.",
  description:
    "기획부터 디자인, 개발, 출시 이후의 운영까지 한 사람이 맡습니다. 모바일 앱 · 웹 서비스 · 랜딩페이지 · 백오피스.",
  keywords: [
    "오진미",
    "외주 개발",
    "서비스 기획",
    "UX/UI 디자인",
    "랜딩페이지 제작",
    "백오피스 구축",
    "포트폴리오",
  ],
  openGraph: {
    title: "오진미 Jinmi Oh — From What If to What's Next.",
    description:
      "기획부터 디자인, 개발, 출시 이후의 운영까지 한 사람이 맡습니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
