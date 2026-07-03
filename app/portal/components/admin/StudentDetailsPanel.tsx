import { ArrowLeft, BadgeCheck, CalendarDays, Mail, MapPin, Phone, School, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";
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

export function StudentDetailsPanel({ portal, showPayments = true, allowEdit = true }: StudentDetailsPanelProps) {
  const student = portal.selectedStudent;

  if (!student) {
    return (
      <section className={portalStyles.studentDetailsShell}>
        <div className={portalStyles.studentDetailsHeader}>
          <div>
            <h1 className={portalStyles.studentDetailsTitle}>Student details</h1>
            <p className={portalStyles.studentDetailsLead}>Pick a student to view their profile.</p>
          </div>
        </div>
      </section>
    );
  }

  const status = student.courses.length > 0 ? "Active" : "Disabled";
  const performance = student.performance;
  const payments = student.payments;

  return (
    <section className={portalStyles.studentDetailsShell}>
      <div className={portalStyles.studentDetailsHeader}>
        <div className="grid gap-2">
          <Button
            type="button"
            variant="secondary"
            className="w-fit"
            icon={<ArrowLeft />}
            onClick={portal.closeStudentDetails}
          >
            Back to students
          </Button>
          <div>
            <h1 className={portalStyles.studentDetailsTitle}>{student.name}</h1>
            <p className={portalStyles.studentDetailsLead}>
              Profile, performance, and progress for the selected student.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="outline">{status}</Badge>
          {allowEdit ? (
            <Button type="button" variant="secondary" onClick={() => portal.startEditingStudent(student)}>
              Edit Student
            </Button>
          ) : null}
        </div>
      </div>

      <div className={portalStyles.studentSummaryGrid}>
        <article className={portalStyles.studentSummaryCard}>
          <span className={portalStyles.studentSummaryIcon}>
            <UserRound aria-hidden="true" />
          </span>
          <div>
            <span className={portalStyles.studentSummaryLabel}>Name</span>
            <strong className={portalStyles.studentSummaryValue}>{student.name}</strong>
          </div>
        </article>
        <article className={portalStyles.studentSummaryCard}>
          <span className={portalStyles.studentSummaryIcon}>
            <Mail aria-hidden="true" />
          </span>
          <div>
            <span className={portalStyles.studentSummaryLabel}>Email</span>
            <strong className={portalStyles.studentSummaryValue}>{student.email}</strong>
          </div>
        </article>
        <article className={portalStyles.studentSummaryCard}>
          <span className={portalStyles.studentSummaryIcon}>
            <CalendarDays aria-hidden="true" />
          </span>
          <div>
            <span className={portalStyles.studentSummaryLabel}>Joined On</span>
            <strong className={portalStyles.studentSummaryValue}>{formatDate(student.joinedOn)}</strong>
          </div>
        </article>
        <article className={portalStyles.studentSummaryCard}>
          <span className={portalStyles.studentSummaryIcon}>
            <School aria-hidden="true" />
          </span>
          <div>
            <span className={portalStyles.studentSummaryLabel}>Courses</span>
            <strong className={portalStyles.studentSummaryValue}>{student.courses.length}</strong>
          </div>
        </article>
      </div>

      <PortalTabs defaultValue="overview">
        <PortalTabsList>
          <PortalTabsTrigger value="overview">Overview</PortalTabsTrigger>
          <PortalTabsTrigger value="performance">Performance</PortalTabsTrigger>
          {showPayments ? <PortalTabsTrigger value="payments">Payments</PortalTabsTrigger> : null}
        </PortalTabsList>

        <PortalTabsContent value="overview">
          <div className={portalStyles.studentDetailsGrid}>
            <article className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>Contact</p>
              <div className="grid gap-3 text-sm text-[#10252b]">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#0d7b68]" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#0d7b68]" />
                  <span>{student.phone ?? "Not added"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#0d7b68]" />
                  <span>{student.address ?? "Not added"}</span>
                </div>
              </div>
            </article>

            <article className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>Guardian</p>
              <div className="grid gap-3 text-sm text-[#10252b]">
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-[#0d7b68]" />
                  <span>{student.guardianName ?? "Not added"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#0d7b68]" />
                  <span>{status}</span>
                </div>
              </div>
            </article>

            <article className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>Course Access</p>
              <div className={portalStyles.coursePills}>
                {student.courses.map((course) => (
                  <Badge key={course}>{course}</Badge>
                ))}
              </div>
            </article>
          </div>
        </PortalTabsContent>

        <PortalTabsContent value="performance">
          <div className={portalStyles.studentDetailsGrid}>
            <article className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>Performance Summary</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className={portalStyles.studentMetricPill}>
                  <span>Average Score</span>
                  <strong>{performance ? `${performance.averageScore}%` : "-"}</strong>
                </div>
                <div className={portalStyles.studentMetricPill}>
                  <span>Attendance</span>
                  <strong>{performance ? `${performance.attendance}%` : "-"}</strong>
                </div>
                <div className={portalStyles.studentMetricPill}>
                  <span>Completion</span>
                  <strong>{performance ? `${performance.completion}%` : "-"}</strong>
                </div>
                <div className={portalStyles.studentMetricPill}>
                  <span>Rank</span>
                  <strong>{performance ? `#${performance.rank}` : "-"}</strong>
                </div>
              </div>
              <p className="m-0 text-[0.84rem] font-semibold text-[#6b7f84]">
                Last assessment: {performance ? performance.lastAssessment : "Not available"}
              </p>
            </article>

            <article className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>Recent Scores</p>
              {student.scoreHistory?.length ? (
                <div className="grid gap-2">
                  {student.scoreHistory.map((score) => (
                    <div
                      key={`${score.test}-${score.date}`}
                      className="flex items-center justify-between rounded-[10px] border border-[#e5eeec] px-3 py-2.5"
                    >
                      <div>
                        <strong className="block text-[0.9rem] text-[#10252b]">{score.test}</strong>
                        <span className="text-[0.78rem] font-semibold text-[#6b7f84]">{formatDate(score.date)}</span>
                      </div>
                      <Badge variant="outline">{score.score}%</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="m-0 text-[0.88rem] text-[#6b7f84]">No score history available.</p>
              )}
            </article>
          </div>
        </PortalTabsContent>

        {showPayments ? (
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
      </PortalTabs>
    </section>
  );
}
