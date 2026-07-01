import type { ReactNode } from "react";
import {
  BadgeCheck,
  Check,
  ClipboardCheck,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { reasons } from "../homeData";
import { SectionEyebrow, SectionIntro, SectionTitle, cardSurface, sectionFrame } from "../shared";

const reasonIcons: Record<string, ReactNode> = {
  SB: <Users aria-hidden="true" />,
  EF: <ClipboardCheck aria-hidden="true" />,
  PG: <UserCheck aria-hidden="true" />,
  PR: <TrendingUp aria-hidden="true" />,
  CA: <BadgeCheck aria-hidden="true" />,
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function reasonTone(code: string) {
  if (code === "EF") {
    return {
      accent: "before:bg-gradient-to-r before:from-[rgba(20,119,255,0.68)] before:to-[rgba(43,157,255,0.16)]",
      pill: "border-[rgba(20,119,255,0.1)] bg-[rgba(20,119,255,0.05)] text-[#1477ff]",
      icon: "border-[rgba(20,119,255,0.1)] bg-gradient-to-b from-[#f8fbff] to-[#edf4ff] text-[#1468e8]",
      check: "text-[#1468e8]",
    };
  }

  if (code === "PG") {
    return {
      accent: "before:bg-gradient-to-r before:from-[rgba(125,84,250,0.68)] before:to-[rgba(155,109,255,0.16)]",
      pill: "border-[rgba(125,84,250,0.1)] bg-[rgba(125,84,250,0.05)] text-[#7d54fa]",
      icon: "border-[rgba(125,84,250,0.1)] bg-gradient-to-b from-[#fbf9ff] to-[#f4efff] text-[#6a42ea]",
      check: "text-[#6a42ea]",
    };
  }

  return {
    accent: "before:bg-gradient-to-r before:from-[rgba(8,184,146,0.72)] before:to-[rgba(111,236,199,0.18)]",
    pill: "border-[rgba(8,115,101,0.1)] bg-[rgba(8,115,101,0.05)] text-[#0b7b69]",
    icon: "border-[rgba(8,115,101,0.1)] bg-gradient-to-b from-[#f7fbfa] to-[#edf7f4] text-[#0a7a68]",
    check: "text-[#087365]",
  };
}

export function Mission() {
  return (
    <section
      className={`${sectionFrame} px-0 pt-4 pb-[76px] text-center max-[520px]:pb-[54px]`}
      aria-label="Why choose us"
    >
      <SectionEyebrow>Why Choose Us</SectionEyebrow>
      <SectionTitle>
        Your <span className="text-[#0e8f78]">Success</span> is Our Mission
      </SectionTitle>
      <SectionIntro className="mt-[15px] mb-11 max-[520px]:mb-7 max-[520px]:text-[0.95rem] max-[520px]:leading-[1.6]">
        A thoughtful coaching experience built around clarity, consistency, and
        personal attention.
      </SectionIntro>

      <div className="grid grid-cols-5 gap-[22px] text-left max-[1180px]:grid-cols-[repeat(5,minmax(240px,1fr))] max-[1180px]:overflow-x-auto max-[1180px]:pb-2 max-[860px]:grid-cols-1 max-[860px]:overflow-visible max-[860px]:pb-0">
        {reasons.map(([code, title, text], index) => {
          const tone = reasonTone(code);

          return (
            <article
              key={title}
              className={cx(
                cardSurface,
                "min-h-[310px] grid grid-rows-[auto_auto_auto] p-[26px_24px_22px]",
                "max-[520px]:min-h-0 max-[520px]:rounded-[24px] max-[520px]:p-[22px_18px_18px]",
                tone.accent,
                "before:absolute before:inset-x-0 before:top-0 before:h-1 before:content-['']",
              )}
            >
              <div className="mb-[18px] flex items-center justify-between gap-3 max-[520px]:mb-4">
                <span
                  className={cx(
                    "inline-flex min-h-8 items-center gap-2 rounded-full border px-3 py-[6px] text-[0.68rem] font-black uppercase tracking-[0.08em]",
                    tone.pill,
                    "max-[520px]:min-h-[30px] max-[520px]:px-[11px] max-[520px]:text-[0.64rem]",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_0_3px_rgba(8,184,146,0.08)]" />
                  0{index + 1}
                </span>
                <div
                  className={cx(
                    "grid h-[54px] w-[54px] place-items-center rounded-[18px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
                    "max-[520px]:h-12 max-[520px]:w-12 max-[520px]:rounded-[16px]",
                    tone.icon,
                  )}
                  aria-hidden="true"
                >
                  {reasonIcons[code]}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="mb-2 text-[1.18rem] tracking-[-0.04em] max-[520px]:text-[1.04rem] max-[520px]:tracking-normal">
                  {title}
                </h3>
                <p className="m-0 text-[0.9rem] leading-[1.68] text-[#627579] max-[520px]:text-[0.88rem] max-[520px]:leading-[1.58]">
                  {text}
                </p>
              </div>

              <div className="self-end pt-4">
                <span className="inline-flex items-center gap-2 text-[0.82rem] font-semibold text-[#556e72] max-[520px]:text-[0.8rem]">
                  <Check
                    aria-hidden="true"
                    className={cx(
                      "h-[18px] w-[18px] rounded-full p-[3px]",
                      tone.check,
                      "bg-gradient-to-br from-[rgba(8,184,146,0.18)] to-[rgba(8,115,101,0.08)] shadow-[inset_0_0_0_1px_rgba(8,115,101,0.14)]",
                    )}
                  />
                  Student-first approach
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
