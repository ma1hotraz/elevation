import type { ReactNode } from "react";
import { ArrowRight, Atom, BookOpenCheck, Check, Languages } from "lucide-react";
import { programs } from "../homeData";
import { SectionEyebrow, SectionIntro, SectionTitle, cardSurface, sectionFrame } from "../shared";

const programIcons: Record<string, ReactNode> = {
  PCM: <Atom aria-hidden="true" />,
  IELTS: <BookOpenCheck aria-hidden="true" />,
  FR: <Languages aria-hidden="true" />,
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function programTone(accent: string) {
  if (accent === "blue") {
    return {
      accent: "before:bg-gradient-to-r before:from-[rgba(20,119,255,0.78)] before:to-[rgba(43,157,255,0.18)]",
      tag: "border-[rgba(20,119,255,0.22)] bg-[#eaf3ff] text-[#1477ff]",
      icon: "bg-gradient-to-br from-[#2b9dff] to-[#1161e8] shadow-[0_18px_40px_rgba(20,119,255,0.24)]",
      check: "text-[#1468e8]",
      link: "border-[rgba(20,104,232,0.28)] text-[#1468e8] bg-transparent",
      arrow: "bg-[rgba(20,104,232,0.1)]",
    };
  }

  if (accent === "purple") {
    return {
      accent: "before:bg-gradient-to-r before:from-[rgba(125,84,250,0.72)] before:to-[rgba(155,109,255,0.18)]",
      tag: "border-[rgba(125,84,250,0.22)] bg-[#f2edff] text-[#7d54fa]",
      icon: "bg-gradient-to-br from-[#9b6dff] to-[#6639e8] shadow-[0_18px_40px_rgba(125,84,250,0.24)]",
      check: "text-[#6a42ea]",
      link: "border-[rgba(106,66,234,0.28)] text-[#6a42ea] bg-[rgba(106,66,234,0.04)]",
      arrow: "bg-[rgba(106,66,234,0.1)]",
    };
  }

  return {
    accent: "before:bg-gradient-to-r before:from-[rgba(8,184,146,0.94)] before:to-[rgba(111,236,199,0.34)]",
    tag: "border-[rgba(14,143,120,0.2)] bg-gradient-to-b from-[#f0fcf8] to-[#e6f9f1] text-[#09866f]",
    icon: "bg-gradient-to-br from-[#08b892] to-[#087365]",
    check: "text-[#087365]",
    link: "border-[rgba(8,115,101,0.16)] text-[#087365] bg-[rgba(8,115,101,0.04)]",
    arrow: "bg-[rgba(8,115,101,0.1)]",
  };
}

export function Programs() {
  return (
    <section
      className={`${sectionFrame} px-0 pb-[76px] text-center max-[520px]:pb-[44px]`}
      id="programs"
    >
      <SectionEyebrow>What Students Get</SectionEyebrow>
      <SectionTitle>
        Structured Support for <span className="text-[#0e8f78]">Real Results</span>
      </SectionTitle>
      <SectionIntro className="mt-[15px] mb-11 max-[520px]:mb-[30px] max-[520px]:text-[0.95rem] max-[520px]:leading-[1.6]">
        Each learning path is built to give students expert teaching, guided
        practice, personal attention, and a clear route to better performance.
      </SectionIntro>

      <div className="grid grid-cols-3 gap-[26px] text-left max-[980px]:grid-cols-1 max-[520px]:gap-4">
        {programs.map((program) => {
          const tone = programTone(program.accent);

          return (
            <article
              key={program.title}
              className={cx(
                cardSurface,
                "grid min-h-[390px] grid-rows-[auto_auto_1fr_auto_auto] p-[28px_28px_24px]",
                "max-[520px]:min-h-0 max-[520px]:rounded-[24px] max-[520px]:p-[26px_22px_22px]",
                tone.accent,
                "before:absolute before:inset-x-0 before:top-0 before:h-[5px] before:content-['']",
              )}
            >
              <div className="mb-[22px] flex items-start justify-between gap-[18px]">
                <span
                  className={cx(
                    "inline-flex min-h-9 items-center gap-2 rounded-full border px-[14px] py-[7px] text-[0.76rem] font-black uppercase tracking-[0.08em]",
                    tone.tag,
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_0_4px_rgba(8,184,146,0.12)]" />
                  {program.tag}
                </span>
                <div
                  className={cx(
                    "grid h-[78px] w-[78px] place-items-center rounded-[24px] text-white shadow-[0_18px_40px_rgba(8,144,120,0.22)]",
                    "max-[520px]:h-[68px] max-[520px]:w-[68px]",
                    tone.icon,
                  )}
                >
                  {programIcons[program.icon] ?? program.icon}
                </div>
              </div>

              <div className="mb-[18px]">
                <h3 className="m-0 mb-1.5 text-[1.72rem] tracking-[-0.04em] max-[520px]:text-[1.45rem] max-[520px]:tracking-normal">
                  {program.title}
                </h3>
                <h4 className="m-0 mb-4 text-[0.96rem] font-extrabold text-[#3f6562]">
                  {program.subtitle}
                </h4>
                <p className="m-0 leading-[1.7] text-[#627579]">{program.description}</p>
              </div>

              <div className="mb-6 grid gap-3">
                {program.points.map((point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-2 text-[0.88rem] font-semibold text-[#556e72]"
                  >
                    <Check
                      aria-hidden="true"
                      className={cx(
                        "h-[18px] w-[18px] rounded-full p-[3px]",
                        tone.check,
                        "bg-gradient-to-br from-[rgba(8,184,146,0.18)] to-[rgba(8,115,101,0.08)] shadow-[inset_0_0_0_1px_rgba(8,115,101,0.14)]",
                      )}
                    />
                    {point}
                  </span>
                ))}
              </div>

              <a
                href="#contact"
                className={cx(
                  "inline-flex min-h-[54px] w-full items-center justify-between gap-3 rounded-[18px] border px-[18px] py-3 font-black",
                  tone.link,
                )}
              >
                See Details
                <ArrowRight
                  aria-hidden="true"
                  className={cx("grid h-[34px] w-[34px] place-items-center rounded-full text-[0.86rem]", tone.arrow)}
                />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
