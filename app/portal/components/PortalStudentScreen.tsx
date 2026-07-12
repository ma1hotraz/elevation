"use client";

import { useState } from "react";
import {
  CalendarClock,
  ClipboardList,
  FolderOpen,
  Link2,
  Phone,
  ReceiptText,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionCard, HeroMetric, HighlightCard, InfoTile, PortalHero } from "./PortalStat";
import { portalLead, portalShell, portalStyles } from "../portalShared";
import type { PortalController } from "../usePortalState";
import type { TestResource } from "../portal.types";
import { AdminSidebar } from "./admin/AdminSidebar";

function StudentWorkspaceHero({ portal }: { portal: PortalController }) {
  const student = portal.currentUser;
  const performance = student?.performance;
  const liveTests = portal.visibleResources.filter(
    (resource) => resource.category === "Live Test" && resource.status !== "Archived",
  );

  return (
    <section className="mb-6 grid gap-5">
      <PortalHero
        eyebrow="Student workspace"
        title={`${student?.name ?? "Student"} dashboard`}
        lead="Resources, tests, performance, and payment visibility now follow the same visual system as admin."
        actions={
          <div className="grid min-w-[230px] gap-3 rounded-[20px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm max-[640px]:w-full">
            <div>
              <span className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-[#9df4d6]">Current standing</span>
              <strong className="mt-2 block text-[1.8rem] font-black leading-none tracking-[-0.05em]">#{performance?.rank ?? 0}</strong>
            </div>
            <div className="grid gap-2 text-[0.84rem] text-white/74">
              <span>Average score: {performance?.averageScore ?? 0}%</span>
              <span>Live tests: {liveTests.length}</span>
            </div>
          </div>
        }
        metrics={
          <>
          <HeroMetric
            label="Resources"
            value={portal.visibleResources.length}
            detail="Published for your assigned courses"
            icon={<FolderOpen aria-hidden="true" className="h-5 w-5" />}
          />
          <HeroMetric
            label="Live tests"
            value={liveTests.length}
            detail="Open active links without leaving the portal"
            icon={<Link2 aria-hidden="true" className="h-5 w-5" />}
          />
          <HeroMetric
            label="Attendance"
            value={`${performance?.attendance ?? 0}%`}
            detail="Stay on track with session participation"
            icon={<CalendarClock aria-hidden="true" className="h-5 w-5" />}
          />
          <HeroMetric
            label="Payment due"
            value={formatMoney(student?.payments?.due ?? 0)}
            detail={student?.payments?.nextDue ? `Next due ${formatPortalDate(student.payments.nextDue)}` : "No due date set"}
            icon={<ReceiptText aria-hidden="true" className="h-5 w-5" />}
          />
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          {(student?.courses ?? []).map((course) => (
            <Badge key={course} className="bg-white/14 text-white">
              {course}
            </Badge>
          ))}
        </div>
      </PortalHero>

      <div className="grid gap-3 xl:grid-cols-3">
        <HighlightCard
          icon={<Target aria-hidden="true" className="h-4 w-4" />}
          title="Next focus"
          body={
            performance?.lastAssessment
              ? `Your latest tracked assessment is ${performance.lastAssessment}.`
              : "Your performance record will appear here once assessments are available."
          }
        />
        <HighlightCard
          icon={<Sparkles aria-hidden="true" className="h-4 w-4" />}
          title="Resource access"
          body={
            portal.visibleResources.length
              ? `${portal.visibleResources.length} resource${portal.visibleResources.length > 1 ? "s are" : " is"} ready across your assigned courses.`
              : "Resources will appear here once your course materials are published."
          }
        />
        <HighlightCard
          icon={<ReceiptText aria-hidden="true" className="h-4 w-4" />}
          title="Account status"
          body={
            student?.accountStatus === "active"
              ? "Your portal access is active and ready to use."
              : "Your access is currently suspended. Contact admin for account help."
          }
        />
      </div>
    </section>
  );
}

function StudentProfilePanel({ portal }: { portal: PortalController }) {
  const student = portal.currentUser;
  const [phone, setPhone] = useState(student?.phone ?? "");
  const [guardianName, setGuardianName] = useState(student?.guardianName ?? "");
  const [address, setAddress] = useState(student?.address ?? "");
  const [feedback, setFeedback] = useState("");

  async function handleSave() {
    const error = await portal.saveOwnProfile({ phone, guardianName, address });
    setFeedback(error ?? "Profile updated.");
  }

  return (
    <div className={portalStyles.panel}>
      <div className={portalStyles.panelHeader}>
        <div>
          <p>Profile</p>
          <h2>Keep your contact details current</h2>
          <span>Course access stays admin-controlled, but your contact information is self-service.</span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[20px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(135deg,#083f3b_0%,#0e6458_100%)] p-5 text-white shadow-[0_20px_48px_rgba(4,39,36,0.16)]">
          <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#9df4d6]">Student profile</p>
          <h3 className="m-0 mt-3 text-[1.45rem] font-black tracking-[-0.04em]">{student?.name}</h3>
          <p className="m-0 mt-2 text-[0.92rem] leading-[1.65] text-white/82">{student?.email}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(student?.courses ?? []).map((course) => (
              <Badge key={course} className="bg-white/14 text-white">
                {course}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className={portalStyles.studentDetailsCard}>
            <Label className="text-[0.82rem] font-black text-[#45595e]">Phone</Label>
            <Input className={portalStyles.dialogControl} value={phone} onChange={(event) => setPhone(event.target.value)} />
          </div>
          <div className={portalStyles.studentDetailsCard}>
            <Label className="text-[0.82rem] font-black text-[#45595e]">Guardian Name</Label>
            <Input className={portalStyles.dialogControl} value={guardianName} onChange={(event) => setGuardianName(event.target.value)} />
          </div>
          <div className={portalStyles.studentDetailsCard}>
            <Label className="text-[0.82rem] font-black text-[#45595e]">Address</Label>
            <Input className={portalStyles.dialogControl} value={address} onChange={(event) => setAddress(event.target.value)} />
          </div>
          <div className={portalStyles.studentDetailsCard}>
            <p className={portalStyles.studentDetailsCardLabel}>Account</p>
            <strong className="text-[1rem] text-[#10252b]">
              {student?.accountStatus === "active" ? "Active access" : "Suspended access"}
            </strong>
            <span className="text-[0.9rem] text-[#627579]">Joined {formatPortalDate(student?.joinedOn)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className={cnFeedback(feedback)}>{feedback || "Only phone, guardian, and address can be changed here."}</p>
        <Button type="button" icon={<Save />} onClick={() => void handleSave()}>
          Save Profile
        </Button>
      </div>
    </div>
  );
}

function StudentSecurityPanel({ portal }: { portal: PortalController }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  async function handleSave() {
    const error = await portal.saveOwnPassword({ currentPassword, nextPassword }, confirmPassword);
    setFeedback(error ?? "Password updated.");
    if (!error) {
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div className={portalStyles.panel}>
      <div className={portalStyles.panelHeader}>
        <div>
          <p>Security</p>
          <h2>Change your password</h2>
          <span>Use a strong password with at least one letter and one number.</span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[20px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-5">
          <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#0d7b68]">Security note</p>
          <h3 className="m-0 mt-3 text-[1.3rem] font-black tracking-[-0.04em] text-[#10252b]">Protect your student account</h3>
          <p className="m-0 mt-2 text-[0.92rem] leading-[1.65] text-[#627579]">
            Reset requests still remain available to admins if you lose access, but changing your password here is faster.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <div className={portalStyles.studentDetailsCard}>
            <Label className="text-[0.82rem] font-black text-[#45595e]">Current Password</Label>
            <Input className={portalStyles.dialogControl} type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          </div>
          <div className={portalStyles.studentDetailsCard}>
            <Label className="text-[0.82rem] font-black text-[#45595e]">New Password</Label>
            <Input className={portalStyles.dialogControl} type="password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} />
          </div>
          <div className={portalStyles.studentDetailsCard}>
            <Label className="text-[0.82rem] font-black text-[#45595e]">Confirm Password</Label>
            <Input className={portalStyles.dialogControl} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className={cnFeedback(feedback)}>{feedback || "Reset requests still remain available to admins if you lose access."}</p>
        <Button type="button" icon={<ShieldCheck />} onClick={() => void handleSave()}>
          Update Password
        </Button>
      </div>
    </div>
  );
}

function StudentPerformanceView({ portal }: { portal: PortalController }) {
  const performance = portal.currentUser?.performance;
  const history = portal.currentUser?.scoreHistory ?? [];

  return (
    <div className="grid gap-5">
      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Performance</p>
            <h2>Track progress over time</h2>
            <span>Keep an eye on score, completion, attendance, and rank.</span>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-4 sm:grid-cols-2">
          <PerformanceMetric
            label="Average score"
            value={`${performance?.averageScore ?? 0}%`}
            icon={<ClipboardList aria-hidden="true" />}
          />
          <PerformanceMetric
            label="Attendance"
            value={`${performance?.attendance ?? 0}%`}
            icon={<CalendarClock aria-hidden="true" />}
          />
          <PerformanceMetric
            label="Completion"
            value={`${performance?.completion ?? 0}%`}
            icon={<Target aria-hidden="true" />}
          />
          <PerformanceMetric
            label="Rank"
            value={`#${performance?.rank ?? 0}`}
            icon={<User aria-hidden="true" />}
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Score history</p>
              <h2>Recent assessments</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {history.length ? (
              history.map((item, index) => {
                const previousScore = index > 0 ? history[index - 1]?.score ?? item.score : item.score;
                const delta = item.score - previousScore;

                return (
                  <div
                    key={`${item.test}-${item.date}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4"
                  >
                    <div>
                      <strong className="block text-[#10252b]">{item.test}</strong>
                      <span className="text-sm text-[#627579]">{formatPortalDate(item.date)}</span>
                    </div>
                    <div className="text-right">
                      <Badge>{item.score}%</Badge>
                      <p className="m-0 mt-2 text-[0.8rem] font-semibold text-[#627579]">
                        {index === 0 ? "Starting point" : `${delta >= 0 ? "+" : ""}${delta}% vs previous`}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={portalStyles.emptyState}>No assessments are available yet.</p>
            )}
          </div>
        </div>

        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Performance notes</p>
              <h2>Current learning snapshot</h2>
            </div>
          </div>
          <div className="grid gap-3">
            <InfoTile label="Last assessment" value={performance?.lastAssessment || "Not available"} />
            <InfoTile label="Current rank" value={performance ? `#${performance.rank}` : "Not available"} />
            <InfoTile label="Attendance status" value={`${performance?.attendance ?? 0}% attendance recorded`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[42px_minmax(0,1fr)] items-center gap-3 rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] px-4 py-4 shadow-[0_12px_34px_rgba(9,72,69,0.04)]">
      <div className={portalStyles.studentStatIcon}>{icon}</div>
      <div>
        <span className={portalStyles.studentStatLabel}>{label}</span>
        <strong className="mt-1 block text-[1.2rem] font-black leading-tight text-[#10252b]">{value}</strong>
      </div>
    </div>
  );
}

function StudentResourcesView({ portal }: { portal: PortalController }) {
  return (
    <div className="grid gap-5">
      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Resources</p>
            <h2>Assigned course materials</h2>
            <span className={portalLead}>Browse everything published for your current courses with answer visibility shown inline.</span>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          {portal.visibleResources.length ? (
            portal.visibleResources.map((resource) => (
              <StudentResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <p className={portalStyles.emptyState}>No resources are available for your assigned courses yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentResourceCard({ resource }: { resource: TestResource }) {
  return (
    <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-4 shadow-[0_14px_34px_rgba(9,72,69,0.04)] transition hover:border-[#bfd8d3] hover:shadow-[0_18px_42px_rgba(9,72,69,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <strong className="block text-[1rem] text-[#10252b]">{resource.title}</strong>
          <p className="m-0 mt-1 text-sm leading-[1.6] text-[#627579]">{resource.description}</p>
        </div>
        <Badge variant="secondary">{resource.course}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{resource.category}</Badge>
        <Badge variant="outline">{resource.status}</Badge>
        <Badge variant="outline">
          {resource.answerUrl && resource.answerReleaseStatus === "Published" ? "Answer visible" : "Answer hidden"}
        </Badge>
      </div>
      <p className="m-0 mt-3 text-[0.82rem] font-semibold text-[#627579]">
        Added {formatPortalDate(resource.addedOn)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <a href={resource.url} target="_blank" rel="noreferrer">
            <Link2 aria-hidden="true" className="mr-2 h-4 w-4" />
            Open resource
          </a>
        </Button>
        {resource.answerUrl && resource.answerReleaseStatus === "Published" ? (
          <Button asChild size="sm" variant="secondary">
            <a href={resource.answerUrl} target="_blank" rel="noreferrer">
              View answer
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function StudentLiveTestView({ portal }: { portal: PortalController }) {
  const liveTests = portal.visibleResources.filter(
    (resource) => resource.category === "Live Test" && resource.status !== "Archived",
  );

  return (
    <div className="grid gap-5">
      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Live Tests</p>
            <h2>Jump into active test links</h2>
            <span>Access test links quickly and keep track of which course each live item belongs to.</span>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          {liveTests.length ? (
            liveTests.map((resource) => (
              <article
                key={resource.id}
                className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4 shadow-[0_14px_34px_rgba(9,72,69,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <strong className="block text-[#10252b]">{resource.title}</strong>
                    <p className="m-0 mt-1 text-sm text-[#627579]">{resource.description}</p>
                  </div>
                  <span className="rounded-full bg-[#e9fbf5] px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#087365]">
                    Live
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{resource.course}</Badge>
                  <Badge variant="outline">{resource.status}</Badge>
                </div>
                <Button asChild className="mt-4">
                  <a href={resource.url} target="_blank" rel="noreferrer">
                    Open live test
                  </a>
                </Button>
              </article>
            ))
          ) : (
            <p className={portalStyles.emptyState}>No live tests are available right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentPaymentsView({ portal }: { portal: PortalController }) {
  const payments = portal.currentUser?.payments;

  return (
    <div className="grid gap-5">
      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Payments</p>
            <h2>Track dues and completed payments</h2>
            <span>See totals, next due dates, and the status of each payment record in one place.</span>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-4 sm:grid-cols-2">
          <PaymentMetric label="Total" value={payments ? formatMoney(payments.total) : "-"} />
          <PaymentMetric label="Paid" value={payments ? formatMoney(payments.paid) : "-"} />
          <PaymentMetric label="Due" value={payments ? formatMoney(payments.due) : "-"} />
          <PaymentMetric label="Next due" value={payments?.nextDue ? formatPortalDate(payments.nextDue) : "-"} />
        </div>

        <div className="mt-5 grid gap-3">
          {payments?.records?.length ? (
            payments.records.map((record) => (
              <div
                key={record.id}
                className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <strong className="block text-[#10252b]">{record.label}</strong>
                    <span className="text-sm text-[#627579]">{record.invoice}</span>
                  </div>
                  <Badge variant="outline">{record.status}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#627579]">
                  <span>{formatMoney(record.amount)}</span>
                  <span>{record.method}</span>
                  <span>{formatPortalDate(record.date)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className={portalStyles.emptyState}>No payment records are available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4 shadow-[0_12px_34px_rgba(9,72,69,0.04)]">
      <span className="text-[0.8rem] font-bold text-[#627579]">{label}</span>
      <strong className="text-[1.05rem] font-black text-[#10252b]">{value}</strong>
    </div>
  );
}

function StudentDashboardView({ portal }: { portal: PortalController }) {
  const student = portal.currentUser;
  const performance = student?.performance;
  const liveTests = portal.visibleResources.filter(
    (resource) => resource.category === "Live Test" && resource.status !== "Archived",
  );
  const recentScores = student?.scoreHistory?.slice(0, 3) ?? [];

  return (
    <div className="grid gap-5">
      <StudentWorkspaceHero portal={portal} />

      <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Quick actions</p>
              <h2>Move through your coursework faster</h2>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <ActionCard
              title="Browse resources"
              body="Open revision material, study notes, and previous tests published for your courses."
              actionLabel="Open resources"
              onClick={() => portal.setStudentView("resources")}
            />
            <ActionCard
              title="Start live tests"
              body="Jump into any active test links directly from the portal."
              actionLabel="Open live tests"
              onClick={() => portal.setStudentView("live-tests")}
            />
            <ActionCard
              title="Check performance"
              body="Review recent scores, attendance, completion, and rank in one screen."
              actionLabel="Open performance"
              onClick={() => portal.setStudentView("performance")}
            />
            <ActionCard
              title="Review payments"
              body="Track dues, pending invoices, and completed payments without leaving the dashboard."
              actionLabel="Open payments"
              onClick={() => portal.setStudentView("payments")}
            />
          </div>
        </div>

        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Current snapshot</p>
              <h2>What matters now</h2>
            </div>
          </div>
          <div className="grid gap-3">
            <InfoTile label="Latest assessment" value={performance?.lastAssessment || "No assessments yet"} />
            <InfoTile label="Next payment due" value={student?.payments?.nextDue ? formatPortalDate(student.payments.nextDue) : "No due date set"} />
            <InfoTile label="Live tests available" value={`${liveTests.length} active item${liveTests.length === 1 ? "" : "s"}`} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Latest resources</p>
              <h2>Continue learning</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {portal.visibleResources.slice(0, 3).length ? (
              portal.visibleResources.slice(0, 3).map((resource) => (
                <StudentResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <p className={portalStyles.emptyState}>No resources are available for your assigned courses yet.</p>
            )}
          </div>
        </div>

        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Recent scores</p>
              <h2>Performance pulse</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {recentScores.length ? (
              recentScores.map((item) => (
                <div
                  key={`${item.test}-${item.date}`}
                  className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <strong className="block text-[#10252b]">{item.test}</strong>
                      <span className="text-sm text-[#627579]">{formatPortalDate(item.date)}</span>
                    </div>
                    <Badge>{item.score}%</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className={portalStyles.emptyState}>No assessments are available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NoCourseAccessPanel({ portal }: { portal: PortalController }) {
  return (
    <div className="rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(116,237,198,0.16),transparent_22%),linear-gradient(180deg,#ffffff,#f7fbfa)] p-6 shadow-[0_24px_62px_rgba(9,72,69,0.08)]">
      <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#0d7b68]">Access pending</p>
      <h2 className="m-0 mt-3 text-[1.55rem] font-black tracking-[-0.04em] text-[#10252b]">
        Your account is active but no courses are assigned yet
      </h2>
      <p className="m-0 mt-3 max-w-2xl text-[0.96rem] leading-[1.7] text-[#627579]">
        Ask an admin to assign at least one course before resources and tests can appear here.
      </p>
      <Button type="button" variant="secondary" icon={<Phone />} onClick={portal.logout} className="mt-5">
        Sign out
      </Button>
    </div>
  );
}

function cnFeedback(message: string) {
  if (!message) return "m-0 text-[0.88rem] font-semibold text-[#627579]";
  return message.includes("updated")
    ? "m-0 text-[0.88rem] font-semibold text-[#087365]"
    : "m-0 text-[0.88rem] font-semibold text-[#b42318]";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPortalDate(dateValue?: string) {
  if (!dateValue) return "No date";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function PortalStudentScreen({ portal }: { portal: PortalController }) {
  return (
    <main className={portalShell}>
      <section className={portalStyles.adminGrid}>
        <AdminSidebar portal={portal} />

        <div className="min-w-0 px-6 py-6 sm:px-8 lg:px-10 xl:px-12">
          {!portal.hasCourseAccess && portal.studentView !== "profile" && portal.studentView !== "security" ? <NoCourseAccessPanel portal={portal} /> : null}
          {portal.hasCourseAccess && portal.studentView === "dashboard" ? <StudentDashboardView portal={portal} /> : null}
          {portal.hasCourseAccess && portal.studentView === "resources" ? <StudentResourcesView portal={portal} /> : null}
          {portal.hasCourseAccess && portal.studentView === "live-tests" ? <StudentLiveTestView portal={portal} /> : null}
          {portal.hasCourseAccess && portal.studentView === "performance" ? <StudentPerformanceView portal={portal} /> : null}
          {portal.hasCourseAccess && portal.studentView === "payments" ? <StudentPaymentsView portal={portal} /> : null}
          {portal.studentView === "profile" ? <StudentProfilePanel portal={portal} /> : null}
          {portal.studentView === "security" ? <StudentSecurityPanel portal={portal} /> : null}
        </div>
      </section>
    </main>
  );
}
