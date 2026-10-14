// ─────────────────────────────────────────────────────────────
//  사이트의 모든 내용. 구조: 핵심 가치(hero · values) → 예시(examples) → 포트폴리오(projects).
//  Edit here to update the site — no component changes needed.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Jinmi Oh",
  nameKo: "오진미",
  email: "ceo@txme.me",
  education: "경북대학교 경영학부 학사",
};

// ── 핵심 가치 (히어로) ─────────────────────────────────────────
export const hero = {
  headline: ["From What If", "to What's Next."],
  sub: "Turning curiosity into ideas, and ideas into reality.",
};

// ── 세 가지 소구점: 아이콘 → 주장 → 의뢰인이 얻는 것 ───────────
// 아이콘은 히어로 큐브와 같은 재질로 직접 그린 것 (scripts/render-icons.sh)
// (고객사 수 같은 회사 차원의 숫자는 개인 성과가 아니므로 쓰지 않는다)
export const values = [
  {
    icon: "/icons/y2k-gear.webp",
    title: "출시 후까지 설계합니다",
    body: "만드는 것과 운영되는 것은 다릅니다. 서비스를 직접 운영해 본 경험으로, 실제 운영에 필요한 부분까지 담아서 만듭니다.",
  },
  {
    icon: "/icons/y2k-chart.webp",
    title: "팔리는 서비스를 만듭니다",
    body: "보기 좋은 화면이 목표가 아닙니다. 유저가 무엇을 원하는지, 본질부터 생각하고 만듭니다.",
  },
  {
    icon: "/icons/y2k-puzzle.webp",
    title: "복잡한 요구도 구조화합니다",
    body: "구조가 복잡하거나, 요구사항이 다양하거나, 여러 이해관계자가 얽혀 있는 일. 정리가 안 돼서 시작하지 못하던 일을 구조부터 잡습니다.",
  },
];

// ── 맡길 수 있는 일의 예시. key는 작업물의 types와 포트폴리오 필터에 쓰인다 ──
export type ExampleKey = "app" | "web" | "landing" | "admin";

export const examples: { key: ExampleKey; label: string; desc: string }[] = [
  {
    key: "app",
    label: "모바일 앱",
    desc: "온보딩부터 결제까지, 처음 쓰는 사람도 막히지 않는 흐름을 설계합니다.",
  },
  {
    key: "web",
    label: "웹 서비스",
    desc: "결제 · 로그인 · 알림까지 붙어 실제로 돌아가는 서비스를 만듭니다.",
  },
  {
    key: "landing",
    label: "랜딩페이지",
    desc: "목적에 맞게 기획하고, 찍어낸 듯하지 않게 디자인합니다.",
  },
  {
    key: "admin",
    label: "백오피스 · 어드민",
    desc: "수작업을 줄이는 내부 도구. 관리 항목이 많고 도메인이 복잡할수록 효과가 큽니다.",
  },
];

// ── Selected Work ──────────────────────────────────────────────
//  detail이 있는 프로젝트는 /work/[slug] 상세 페이지가 생성된다.
//  이미지가 있는 6개는 위시켓 포트폴리오, 글만 있는 4개는 이력서가 출처.
export type ProjectImage = {
  src: string;
  w: number;
  h: number;
  alt: string;
  caption?: string;
};

export type ProjectDetail = {
  period: string;
  platform?: string;
  /** 화면에는 노출하지 않는다. 검색 · 공유용 설명(meta description)으로만 쓰인다 */
  summary: string;
  sections: { heading: string; items: string[] }[];
  /** 기본은 대표 이미지 + 썸네일. phones는 모바일 화면을 한 줄로 */
  gallery?: "phones";
  /** 이미지가 아직 없을 때 이미지 자리를 비워 둔다 (나중에 images만 채우면 됨) */
  placeholder?: boolean;
  /** 기본 정보에 '수상' 줄로 표시 */
  award?: string;
  /** 비어 있으면 갤러리 없이 글만 있는 상세 페이지 */
  images?: ProjectImage[];
  link?: { href: string; label: string };
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  role: string[];
  year: string;
  /** 어떤 예시(맡길 수 있는 일)에 해당하는지. 예시를 누르면 이 값으로 걸러진다 */
  types: ExampleKey[];
  /** true면 포트폴리오에 표시하지 않고, 상세 페이지도 만들지 않는다 */
  disabled?: boolean;
  /** 카드 썸네일(정사각형). 없으면 타이포 타일로 대체 */
  cover?: ProjectImage;
  detail?: ProjectDetail;
};

