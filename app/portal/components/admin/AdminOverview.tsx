import { BookOpenCheck, ChevronRight, Download, GraduationCap, FolderOpen, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  portalCourseCard,
  portalEyebrow,
  portalLead,
  portalMetricCard,
  portalMetricIcon,
} from "../../portalShared";
import { COURSES } from "../../portal.data";
import type { PortalController } from "../../usePortalState";

type AdminOverviewProps = {
  portal: PortalController;
};

export function AdminOverview({ portal }: AdminOverviewProps) {
  const overviewMetrics = [
    {
      label: "Materials",
      value: portal.state.resources.length,
      icon: <BookOpenCheck aria-hidden="true" className="h-[22px] w-[22px]" />,
    },
    {
      label: "Students",
      value: portal.studentUsers.length,
      icon: <Users aria-hidden="true" className="h-[22px] w-[22px]" />,
    },
    {
      label: "Courses",
      value: COURSES.length,
      icon: <GraduationCap aria-hidden="true" className="h-[22px] w-[22px]" />,
    },
    {
      label: "Visible Now",
      value: portal.visibleResources.length,
      icon: <FolderOpen aria-hidden="true" className="h-[22px] w-[22px]" />,
    },
  ] as const;

  return (
    <>
      <section className="grid max-w-6xl gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <div className="max-w-3xl">
          <h1 className="text-[clamp(1.9rem,3vw,2.9rem)] leading-[1] tracking-[-0.06em] text-[#123036]">
            Overview
          </h1>
          <p className={cn(portalLead, "mt-3 max-w-xl text-[0.96rem]")}>
            Track materials, course coverage, and student access at a glance.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2.5">
          <Button
            type="button"
            variant="primary"
            size="lg"
            icon={<Plus />}
            onClick={() => portal.openResourceDialog()}
          >
            Add Resource
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            icon={<Download />}
            onClick={portal.exportResources}
          >
            Export
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-3 lg:grid-cols-2 xl:grid-cols-4" aria-label="Admin overview">
        {overviewMetrics.map((metric) => (
          <article
            key={metric.label}
            className={cn(
              portalMetricCard,
              "min-h-[126px] bg-[radial-gradient(circle_at_86%_24%,rgba(14,143,120,0.06),transparent_7rem),white]",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span className={cn(portalMetricIcon, "h-12 w-12")}>{metric.icon}</span>
              <span className="rounded-full bg-[rgba(14,143,120,0.08)] px-2.5 py-1 text-[0.64rem] font-black uppercase tracking-[0.14em] text-[#0d7b68]">
                Live
              </span>
            </div>
            <div className="mt-5">
              <span className="block text-[0.8rem] font-semibold text-[#627579]">{metric.label}</span>
              <strong className="mt-1 block text-[1.9rem] leading-none tracking-[-0.06em] text-[#123036]">
                {metric.value}
              </strong>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-3 xl:grid-cols-3" aria-label="Course summary">
        {portal.courseSummaries.map((summary) => (
          <article key={summary.course} className={cn(portalCourseCard, "p-0")}>
            <div className="flex items-center justify-between border-b border-[rgba(8,47,43,0.06)] px-[18px] py-[18px]">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-[linear-gradient(180deg,rgba(8,184,146,0.16),rgba(8,115,101,0.07))] text-[#0a7a68]">
                  <BookOpenCheck aria-hidden="true" className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <h3 className="m-0 text-[1.2rem] leading-[1.05] tracking-[-0.04em] text-[#123036]">
                    {summary.course}
                  </h3>
                  <p className="m-0 mt-1 text-[0.78rem] font-semibold text-[#627579]">
                    {summary.resources} materials
                  </p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon-sm" aria-label={`View ${summary.course}`}>
                <ChevronRight aria-hidden="true" className="h-[15px] w-[15px]" />
              </Button>
            </div>
            <div className="grid gap-3 px-[18px] py-[18px]">
              <div className="flex items-center gap-3 text-[0.86rem] font-semibold text-[#556e72]">
                <BookOpenCheck aria-hidden="true" className="h-[16px] w-[16px] text-[#0d7b68]" />
                {summary.resources} materials
              </div>
              <div className="flex items-center gap-3 text-[0.86rem] font-semibold text-[#556e72]">
                <Users aria-hidden="true" className="h-[16px] w-[16px] text-[#0d7b68]" />
                {summary.students} students
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgba(14,143,120,0.08)]">
                <div className="h-full w-1/2 rounded-full bg-[linear-gradient(90deg,var(--mint),var(--green))]" />
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
