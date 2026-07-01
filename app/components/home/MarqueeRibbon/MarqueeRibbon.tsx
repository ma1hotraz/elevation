export function MarqueeRibbon() {
  const items = [
    "Physics Coaching",
    "Math Mastery",
    "Chemistry Prep",
    "IELTS Guidance",
    "French Classes",
    "Small Batches",
  ];

  return (
    <section className="relative z-10 w-full px-0 pt-7 pb-4 max-[860px]:pt-5 max-[860px]:pb-3" aria-hidden="true">
      <div className="w-full overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_16%_50%,rgba(111,236,199,0.18),transparent_18rem),linear-gradient(135deg,#063d3a_0%,#063633_47%,#042320_100%)] shadow-[0_28px_70px_rgba(4,39,36,0.16)] [-webkit-transform:rotate(-0.8deg)] [transform:rotate(-0.8deg)] max-[860px]:[-webkit-transform:rotate(-0.35deg)] max-[860px]:[transform:rotate(-0.35deg)]">
        <div className="relative overflow-hidden py-5 max-[860px]:py-3.5">
          <div className="absolute inset-y-0 left-0 z-[1] w-20 bg-gradient-to-r from-[#052f2b]/95 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 z-[1] w-20 bg-gradient-to-l from-[#052f2b]/95 to-transparent pointer-events-none" />
          <div className="relative z-0 flex w-max items-center gap-[18px] animate-[marqueeSlide_24s_linear_infinite]">
            {[...items, ...items].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex flex-shrink-0 items-center whitespace-nowrap text-[0.8rem] font-extrabold uppercase tracking-[0.14em] text-white/95 max-[860px]:text-[0.75rem] max-[860px]:tracking-[0.12em] after:ml-[18px] after:inline-block after:h-[7px] after:w-[7px] after:rounded-full after:bg-[rgba(143,244,209,0.75)] after:shadow-[0_0_0_4px_rgba(143,244,209,0.1)] after:content-['']"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
