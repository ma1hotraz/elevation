import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const sectionFrame =
  "mx-auto w-[min(1240px,calc(100%-64px))] max-[860px]:w-[min(100%-32px,680px)] max-[520px]:w-[min(100%-14px,420px)]";

export const sectionTitle =
  "m-0 text-[clamp(2rem,4vw,3.25rem)] leading-[1.04] tracking-[-0.055em]";

export const sectionIntro =
  "mx-auto max-w-[620px] font-semibold leading-[1.7] text-[#708084]";

export const cardSurface =
  "relative overflow-hidden rounded-[30px] border border-[rgba(7,67,61,0.1)] bg-gradient-to-b from-white to-[#fbfefd] shadow-[0_24px_70px_rgba(9,72,69,0.08)] transition duration-200 hover:-translate-y-2 hover:border-[rgba(14,143,120,0.18)] hover:shadow-[0_34px_90px_rgba(9,72,69,0.13)]";

export const pillBase =
  "inline-flex min-h-8 items-center gap-2 rounded-full border text-[0.76rem] font-black uppercase tracking-[0.08em]";

export function SectionEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mx-auto mb-3 inline-grid gap-2 text-[0.76rem] font-[850] uppercase tracking-[0.2em] text-[#079475] before:content-[''] before:mx-auto before:h-[22px] before:w-px before:bg-gradient-to-b before:from-[rgba(14,143,120,0.22)] before:to-[rgba(14,143,120,0.82)] after:content-[''] after:mx-auto after:h-px after:w-[88px] after:bg-gradient-to-r after:from-transparent after:via-[rgba(14,143,120,0.65)] after:to-transparent",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={cn(sectionTitle, className)}>{children}</h2>;
}

export function SectionIntro({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn(sectionIntro, className)}>{children}</p>;
}
