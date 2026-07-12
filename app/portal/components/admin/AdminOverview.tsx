import {
  ArrowUpRight,
  BookOpenCheck,
  Clock3,
  Download,
  FolderOpen,
  GraduationCap,
  Plus,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  portalCourseCard,
  portalMetricIcon,
} from "../../portalShared";
import { COURSES } from "../../portal.data";
import { ActionCard, HeroMetric, PortalHero, PortalPanel, PortalSectionHeader, PulseCard } from "../PortalStat";
import type { PortalController } from "../../usePortalState";

type AdminOverviewProps = {
  portal: PortalController;
};

export function AdminOverview({ portal }: AdminOverviewProps) {
  const suspendedAccounts = portal.managedAccounts.filter((account) => account.accountStatus === "suspended").length;
  const liveResources = portal.state.resources.filter((resource) => resource.status === "Live").length;
  const upcomingResources = portal.state.resources.filter((resource) => resource.status === "Upcoming").length;
  const teacherCount = portal.teacherUsers.length;
  const overviewMetrics = [
    {
      label: "Materials",
      value: portal.state.resources.length,
      icon: <BookOpenCheck aria-hidden="true" className="h-[22px] w-[22px]" />,
      tone: "Library",
    },
    {
      label: "Students",
      value: portal.studentUsers.length,
      icon: <Users aria-hidden="true" className="h-[22px] w-[22px]" />,
      tone: "Active",
    },
    {
      label: "Courses",
      value: COURSES.length,
      icon: <GraduationCap aria-hidden="true" className="h-[22px] w-[22px]" />,
      tone: "Coverage",
    },
    {
      label: "Visible Now",
      value: liveResources,
      icon: <FolderOpen aria-hidden="true" className="h-[22px] w-[22px]" />,
      tone: "Live",
    },
  ] as const;

  return (
    <div className="grid gap-6">
      <PortalHero
        eyebrow="Admin workspace"
        title="Control resources, access, and payments from one command view."
        lead="Monitor course delivery, resolve account issues, and keep payment visibility current without switching between disconnected panels."
        actions={
          <>
            <Button type="button" size="lg" icon={<Plus />} onClick={() => portal.openResourceDialog()}>
              Add Resource
            </Button>
            <Button type="button" variant="secondary" size="lg" icon={<Download />} onClick={portal.exportResources}>
              Export Resources
            </Button>
          </>
        }
        metrics={overviewMetrics.map((metric) => (
            <HeroMetric
              key={metric.label}
              label={metric.label}
              value={metric.value}
              icon={metric.icon}
              tone={metric.tone}
            />
          ))}
      />

      <section className="grid gap-3 xl:grid-cols-3">
        <PulseCard
          title="Account health"
          value={`${suspendedAccounts} suspended`}
          detail={
            suspendedAccounts
              ? "Review suspended accounts from the accounts view and restore access where needed."
              : "All teacher and student accounts are currently active."
          }
        />
        <PulseCard
          title="Publishing queue"
          value={`${upcomingResources} upcoming`}
          detail={
            upcomingResources
              ? "There are scheduled resources waiting to be pushed live."
              : "No resources are waiting in the upcoming queue."
          }
        />
        <PulseCard
          title="Teaching coverage"
          value={`${teacherCount} teachers`}
          detail="Use teacher accounts and course assignments to balance delivery across programs."
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-5">
          <div className="grid gap-3 md:grid-cols-2">
            <ActionCard
              title="Manage accounts"
              body="Create teacher and student access, assign courses, and resolve credential or status issues."
              actionLabel="Open accounts"
              onClick={() => portal.setAdminView("accounts")}
            />
            <ActionCard
              title="Review payments"
              body="Track due, paid, and refunded amounts and create new payment entries for students."
              actionLabel="Open payments"
              onClick={() => portal.setAdminView("payments")}
            />
            <ActionCard
              title="Review resource library"
              body="Audit live links, archive outdated items, and keep every course library current."
              actionLabel="Open resources"
              onClick={() => portal.setAdminView("library")}
            />
            <ActionCard
              title="Create new material"
              body="Add a new test, study material, revision file, or answer link from the central resource form."
              actionLabel="Add resource"
              onClick={() => portal.openResourceDialog()}
            />
          </div>

          <PortalPanel className="rounded-[24px] p-5">
            <PortalSectionHeader
              eyebrow="Latest publish"
              title="Newest library update"
              actions={portal.latestResource ? <Badge variant="secondary">{portal.latestResource.course}</Badge> : null}
            />

            {portal.latestResource ? (
              <div className="mt-4 rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-2xl">
                    <strong className="block text-[1rem] text-[#10252b]">{portal.latestResource.title}</strong>
                    <p className="m-0 mt-2 text-[0.9rem] leading-[1.65] text-[#627579]">
                      {portal.latestResource.description}
                    </p>
                  </div>
                  <Badge>{portal.latestResource.status}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline">{portal.latestResource.category}</Badge>
                  <Badge variant="outline">{portal.latestResource.answerReleaseStatus}</Badge>
                </div>
              </div>
            ) : (
              <p className="m-0 mt-4 text-[0.92rem] text-[#627579]">No resources have been published yet.</p>
            )}
          </PortalPanel>
        </div>

        <PortalPanel className="rounded-[24px] p-5">
          <PortalSectionHeader
            eyebrow="Course summary"
            title="Coverage by program"
            actions={
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f0fbf7] px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#087365]">
                <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                Live view
              </span>
            }
          />

          <div className="mt-4 grid gap-3">
            {portal.courseSummaries.map((summary) => (
              <article key={summary.course} className={cn(portalCourseCard, "p-0")}>
                <div className="flex items-center justify-between border-b border-[rgba(8,47,43,0.06)] px-[18px] py-[18px]">
                  <div className="flex items-center gap-3">
                    <span className={cn(portalMetricIcon, "h-11 w-11 rounded-[16px]")}>
                      <BookOpenCheck aria-hidden="true" className="h-[18px] w-[18px]" />
                    </span>
                    <div>
                      <h3 className="m-0 text-[1.08rem] leading-[1.05] tracking-[-0.04em] text-[#123036]">
                        {summary.course}
                      </h3>
                      <p className="m-0 mt-1 text-[0.78rem] font-semibold text-[#627579]">
                        {summary.resources} materials
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`View ${summary.course}`}
                    onClick={() => {
                      portal.setActiveCourse(summary.course);
                      portal.setAdminView("library");
                    }}
                  >
                    <ArrowUpRight aria-hidden="true" className="h-[15px] w-[15px]" />
                  </Button>
                </div>
                <div className="grid gap-3 px-[18px] py-[18px]">
                  <div className="flex items-center justify-between gap-3 text-[0.86rem] font-semibold text-[#556e72]">
                    <span>Resources</span>
                    <strong className="text-[#10252b]">{summary.resources}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[0.86rem] font-semibold text-[#556e72]">
                    <span>Students</span>
                    <strong className="text-[#10252b]">{summary.students}</strong>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[rgba(14,143,120,0.08)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--mint),var(--green))]"
                      style={{ width: `${Math.max(18, Math.min(100, summary.resources * 20))}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PortalPanel>
      </section>

      {suspendedAccounts > 0 ? (
        <section className="rounded-[20px] border border-[rgba(180,35,24,0.12)] bg-[#fff8f7] p-4 shadow-[0_12px_30px_rgba(180,35,24,0.05)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.14em] text-[#b42318]">
                Needs review
              </p>
              <h2 className="m-0 mt-2 text-[1.2rem] font-black text-[#10252b]">
                {suspendedAccounts} account{suspendedAccounts === 1 ? "" : "s"} currently suspended
              </h2>
              <p className="m-0 mt-2 text-[0.9rem] leading-[1.6] text-[#7b4e4a]">
                Review account status, payment context, or course assignment issues from the accounts panel.
              </p>
            </div>
            <Button type="button" variant="destructive" icon={<ShieldAlert />} onClick={() => portal.setAdminView("accounts")}>
              Review accounts
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
