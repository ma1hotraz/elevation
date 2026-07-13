import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCounter } from "./StatCounter";
import { EnquiryForm } from "./EnquiryForm";
import { MobileNavigation } from "./MobileNavigation";

export function Hero() {
  const heroFrame =
    "relative z-10 mx-auto w-[min(1380px,calc(100%-64px))] max-[860px]:w-[min(100%-32px,680px)] max-[520px]:w-[min(100%-24px,420px)]";

  const navLink =
    "relative py-2 text-[0.92rem] font-semibold text-white/86 after:absolute after:inset-x-0 after:bottom-[5px] after:h-[2px] after:origin-left after:scale-x-0 after:bg-[#8ef1ce] after:transition-transform after:content-[''] hover:after:scale-x-100";


  return (
    <section id="home" className="relative">
      <div className="relative min-h-[100svh] overflow-hidden bg-[radial-gradient(circle_at_70%_18%,rgba(111,236,199,0.18),transparent_22rem),radial-gradient(circle_at_83%_72%,rgba(247,201,108,0.14),transparent_15rem),linear-gradient(135deg,#063d3a_0%,#063633_47%,#042320_100%)]">
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(180deg,black,transparent_80%)]" />

        <nav
          className={`${heroFrame} relative z-10 grid grid-cols-[280px_1fr_auto] items-center gap-5 pb-[2px] pt-[10px] max-[1180px]:grid-cols-[1fr_auto_auto] max-[1180px]:gap-3 max-[1180px]:pt-[14px]`}
          aria-label="Main navigation"
        >
          <a className="inline-flex items-center" href="#home" aria-label="Elevation Coaching Institute home">
            <Image
              src="/logo2.png"
              alt="Elevation Institute"
              width={1024}
              height={369}
              className="block h-auto w-[clamp(150px,13vw,202px)] object-contain max-[520px]:w-[clamp(122px,34vw,152px)]"
              priority
            />
          </a>

          <div className="flex items-center justify-center gap-[clamp(18px,2vw,30px)] text-[0.92rem] font-semibold text-white/86 max-[1180px]:hidden">
            <a className={navLink} href="#home">Home</a>
            <a className={navLink} href="#programs">Programs</a>
            <a className={navLink} href="#platform">Platform</a>
            <a className={navLink} href="#about">About</a>
            <a className={navLink} href="#results">Results</a>
            <a className={navLink} href="#testimonials">Testimonials</a>
            <a className={navLink} href="#faq">FAQ</a>
            <a className={navLink} href="#contact">Contact</a>
          </div>

          <Button
            asChild
            variant="ghost"
            className="h-auto justify-self-end rounded-full border border-white/12 bg-white px-[14px] py-[10px] text-[#063a37] shadow-[0_18px_42px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 hover:bg-[#f5fffb] hover:text-[#063a37] max-[520px]:px-[10px] max-[520px]:py-[8px]"
          >
            <Link href="/portal" aria-label="Open learning portal">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0c8f79,#67e7c6)] text-white shadow-[0_10px_22px_rgba(8,115,101,0.22)] max-[520px]:h-6 max-[520px]:w-6">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="grid text-left leading-none">
                <span className="text-[0.56rem] font-black uppercase tracking-[0.16em] text-[#0d8b77] max-[520px]:hidden">
                  Student Access
                </span>
                <span className="text-[0.82rem] font-black tracking-[0.01em] text-[#063a37] max-[520px]:text-[0.72rem]">
                  Portal
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 text-[#063a37] transition-transform group-hover/button:translate-x-0.5 max-[520px]:hidden"
              />
            </Link>
          </Button>

          <MobileNavigation />
        </nav>

        <div
          className={`${heroFrame} relative z-10 grid min-h-[calc(100svh-110px)] grid-cols-[minmax(0,1.04fr)_minmax(320px,0.82fr)_340px] items-center gap-[clamp(24px,3vw,40px)] py-[6px] pb-[36px] max-[1180px]:grid-cols-[1fr_350px] max-[1180px]:gap-6 max-[1180px]:min-h-[calc(100svh-108px)] max-[860px]:grid-cols-1 max-[860px]:gap-[18px] max-[860px]:min-h-0 max-[860px]:py-5 max-[860px]:pb-[58px]`}
        >
          <div className="max-w-[560px] pt-2 max-[860px]:max-w-none max-[860px]:pt-0">
            <p className="mb-[34px] border-l-2 border-[#79eecd]/70 pl-4 text-[0.76rem] font-black uppercase tracking-[0.16em] text-[#8ff4d1] max-[520px]:mb-[12px] max-[520px]:pl-[10px] max-[520px]:text-[0.58rem] max-[520px]:leading-[1.35] max-[520px]:tracking-[0.1em]">
              Focused coaching for ambitious students
            </p>

            <h1
            className="m-0 max-w-[12.5ch] text-[clamp(4.35rem,5.15vw,6.05rem)] leading-[1.02] tracking-[-0.035em] text-white max-[860px]:max-w-full max-[860px]:text-[clamp(2.9rem,10vw,4rem)] max-[520px]:text-[clamp(2.24rem,10vw,2.68rem)]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Learn Better.
              <span className="mt-3.5 block text-[#74edc6] drop-shadow-[0_20px_70px_rgba(101,228,196,0.22)] max-[520px]:mt-1.5">
                Achieve Bigger.
              </span>
            </h1>

            <div className="my-4 hidden overflow-hidden rounded-[26px] border border-white/12 bg-[radial-gradient(circle_at_78%_15%,rgba(247,201,108,0.2),transparent_9rem),linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.035))] px-4 pt-4 shadow-[0_22px_58px_rgba(0,0,0,0.2)] max-[860px]:block max-[520px]:my-3">
              <div className="relative mx-auto h-[248px] w-full max-w-[370px] max-[520px]:h-[224px]">
                <span className="absolute left-1/2 top-8 h-[182px] w-[182px] -translate-x-1/2 rounded-full bg-[linear-gradient(135deg,rgba(101,228,196,0.28),rgba(247,201,108,0.18))] max-[520px]:h-[166px] max-[520px]:w-[166px]" />
                <span className="absolute left-3 top-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#8ef1ce]">
                  Head Coach
                </span>
                <Image
                  className="absolute left-1/2 bottom-0 h-[224px] w-[224px] -translate-x-1/2 rounded-full border-[7px] border-white/14 object-cover object-top shadow-[0_26px_54px_rgba(0,0,0,0.25)] max-[520px]:h-[204px] max-[520px]:w-[204px]"
                  src="/founder-kulkaran-singh.png"
                  alt="Kulkaran Singh, founder of Elevation Coaching Institute"
                  width={440}
                  height={440}
                  priority
                />
                <div className="absolute bottom-3 right-0 rounded-[14px] bg-white/95 px-3 py-2 text-[#063a37] shadow-[0_18px_36px_rgba(0,0,0,0.2)] max-[520px]:right-0 max-[520px]:bottom-2">
                  <strong className="block text-[0.86rem] leading-none max-[520px]:text-[0.8rem]">Kulkaran Singh</strong>
                  <span className="mt-1 block text-[0.62rem] font-bold text-[#5c6e72] max-[520px]:text-[0.58rem]">
                    Founder & Head Coach
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-[26px] mb-[26px] max-w-[520px] text-[1.02rem] leading-[1.74] tracking-[0.01em] text-white/84 max-[860px]:max-w-[620px] max-[860px]:text-[1rem] max-[860px]:leading-[1.7] max-[520px]:mt-[12px] max-[520px]:mb-4 max-[520px]:max-w-[36ch] max-[520px]:text-[0.84rem] max-[520px]:leading-[1.45]">
              Premium coaching for Grade 9-12 Physics, Chemistry, Math, IELTS, and
              French across offline, online, and hybrid formats.
            </p>

            <div className="mb-4 hidden grid-cols-2 gap-2.5 max-[860px]:grid">
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#8ef1ce] px-4 text-[0.82rem] font-black text-[#053b36] shadow-[0_16px_34px_rgba(0,0,0,0.18)]"
              >
                Book Counselling
              </a>
              <a
                href="#programs"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 bg-white/10 px-4 text-[0.82rem] font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                style={{ color: "#ffffff" }}
              >
                View Programs
              </a>
            </div>

            <div aria-label="Institute statistics" className="w-[min(560px,100%)] max-[860px]:w-full">
              <p className="mb-3 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/70 max-[520px]:mb-2 max-[520px]:text-[0.56rem] max-[520px]:tracking-[0.12em]">
                Trusted outcomes
              </p>
              <div className="grid grid-cols-3 gap-3 max-[860px]:grid-cols-2 max-[520px]:grid-cols-3 max-[520px]:gap-1.5">
                <div className="grid min-h-[112px] justify-items-start gap-2.5 rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,251,248,0.94))] p-[18px_18px_16px] text-left shadow-[0_18px_46px_rgba(0,0,0,0.14)] max-[520px]:min-h-[82px] max-[520px]:rounded-[15px] max-[520px]:gap-1.5 max-[520px]:p-[10px_9px_9px]">
                  <span className="h-[3px] w-[42px] rounded-full bg-gradient-to-r from-[#08b892] to-[rgba(8,184,146,0.24)] max-[520px]:w-9" />
                  <strong
                    className="flex min-h-[2.05rem] items-center justify-start text-[2.05rem] leading-none tracking-[-0.06em] text-[#07836f] max-[520px]:min-h-[1.25rem] max-[520px]:text-[1.32rem]"
                    style={{ fontFamily: '"Space Grotesk", "Segoe UI", "Helvetica Neue", Arial, sans-serif' }}
                  >
                    <StatCounter end={500} suffix="+" />
                  </strong>
                  <small className="max-w-[12ch] text-[0.72rem] font-extrabold leading-[1.35] text-[#5b7275] max-[520px]:text-[0.58rem] max-[520px]:leading-[1.2]">
                    Students Mentored
                  </small>
                </div>
                <div className="grid min-h-[112px] justify-items-start gap-2.5 rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,251,248,0.94))] p-[18px_18px_16px] text-left shadow-[0_18px_46px_rgba(0,0,0,0.14)] max-[520px]:min-h-[82px] max-[520px]:rounded-[15px] max-[520px]:gap-1.5 max-[520px]:p-[10px_9px_9px]">
                  <span className="h-[3px] w-[42px] rounded-full bg-gradient-to-r from-[#08b892] to-[rgba(8,184,146,0.24)] max-[520px]:w-9" />
                  <strong
                    className="flex min-h-[2.05rem] items-center justify-start text-[2.05rem] leading-none tracking-[-0.06em] text-[#07836f] max-[520px]:min-h-[1.25rem] max-[520px]:text-[1.32rem]"
                    style={{ fontFamily: '"Space Grotesk", "Segoe UI", "Helvetica Neue", Arial, sans-serif' }}
                  >
                    <StatCounter end={95} suffix="%" />
                  </strong>
                  <small className="max-w-[12ch] text-[0.72rem] font-extrabold leading-[1.35] text-[#5b7275] max-[520px]:text-[0.58rem] max-[520px]:leading-[1.2]">
                    Success
                    <br />
                    Rate
                  </small>
                </div>
                <div className="grid min-h-[112px] justify-items-start gap-2.5 rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,251,248,0.94))] p-[18px_18px_16px] text-left shadow-[0_18px_46px_rgba(0,0,0,0.14)] max-[520px]:min-h-[82px] max-[520px]:rounded-[15px] max-[520px]:gap-1.5 max-[520px]:p-[10px_9px_9px] max-[860px]:col-span-2 max-[520px]:col-span-1">
                  <span className="h-[3px] w-[42px] rounded-full bg-gradient-to-r from-[#08b892] to-[rgba(8,184,146,0.24)] max-[520px]:w-9" />
                  <strong
                    className="flex min-h-[2.05rem] items-center justify-start text-[2.05rem] leading-none tracking-[-0.06em] text-[#07836f] max-[520px]:min-h-[1.25rem] max-[520px]:text-[1.32rem]"
                    style={{ fontFamily: '"Space Grotesk", "Segoe UI", "Helvetica Neue", Arial, sans-serif' }}
                  >
                    <StatCounter end={10} suffix="+" />
                  </strong>
                  <small className="max-w-[12ch] text-[0.72rem] font-extrabold leading-[1.35] text-[#5b7275] max-[520px]:text-[0.58rem] max-[520px]:leading-[1.2]">
                    Years Experience
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[540px] min-h-[540px] self-end max-[1180px]:h-[500px] max-[1180px]:min-h-[500px] max-[860px]:hidden" aria-hidden="true">
            <span className="absolute right-7 top-[88px] h-[250px] w-[250px] rounded-full bg-[radial-gradient(circle_at_40%_38%,#ffe1a0,#e5bc6c_48%,rgba(229,188,108,0.1)_70%)] opacity-70 max-[860px]:right-2 max-[860px]:top-[26px] max-[860px]:h-[160px] max-[860px]:w-[160px]" />
            <span className="absolute bottom-[56px] right-[48px] h-[230px] w-[230px] rounded-full bg-[linear-gradient(135deg,rgba(97,233,197,0.34),rgba(20,143,123,0.18))] opacity-[0.38] max-[860px]:bottom-3 max-[860px]:right-4 max-[860px]:h-[230px] max-[860px]:w-[230px] max-[520px]:bottom-0 max-[520px]:right-0 max-[520px]:h-[150px] max-[520px]:w-[150px]" />
            <span className="absolute right-[58px] top-[64px] h-[150px] w-[120px] bg-[radial-gradient(circle,rgba(134,245,214,0.58)_1.4px,transparent_1.4px)] bg-[length:14px_14px] opacity-[0.18] max-[520px]:right-2 max-[520px]:top-4 max-[520px]:h-[120px] max-[520px]:w-[96px]" />
            <Image
              className="absolute left-1/2 bottom-[26px] h-[448px] w-[448px] -translate-x-1/2 rounded-full border-[8px] border-white/14 object-cover object-top drop-shadow-[0_28px_52px_rgba(0,0,0,0.28)] max-[860px]:bottom-[34px] max-[860px]:h-[360px] max-[860px]:w-[360px] max-[520px]:bottom-[16px] max-[520px]:h-[180px] max-[520px]:w-[180px]"
              src="/founder-kulkaran-singh.png"
              alt="Kulkaran Singh, founder of Elevation Coaching Institute"
              width={720}
              height={720}
              priority
              loading="eager"
            />
            <div className="absolute right-2 bottom-[64px] w-[228px] rotate-[-2deg] rounded-[18px] bg-white/95 p-[15px_18px] text-[#063a37] shadow-[0_24px_70px_rgba(0,0,0,0.22)] max-[860px]:bottom-2 max-[520px]:right-0 max-[520px]:bottom-0 max-[520px]:w-[156px] max-[520px]:rounded-[14px] max-[520px]:p-[9px_10px]">
              <b
                className="mb-2 block text-[1.32rem] leading-none text-[#086d5e] max-[520px]:text-[0.9rem]"
                style={{ fontFamily: '"Segoe Script", cursive' }}
              >
                Kulkaran Singh
              </b>
              <small className="block text-[0.72rem] font-bold text-[#5c6e72] max-[520px]:text-[0.6rem]">
                Founder & Head Coach
              </small>
            </div>
          </div>

          <EnquiryForm />
        </div>

        <a
          className="absolute bottom-[22px] left-1/2 z-10 inline-flex -translate-x-1/2 flex-col items-center gap-2.5 text-white/76 transition hover:-translate-y-0.5 max-[520px]:hidden"
          href="#programs"
          aria-label="Scroll to programs section"
        >
          <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.22em]">Scroll</span>
          <span className="relative h-[46px] w-7 rounded-full border border-white/40 bg-white/4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_18px_rgba(142,241,206,0.12)]">
            <span className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#8ef1ce] shadow-[0_0_14px_rgba(142,241,206,0.45)] motion-safe:animate-[scrollCueFloat_1.8s_ease-in-out_infinite]" />
          </span>
        </a>
      </div>
    </section>
  );
}
