"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  School,
  ShieldCheck,
  UserRound,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";
import type { PerformanceFormState, ScoreFormState } from "../../portal.types";
import { PortalTabs, PortalTabsContent, PortalTabsList, PortalTabsTrigger } from "../PortalTabs";

type StudentDetailsPanelProps = {
  portal: PortalController;
  showPayments?: boolean;
  allowEdit?: boolean;
};

function formatDate(value?: string) {
  if (!value) return "Not set";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value?: number) {
  return typeof value === "number" ? `${value}%` : "-";
}

function formatScore(value?: number) {
  if (typeof value !== "number") return "-";
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function PerformanceCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <article className="grid min-h-[124px] gap-3 rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-white p-4 shadow-[0_12px_34px_rgba(9,72,69,0.04)]">
      <span className="text-[0.76rem] font-black uppercase tracking-[0.14em] text-[#6b7f84]">{label}</span>
      <strong className="text-[1.9rem] font-black leading-none tracking-[-0.06em] text-[#123036]">{value}</strong>
      {hint ? <span className="text-[0.85rem] font-semibold text-[#0d7b68]">{hint}</span> : null}
    </article>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <article className={portalStyles.studentSummaryCard}>
      <span className={portalStyles.studentSummaryIcon}>{icon}</span>
      <div>
        <span className={portalStyles.studentSummaryLabel}>{label}</span>
        <strong className={portalStyles.studentSummaryValue}>{value}</strong>
      </div>
    </article>
  );
}

