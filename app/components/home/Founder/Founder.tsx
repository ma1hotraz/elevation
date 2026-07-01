import Image from "next/image";
import { Check, Quote } from "lucide-react";
import { SectionEyebrow, sectionFrame } from "../shared";

export function Founder() {
  return (
    <section className={`${sectionFrame} grid grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)_280px] items-center gap-7 px-0 pb-[76px] max-[1180px]:grid-cols-2 max-[860px]:grid-cols-1 max-[520px]:gap-[22px] max-[520px]:pb-[58px]`} id="about">
      <div className="relative min-h-[540px] overflow-hidden rounded-[32px] bg-gradient-to-b from-[#e6fbf4] to-[#fbfefd] max-[860px]:min-h-[480px] max-[520px]:min-h-[340px] max-[520px]:rounded-[24px]">
        <Image
          src="/founder-kulkaran-singh.png"
          alt="Kulkaran Singh"
          width={760}
          height={760}
          className="absolute inset-[20px_20px_0] h-[calc(100%-20px)] w-[calc(100%-40px)] rounded-[28px] object-cover object-top max-[520px]:inset-[12px_12px_0] max-[520px]:h-[calc(100%-12px)] max-[520px]:w-[calc(100%-24px)] max-[520px]:rounded-[20px]"
        />
        <div className="absolute left-6 bottom-6 max-w-[210px] rounded-[20px] bg-white/96 p-4 shadow-[0_18px_48px_rgba(8,47,43,0.14)] max-[520px]:left-3.5 max-[520px]:bottom-3.5 max-[520px]:max-w-[180px] max-[520px]:rounded-[16px] max-[520px]:p-[12px_14px]">
          <strong className="block text-[1.85rem] tracking-[-0.05em] text-[#07836f] max-[520px]:text-[1.5rem] max-[520px]:tracking-normal">
            10+
          </strong>
          <span className="mt-1 block text-[0.88rem] font-bold leading-[1.4] text-[#5c6e72] max-[520px]:text-[0.78rem] max-[520px]:leading-[1.3]">
            Years of Teaching Excellence
          </span>
        </div>
      </div>

      <div>
        <SectionEyebrow className="mx-0 justify-items-start text-left max-[520px]:justify-items-center max-[520px]:text-center">
          Meet the Founder
        </SectionEyebrow>
        <h2 className="m-0 mb-2 text-[clamp(2rem,4vw,3.1rem)] tracking-[-0.05em] max-[520px]:text-center">
          Kulkaran Singh
        </h2>
        <h3 className="m-0 mb-[18px] text-[1.2rem] text-[#07836f] max-[520px]:text-center">
          Educator. Mentor. Guide.
        </h3>
        <p className="m-0 mb-4 leading-[1.75] text-[#617477] max-[520px]:text-center">
          With over a decade of teaching experience in India and Canada, I
          founded Kulkaran Coaching Institute with a simple vision - to help
          students build strong concepts, confidence, and character.
        </p>
        <p className="m-0 mb-4 leading-[1.75] text-[#617477] max-[520px]:text-center">
          I personally mentor students to help them achieve their academic and
          language goals with clarity, patience, and structured guidance.
        </p>
        <ul className="m-0 mb-[18px] grid list-none gap-2 p-0 font-medium leading-[1.45] text-[#1f3439] max-[520px]:justify-items-center max-[520px]:text-center">
          <li className="flex items-center gap-2">
            <Check aria-hidden="true" className="h-[18px] w-[18px] flex-shrink-0 rounded-full bg-gradient-to-br from-[rgba(8,184,146,0.18)] to-[rgba(8,115,101,0.08)] p-[3px] text-[#087365] shadow-[inset_0_0_0_1px_rgba(8,115,101,0.14)]" />
            10+ Years of Teaching Experience
          </li>
          <li className="flex items-center gap-2">
            <Check aria-hidden="true" className="h-[18px] w-[18px] flex-shrink-0 rounded-full bg-gradient-to-br from-[rgba(8,184,146,0.18)] to-[rgba(8,115,101,0.08)] p-[3px] text-[#087365] shadow-[inset_0_0_0_1px_rgba(8,115,101,0.14)]" />
            Hundreds of Students Mentored
          </li>
          <li className="flex items-center gap-2">
            <Check aria-hidden="true" className="h-[18px] w-[18px] flex-shrink-0 rounded-full bg-gradient-to-br from-[rgba(8,184,146,0.18)] to-[rgba(8,115,101,0.08)] p-[3px] text-[#087365] shadow-[inset_0_0_0_1px_rgba(8,115,101,0.14)]" />
            Passionate About Student Success
          </li>
        </ul>
        <span
          className="text-[1.7rem] text-[#086d5e] max-[520px]:block max-[520px]:text-center"
          style={{ fontFamily: '"Segoe Script", cursive' }}
        >
          Kulkaran Singh
        </span>
      </div>

      <aside className="rounded-[26px] bg-gradient-to-b from-[#083f3b] to-[#042724] p-[24px_22px] text-white shadow-[0_24px_60px_rgba(4,39,36,0.18)] max-[1180px]:col-span-2 max-[520px]:rounded-[22px] max-[520px]:p-[20px_18px]">
        <Quote aria-hidden="true" className="mb-2.5 block h-[34px] w-[34px] text-[#7ff0cb]" />
        <p className="m-0 mb-[18px] leading-[1.75] text-white/86">
          Every student has potential. My mission is to unlock it.
        </p>
        <strong className="text-[0.92rem] text-white">- Kulkaran Singh</strong>
      </aside>
    </section>
  );
}
