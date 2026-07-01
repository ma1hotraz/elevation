import { Star } from "lucide-react";
import { testimonials } from "../homeData";
import { SectionEyebrow, SectionIntro, SectionTitle, sectionFrame } from "../shared";

export function Testimonials() {
  return (
    <section className={`${sectionFrame} px-0 pb-[76px] text-center`} id="testimonials">
      <SectionEyebrow>Results That Inspire</SectionEyebrow>
      <SectionTitle>
        What Our <span className="text-[#0e8f78]">Students & Parents</span> Say
      </SectionTitle>
      <SectionIntro className="mt-[15px] mb-[34px] max-[520px]:mb-7 max-[520px]:text-[0.95rem] max-[520px]:leading-[1.6]">
        Honest feedback from students who gained stronger concepts, more
        confidence, and better outcomes.
      </SectionIntro>

      <div className="grid grid-cols-3 gap-[22px] text-left max-[1180px]:grid-cols-2 max-[860px]:grid-cols-1">
        {testimonials.map((testimonial) => (
          <article
            className="flex min-h-[228px] flex-col justify-between rounded-[26px] border border-[rgba(8,47,43,0.08)] bg-gradient-to-b from-white to-[#fbfefd] p-[24px_22px_22px] text-left shadow-[0_18px_50px_rgba(9,72,69,0.06)] max-[520px]:min-h-0 max-[520px]:rounded-[22px] max-[520px]:p-[20px_18px_18px]"
            key={testimonial.name}
          >
            <div className="mb-3.5 flex gap-1 text-[#f6ba43]" aria-label="5 star rating">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} aria-hidden="true" className="h-4 w-4 fill-current stroke-0" />
              ))}
            </div>
            <p className="mb-5 leading-[1.75] text-[#5d7276] text-[0.95rem]">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e8fbf5] font-black text-[#07836f]">
                {testimonial.avatar}
              </span>
              <div>
                <b className="block mb-1 text-[#123036]">{testimonial.name}</b>
                <small className="text-[#75878a]">{testimonial.role}</small>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside
        className="relative mt-6 overflow-hidden rounded-[26px] border border-white/8 bg-[radial-gradient(circle_at_8%_30%,rgba(111,236,199,0.1),transparent_10rem),radial-gradient(circle_at_88%_20%,rgba(247,201,108,0.13),transparent_9rem),linear-gradient(180deg,#083f3b,#042724)] p-[18px_18px_18px_20px] text-white shadow-[0_22px_54px_rgba(4,39,36,0.16)] max-[1180px]:grid max-[1180px]:grid-cols-1 max-[1180px]:gap-4 max-[860px]:p-[22px_20px] max-[520px]:rounded-[22px]"
        id="results"
      >
        <div className="relative min-h-[88px] self-center pl-4 text-left before:absolute before:left-0 before:top-1/2 before:h-[54px] before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-gradient-to-b before:from-[#8ef1ce] before:to-[#f7c96c] before:content-['']">
          <h3 className="m-0 max-w-[16ch] text-[1.58rem] leading-[1.08] max-[1180px]:max-w-none max-[520px]:text-[1.32rem]">
            Consistent Results.
            <span className="block text-[#8ef1ce]">Real Progress.</span>
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-3 max-[860px]:grid-cols-1">
          <div className="min-h-[88px] rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-[14px_14px_12px] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] max-[860px]:min-h-[76px]">
            <strong className="block text-[1.95rem] leading-none tracking-[-0.05em] text-[#8af1ce] max-[520px]:text-[1.7rem]">95%</strong>
            <span className="mt-1.5 block max-w-[13ch] text-[0.78rem] leading-[1.3] text-white/76">
              Target Achieved
            </span>
          </div>
          <div className="min-h-[88px] rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-[14px_14px_12px] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] max-[860px]:min-h-[76px]">
            <strong className="block text-[1.95rem] leading-none tracking-[-0.05em] text-[#8af1ce] max-[520px]:text-[1.7rem]">500+</strong>
            <span className="mt-1.5 block max-w-[13ch] text-[0.78rem] leading-[1.3] text-white/76">
              Students Mentored
            </span>
          </div>
          <div className="min-h-[88px] rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-[14px_14px_12px] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] max-[860px]:min-h-[76px]">
            <strong className="block text-[1.95rem] leading-none tracking-[-0.05em] text-[#8af1ce] max-[520px]:text-[1.7rem]">10+</strong>
            <span className="mt-1.5 block max-w-[13ch] text-[0.78rem] leading-[1.3] text-white/76">
              Teaching Excellence
            </span>
          </div>
        </div>
      </aside>
    </section>
  );
}
