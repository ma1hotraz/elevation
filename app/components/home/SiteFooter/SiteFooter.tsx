import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const linkClass =
    "my-2 block w-fit text-[0.94rem] font-semibold text-white/72 transition hover:translate-x-[3px] hover:text-[#88efcb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88efcb]/50";

  return (
    <footer className="grid w-full grid-cols-[minmax(280px,1.7fr)_repeat(3,minmax(150px,1fr))] gap-[42px] bg-[radial-gradient(circle_at_12%_18%,rgba(101,228,196,0.13),transparent_22rem),radial-gradient(circle_at_90%_10%,rgba(247,201,108,0.1),transparent_18rem),linear-gradient(180deg,#073f3a_0%,#042724_100%)] px-[max(32px,calc((100vw-1240px)/2))] pb-[30px] pt-[58px] text-white max-[980px]:grid-cols-[1.5fr_1fr_1fr] max-[980px]:gap-x-7 max-[980px]:gap-y-9 max-[640px]:grid-cols-1 max-[640px]:gap-7 max-[640px]:px-[20px] max-[640px]:pb-[26px] max-[640px]:pt-[44px]">
      <div className="max-w-[390px] max-[980px]:col-span-full max-[980px]:max-w-[560px]">
        <a className="mb-4 inline-flex items-center" href="#home" aria-label={`${siteConfig.name} home`}>
          <Image
            src="/logo2.png"
            alt="Elevation Institute"
            width={1024}
            height={369}
            className="block h-auto w-[clamp(185px,18vw,245px)] object-contain max-[640px]:w-[min(210px,78vw)]"
          />
        </a>
        <p className="m-0 text-[0.95rem] leading-[1.7] text-white/72">
          Empowering students with knowledge, guidance, and confidence to achieve excellence.
        </p>
        {siteConfig.socialLinks.length ? (
          <div className="mt-[18px] flex flex-wrap gap-2.5" aria-label="Social links">
            {siteConfig.socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-[0.78rem] font-black text-white transition hover:-translate-y-0.5 hover:bg-white/16"
              >
                {social.label}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <h2 className="mb-[17px] mt-1 text-[1rem] font-black tracking-[-0.02em] text-white">Quick Links</h2>
        <a className={linkClass} href="#home">Home</a>
        <a className={linkClass} href="#programs">Programs</a>
        <a className={linkClass} href="#about">About Us</a>
        <a className={linkClass} href="#testimonials">Testimonials</a>
      </div>

      <div>
        <h2 className="mb-[17px] mt-1 text-[1rem] font-black tracking-[-0.02em] text-white">Programs</h2>
        <a className={linkClass} href="#programs">Offline PCM</a>
        <a className={linkClass} href="#programs">IELTS Hybrid</a>
        <a className={linkClass} href="#programs">French Online</a>
      </div>

      <div>
        <h2 className="mb-[17px] mt-1 text-[1rem] font-black tracking-[-0.02em] text-white">Stay Connected</h2>
        {siteConfig.contactEmail ? (
          <a className={`${linkClass} flex items-center gap-2.5 break-all`} href={`mailto:${siteConfig.contactEmail}`}>
            <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
            {siteConfig.contactEmail}
          </a>
        ) : null}
        {siteConfig.phoneHref && siteConfig.phoneDisplay ? (
          <a className={`${linkClass} flex items-center gap-2.5`} href={siteConfig.phoneHref}>
            <Phone aria-hidden="true" className="h-4 w-4" />
            {siteConfig.phoneDisplay}
          </a>
        ) : null}
        {!siteConfig.contactEmail && !siteConfig.phoneHref ? (
          <a className={`${linkClass} flex items-center gap-2.5`} href="#contact">
            <Mail aria-hidden="true" className="h-4 w-4" />
            Use the enquiry form
          </a>
        ) : null}
        <p className="mt-4 flex items-center gap-2.5 font-black text-[#88efcb]">
          <MapPin aria-hidden="true" className="h-4 w-4" />
          {siteConfig.location}
        </p>
      </div>

      <p className="col-span-full mt-2 border-t border-white/11 pt-6 text-[0.84rem] text-white/58">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </p>
    </footer>
  );
}
