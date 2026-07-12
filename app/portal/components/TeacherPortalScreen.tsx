"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  ClipboardList,
  FolderOpen,
  Save,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { portalLead, portalShell, portalStyles } from "../portalShared";
import type { PortalController } from "../usePortalState";
import { AdminSidebar } from "./admin/AdminSidebar";
import { ResourceFormCard } from "./admin/ResourceFormCard";
import { ResourceLibraryPanel } from "./admin/ResourceLibraryPanel";
import { StudentDetailsPanel } from "./admin/StudentDetailsPanel";
import { HeroMetric, HighlightCard, MetricCard, PortalHero } from "./PortalStat";

function TeacherHero({ portal }: { portal: PortalController }) {
  const liveTests = portal.visibleResources.filter((resource) => resource.category === "Live Test");
  const upcomingResources = portal.visibleResources.filter((resource) => resource.status === "Upcoming");

  return (
    <section className="mb-6 grid gap-5">
      <PortalHero
        eyebrow="Teacher workspace"
        title="Guide assigned courses with the same control system used by admin."
        lead="Review student progress, publish resources faster, and keep course activity visible from one dashboard."
        actions={
          <>
            <Button type="button" size="lg" icon={<FolderOpen />} onClick={() => portal.openResourceDialog()}>
              Add Resource
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              icon={<Users />}
              onClick={() => portal.setTeacherView("students")}
            >
              Review Students
            </Button>
          </>
        }
        metrics={
          <>
          <HeroMetric
            label="Assigned courses"
            value={portal.visibleCourses.length}
            detail="Editable resources only within these tracks"
            icon={<BookOpen aria-hidden="true" className="h-5 w-5" />}
            tone="Live"
          />
          <HeroMetric
            label="Visible resources"
            value={portal.visibleResources.length}
            detail={`${upcomingResources.length} still upcoming`}
            icon={<FolderOpen aria-hidden="true" className="h-5 w-5" />}
            tone="Live"
          />
          <HeroMetric
            label="Live tests"
            value={liveTests.length}
            detail="Quick access for current learners"
            icon={<ClipboardList aria-hidden="true" className="h-5 w-5" />}
            tone="Live"
          />
          <HeroMetric
            label="Assigned students"
            value={portal.teacherStudentUsers.length}
            detail="Shared-course visibility only"
            icon={<Users aria-hidden="true" className="h-5 w-5" />}
            tone="Live"
          />
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-3">
        <HighlightCard
          icon={<Sparkles aria-hidden="true" className="h-4 w-4" />}
          title="What needs attention"
          body={
            upcomingResources.length
              ? `${upcomingResources.length} scheduled resource${upcomingResources.length > 1 ? "s are" : " is"} still waiting to go live.`
              : "All currently visible resources are already live or archived."
          }
        />
        <HighlightCard
          icon={<CalendarClock aria-hidden="true" className="h-4 w-4" />}
          title="Student follow-up"
          body={
            portal.teacherStudentUsers.length
              ? `${portal.teacherStudentUsers[0]?.name ?? "Your students"} can be reviewed directly from the roster for course-level follow-up.`
              : "No students are assigned to this teacher account yet."
          }
        />
        <HighlightCard
          icon={<ArrowUpRight aria-hidden="true" className="h-4 w-4" />}
          title="Latest publish"
          body={
            portal.latestResource
              ? `${portal.latestResource.title} is the newest resource in the portal library.`
              : "No resources have been published yet."
          }
        />
      </div>
    </section>
  );
}

function TeacherOverview({ portal }: { portal: PortalController }) {
  const assignedCourseSummaries = portal.courseSummaries.filter((summary) =>
    portal.visibleCourses.includes(summary.course),
  );
  const recentResources = portal.visibleResources.slice(0, 4);
  const highlightedStudents = portal.teacherStudentUsers.slice(0, 4);

  return (
    <div className="grid gap-5">
      <TeacherHero portal={portal} />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Course coverage</p>
              <h2>Assigned course snapshot</h2>
              <span className={portalLead}>Use the same course-by-course structure as admin, scoped to your own teaching load.</span>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {assignedCourseSummaries.map((summary) => (
              <article
                key={summary.course}
                className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4 shadow-[0_14px_34px_rgba(9,72,69,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[0.74rem] font-black uppercase tracking-[0.14em] text-[#0d7b68]">
                      {summary.course}
                    </span>
                    <h3 className="m-0 mt-2 text-[1.1rem] font-black text-[#10252b]">
                      {summary.resources} resources available
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#e9fbf5] px-2.5 py-1 text-[0.72rem] font-black text-[#087365]">
                    {summary.students} students
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-[0.84rem] font-semibold text-[#627579]">
                  <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[#f7fbfa] px-3 py-2">
                    <span>Course resources</span>
                    <strong className="text-[#10252b]">{summary.resources}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[#f7fbfa] px-3 py-2">
                    <span>Shared students</span>
                    <strong className="text-[#10252b]">{summary.students}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Recent resources</p>
              <h2>Your latest course material</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {recentResources.length ? (
              recentResources.map((resource) => (
                <article
                  key={resource.id}
                  className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4 transition hover:border-[#c7ddd8] hover:shadow-[0_18px_38px_rgba(9,72,69,0.06)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="m-0 text-[1rem] font-black text-[#10252b]">{resource.title}</h3>
                      <p className="m-0 mt-1 text-sm leading-[1.55] text-[#627579]">{resource.description}</p>
                    </div>
                    <Badge variant="secondary">{resource.course}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{resource.category}</Badge>
                    <Badge variant="outline">{resource.status}</Badge>
                  </div>
                </article>
              ))
            ) : (
              <p className={portalStyles.emptyState}>No resources are available for your assigned courses yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Teaching focus</p>
              <h2>Suggested next steps</h2>
            </div>
          </div>
          <div className="grid gap-3">
            <TeacherFocusRow
              label="Publish or review resource updates"
              detail="Keep live tests and revision material current for active courses."
              actionLabel="Manage resources"
              onClick={() => portal.setTeacherView("resources")}
            />
            <TeacherFocusRow
              label="Check student progress"
              detail="Open the student roster to review shared-course access and profiles."
              actionLabel="Open students"
              onClick={() => portal.setTeacherView("students")}
            />
            <TeacherFocusRow
              label="Update your contact information"
              detail="Keep phone and address current for admin coordination."
              actionLabel="Open profile"
              onClick={() => portal.setTeacherView("profile")}
            />
          </div>
        </div>

        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Students</p>
              <h2>Assigned-course visibility</h2>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {highlightedStudents.length ? (
              highlightedStudents.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#bfd8d3] hover:shadow-[0_18px_38px_rgba(9,72,69,0.06)]"
                  onClick={() => portal.openAccountDetails(student)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <strong className="block text-[1rem] text-[#10252b]">{student.name}</strong>
                      <p className="m-0 mt-1 text-sm text-[#627579]">{student.email}</p>
                    </div>
                    <span className="rounded-full bg-[#e9fbf5] px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#087365]">
                      {student.accountStatus}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {student.courses.map((course) => (
                      <Badge key={course} variant="secondary">
                        {course}
                      </Badge>
                    ))}
                  </div>
                  <p className="m-0 mt-3 text-[0.82rem] font-semibold text-[#627579]">
                    Joined {formatPortalDate(student.joinedOn)}
                  </p>
                </button>
              ))
            ) : (
              <p className={portalStyles.emptyState}>No students are assigned to this teacher yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherFocusRow({
  label,
  detail,
  actionLabel,
  onClick,
}: {
  label: string;
  detail: string;
  actionLabel: string;
  onClick: () => void;
}) {
  return (
    <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-[34rem]">
          <strong className="block text-[0.98rem] text-[#10252b]">{label}</strong>
          <p className="m-0 mt-1 text-[0.9rem] leading-[1.6] text-[#627579]">{detail}</p>
        </div>
        <Button type="button" variant="secondary" icon={<ArrowUpRight />} onClick={onClick}>
          {actionLabel}
        </Button>
      </div>
    </article>
  );
}

function TeacherStudentsView({ portal }: { portal: PortalController }) {
  if (portal.selectedAccount) {
    return <StudentDetailsPanel portal={portal} allowEdit={false} showPayments={false} />;
  }

  const activeStudents = portal.teacherStudentUsers.filter((student) => student.accountStatus === "active");
  const multiCourseStudents = portal.teacherStudentUsers.filter((student) => student.courses.length > 1);

  return (
    <div className="grid gap-5">
      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Students</p>
            <h2>Assigned-course student roster</h2>
            <span>Teachers can review and update assigned-student progress. Account access and payments remain admin-only.</span>
          </div>
          <div className={portalStyles.panelHeaderActions}>
            <Button type="button" variant="secondary" icon={<Users />} onClick={() => portal.setTeacherView("overview")}>
              Back to Overview
            </Button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <MetricCard label="Total students" value={portal.teacherStudentUsers.length} />
          <MetricCard label="Active access" value={activeStudents.length} />
          <MetricCard label="Multi-course learners" value={multiCourseStudents.length} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {portal.teacherStudentUsers.length ? (
          portal.teacherStudentUsers.map((student) => (
            <button
              key={student.id}
              type="button"
              className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-4 text-left shadow-[0_14px_34px_rgba(9,72,69,0.04)] transition hover:-translate-y-0.5 hover:border-[#bfd8d3] hover:shadow-[0_18px_42px_rgba(9,72,69,0.08)]"
              onClick={() => portal.openAccountDetails(student)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <strong className="block text-[1rem] text-[#10252b]">{student.name}</strong>
                  <p className="m-0 mt-1 text-sm text-[#627579]">{student.email}</p>
                </div>
                <span className="rounded-full bg-[#e9fbf5] px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#087365]">
                  {student.accountStatus}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="flex flex-wrap gap-2">
                  {student.courses.length ? (
                    student.courses.map((course) => (
                      <Badge key={course} variant="secondary">
                        {course}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No courses</Badge>
                  )}
                </div>
                <div className="grid gap-1 text-[0.83rem] font-semibold text-[#627579]">
                  <span>Joined {formatPortalDate(student.joinedOn)}</span>
                  <span>{student.phone || "Phone not added"}</span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <p className={portalStyles.emptyState}>No students are assigned to this teacher yet.</p>
        )}
      </div>
    </div>
  );
}

function TeacherProfilePanel({ portal }: { portal: PortalController }) {
  const teacher = portal.currentUser;
  const [phone, setPhone] = useState(teacher?.phone ?? "");
  const [address, setAddress] = useState(teacher?.address ?? "");
  const [feedback, setFeedback] = useState("");

  async function handleSave() {
    const error = await portal.saveOwnProfile({ phone, guardianName: "", address });
    setFeedback(error ?? "Profile updated.");
  }

  return (
    <div className="grid gap-5">
      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Profile</p>
            <h2>Update contact information</h2>
            <span>Course assignments remain admin-controlled.</span>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[20px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(135deg,#083f3b_0%,#0e6458_100%)] p-5 text-white shadow-[0_20px_48px_rgba(4,39,36,0.16)]">
            <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#9df4d6]">Teacher profile</p>
            <h3 className="m-0 mt-3 text-[1.45rem] font-black tracking-[-0.04em]">{teacher?.name}</h3>
            <p className="m-0 mt-2 text-[0.92rem] leading-[1.65] text-white/80">
              Keep your contact details updated so admin can coordinate classes and resource updates without delay.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(teacher?.courses ?? []).map((course) => (
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
              <Label className="text-[0.82rem] font-black text-[#45595e]">Address</Label>
              <Input className={portalStyles.dialogControl} value={address} onChange={(event) => setAddress(event.target.value)} />
            </div>
            <div className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>Email</p>
              <strong className="text-[1rem] text-[#10252b]">{teacher?.email}</strong>
              <span className="text-[0.88rem] text-[#627579]">Email access remains managed from the portal account.</span>
            </div>
            <div className={portalStyles.studentDetailsCard}>
              <p className={portalStyles.studentDetailsCardLabel}>Assigned Courses</p>
              <div className="flex flex-wrap gap-2">
                {(teacher?.courses ?? []).map((course) => (
                  <Badge key={course}>{course}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className={cnFeedback(feedback)}>{feedback || "Teachers can update only their own contact details here."}</p>
          <Button type="button" icon={<Save />} onClick={() => void handleSave()}>
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

function TeacherSecurityPanel({ portal }: { portal: PortalController }) {
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
          <h2>Update your password</h2>
          <span>Admins can still issue a temporary password reset if access is lost.</span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[20px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-5">
          <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#0d7b68]">Security note</p>
          <h3 className="m-0 mt-3 text-[1.3rem] font-black tracking-[-0.04em] text-[#10252b]">Protect your teacher access</h3>
          <p className="m-0 mt-2 text-[0.92rem] leading-[1.65] text-[#627579]">
            Use a unique password and rotate it after device changes or shared lab access.
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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className={cnFeedback(feedback)}>{feedback || "Use at least eight characters with a mix of letters and numbers."}</p>
        <Button type="button" icon={<ShieldCheck />} onClick={() => void handleSave()}>
          Update Password
        </Button>
      </div>
    </div>
  );
}

function NoCourseAccessPanel() {
  return (
    <div className="rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(116,237,198,0.16),transparent_22%),linear-gradient(180deg,#ffffff,#f7fbfa)] p-6 shadow-[0_24px_62px_rgba(9,72,69,0.08)]">
      <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#0d7b68]">Access pending</p>
      <h2 className="m-0 mt-3 text-[1.55rem] font-black tracking-[-0.04em] text-[#10252b]">
        No courses are assigned to this teacher account yet
      </h2>
      <p className="m-0 mt-3 max-w-2xl text-[0.96rem] leading-[1.7] text-[#627579]">
        An admin needs to assign one or more courses before resource management and student progress can appear here.
      </p>
    </div>
  );
}

function cnFeedback(message: string) {
  if (!message) return "m-0 text-[0.88rem] font-semibold text-[#627579]";
  return message.includes("updated")
    ? "m-0 text-[0.88rem] font-semibold text-[#087365]"
    : "m-0 text-[0.88rem] font-semibold text-[#b42318]";
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

export function TeacherPortalScreen({ portal }: { portal: PortalController }) {
  return (
    <main className={portalShell}>
      <section className={portalStyles.adminGrid}>
        <AdminSidebar portal={portal} />

        <div className="min-w-0 px-6 py-6 sm:px-8 lg:px-10 xl:px-12">
          {!portal.hasCourseAccess && portal.teacherView !== "profile" && portal.teacherView !== "security" ? <NoCourseAccessPanel /> : null}
          {portal.hasCourseAccess && portal.teacherView === "overview" ? <TeacherOverview portal={portal} /> : null}
          {portal.hasCourseAccess && portal.teacherView === "resources" ? <ResourceLibraryPanel portal={portal} /> : null}
          {portal.hasCourseAccess && portal.teacherView === "students" ? <TeacherStudentsView portal={portal} /> : null}
          {portal.teacherView === "profile" ? <TeacherProfilePanel portal={portal} /> : null}
          {portal.teacherView === "security" ? <TeacherSecurityPanel portal={portal} /> : null}
        </div>
      </section>

      <ResourceFormCard portal={portal} />
    </main>
  );
}