const shots = (
  slug: string,
  sizes: [number, number][],
  alt: string,
  extra: Record<number, Partial<ProjectImage>> = {}
): ProjectImage[] =>
  sizes.map(([w, h], i) => ({
    src: `/work/${slug}-${String(i + 1).padStart(2, "0")}.png`,
    w,
    h,
    alt: `${alt} 화면 ${i + 1}`,
    ...extra[i],
  }));

// 카드 썸네일: 위시켓 포트폴리오에 올린 것과 같은 그림 (480×480)
const thumb = (slug: string, alt: string): ProjectImage => ({
  src: `/work/thumb-${slug}.jpeg`,
  w: 480,
  h: 480,
  alt,
});

const web = (n: number): [number, number][] =>
  Array.from({ length: n }, () => [1920, 970]);

const canaRotation = shots("cana-rotation", web(6), "로테이션 소개팅 웹사이트");
const canaLanding = shots("cana-landing", web(6), "소개팅 서비스 랜딩페이지", {
  0: { caption: "Hero 페이지 — 백그라운드 이미지도 직접 생성" },
});
const canaApp = shots(
  "cana-app",
  [
    [375, 812],
    [375, 812],
    [375, 812],
    [375, 880],
    [375, 812],
  ],
  "소개팅 앱"
);
const designSystem = shots(
  "design-system",
  [
    [1000, 3207],
    [664, 1573],
    [2346, 1779],
    [870, 1427],
    [5048, 1266],
    [1902, 1382],
  ],
  "디자인 시스템",
  {
    5: { caption: "디자인 토큰이 적용된 컴포넌트 예시" },
  }
);
const whistle = shots(
  "whistle",
  [
    [1366, 2535],
    [1366, 768],
    [1366, 1086],
    [1366, 990],
  ],
  "휘슬 커리어 관리 시스템"
);
const datingErp = shots(
  "dating-erp",
  [
    [1280, 832],
    [1280, 1003],
  ],
  "소개팅 서비스 ERP"
);

// 앱스토어용 소개 이미지(가로로 이어진 한 장)를 화면 단위로 나눈 것
const evCharging = shots(
  "ev-charging",
  Array.from({ length: 6 }, (): [number, number] => [645, 1398]),
  "전기차 충전 앱"
);

