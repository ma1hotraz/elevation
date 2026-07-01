import { Plus } from "lucide-react";
import { faqs } from "../homeData";
import { SectionEyebrow, SectionIntro, SectionTitle, sectionFrame } from "../shared";

export function Faq() {
  return (
    <section className={`${sectionFrame} px-0 pb-[58px] text-center`} id="faq">
      <SectionEyebrow>Frequently Asked Questions</SectionEyebrow>
      <SectionTitle>
        Got Questions? We've Got <span className="text-[#0e8f78]">Answers.</span>
      </SectionTitle>
      <SectionIntro className="mt-[15px] mb-[42px] max-[520px]:mb-7 max-[520px]:text-[0.95rem] max-[520px]:leading-[1.6]">
        Clear answers to the most common questions about programs, batch
        format, and getting started.
      </SectionIntro>

      <div className="grid grid-cols-2 gap-[18px] text-left max-[1180px]:grid-cols-1">
        {faqs.map((faq, index) => (
          <details
            className="group overflow-hidden rounded-[24px] border border-[rgba(8,47,43,0.08)] bg-gradient-to-b from-white to-[#fbfefd] shadow-[0_18px_48px_rgba(9,72,69,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(14,143,120,0.16)] hover:shadow-[0_24px_56px_rgba(9,72,69,0.08)]"
            key={faq}
          >
            <summary className="grid cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-[22px] font-extrabold tracking-[-0.02em] max-[860px]:gap-3 max-[860px]:px-5 max-[520px]:gap-2.5 max-[520px]:px-3.5 max-[520px]:py-4">
              <span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-[#e8fbf5] text-[0.8rem] font-black tracking-[0.08em] text-[#07836f] max-[520px]:h-[34px] max-[520px]:w-[34px] max-[520px]:rounded-[11px] max-[520px]:text-[0.72rem]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="leading-[1.45] text-[#123036] max-[520px]:text-[0.92rem] max-[520px]:leading-[1.35]">
                {faq}
              </span>
              <Plus
                className="h-[18px] w-[18px] flex-shrink-0 text-[#0d8b76] transition-transform duration-200 group-open:rotate-45"
                aria-hidden="true"
              />
            </summary>
            <p className="m-0 px-6 pb-[22px] pl-[82px] leading-[1.75] text-[#627579] max-[860px]:px-5 max-[860px]:pb-5 max-[860px]:pl-5 max-[520px]:px-3.5 max-[520px]:pb-4 max-[520px]:text-[0.9rem] max-[520px]:leading-[1.6]">
              Book a free counselling session and our team will guide you with
              the best program, timing, and mode.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
