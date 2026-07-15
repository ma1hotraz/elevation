import {
  BookOpenCheck,
  CalendarClock,
  ChartNoAxesCombined,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { SectionEyebrow, SectionIntro, SectionTitle, sectionFrame } from "../shared";

const benefits = [
  {
    icon: <BookOpenCheck aria-hidden="true" />,
    title: "Resources",
    text: "Notes, worksheets, and links in one place.",
  },
  {
    icon: <ChartNoAxesCombined aria-hidden="true" />,
    title: "Feedback",
    text: "Scores and teacher comments after each test.",
  },
  {
    icon: <CalendarClock aria-hidden="true" />,
    title: "Revision",
    text: "Clear next steps before the next class.",
  },
] as const;

const portalItems = [
  ["Physics worksheet", "Uploaded today"],
  ["IELTS mock feedback", "Review ready"],
  ["French grammar drill", "Next practice"],
] as const;

export function LearningPlatform() {
  return (
    <section className={`${sectionFrame} px-0 pb-[70px] max-[520px]:pb-[48px]`} id="platform">
      <div className="relative overflow-hidden rounded-[34px] border border-[rgba(7,67,61,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbfa_45%,#eef9f5_100%)] p-[34px] shadow-[0_28px_80px_rgba(9,72,69,0.1)] max-[720px]:p-5 max-[520px]:rounded-[24px]">
        <div className="pointer-events-none absolute right-[-90px] top-[-120px] h-[280px] w-[280px] rounded-full bg-[rgba(101,228,196,0.16)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-140px] left-[30%] h-[260px] w-[260px] rounded-full bg-[rgba(20,119,255,0.08)] blur-3xl" />

        <div className="relative grid items-center gap-9 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionEyebrow className="mx-0 text-left before:mx-0 after:mx-0">
              Learning Platform
            </SectionEyebrow>
            <SectionTitle className="max-w-[640px] text-[clamp(2rem,3.8vw,3.15rem)]">
              A polished portal for <span className="text-[#0e8f78]">every class update</span>
            </SectionTitle>
            <SectionIntro className="mx-0 mt-[15px] max-w-[560px] max-[520px]:text-[0.95rem] max-[520px]:leading-[1.6]">
              Study material, feedback, and revision tasks stay organised in one
              calm workspace students can check anytime.
            </SectionIntro>

            <div className="mt-7 grid gap-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="grid grid-cols-[42px_1fr] items-center gap-3 rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white/72 p-3 shadow-[0_12px_34px_rgba(9,72,69,0.05)] backdrop-blur"
                >
                  <span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-[#e9fbf5] text-[#087365] [&_svg]:h-5 [&_svg]:w-5">
                    {benefit.icon}
                  </span>
                  <div>
                    <strong className="block text-[0.94rem] text-[#10252b]">
                      {benefit.title}
                    </strong>
                    <p className="m-0 mt-0.5 text-[0.84rem] leading-[1.45] text-[#627579]">
                      {benefit.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="relative min-h-[430px] max-[980px]:min-h-0">
            <div className="absolute left-4 top-8 h-[84%] w-[84%] rounded-[28px] bg-[#083f3b] opacity-[0.08] blur-2xl max-[980px]:hidden" />
            <div className="relative overflow-hidden rounded-[30px] border border-[rgba(8,47,43,0.1)] bg-[#f9fdfc] p-3 shadow-[0_30px_90px_rgba(4,39,36,0.18)] max-[520px]:rounded-[22px]">
              <div className="rounded-[24px] bg-[linear-gradient(180deg,#083f3b,#042825)] p-4 text-white max-[520px]:rounded-[18px]">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#8ef1ce]">
                      Student Portal
                    </p>
                    <strong className="mt-1 block text-[1.2rem] text-white">
                      Today&apos;s learning plan
                    </strong>
                  </div>
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-white/82">
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-3 overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.07]">
                  <div className="p-4 max-[520px]:p-3">
                    <span className="block text-[0.64rem] font-black uppercase tracking-[0.12em] text-white/55">
                      Notes
                    </span>
                    <strong className="mt-2 block text-[1.42rem] leading-none text-[#8ef1ce] max-[520px]:text-[1.18rem]">
                      12
                    </strong>
                  </div>
                  <div className="border-x border-white/10 p-4 max-[520px]:p-3">
                    <span className="block text-[0.64rem] font-black uppercase tracking-[0.12em] text-white/55">
                      Score
                    </span>
                    <strong className="mt-2 block text-[1.42rem] leading-none text-[#8ef1ce] max-[520px]:text-[1.18rem]">
                      89%
                    </strong>
                  </div>
                  <div className="p-4 max-[520px]:p-3">
                    <span className="block text-[0.64rem] font-black uppercase tracking-[0.12em] text-white/55">
                      Next
                    </span>
                    <strong className="mt-2 block text-[1.42rem] leading-none text-[#8ef1ce] max-[520px]:text-[1.18rem]">
                      Today
                    </strong>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 bg-white p-4 max-[520px]:p-3">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-[0.95rem] text-[#10252b]">Class updates</strong>
                  <span className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#9aa8aa]">
                    Ready
                  </span>
                </div>

                {portalItems.map(([title, meta]) => (
                  <div
                    key={title}
                    className="grid grid-cols-[38px_1fr_auto] items-center gap-3 rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-3 max-[520px]:grid-cols-[38px_1fr]"
                  >
                    <span className="grid h-[38px] w-[38px] place-items-center rounded-[12px] bg-[#e9fbf5] text-[#087365]">
                      <FileText className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <div>
                      <strong className="block text-[0.9rem] text-[#10252b]">{title}</strong>
                      <span className="text-[0.78rem] font-semibold text-[#708084]">{meta}</span>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-[#0e8f78] max-[520px]:col-start-2" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