export const projects: Project[] = [
  {
    slug: "timmi",
    title: "티미",
    subtitle: "멀티체인 스테이블코인 결제 솔루션",
    role: ["기획", "디자인", "개발"],
    year: "2025",
    types: ["app", "admin"],
    cover: thumb("timmi-wallet", "티미 결제 앱"),
    detail: {
      period: "2025.06 — 2026.01",
      platform: "소비자 앱 · 가맹점 대시보드",
      summary:
        "멀티체인 스테이블코인 결제 솔루션 ‘티미’. 사용자와 시장의 문제를 정의하는 단계부터 제품 구조와 정책 설계까지, 0에서 1을 만들었습니다.",
      sections: [
        {
          heading: "작업 범위",
          items: [
            "소비자용 P2P 결제 앱 — 온보딩 · 지갑 생성 · 송금 · 결제",
            "가맹점용 결제 · 정산 대시보드 — 실시간 결제 내역, 상품별 결제 링크, 고객 관리, 쿠폰 · 혜택, API/SDK 연동",
            "제품 구조와 운영 정책 설계",
          ],
        },
        {
          heading: "주안점",
          items: [
            "핀테크 앱 수준의 쉬운 UX",
            "기술 구현뿐 아니라 규제 · 보안 · 실제 운영 프로세스까지 고려한 제품 정책",
            "비용과 수익구조를 따져 정한 MVP 범위와 기능 우선순위",
          ],
        },
      ],
      award: "BDACS 아이디어톤 우수상 (2025.10)",
      images: [
        {
          src: "/work/timmi-01.png",
          w: 1829,
          h: 940,
          alt: "티미 소비자용 결제 앱 화면",
          caption: "소비자용 결제 앱",
        },
        {
          src: "/work/timmi-02.png",
          w: 826,
          h: 558,
          alt: "티미 가맹점용 결제 · 정산 대시보드 화면",
          caption: "가맹점용 결제 · 정산 대시보드",
        },
      ],
    },
  },
  {
    slug: "ev-charging",
    title: "VZ Point",
    subtitle: "전기차 충전과 리워드 적립을 한 앱에서",
    role: ["기획", "디자인", "개발"],
    year: "2025",
    types: ["app"],
    cover: thumb("ev-charging", "전기차 충전 앱"),
    detail: {
      period: "2025.09 — 2025.12",
      platform: "Android · iOS",
      summary:
        "전기차 충전과 리워드(코인) 적립 앱의 리뉴얼. 기획, 디자인, 개발을 맡았습니다.",
      sections: [
        {
          heading: "작업 범위",
          items: [
            "앱 리뉴얼과 신규 기능 도입을 위한 기획 · 디자인 · 개발 일체",
            "회원가입 · 지갑 생성 · 니모닉 백업",
            "충전소 조회 및 충전",
            "포인트 적립과 코인 전환, 코인 출금 · 내역 조회",
          ],
        },
        {
          heading: "주안점",
          items: ["기존 앱 유저와 데이터 마이그레이션", "직관적이고 트렌디한 디자인"],
        },
      ],
      gallery: "phones",
      images: evCharging,
    },
  },
  {
    slug: "dating-app",
    title: "카나",
    subtitle: "크리스천 소개팅 서비스의 모바일 앱",
    role: ["디자인"],
    year: "2026",
    types: ["app"],
    cover: thumb("dating-app", "소개팅 앱"),
    detail: {
      period: "2026.01 — 2026.02",
      platform: "Android · iOS",
      summary:
        "크리스천 소개팅 서비스의 앱 디자인. 브랜딩부터 디자인 시스템, UX/UI까지 진행했습니다.",
      sections: [
        {
          heading: "작업 범위",
          items: [
            "브랜딩 · 로고 디자인",
            "클라이언트 요구사항을 반영한 디자인 시스템 구축",
            "UX/UI 디자인 전체",
          ],
        },
        { heading: "주안점", items: ["깔끔한 UI"] },
      ],
      gallery: "phones",
      images: canaApp,
      link: { href: "https://cana.im/home", label: "결과물 확인하기" },
    },
  },
  {
    slug: "rotation-admin",
    title: "로테이션 소개팅 백오피스",
    subtitle: "오프라인 단체 소개팅 행사를 운영하는 관리자 페이지",
    role: ["기획", "디자인", "개발"],
    year: "2026",
    types: ["admin"],
    cover: thumb("rotation-admin", "로테이션 소개팅 백오피스"),
    detail: {
      period: "2026.05 — 2026.06",
      platform: "백오피스 (웹)",
      summary:
        "오프라인 단체 소개팅 행사의 모집부터 현장 진행까지 운영하는 관리자 페이지.",
      sections: [
        {
          heading: "작업 범위",
          items: [
            "신청자 검토와 상태 관리 (검토중 · 대기 · 확정 · 반려 · 취소)",
            "회차별 행사 개설 — 일시 · 장소 · 연령대 · 정원 · 참가비",
            "회원 목록, 결제 내역과 매출 현황",
            "안내 문자 발송, 첫인상 투표, 프로필 카드 출력",
          ],
        },
        {
          heading: "주안점",
          items: ["모집 → 검토 → 확정 → 결제 → 안내 → 현장으로 이어지는 행사 운영 흐름에 맞춘 구성"],
        },
      ],
      images: [
        {
          src: "/work/rotation-admin-01.jpg",
          w: 2486,
          h: 1256,
          alt: "로테이션 소개팅 백오피스 신청자 명단 화면 (개인정보 가림)",
          caption: "신청자 명단 — 개인정보는 가렸습니다",
        },
        {
          src: "/work/rotation-admin-02.jpg",
          w: 2486,
          h: 1256,
          alt: "로테이션 소개팅 백오피스 이벤트 관리 화면",
          caption: "이벤트 관리",
        },
        {
          src: "/work/rotation-admin-03.jpg",
          w: 1194,
          h: 650,
          alt: "로테이션 소개팅 백오피스 이벤트 상세 화면 (개인정보 가림)",
          caption: "이벤트 상세 — 확정 인원 · 장소 · 프로필 카드",
        },
        {
          src: "/work/rotation-admin-04.jpg",
          w: 1194,
          h: 650,
          alt: "로테이션 소개팅 백오피스 매출 현황 화면",
          caption: "매출 현황",
        },
        {
          src: "/work/rotation-admin-05.jpg",
          w: 1194,
          h: 650,
          alt: "로테이션 소개팅 백오피스 문자 관리 화면",
          caption: "문자 관리 — 자동 · 예약 · 수동 발송",
        },
      ],
    },
  },
  {
    slug: "whistle",
    title: "휘슬",
    subtitle: "채용 플랫폼 커리어 관리 시스템",
    role: ["기획", "디자인"],
    year: "2024",
    types: ["web"],
    cover: thumb("whistle", "휘슬 커리어 관리 시스템"),
    detail: {
      period: "2024.11 — 2024.12",
      platform: "웹",
      summary:
        "채용 플랫폼 ‘휘슬’의 커리어 관리 기능 신규 도입에 따라 기획과 디자인을 진행했습니다. 내 커리어와 관련된 사항 전반을 기록하고 관리하는 기능입니다.",
      sections: [
        {
          heading: "작업 범위",
          items: ["기능 정의", "화면 설계", "UX/UI 디자인"],
        },
        {
          heading: "주요 기능",
          items: [
            "업무 — 업무 로그, 업무 경험, 개인 경험, 리더 경험",
            "커리어 니즈 — 연봉 로그 및 목표 연봉, 희망 근무 환경, 경력 개발 현황, 구직 상태",
            "평가 — 내부 평가, 추천서 요청 및 수신",
            "서류함 — 구직 관련 서류 일체 관리",
          ],
        },
        {
          heading: "주안점",
          items: [
            "입력해야 하는 정보가 방대한 만큼, 논리적으로 구조화하는 것을 가장 중요하게 두고 작업",
          ],
        },
      ],
      images: whistle,
    },
  },
  {
    slug: "dating-erp",
    title: "소개왕 김혜지",
    subtitle: "소개팅 회사의 고객 · 채팅 · 일정 관리용 내부 시스템",
    role: ["기획", "디자인"],
    year: "2025",
    types: ["admin"],
    cover: thumb("dating-erp", "소개팅 서비스 ERP"),
    detail: {
      period: "2025.05 — 2025.09",
      platform: "웹 · 백오피스",
      summary:
        "소개팅 플랫폼의 내부 업무 환경 개선을 위한 백오피스 및 ERP 시스템 디자인. 고객 관리 자동화와 채팅, 일정 관리 등 주요 업무를 기능으로 만들었습니다.",
      sections: [
        {
          heading: "작업 범위",
          items: [
            "디자인 시스템",
            "UX/UI 디자인",
          ],
        },
        {
          heading: "주안점",
          items: ["내부 업무용 제품인 만큼 직관적인 UX를 최우선으로 둠"],
        },
      ],
      images: datingErp,
    },
  },
  {
    slug: "dating-landing",
    title: "카나 랜딩페이지",
    subtitle: "크리스천 소개팅 서비스를 알리는 소개 페이지",
    role: ["기획", "디자인", "개발"],
    year: "2026",
    types: ["landing"],
    cover: thumb("dating-landing", "소개팅 서비스 랜딩페이지"),
    detail: {
      period: "2026.06",
      platform: "웹 · 랜딩",
      summary:
        "크리스천 소개팅 서비스 ‘카나’의 랜딩페이지. 디자인부터 개발까지 전체를 맡았습니다.",
      sections: [
        {
          heading: "작업 범위",
          items: [
            "UX/UI 디자인",
            "Claude Code를 활용한 반응형 웹 구축",
          ],
        },
        {
          heading: "주안점",
          items: ["직관적인 정보 전달", "브랜드 이미지에 맞는 디자인"],
        },
      ],
      images: canaLanding,
      link: {
        href: "https://cana-for-love.vercel.app/",
        label: "결과물 확인하기",
      },
    },
  },
  {
    slug: "rotation-dating",
    title: "로테이션 소개팅 플랫폼",
    subtitle: "크리스천 직장인을 위한 소개팅 서비스",
    role: ["기획", "디자인", "개발"],
    year: "2026",
    types: ["web", "landing"],
    cover: thumb("rotation-dating", "로테이션 소개팅 웹사이트"),
    detail: {
      period: "2026.05 — 2026.06",
      platform: "웹 · 랜딩",
      summary:
        "크리스천 직장인을 위한 로테이션 소개팅 랜딩페이지와 웹사이트. 서비스 기획부터 디자인, 브랜딩, 개발까지 A to Z로 진행했습니다.",
      sections: [
        {
          heading: "작업 범위",
          items: [
            "서비스 기획, 디자인, 브랜딩, 개발 등 A to Z",
            "Claude Code를 이용한 반응형 웹사이트 구축",
            "PG 결제 · 구글 로그인 · 자동 발송 MMS 연동",
          ],
        },
        { heading: "주안점", items: ["전환율 상승", "AI스럽지 않은 디자인"] },
      ],
      images: canaRotation,
      link: {
        href: "https://cana-for-love.vercel.app/rotation",
        label: "결과물 확인하기",
      },
    },
  },
  {
    slug: "daengdaengpang",
    title: "댕댕팡",
    subtitle: "강아지 타일 매칭 퍼즐 게임",
    role: ["기획", "디자인", "개발"],
    year: "2026",
    types: ["app"],
    cover: thumb("daengdaengpang", "댕댕팡 게임 화면"),
    detail: {
      period: "2026.01",
      platform: "모바일 게임",
      summary:
        "귀여운 강아지 타일을 매칭하는 레트로 퍼즐 게임. 기획과 디자인부터 AI를 활용한 게임 개발까지 직접 진행한 미니 프로젝트로, 앱스토어 런칭을 완료했습니다.",
      sections: [
        {
          heading: "작업 범위",
          items: ["게임 기획", "디자인", "AI를 활용한 게임 개발", "앱스토어 런칭"],
        },
        {
          heading: "주안점",
          items: ["귀여운 강아지 타일과 레트로 분위기"],
        },
      ],
      images: [
        {
          src: "/work/daengdaengpang-01.jpg",
          w: 2400,
          h: 1200,
          alt: "댕댕팡 앱 아이콘과 로고",
          caption: "앱 아이콘 · 로고",
        },
        {
          src: "/work/daengdaengpang-02.jpg",
          w: 2400,
          h: 1200,
          alt: "댕댕팡 게임 화면 네 장",
          caption: "게임 화면",
        },
        {
          src: "/work/daengdaengpang-03.jpg",
          w: 2400,
          h: 1200,
          alt: "댕댕팡 강아지 캐릭터 12종",
          caption: "강아지 캐릭터 12종",
        },
      ],
      link: { href: "https://dangdangpang.vercel.app/", label: "게임 해보기" },
    },
  },
  {
    slug: "design-system",
    title: "Design System",
    subtitle: "토큰에서 패턴까지 이어지는 디자인 시스템",
    role: ["디자인"],
    year: "2026",
    types: [],
    disabled: true,
    cover: thumb("design-system", "디자인 시스템"),
    detail: {
      period: "2026.01 — 2026.02",
      platform: "IT 서비스 구축",
      summary:
        "토큰 → 컴포넌트 → 패턴으로 이어지는 위계를 가진 디자인 시스템을 설계했습니다.",
      sections: [
        {
          heading: "디자인 토큰",
          items: ["color, spacing, typography, radius 등 정의"],
        },
        {
          heading: "컴포넌트",
          items: [
            "button, input, select, modal popup, table 등",
            "variants 및 state에 따라 정의",
          ],
        },
        {
          heading: "설계 원칙",
          items: ["네이밍 및 구조 통일성 유지", "반응형을 고려한 설계"],
        },
      ],
      images: designSystem,
    },
  },
  {
    slug: "octet",
    title: "OCTET",
    subtitle: "기업의 블록체인 지갑 구축과 운영을 돕는 서비스",
    role: ["서비스 팀장", "PM"],
    year: "2021–24",
    types: ["web", "admin"],
    disabled: true,
    detail: {
      period: "2021.06 — 2024.12",
      platform: "B2B SaaS",
      summary:
        "헥슬란트(現 헥토월렛원)의 기업용 블록체인 B2B SaaS ‘옥텟’의 리뉴얼과 운영을 총괄했습니다.",
      sections: [
        {
          heading: "주요 업무",
          items: [
            "‘옥텟’ 리뉴얼 및 운영 총괄",
            "대기업 · 금융권 · 정부기관 고객사와 소통하며 업무",
            "서비스팀 팀장으로 개발자 · CS 매니저 13명 리딩",
          ],
        },
        {
          heading: "리뉴얼 1년의 결과",
          items: [
            "매출 126% 증가",
            "고객사 27% 증가, 고객사당 매출 28% 증가",
            "국내 가상자산사업자 점유율 40% (이후 50%)",
            "트래픽이 급증하는 동안 보안사고 0건",
            "사용자 만족도 조사 ‘만족’ 48.6%, ‘매우 만족’ 37.1%",
          ],
        },
        {
          heading: "리뉴얼 — 문제 → 해결 → 결과",
          items: [
            "가입 후 무엇을 해야 할지 몰라 문의가 이어짐 → 첫 접속 시 홈 화면에서 다음 행동을 안내 → 관련 문의 100% 감소",
            "지갑 생성 과정이 직관적이지 않아 기술팀 안내 없이는 만들기 어려움 → 순서대로 따라가는 위저드 방식으로 개선 → 관련 문의 약 90% 감소",
            "기능이 대시보드 곳곳에 흩어져 찾기 어려움 → API 연동에 필요한 기능을 모은 ‘개발자 도구’ 페이지 신설 → 관련 문의 약 85% 감소",
            "누락되는 문의가 잦고 반복 처리에 시간이 많이 듦 → 처리 프로세스와 답변 템플릿 도입 → 평균 처리 시간 10분 이내, 만족도 4.7점(5점 만점)",
          ],
        },
        {
          heading: "백오피스",
          items: [
            "개발자가 직접 처리하던 반복 문의를 운영자가 처리할 수 있게 회원 · 계약 · 토큰 관리 페이지 도입",
            "하루 이상 대기하던 단순 작업을 5분 이내로 단축",
            "ISMS 규정에 따른 기능 기획 — 관리자 권한 분리, 로그 관리, 개인정보 보호 처리, 접속 IP 관리",
          ],
        },
        {
          heading: "고객 사례 — 스타벅스 NFT 에코 프로젝트",
          items: [
            "스타벅스 코리아의 NFT 에코 프로젝트 ‘STARBUCKS STAR★LIGHT’에 옥텟 지갑 기술 지원",
            "신세계아이앤씨 ‘스파로스 NFT’의 지갑 멀티시그 보안 구축, NFT 발행 · 발급 프로세스 단축",
            "별도 지갑 앱 없이 스타벅스 앱만으로 NFT를 받을 수 있는 구조",
          ],
        },
      ],
      link: {
        href: "https://youtu.be/G8_2QXtBhFU",
        label: "옥텟 튜토리얼 영상",
      },
    },
  },
  {
    slug: "ohai-wallet",
    title: "오하이월렛",
    subtitle: "신한 SOL 앱 안에서 쓰는 가상자산 지갑",
    role: ["기획", "디자인"],
    year: "2024",
    types: ["app"],
    disabled: true,
    detail: {
      period: "2024.06 — 2024.12",
      platform: "모바일 앱",
      summary:
        "신한 SOL 앱에 탑재된 가상자산 지갑 ‘오하이월렛’의 리뉴얼과 운영을 총괄했습니다. 제품을 둘러싼 문제점을 바로잡으며 규제 대응, 신규 기능 기획, 프로세스 개선을 진행했습니다.",
      sections: [
        {
          heading: "신한은행 × 컴투스 프로야구 멤버십 NFT 이벤트",
          items: [
            "신한 SOL 앱에서 NFT 지갑을 만들면 한정판 NFT가 지급되는 이벤트 오픈",
            "XPLA 메인넷 런칭과 이벤트 오픈을 위해 신한은행 · 컴투스 두 고객사와 소통",
          ],
        },
        {
          heading: "가상자산이용자보호법 대비",
          items: [
            "법 시행을 앞두고 규제를 준수할 수 있도록 추가 기능 기획",
            "운영 프로세스 수정",
          ],
        },
        {
          heading: "KYC",
          items: [
            "KYC 프로세스에서 누락된 항목 추가",
            "재심사 대상에게 안내하는 팝업과 안내 정책 수립",
          ],
        },
        {
          heading: "AML",
          items: [
            "WLF 매칭 안내 페이지, EEDD 고객 대상 안내 페이지 등 AML 관련 추가 기능 기획",
          ],
        },
      ],
    },
  },
  {
    slug: "class101",
    title: "Class101",
    subtitle: "온라인 클래스 구독 서비스의 리텐션 개선",
    role: ["Growth PM"],
    year: "2025",
    types: ["app", "web"],
    disabled: true,
    detail: {
      period: "2025.01 — 2025.05",
      summary:
        "클래스101 구독자의 Stickiness와 리텐션 개선을 위해 Streak 시스템과 구독자 전용 월간 혜택을 도입했습니다.",
      sections: [
        {
          heading: "Streak 시스템",
          items: ["구독자 Stickiness 개선을 위한 불꽃 시스템(streak) 도입"],
        },
        {
          heading: "구독자 전용 월간 혜택",
          items: ["구독 리텐션 개선을 위한 구독자 전용 월간 혜택 시스템 도입"],
        },
      ],
    },
  },
];

