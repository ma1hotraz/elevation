import { ArrowRight, Check } from "lucide-react";
import { SectionEyebrow, SectionTitle, sectionFrame } from "../shared";

const assessments = [
  {
    tag: "IELTS",
    title: "IELTS Reading Sample",
    format: "Google Form",
    timing: "Reading test format",
    description:
      "View the reading passage and question style used in Elevation's IELTS practice tests.",
    points: ["Passage-based questions", "Online response format", "Reading-focused sample"],
    href: "https://forms.gle/vbc4L2bRRFuPqYdu9",
    action: "View Sample",
    accent: "blue",
  },
  {
    tag: "PCM",
    title: "PCM Test Sample",
    format: "Physics / Chemistry / Math",
    timing: "Grade 9-12 test format",
    description:
      "A simple place to share the Physics, Chemistry, and Math sample test link once available.",
    points: ["Subject-wise questions", "Grade-level practice", "Concept and application mix"],
    href: "",
    action: "Sample Link Coming Soon",
    accent: "green",
  },
  {
    tag: "French",
    title: "French Test Sample",
    format: "Online Form",
    timing: "Language test format",
    description:
      "A simple place to share the French sample test link once the form is ready.",
    points: ["Grammar questions", "Reading comprehension", "Level-check style"],
    href: "",
    action: "Sample Link Coming Soon",
    accent: "purple",
  },
] as const;

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function sampleTone(accent: string) {
  if (accent === "blue") {
    return {
      accent: "before:bg-gradient-to-r before:from-[rgba(20,119,255,0.78)] before:to-[rgba(43,157,255,0.18)]",
      tag: "border-[rgba(20,119,255,0.16)] bg-[#eaf3ff] text-[#1477ff]",
      timing: "text-[#1468e8]",
      link: "border-[rgba(20,104,232,0.28)] text-[#1468e8] bg-transparent",
      arrow: "bg-[rgba(20,104,232,0.1)]",
      check: "text-[#1468e8]",
    };
  }

  if (accent === "purple") {
    return {
      accent: "before:bg-gradient-to-r before:from-[rgba(125,84,250,0.72)] before:to-[rgba(155,109,255,0.18)]",
      tag: "border-[rgba(125,84,250,0.16)] bg-[#f2edff] text-[#7d54fa]",
      timing: "text-[#6a42ea]",
      link: "border-[rgba(106,66,234,0.28)] text-[#6a42ea] bg-[rgba(106,66,234,0.04)]",
      arrow: "bg-[rgba(106,66,234,0.1)]",
      check: "text-[#6a42ea]",
    };
  }

  return {
    accent: "before:bg-gradient-to-r before:from-[rgba(8,184,146,0.94)] before:to-[rgba(111,236,199,0.34)]",
    tag: "border-[rgba(14,143,120,0.16)] bg-[#e9fbf5] text-[#087365]",
    timing: "text-[#07836f]",
    link: "border-[rgba(8,115,101,0.16)] text-[#087365] bg-[rgba(8,115,101,0.04)]",
    arrow: "bg-[rgba(8,115,101,0.1)]",
    check: "text-[#087365]",
  };
}

export function SampleAssessments() {
  return (
    <section className={`${sectionFrame} px-0 pt-[18px] pb-[70px]`} id="sample-tests">
      <div className="mx-auto mb-[34px] max-w-[760px] text-center">
        <SectionEyebrow>Sample Tests</SectionEyebrow>
        <SectionTitle>
          View Our Test <span className="text-[#0e8f78]">Sample Formats</span>
        </SectionTitle>
        <p className="mx-auto mt-[15px] max-w-[700px] font-semibold leading-[1.7] text-[#708084]">
          These sample links show visitors the format of tests Elevation uses
          across IELTS, PCM, and French courses.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-[22px] max-[980px]:grid-cols-1">
        {assessments.map((assessment) => {
          const tone = sampleTone(assessment.accent);

          return (
            <article
              key={assessment.title}
              className={cx(
                "relative grid min-h-[390px] grid-rows-[auto_auto_auto_1fr_auto_auto] overflow-hidden rounded-[30px] border border-[rgba(7,67,61,0.1)] bg-gradient-to-b from-white to-[#fbfefd] p-[24px_22px_22px] text-left shadow-[0_24px_70px_rgba(9,72,69,0.08)]",
                "max-[980px]:min-h-0 max-[520px]:rounded-[24px] max-[520px]:p-[22px_18px_18px]",
                tone.accent,
                "before:absolute before:inset-x-0 before:top-0 before:h-[5px] before:content-['']",
              )}
            >
              <div className="mb-[22px] flex flex-wrap items-center justify-between gap-2.5">
                <span className={cx("inline-flex min-h-8 items-center rounded-full border px-[11px] py-[6px] text-[0.68rem] font-black uppercase tracking-[0.08em]", tone.tag)}>
                  {assessment.tag}
                </span>
                <span className="inline-flex min-h-8 items-center rounded-full bg-[rgba(8,115,101,0.05)] px-[11px] py-[6px] text-[0.68rem] font-black uppercase tracking-[0.08em] text-[#5c6e72]">
                  {assessment.format}
                </span>
              </div>

              <h3 className="m-0 mb-1.5 text-[1.6rem] text-[#123036] max-[520px]:text-[1.42rem]">
                {assessment.title}
              </h3>
              <p className={cx("m-0 mb-4 text-[0.94rem] font-extrabold", tone.timing)}>
                {assessment.timing}
              </p>
              <p className="m-0 mb-[18px] leading-[1.68] text-[#627579]">
                {assessment.description}
              </p>

              <div className="mb-[22px] grid gap-[11px]">
                {assessment.points.map((point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-2 text-[0.86rem] font-semibold leading-[1.35] text-[#556e72]"
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

              {assessment.href ? (
                <a
                  href={assessment.href}
                  target={assessment.href.startsWith("http") ? "_blank" : undefined}
                  rel={assessment.href.startsWith("http") ? "noreferrer" : undefined}
                  className={cx("inline-flex min-h-[54px] items-center justify-between gap-3 rounded-[18px] border px-[18px] py-3 font-black", tone.link)}
                >
                  {assessment.action}
                  <ArrowRight aria-hidden="true" className={cx("h-[34px] w-[34px] rounded-full p-2 text-[0.86rem]", tone.arrow)} />
                </a>
              ) : (
                <span className="inline-flex min-h-[54px] cursor-default items-center justify-between gap-3 rounded-[18px] border border-[rgba(8,47,43,0.1)] bg-[rgba(8,47,43,0.03)] px-[18px] py-3 font-black text-[#809194]">
                  {assessment.action}
                  <ArrowRight aria-hidden="true" className="h-[34px] w-[34px] rounded-full bg-[rgba(8,47,43,0.06)] p-2 text-[0.86rem]" />
                </span>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
