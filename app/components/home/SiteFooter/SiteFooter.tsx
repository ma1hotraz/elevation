import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  const linkClass =
    "my-2 block w-fit text-[0.94rem] font-semibold text-white/72 transition hover:translate-x-[3px] hover:text-[#88efcb]";

  return (
    <footer className="grid w-full grid-cols-[minmax(280px,1.7fr)_repeat(3,minmax(150px,1fr))] gap-[42px] bg-[radial-gradient(circle_at_12%_18%,rgba(101,228,196,0.13),transparent_22rem),radial-gradient(circle_at_90%_10%,rgba(247,201,108,0.1),transparent_18rem),linear-gradient(180deg,#073f3a_0%,#042724_100%)] px-[max(32px,calc((100vw-1240px)/2))] pb-[30px] pt-[58px] text-white max-[980px]:grid-cols-[1.5fr_1fr_1fr] max-[980px]:gap-x-7 max-[980px]:gap-y-9 max-[640px]:grid-cols-1 max-[640px]:gap-7 max-[640px]:px-[20px] max-[640px]:pb-[26px] max-[640px]:pt-[44px]">
      <div className="max-w-[390px] max-[980px]:col-span-full max-[980px]:max-w-[560px]">
        <a className="mb-4 inline-flex items-center" href="#home">
          <Image
            src="/logo2.png"
            alt="Elevation Institute"
            width={1024}
            height={369}
            className="block h-auto w-[clamp(185px,18vw,245px)] object-contain max-[640px]:w-[min(210px,78vw)]"
          />
        </a>
        <p className="m-0 text-[0.95rem] leading-[1.7] text-white/72">
          Empowering students with knowledge, guidance, and confidence to
          achieve excellence.
        </p>
        <div className="mt-[18px] flex flex-wrap gap-2.5">
          <span
            aria-label="Facebook"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/8 bg-white/11 text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current stroke-0">
              <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.6 1.7-1.6H16V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.2-3.5 3.6V11H8v3h2.3v7h3.2Z" />
            </svg>
          </span>
          <span
            aria-label="Instagram"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/8 bg-white/11 text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current stroke-0">
              <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.45 1.35a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM12 7.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 1.8A3 3 0 1 0 15 12a3 0 0 0-3-3Z" />
            </svg>
          </span>
          <span
            aria-label="YouTube"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/8 bg-white/11 text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current stroke-0">
              <path d="M21 8.2a2.8 2.8 0 0 0-2-2c-1.8-.5-7-.5-7-.5s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.5 12a29 29 0 0 0 .5 3.8 2.8 2.8 0 0 0 2 2c1.8.5 7 .5 7 .5s5.2 0 7-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-3.8 29 29 0 0 0-.5-3.8ZM10.2 15.3V8.7L15.8 12l-5.6 3.3Z" />
            </svg>
          </span>
          <span
            aria-label="LinkedIn"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/8 bg-white/11 text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current stroke-0">
              <path d="M6.3 8.1A1.8 1.8 0 1 1 6.3 4.5a1.8 1.8 0 0 1 0 3.6ZM4.8 9.6h3V19h-3V9.6Zm4.8 0h2.9v1.3h.1c.4-.8 1.4-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8V19h-3v-4.3c0-1 0-2.4-1.5-2.4s-1.8 1.1-1.8 2.3V19h-3V9.6Z" />
            </svg>
          </span>
        </div>
      </div>

      <div>
        <h4 className="mb-[17px] mt-1 text-[1rem] font-black tracking-[-0.02em] text-white">Quick Links</h4>
        <a className={linkClass} href="#home">Home</a>
        <a className={linkClass} href="#programs">Programs</a>
        <a className={linkClass} href="#about">About Us</a>
        <a className={linkClass} href="#testimonials">Testimonials</a>
      </div>

      <div>
        <h4 className="mb-[17px] mt-1 text-[1rem] font-black tracking-[-0.02em] text-white">Programs</h4>
        <a className={linkClass} href="#programs">Offline PCM</a>
        <a className={linkClass} href="#programs">IELTS Hybrid</a>
        <a className={linkClass} href="#programs">French Online</a>
      </div>

      <div>
        <h4 className="mb-[17px] mt-1 text-[1rem] font-black tracking-[-0.02em] text-white">Stay Connected</h4>
        <a className={`${linkClass} flex items-center gap-2.5`} href="mailto:info@kulkarancoaching.ca">
          <Mail aria-hidden="true" className="h-4 w-4" />
          info@kulkarancoaching.ca
        </a>
        <a className={`${linkClass} flex items-center gap-2.5`} href="tel:+14371234567">
          <Phone aria-hidden="true" className="h-4 w-4" />
          +1 (437) 123-4567
        </a>
        <p className="mt-4 flex items-center gap-2.5 font-black text-[#88efcb]">
          <MapPin aria-hidden="true" className="h-4 w-4" />
          Canada Based
        </p>
      </div>

      <p className="col-span-full mt-2 border-t border-white/11 pt-6 text-[0.84rem] text-white/58">
        (c) 2025 Kulkaran Coaching Institute. All rights reserved.
      </p>
    </footer>
  );
}
