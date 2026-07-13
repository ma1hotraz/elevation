"use client";

import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  ["Home", "#home"],
  ["Programs", "#programs"],
  ["Platform", "#platform"],
  ["About", "#about"],
  ["Results", "#results"],
  ["Testimonials", "#testimonials"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
] as const;

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className="hidden rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/18 hover:text-white max-[1180px]:inline-flex"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(88vw,380px)] border-l-0 bg-[#f8fcfb] p-0 text-[#10252b]">
        <SheetHeader className="border-b border-[#dce8e5] bg-white px-6 pb-5 pt-6 text-left">
          <p className="mb-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#0d7b68]">Elevation Institute</p>
          <SheetTitle className="text-[1.35rem] font-black tracking-[-0.04em] text-[#10252b]">Explore the institute</SheetTitle>
          <SheetDescription className="mt-1 leading-relaxed text-[#64777a]">
            Programs, results, institute details, and student access in one place.
          </SheetDescription>
        </SheetHeader>

        <nav className="grid gap-1 p-4" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <SheetClose asChild key={href}>
              <a
                href={href}
                className="flex min-h-12 items-center justify-between rounded-[13px] px-4 py-3 text-[0.96rem] font-extrabold text-[#21383d] transition hover:bg-[#e9f7f3] hover:text-[#087365] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d7b68]/25"
              >
                {label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </SheetClose>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#dce8e5] bg-white p-5">
          <SheetClose asChild>
            <Button asChild size="lg" className="h-12 w-full rounded-[12px] text-sm">
              <Link href="/portal">
                Open learning portal
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
