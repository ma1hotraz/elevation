"use client";

import { CalendarClock, ClipboardList, FolderOpen, Link2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./admin/AdminSidebar";
import { portalKicker, portalStyles } from "../portalShared";
import type { PortalController } from "../usePortalState";
import type { TestResource } from "../portal.types";

type PortalStudentScreenProps = {
  portal: PortalController;
};

function StudentProfileView({ portal }: PortalStudentScreenProps) {
  const student = portal.currentUser;

  return (
    <div className={portalStyles.studentDetailsShell}>
      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Profile</p>
            <h2>Your account details</h2>
            <span>Everything you need in one place.</span>
          </div>
        </div>

        <div className={portalStyles.studentDetailsGrid}>
          <div className={portalStyles.studentDetailsCard}>
            <p className={portalStyles.studentDetailsCardLabel}>Student</p>
            <strong>{student?.name}</strong>
            <span>{student?.email}</span>
          </div>
          <div className={portalStyles.studentDetailsCard}>
            <p className={portalStyles.studentDetailsCardLabel}>Courses</p>
            <div className="flex flex-wrap gap-2">
              {student?.courses.map((course) => (
                <Badge key={course}>{course}</Badge>
              ))}
            </div>
          </div>
          <div className={portalStyles.studentDetailsCard}>
            <p className={portalStyles.studentDetailsCardLabel}>Contact</p>
            <strong>{student?.phone ?? "Not updated"}</strong>
            <span>{student?.guardianName ?? "Guardian not added"}</span>
          </div>
          <div className={portalStyles.studentDetailsCard}>
            <p className={portalStyles.studentDetailsCardLabel}>Address</p>
            <strong>{student?.address ?? "Not updated"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentPerformanceView({ portal }: PortalStudentScreenProps) {
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

        <div className={portalStyles.studentStatGrid}>
          <div className={portalStyles.studentStatCard}>
            <div className={portalStyles.studentStatIcon}>
              <ClipboardList aria-hidden="true" />
            </div>
            <div>
              <span className={portalStyles.studentStatLabel}>Average score</span>
              <strong className={portalStyles.studentStatValue}>{performance?.averageScore ?? 0}%</strong>
            </div>
          </div>
          <div className={portalStyles.studentStatCard}>
            <div className={portalStyles.studentStatIcon}>
              <CalendarClock aria-hidden="true" />
            </div>
            <div>
              <span className={portalStyles.studentStatLabel}>Attendance</span>
              <strong className={portalStyles.studentStatValue}>{performance?.attendance ?? 0}%</strong>
            </div>
          </div>
          <div className={portalStyles.studentStatCard}>
            <div className={portalStyles.studentStatIcon}>
              <User aria-hidden="true" />
            </div>
            <div>
              <span className={portalStyles.studentStatLabel}>Rank</span>
              <strong className={portalStyles.studentStatValue}>#{performance?.rank ?? 0}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Score history</p>
            <h2>Recent assessments</h2>
          </div>
        </div>
        <div className="grid gap-3">
          {history.map((item) => (
            <div key={`${item.test}-${item.date}`} className="flex items-center justify-between rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-4">
              <div>
                <strong className="block text-[#10252b]">{item.test}</strong>
                <span className="text-sm text-[#627579]">{item.date}</span>
              </div>
              <Badge>{item.score}%</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentResourcesView({ portal }: PortalStudentScreenProps) {
  const resources = portal.visibleResources;

  return (
    <div className="grid gap-5">
      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Resources</p>
            <h2>Live tests and study material</h2>
          </div>
        </div>

        <div className="grid gap-3">
          {resources.map((resource) => (
            <StudentResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentResourceCard({ resource }: { resource: TestResource }) {
  return (
    <div className="rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <strong className="block text-[#10252b]">{resource.title}</strong>
          <p className="mt-1 text-sm text-[#627579]">{resource.description}</p>
        </div>
        <Badge variant="secondary">{resource.course}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{resource.category}</Badge>
        <Badge variant="outline">{resource.status}</Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <a href={resource.url} target="_blank" rel="noreferrer">
            <Link2 aria-hidden="true" className="mr-2 h-4 w-4" />
            Open resource
          </a>
        </Button>
        {resource.answerUrl ? (
          <Button asChild size="sm" variant="secondary">
            <a href={resource.answerUrl} target="_blank" rel="noreferrer">
              View answer
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function StudentLiveTestView({ portal }: PortalStudentScreenProps) {
  const liveTests = portal.visibleResources.filter((resource) => resource.category === "Live Test");

  return (
    <div className="grid gap-5">
      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Live Test</p>
            <h2>Jump into the active test flow</h2>
          </div>
        </div>

        <div className="grid gap-3">
          {liveTests.map((resource) => (
            <div key={resource.id} className="rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-4">
              <strong className="block text-[#10252b]">{resource.title}</strong>
              <p className="mt-1 text-sm text-[#627579]">{resource.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>{resource.course}</Badge>
                <Badge variant="outline">{resource.status}</Badge>
              </div>
              <Button asChild className="mt-4">
                <a href={resource.url} target="_blank" rel="noreferrer">
                  Open live test
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PortalStudentScreen({ portal }: PortalStudentScreenProps) {
  const activeView = portal.activeAdminView;

  return (
    <main className={portalStyles.adminGrid}>
      <AdminSidebar portal={portal} />

      <div className="min-w-0 px-6 py-6 sm:px-8 lg:px-10 xl:px-12">
        <div className="mb-5">
          <p className={portalKicker}>Student workspace</p>
          <h1 className="mt-2 text-[2rem] font-black tracking-[-0.04em] text-[#10252b]">{portal.currentUser?.name}</h1>
          <p className="mt-2 max-w-2xl text-[0.98rem] text-[#627579]">
            Profile, performance, resources, and live tests stay in one clean portal.
          </p>
        </div>

        {activeView === "profile" ? <StudentProfileView portal={portal} /> : null}
        {activeView === "performance" ? <StudentPerformanceView portal={portal} /> : null}
        {activeView === "resources" ? <StudentResourcesView portal={portal} /> : null}
        {activeView === "live-test" ? <StudentLiveTestView portal={portal} /> : null}
        {activeView === "overview" ? <StudentProfileView portal={portal} /> : null}
      </div>
    </main>
  );
}