export function StudentDetailsPanel({ portal, showPayments = true, allowEdit = true }: StudentDetailsPanelProps) {
  const account = portal.selectedAccount;
  const [showProgressEditor, setShowProgressEditor] = useState(false);
  const [showScoreEditor, setShowScoreEditor] = useState(false);
  const [formError, setFormError] = useState("");
  const [progressForm, setProgressForm] = useState<PerformanceFormState>({
    attendance: String(account?.performance?.attendance ?? 0),
    completion: String(account?.performance?.completion ?? 0),
    rank: String(account?.performance?.rank ?? 0),
    lastAssessment: account?.performance?.lastAssessment ?? "No assessments yet",
  });
  const [scoreForm, setScoreForm] = useState<ScoreFormState>({
    course: account?.courses[0] ?? "IELTS",
    test: "",
    score: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  if (!account) {
    return (
      <section className={portalStyles.studentDetailsShell}>
        <div className="rounded-[24px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#f7fbfa)] p-6 shadow-[0_20px_58px_rgba(9,72,69,0.06)]">
          <h1 className={portalStyles.studentDetailsTitle}>Account details</h1>
          <p className={portalStyles.studentDetailsLead}>Pick a student or teacher to view their profile.</p>
        </div>
      </section>
    );
  }

  const accountId = account.id;
  const isStudent = account.role === "student";
  const performance = account.performance;
  const payments = account.payments;
  const scoreHistory = account.scoreHistory ?? [];
  const bestScore = [...scoreHistory].sort((left, right) => right.score - left.score)[0];
  const improvement = performance ? Math.max(0, performance.averageScore - 70) : undefined;
  const latestScore = scoreHistory[0];
  const canManagePerformance = isStudent && (portal.currentUser?.role === "admin" || portal.currentUser?.role === "teacher");

  async function submitProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = await portal.saveStudentPerformance(accountId, progressForm);
    setFormError(error ?? "");
    if (!error) setShowProgressEditor(false);
  }

  async function submitScore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = await portal.addStudentScore(accountId, scoreForm);
    setFormError(error ?? "");
    if (!error) {
      setShowScoreEditor(false);
      setScoreForm((current) => ({ ...current, test: "", score: "", notes: "", date: new Date().toISOString().slice(0, 10) }));
    }
  }

  return (
    <section className={portalStyles.studentDetailsShell}>
      <div className="relative overflow-hidden rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(116,237,198,0.24),transparent_24%),linear-gradient(135deg,#083f3b_0%,#0b5d54_54%,#11806e_100%)] p-6 text-white shadow-[0_26px_72px_rgba(4,39,36,0.18)]">
        <div className="relative z-10 grid gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid gap-3">
              <Button type="button" variant="secondary" className="w-fit" icon={<ArrowLeft />} onClick={portal.closeAccountDetails}>
                Back to accounts
              </Button>
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="m-0 text-[clamp(1.8rem,3vw,2.5rem)] font-black leading-[0.98] tracking-[-0.05em]">
                    {account.name}
                  </h1>
                  <Badge className="bg-white/14 text-white">{account.role}</Badge>
                  <Badge className="bg-white/14 text-white">
                    {account.accountStatus === "active" ? "Active access" : "Suspended access"}
                  </Badge>
                </div>
                <p className="m-0 max-w-2xl text-[0.96rem] leading-[1.65] text-white/82">
                  {isStudent
                    ? "Profile, access, progress, and payment history for the selected student."
                    : "Profile and course access for the selected teacher."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 max-[640px]:w-full max-[640px]:flex-col">
              {allowEdit ? (
                <>
                  <Button type="button" variant="secondary" onClick={() => void portal.requestPasswordReset(account.id)}>
                    Reset Password
                  </Button>
                  <Button type="button" onClick={() => portal.openEditAccount(account)}>
                    Edit Account
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-4 sm:grid-cols-2">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
              <span className="text-[0.76rem] font-black uppercase tracking-[0.14em] text-white/74">Joined on</span>
              <strong className="mt-3 block text-[1.45rem] font-black leading-none tracking-[-0.05em]">
                {formatDate(account.joinedOn)}
              </strong>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
              <span className="text-[0.76rem] font-black uppercase tracking-[0.14em] text-white/74">Courses</span>
              <strong className="mt-3 block text-[1.45rem] font-black leading-none tracking-[-0.05em]">
                {account.courses.length}
              </strong>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
              <span className="text-[0.76rem] font-black uppercase tracking-[0.14em] text-white/74">Email</span>
              <strong className="mt-3 block truncate text-[1rem] font-black leading-tight">
                {account.email}
              </strong>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
              <span className="text-[0.76rem] font-black uppercase tracking-[0.14em] text-white/74">Status</span>
              <strong className="mt-3 block text-[1.1rem] font-black leading-tight">
                {account.accountStatus === "active" ? "Access available" : "Needs review"}
              </strong>
            </div>
          </div>
        </div>

        <div className="absolute inset-y-0 right-[-8%] hidden w-[34%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_66%)] blur-2xl lg:block" />
      </div>

      <PortalTabs defaultValue={isStudent ? "overview" : "courses"}>
        <PortalTabsList>
          <PortalTabsTrigger value="overview">Overview</PortalTabsTrigger>
          <PortalTabsTrigger value="courses">Courses & Access</PortalTabsTrigger>
          {isStudent ? <PortalTabsTrigger value="performance">Performance & Scores</PortalTabsTrigger> : null}
          {showPayments && isStudent ? <PortalTabsTrigger value="payments">Payments</PortalTabsTrigger> : null}
          <PortalTabsTrigger value="activity">Activity</PortalTabsTrigger>
        </PortalTabsList>

        <PortalTabsContent value="overview">
          <div className={portalStyles.studentSummaryGrid}>
            <SummaryCard label="Name" value={account.name} icon={<UserRound aria-hidden="true" />} />
            <SummaryCard label="Email" value={account.email} icon={<Mail aria-hidden="true" />} />
            <SummaryCard label="Joined On" value={formatDate(account.joinedOn)} icon={<CalendarDays aria-hidden="true" />} />
            <SummaryCard label="Courses" value={String(account.courses.length)} icon={<School aria-hidden="true" />} />
          </div>

          <div className={portalStyles.studentDetailsGrid}>
            <article className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>Contact</p>
              <div className="grid gap-3 text-sm text-[#10252b]">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#0d7b68]" />
                  <span>{account.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#0d7b68]" />
                  <span>{account.phone || "Not added"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#0d7b68]" />
                  <span>{account.address || "Not added"}</span>
                </div>
              </div>
            </article>

            <article className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>{isStudent ? "Guardian & Status" : "Access Status"}</p>
              <div className="grid gap-3 text-sm text-[#10252b]">
                {isStudent ? (
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-[#0d7b68]" />
                    <span>{account.guardianName || "Not added"}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#0d7b68]" />
                  <span>{account.accountStatus === "active" ? "Active access" : "Suspended access"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#0d7b68]" />
                  <span>{account.courses.length ? `${account.courses.length} assigned course(s)` : "No assigned courses"}</span>
                </div>
              </div>
            </article>
          </div>
        </PortalTabsContent>

        <PortalTabsContent value="courses">
          <div className={portalStyles.studentDetailsGrid}>
            <article className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>Course Access</p>
              <div className={portalStyles.coursePills}>
                {account.courses.length ? account.courses.map((course) => <Badge key={course}>{course}</Badge>) : <span>No courses assigned</span>}
              </div>
            </article>

            <article className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>Access Status</p>
              <div className="grid gap-3 text-sm text-[#10252b]">
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-[#0d7b68]" />
                  <span>{account.courses.length ? `${account.courses.length} assigned course(s)` : "No course access"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#0d7b68]" />
                  <span>{account.accountStatus === "active" ? "Access available" : "Access suspended"}</span>
                </div>
              </div>
            </article>
          </div>
        </PortalTabsContent>

        {isStudent ? (
          <PortalTabsContent value="performance">
            <div className="grid gap-6">
              <div>
                <p className="mb-3 text-[0.92rem] font-black uppercase tracking-[0.14em] text-[#0d7b68]">Overall Performance</p>
                <div className="grid gap-3 md:grid-cols-4">
                  <PerformanceCard
                    label="Average Score"
                    value={formatPercent(performance?.averageScore)}
                    hint={improvement !== undefined ? `+${improvement}% vs last 30 days` : undefined}
                  />
                  <PerformanceCard label="Tests Attempted" value={String(scoreHistory.length)} />
                  <PerformanceCard
                    label="Best Score"
                    value={bestScore ? `${bestScore.score}%` : "-"}
                    hint={bestScore ? bestScore.test : undefined}
                  />
                  <PerformanceCard
                    label="Improvement"
                    value={improvement !== undefined ? `+${improvement}%` : "-"}
                    hint="vs last 30 days"
                  />
                </div>
              </div>

              {canManagePerformance ? (
                <article className={portalStyles.studentDetailsCard}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={portalStyles.studentDetailsCardLabel}>Progress controls</p>
                      <p className="m-0 mt-1 text-[0.86rem] leading-[1.55] text-[#6b7f84]">Keep attendance, completion, rank, and assessment history accurate.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="secondary" icon={showProgressEditor ? <X /> : <Save />} onClick={() => { setShowProgressEditor((value) => !value); setFormError(""); }}>
                        {showProgressEditor ? "Close" : "Update progress"}
                      </Button>
                      <Button type="button" icon={showScoreEditor ? <X /> : <Plus />} onClick={() => { setShowScoreEditor((value) => !value); setFormError(""); }}>
                        {showScoreEditor ? "Close" : "Add score"}
                      </Button>
                    </div>
                  </div>

                  {showProgressEditor ? (
                    <form onSubmit={submitProgress} className="mt-5 grid gap-4 rounded-[16px] border border-[#e3eeeb] bg-[#f8fcfb] p-4 lg:grid-cols-4">
                      <label className="grid gap-1.5 text-[0.78rem] font-black text-[#45595e]">
                        Attendance (%)
                        <Input type="number" min="0" max="100" value={progressForm.attendance} onChange={(event) => setProgressForm((current) => ({ ...current, attendance: event.target.value }))} required />
                      </label>
                      <label className="grid gap-1.5 text-[0.78rem] font-black text-[#45595e]">
                        Completion (%)
                        <Input type="number" min="0" max="100" value={progressForm.completion} onChange={(event) => setProgressForm((current) => ({ ...current, completion: event.target.value }))} required />
                      </label>
                      <label className="grid gap-1.5 text-[0.78rem] font-black text-[#45595e]">
                        Rank
                        <Input type="number" min="0" value={progressForm.rank} onChange={(event) => setProgressForm((current) => ({ ...current, rank: event.target.value }))} required />
                      </label>
                      <label className="grid gap-1.5 text-[0.78rem] font-black text-[#45595e]">
                        Last assessment
                        <Input value={progressForm.lastAssessment} onChange={(event) => setProgressForm((current) => ({ ...current, lastAssessment: event.target.value }))} maxLength={160} required />
                      </label>
                      <div className="flex items-center gap-3 lg:col-span-4">
                        <Button type="submit" icon={<Save />}>Save progress</Button>
                      </div>
                    </form>
                  ) : null}

                  {showScoreEditor ? (
                    <form onSubmit={submitScore} className="mt-5 grid gap-4 rounded-[16px] border border-[#e3eeeb] bg-[#f8fcfb] p-4 lg:grid-cols-2">
                      <label className="grid gap-1.5 text-[0.78rem] font-black text-[#45595e]">
                        Course
                        <select className="h-10 rounded-md border border-[#d8e6e3] bg-white px-3 text-sm" value={scoreForm.course} onChange={(event) => setScoreForm((current) => ({ ...current, course: event.target.value as ScoreFormState["course"] }))} required>
                          {account.courses.map((course) => <option key={course}>{course}</option>)}
                        </select>
                      </label>
                      <label className="grid gap-1.5 text-[0.78rem] font-black text-[#45595e]">
                        Assessment name
                        <Input value={scoreForm.test} onChange={(event) => setScoreForm((current) => ({ ...current, test: event.target.value }))} placeholder="e.g. IELTS Reading Mock 4" maxLength={160} required />
                      </label>
                      <label className="grid gap-1.5 text-[0.78rem] font-black text-[#45595e]">
                        Score (%)
                        <Input type="number" min="0" max="100" step="0.1" value={scoreForm.score} onChange={(event) => setScoreForm((current) => ({ ...current, score: event.target.value }))} required />
                      </label>
                      <label className="grid gap-1.5 text-[0.78rem] font-black text-[#45595e]">
                        Assessment date
                        <Input type="date" value={scoreForm.date} onChange={(event) => setScoreForm((current) => ({ ...current, date: event.target.value }))} required />
                      </label>
                      <label className="grid gap-1.5 text-[0.78rem] font-black text-[#45595e] lg:col-span-2">
                        Notes <span className="font-semibold text-[#819095]">(optional)</span>
                        <Input value={scoreForm.notes} onChange={(event) => setScoreForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Feedback or focus area" maxLength={500} />
                      </label>
                      <div className="flex items-center gap-3 lg:col-span-2">
                        <Button type="submit" icon={<Plus />}>Add assessment</Button>
                      </div>
                    </form>
                  ) : null}

                  {formError ? <p className="m-0 mt-3 rounded-[10px] bg-[#fff1f0] px-3 py-2 text-[0.82rem] font-bold text-[#a3342c]" role="alert">{formError}</p> : null}
                </article>
              ) : null}

              <article className={portalStyles.studentDetailsCard}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className={portalStyles.studentDetailsCardLabel}>Recent Test Scores</p>
                  <span className="inline-flex items-center gap-2 text-[0.8rem] font-bold text-[#6b7f84]">
                    <Clock3 className="h-4 w-4" />
                    Latest activity
                  </span>
                </div>

                {scoreHistory.length ? (
                  <div className="grid gap-2">
                    {scoreHistory.map((score) => (
                      <div key={score.id} className="rounded-[12px] border border-[#e5eeec] bg-white px-4 py-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <strong className="block text-[0.95rem] text-[#10252b]">{score.test}</strong>
                            <span className="text-[0.8rem] font-semibold text-[#6b7f84]">{formatDate(score.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{score.course}</Badge>
                            {canManagePerformance ? (
                              <Button type="button" variant="destructive" size="icon-sm" aria-label={`Remove ${score.test}`} icon={<Trash2 />} onClick={() => void portal.removeStudentScore(score.id)} />
                            ) : null}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[0.85rem] font-semibold text-[#46595e]">
                          <span>Score {formatScore(score.score)}</span>
                          <span>Max 100%</span>
                          {score.notes ? <span>{score.notes}</span> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="m-0 text-[0.88rem] text-[#6b7f84]">No score history available.</p>
                )}
              </article>
            </div>
          </PortalTabsContent>
        ) : null}

        {showPayments && isStudent ? (
          <PortalTabsContent value="payments">
            <div className={portalStyles.studentDetailsGrid}>
              <article className={portalStyles.studentDetailsCard}>
                <p className={portalStyles.studentDetailsCardLabel}>Payment Summary</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className={portalStyles.studentMetricPill}>
                    <span>Total</span>
                    <strong>{payments ? formatMoney(payments.total) : "-"}</strong>
                  </div>
                  <div className={portalStyles.studentMetricPill}>
                    <span>Paid</span>
                    <strong>{payments ? formatMoney(payments.paid) : "-"}</strong>
                  </div>
                  <div className={portalStyles.studentMetricPill}>
                    <span>Due</span>
                    <strong>{payments ? formatMoney(payments.due) : "-"}</strong>
                  </div>
                </div>
                <p className="m-0 text-[0.84rem] font-semibold text-[#6b7f84]">
                  Next due date: {payments ? formatDate(payments.nextDue) : "Not available"}
                </p>
              </article>

              <article className={portalStyles.studentDetailsCard}>
                <p className={portalStyles.studentDetailsCardLabel}>Payment History</p>
                {payments?.records?.length ? (
                  <div className="grid gap-2">
                    {payments.records.map((record) => (
                      <div
                        key={`${record.label}-${record.date}`}
                        className="flex items-center justify-between rounded-[10px] border border-[#e5eeec] px-3 py-2.5"
                      >
                        <div>
                          <strong className="block text-[0.9rem] text-[#10252b]">{record.label}</strong>
                          <span className="text-[0.78rem] font-semibold text-[#6b7f84]">{formatDate(record.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{record.status}</Badge>
                          <span className="text-[0.85rem] font-black text-[#10252b]">{formatMoney(record.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="m-0 text-[0.88rem] text-[#6b7f84]">No payment history available.</p>
                )}
              </article>
            </div>
          </PortalTabsContent>
        ) : null}

        <PortalTabsContent value="activity">
          <article className={portalStyles.studentDetailsCard}>
            <p className={portalStyles.studentDetailsCardLabel}>Recent Activity</p>
            <div className="grid gap-2">
              <div className="flex items-center justify-between rounded-[10px] border border-[#e5eeec] px-3 py-2.5">
                <span className="font-semibold text-[#10252b]">Profile last reviewed</span>
                <span className="text-[0.8rem] font-semibold text-[#6b7f84]">Today</span>
              </div>
              {isStudent ? (
                <div className="flex items-center justify-between rounded-[10px] border border-[#e5eeec] px-3 py-2.5">
                  <span className="font-semibold text-[#10252b]">Latest assessment updated</span>
                  <span className="text-[0.8rem] font-semibold text-[#6b7f84]">{formatDate(latestScore?.date)}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-[10px] border border-[#e5eeec] px-3 py-2.5">
                  <span className="font-semibold text-[#10252b]">Assigned courses reviewed</span>
                  <span className="text-[0.8rem] font-semibold text-[#6b7f84]">{account.courses.length}</span>
                </div>
              )}
            </div>
          </article>
        </PortalTabsContent>
      </PortalTabs>
    </section>
  );
}