// 포트폴리오 탭: 맡은 역할로 나눈다 (작업물의 role 에 들어 있는 이름과 같아야 한다)
export const roleTabs = ["기획", "디자인", "개발"] as const;
export type RoleTab = (typeof roleTabs)[number];

// 사이트에 보이는 작업물 (포트폴리오 카드 · 예시의 작업 수 · 상세 페이지)
export const shownProjects = projects.filter((p) => !p.disabled);

// ── Career timeline ────────────────────────────────────────────
export const career: {
  company: string;
  logo?: string;
  role: string;
  period: string;
}[] = [
  {
    company: "티엑스미 (TXME)",
    logo: "/about/logo-txme.svg",
    role: "대표이사 / CEO",
    period: "2025.07 — 재직 중",
  },
  {
    company: "Class101",
    logo: "/about/icon-class101.net.png",
    role: "Growth PM",
    period: "2025.01 — 2025.05",
  },
  {
    company: "헥슬란트 (現 헥토월렛원)",
    logo: "/about/logo-hecto.svg",
    role: "서비스 팀장 & PM",
    period: "2021.06 — 2024.12",
  },
  {
    company: "호두소프트",
    logo: "/about/icon-hodosoft.jpg",
    role: "콘텐츠 마케터",
    period: "2020.11 — 2021.05",
  },
  {
    company: "Freelance",
    role: "기획 · 디자인 · 개발 · 마케팅",
    period: "2024.11 — 진행 중",
  },
];

