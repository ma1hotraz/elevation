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
  portalMetricCard,
  portalMetricIcon,
} from "../../portalShared";
import { COURSES } from "../../portal.data";
import type { PortalController } from "../../usePortalState";

type AdminOverviewProps = {
  portal: PortalController;
};

function OverviewActionCard({
  title,
  body,
  actionLabel,
  onClick,
}: {
  title: string;
  body: string;
  actionLabel: string;
  onClick: () => void;
}) {
  return (
    <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-4">
      <strong className="block text-[0.98rem] text-[#10252b]">{title}</strong>
      <p className="m-0 mt-2 text-[0.9rem] leading-[1.6] text-[#627579]">{body}</p>
      <Button type="button" variant="secondary" className="mt-4" icon={<ArrowUpRight />} onClick={onClick}>
        {actionLabel}
      </Button>
    </article>
  );
}

function OverviewPulseCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4 shadow-[0_14px_34px_rgba(9,72,69,0.04)]">
      <span className="text-[0.74rem] font-black uppercase tracking-[0.14em] text-[#0d7b68]">{title}</span>
      <strong className="mt-3 block text-[1.5rem] font-black leading-none tracking-[-0.05em] text-[#10252b]">
        {value}
      </strong>
      <p className="m-0 mt-2 text-[0.86rem] leading-[1.55] text-[#627579]">{detail}</p>
    </article>
  );
}

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
      <section className="relative overflow-hidden rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(116,237,198,0.24),transparent_24%),linear-gradient(135deg,#083f3b_0%,#0b5d54_54%,#11806e_100%)] p-6 text-white shadow-[0_26px_72px_rgba(4,39,36,0.18)]">
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#9df4d6]">
              Admin workspace
            </p>
            <h1 className="m-0 mt-3 text-[clamp(2rem,3.3vw,3rem)] font-black leading-[0.98] tracking-[-0.05em]">
              Control resources, access, and payments from one command view.
            </h1>
            <p className="m-0 mt-3 max-w-2xl text-[0.98rem] leading-[1.7] text-white/82">
              Monitor course delivery, resolve account issues, and keep payment visibility current without switching between disconnected panels.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 max-[640px]:w-full max-[640px]:flex-col">
            <Button type="button" size="lg" icon={<Plus />} onClick={() => portal.openResourceDialog()}>
              Add Resource
            </Button>
            <Button type="button" variant="secondary" size="lg" icon={<Download />} onClick={portal.exportResources}>
              Export Resources
            </Button>
          </div>
        </div>

        <div className="relative z-10 mt-6 grid gap-3 lg:grid-cols-4 sm:grid-cols-2">
          {overviewMetrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[20px] border border-white/10 bg-white/[0.08] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-white/[0.14] text-[#9df4d6]">
                  {metric.icon}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-[0.64rem] font-black uppercase tracking-[0.14em] text-white/72">
                  {metric.tone}
                </span>
              </div>
              <strong className="mt-5 block text-[1.9rem] font-black leading-none tracking-[-0.05em]">
                {metric.value}
              </strong>
              <span className="mt-2 block text-[0.82rem] font-bold text-white/72">{metric.label}</span>
            </article>
          ))}
        </div>

        <div className="absolute inset-y-0 right-[-8%] hidden w-[34%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_66%)] blur-2xl lg:block" />
      </section>

      <section className="grid gap-3 xl:grid-cols-3">
        <OverviewPulseCard
          title="Account health"
          value={`${suspendedAccounts} suspended`}
          detail={
            suspendedAccounts
              ? "Review suspended accounts from the accounts view and restore access where needed."
              : "All teacher and student accounts are currently active."
          }
        />
        <OverviewPulseCard
          title="Publishing queue"
          value={`${upcomingResources} upcoming`}
          detail={
            upcomingResources
              ? "There are scheduled resources waiting to be pushed live."
              : "No resources are waiting in the upcoming queue."
          }
        />
        <OverviewPulseCard
          title="Teaching coverage"
          value={`${teacherCount} teachers`}
          detail="Use teacher accounts and course assignments to balance delivery across programs."
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-5">
          <div className="grid gap-3 md:grid-cols-2">
            <OverviewActionCard
              title="Manage accounts"
              body="Create teacher and student access, assign courses, and resolve credential or status issues."
              actionLabel="Open accounts"
              onClick={() => portal.setAdminView("accounts")}
            />
            <OverviewActionCard
              title="Review payments"
              body="Track due, paid, and refunded amounts and create new payment entries for students."
              actionLabel="Open payments"
              onClick={() => portal.setAdminView("payments")}
            />
            <OverviewActionCard
              title="Review resource library"
              body="Audit live links, archive outdated items, and keep every course library current."
              actionLabel="Open resources"
              onClick={() => portal.setAdminView("library")}
            />
            <OverviewActionCard
              title="Create new material"
              body="Add a new test, study material, revision file, or answer link from the central resource form."
              actionLabel="Add resource"
              onClick={() => portal.openResourceDialog()}
            />
          </div>

          <div className="rounded-[24px] border border-[rgba(8,47,43,0.08)] bg-white p-5 shadow-[0_20px_58px_rgba(9,72,69,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.14em] text-[#0d7b68]">
                  Latest publish
                </p>
                <h2 className="m-0 mt-2 text-[1.3rem] font-black text-[#10252b]">Newest library update</h2>
              </div>
              {portal.latestResource ? <Badge variant="secondary">{portal.latestResource.course}</Badge> : null}
            </div>

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
          </div>
        </div>

        <div className="rounded-[24px] border border-[rgba(8,47,43,0.08)] bg-white p-5 shadow-[0_20px_58px_rgba(9,72,69,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.14em] text-[#0d7b68]">
                Course summary
              </p>
              <h2 className="m-0 mt-2 text-[1.3rem] font-black text-[#10252b]">Coverage by program</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f0fbf7] px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#087365]">
              <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
              Live view
            </span>
          </div>

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
        </div>
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
