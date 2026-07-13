import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  ChartNoAxesCombined,
  CheckCircle2,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionEyebrow, SectionIntro, SectionTitle, sectionFrame } from "../shared";

const benefits = [
  {
    icon: <BookOpenCheck aria-hidden="true" />,
    title: "Resources stay organised",
    text: "Notes, worksheets, and test links are easy to find after class.",
  },
  {
    icon: <ChartNoAxesCombined aria-hidden="true" />,
    title: "Progress is visible",
    text: "Students can review scores and feedback without waiting for reminders.",
  },
  {
    icon: <CalendarClock aria-hidden="true" />,
    title: "Revision feels focused",
    text: "The next task is clear, so study time between classes is not wasted.",
  },
] as const;

const timeline = [
  {
    title: "Today",
    detail: "Worksheet uploaded for the current topic",
    tone: "bg-[#e8fbf5] text-[#087365]",
  },
  {
    title: "Review",
    detail: "Latest mock test feedback is ready",
    tone: "bg-[#eef4ff] text-[#315f9f]",
  },
  {
    title: "Next",
    detail: "Revision plan before the next class",
    tone: "bg-[#fff7df] text-[#8a6514]",
  },
] as const;

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function LearningPlatform() {
  return (
    <section className={`${sectionFrame} px-0 pb-[64px]`} id="platform">
      <div className="mx-auto mb-9 max-w-[760px] text-center max-[520px]:mb-7">
        <SectionEyebrow>Learning Platform</SectionEyebrow>
        <SectionTitle>
          A Simpler Way for <span className="text-[#0e8f78]">Students to Stay Prepared</span>
        </SectionTitle>
        <SectionIntro className="mt-[15px] max-[520px]:text-[0.95rem] max-[520px]:leading-[1.6]">
          Study material, feedback, and next steps stay in one place after every
          class.
        </SectionIntro>
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#fbfefd,#f4fbf9)] p-5 shadow-[0_20px_60px_rgba(9,72,69,0.06)] max-[520px]:rounded-[22px] max-[520px]:p-4">
          <div className="grid gap-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="grid grid-cols-[44px_1fr] gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#e9fbf5] text-[#087365] [&_svg]:h-5 [&_svg]:w-5">
                  {benefit.icon}
                </span>
                <div>
                  <strong className="block text-[0.96rem] text-[#10252b]">{benefit.title}</strong>
                  <p className="m-0 mt-1 max-w-[46ch] text-[0.93rem] leading-[1.62] text-[#627579]">
                    {benefit.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[rgba(8,47,43,0.08)] pt-5">
            <Button asChild variant="primary" className="h-11 rounded-[12px] px-4 text-[0.88rem] font-black">
              <Link href="/portal">
                Open Learning Portal
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <span className="text-[0.83rem] font-semibold text-[#627579]">
              Works on phone, tablet, and laptop.
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[30px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#083f3b,#042825)] p-5 text-white shadow-[0_28px_74px_rgba(4,39,36,0.2)] max-[520px]:rounded-[24px] max-[520px]:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-[14px] bg-white/10 ring-1 ring-white/10">
                <Image src="/logo2.png" alt="Elevation Institute" width={44} height={44} className="h-8 w-8 object-contain" />
              </span>
              <div>
                <p className="mb-0.5 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#8ef1ce]">
                  Learning Portal
                </p>
                <strong className="block text-[1.02rem] text-white">Student dashboard</strong>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.12em] text-white/82">
              <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
              24/7 access
            </span>
          </div>

          <div className="mt-5 rounded-[20px] border border-white/10 bg-white/[0.07]">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              <div className="p-4 max-[520px]:p-3">
                <span className="block text-[0.66rem] font-black uppercase tracking-[0.14em] text-white/56">Resources</span>
                <strong className="mt-2 block text-[1.45rem] leading-none text-[#8ef1ce]">12</strong>
              </div>
              <div className="p-4 max-[520px]:p-3">
                <span className="block text-[0.66rem] font-black uppercase tracking-[0.14em] text-white/56">Progress</span>
                <strong className="mt-2 block text-[1.45rem] leading-none text-[#8ef1ce]">89%</strong>
              </div>
              <div className="p-4 max-[520px]:p-3">
                <span className="block text-[0.66rem] font-black uppercase tracking-[0.14em] text-white/56">Next</span>
                <strong className="mt-2 block text-[1.45rem] leading-none text-[#8ef1ce]">Today</strong>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <strong className="text-[0.86rem] text-white">This week</strong>
              <span className="text-[0.7rem] font-black uppercase tracking-[0.12em] text-white/56">
                Follow the plan
              </span>
            </div>

            <div className="grid gap-2">
              {timeline.map((item) => (
                <div key={item.title} className="flex items-start gap-3 border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
                  <span className={cx("mt-0.5 inline-flex rounded-full px-2.5 py-1 text-[0.66rem] font-black uppercase tracking-[0.1em]", item.tone)}>
                    {item.title}
                  </span>
                  <p className="m-0 flex-1 text-[0.86rem] leading-[1.5] text-white/80">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 text-[0.83rem] font-semibold text-white/78">
              <CheckCircle2 className="h-4 w-4 text-[#8ef1ce]" aria-hidden="true" />
              <span>Students always know what to revise next.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
