import { profile } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] border-t border-white/15 px-5 py-8 text-[13px] text-white/40 md:px-10">
        <span>
          © {year} {profile.name} · (주)티엑스미. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
