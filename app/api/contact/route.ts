// 문의 폼 → Slack Incoming Webhook 전달
// SLACK_WEBHOOK_URL 은 .env.local (로컬) / Vercel 환경변수 (배포) 에 설정한다.

const LIMITS = { name: 40, company: 80, contact: 120, message: 2800 };

// Slack mrkdwn 에서 의미를 갖는 문자 이스케이프
const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // 허니팟: 사람에게 보이지 않는 필드가 채워져 있으면 봇으로 보고 조용히 성공 처리
  if (clean(body.website, 200)) {
    return Response.json({ ok: true });
  }

  const name = clean(body.name, LIMITS.name);
  const company = clean(body.company, LIMITS.company);
  const contact = clean(body.contact, LIMITS.contact);
  const message = clean(body.message, LIMITS.message);

  if (!name || !company || !contact || !message) {
    return Response.json({ ok: false, error: "missing" }, { status: 400 });
  }

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    return Response.json(
      { ok: false, error: "not_configured" },
      { status: 503 }
    );
  }

  const fields = [
    `*이름(회사)*\n${esc(name)} (${esc(company)})`,
    `*연락처*\n${esc(contact)}`,
  ];

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `포트폴리오 문의 — ${esc(name)} (${esc(company)})`,
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: "📮 포트폴리오 문의", emoji: true },
          },
          {
            type: "section",
            fields: fields.map((text) => ({ type: "mrkdwn", text })),
          },
          {
            type: "section",
            text: { type: "mrkdwn", text: `*내용*\n${esc(message)}` },
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`slack ${res.status}`);
  } catch (err) {
    console.error("[contact] slack delivery failed", err);
    return Response.json({ ok: false, error: "delivery" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
