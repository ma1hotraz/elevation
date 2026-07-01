import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function BottomCta() {
  return (
    <section className="relative mx-auto mb-[42px] grid w-[min(1240px,calc(100%-64px))] grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] items-stretch gap-6 overflow-hidden rounded-[34px] bg-gradient-to-br from-[#083f3b] to-[#042724] p-[28px_30px] max-[860px]:w-[min(100%-32px,680px)] max-[860px]:grid-cols-1 max-[860px]:p-6 max-[520px]:w-[min(100%-14px,420px)] max-[520px]:mb-[30px] max-[520px]:rounded-[24px] max-[520px]:p-[20px_18px]">
      <div className="px-1 py-3 text-white">
        <p className="mb-3.5 text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-[#8ef1ce]">
          Start Your Journey
        </p>
        <div>
          <h2 className="m-0 mb-2.5 max-w-[11ch] text-[clamp(2rem,3.8vw,2.8rem)] leading-[0.98] tracking-[-0.055em]">
            Ready to Build a Clear Study Plan?
          </h2>
          <p className="m-0 max-w-[470px] leading-[1.7] text-white/80">
            Share your course goal, current level, and preferred schedule.
            Elevation will guide you toward the right class format and next
            step after reviewing your needs.
          </p>
        </div>

        <div className="mt-[18px] flex flex-wrap gap-2.5" aria-label="Counselling benefits">
          <span className="inline-flex min-h-[34px] items-center rounded-full border border-white/16 bg-white/8 px-[14px] py-[7px] text-[0.8rem] font-extrabold tracking-[0.04em] text-white/90">
            Course Fit
          </span>
          <span className="inline-flex min-h-[34px] items-center rounded-full border border-white/16 bg-white/8 px-[14px] py-[7px] text-[0.8rem] font-extrabold tracking-[0.04em] text-white/90">
            Level Review
          </span>
          <span className="inline-flex min-h-[34px] items-center rounded-full border border-white/16 bg-white/8 px-[14px] py-[7px] text-[0.8rem] font-extrabold tracking-[0.04em] text-white/90">
            Next-Step Guidance
          </span>
        </div>

        <div className="mt-[22px] flex flex-wrap gap-3.5">
          <a href="#contact" className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3.5 font-black text-[#063a37] shadow-[0_18px_42px_rgba(0,0,0,0.16)]">
            Book Free Counselling <ArrowRight aria-hidden="true" />
          </a>
          <a href="#sample-tests" className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/18 bg-white/8 px-6 py-3.5 font-black text-white">
            View Sample Tests
          </a>
        </div>

        <div className="mt-[18px] flex flex-wrap gap-x-5 gap-y-3 text-[0.92rem] font-medium text-white/82">
          <span>Call: +1 (437) 123-4567</span>
          <span>Location: Brampton, Ontario, Canada</span>
        </div>
      </div>

      <div className="grid gap-4 rounded-[26px] border border-white/8 bg-[radial-gradient(circle_at_24%_22%,rgba(247,201,108,0.18),transparent_11rem),rgba(255,255,255,0.06)] p-[18px] max-[860px]:rounded-[20px]">
        <div className="flex justify-center pt-[2px] pb-[4px]">
          <Image
            src="/founder-kulkaran-singh.png"
            alt="Elevation mentor"
            width={360}
            height={360}
            className="h-[184px] w-[184px] rounded-full border-[8px] border-white/14 object-cover object-top shadow-[0_22px_44px_rgba(0,0,0,0.22)] max-[860px]:h-[172px] max-[860px]:w-[172px] max-[520px]:h-[150px] max-[520px]:w-[150px]"
          />
        </div>

        <div className="rounded-[20px] bg-white/92 p-[16px_18px_15px] text-[#063a37]">
          <strong className="mb-1 block text-[1.2rem] tracking-[-0.03em]">Elevation Mentorship</strong>
          <span className="mb-3 block text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[#087365]">
            Focused coaching path
          </span>
          <p className="m-0 leading-[1.6] text-[0.9rem] text-[#566b70]">
            Personal guidance for PCM, IELTS, and French with sample
            assessments, structured classes, and a practical improvement plan.
          </p>
        </div>
      </div>
    </section>
  );
}