// ── 강의 · 발표 ────────────────────────────────────────────────
export const talks = [
  { title: "포용적 AI 청년 포럼 연사", when: "2026.08" },
  {
    title: "메가스터디아카데미 ‘블록체인 서비스 기획’ 강의",
    when: "런칭 준비 중",
  },
  { title: "진학사 캐치카페 커리어콘 블록체인편 연사", when: "2023.05" },
  {
    title: "고객사 대상 블록체인 교육",
    when: "2022.01 — 2024.12",
    note: "상시 진행 · 대기업 및 금융권 포함",
  },
];

// ── 관련 링크 ──────────────────────────────────────────────────
export type ExternalLink = {
  label: string;
  href: string;
  note?: string;
  /** 사이트 아이콘 또는 영상 썸네일 */
  image?: string;
};

export const profileLinks: ExternalLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/doyoulovez/",
    image: "/about/icon-linkedin.com.png",
  },
  {
    label: "Brunch",
    href: "https://brunch.co.kr/@doyoulovez",
    image: "/about/icon-brunch.co.kr.png",
  },
  {
    label: "Medium",
    href: "https://medium.com/@doyoulovez",
    image: "/about/icon-medium.com.png",
  },
];

export const videos: ExternalLink[] = [
  {
    label: "“블록체인이 일상으로”… 업비트 컨퍼런스",
    href: "https://youtu.be/MDl0qz9XIwo?t=60",
    image: "/about/v-MDl0qz9XIwo.jpg",
    note: "서울경제TV · 뉴스 인터뷰",
  },
  {
    label: "블록체인 지갑 개발에서 놓치면 안 되는 4가지",
    href: "https://youtu.be/s1cjfrkSjfg",
    image: "/about/v-s1cjfrkSjfg.jpg",
    note: "헥슬란트 · 컨퍼런스 발표",
  },
  {
    label: "Tokenroll 23 — 옥텟 튜토리얼 1화",
    href: "https://youtu.be/G8_2QXtBhFU",
    image: "/about/v-G8_2QXtBhFU.jpg",
    note: "헥슬란트 · 튜토리얼",
  },
  {
    label: "코딩 왕초보 마케터, MBTI 궁합 찾아주는 앱을 만들다",
    href: "https://youtu.be/Ca3hk1ZzZ_A",
    image: "/about/v-Ca3hk1ZzZ_A.jpg",
    note: "스파르타클럽",
  },
];
