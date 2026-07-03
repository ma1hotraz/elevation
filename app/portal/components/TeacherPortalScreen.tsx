"use client";

import { BookOpen, CalendarClock, ClipboardList, FolderOpen, PlusCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./admin/AdminSidebar";
import { ResourceFormCard } from "./admin/ResourceFormCard";
import { portalKicker, portalStyles } from "../portalShared";
import type { PortalController } from "../usePortalState";

type TeacherPortalScreenProps = {
  portal: PortalController;
};

function TeacherOverview({ portal }: TeacherPortalScreenProps) {
  const liveTests = portal.state.resources.filter((resource) => resource.category === "Live Test");
  const totalStudents = portal.state.users.filter((user) => user.role === "student").length;

  return (
    <div className="grid gap-5">
      <div className={portalStyles.panel}>
        <div className={portalStyles.panelHeader}>
          <div>
            <p>Teacher Workspace</p>
            <h2>Plan tests, add resources, and watch student progress.</h2>
            <span>Limited tools for teaching, all in the same admin-style shell.</span>
          </div>
          <div className={portalStyles.panelHeaderActions}>
            <Button type="button" onClick={() => portal.openResourceDialog()}>
              <PlusCircle aria-hidden="true" className="mr-2 h-4 w-4" />
              Create Test
            </Button>
            <Button type="button" variant="secondary" onClick={() => portal.openResourceDialog()}>
              <FolderOpen aria-hidden="true" className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </div>
        </div>

        <div className={portalStyles.resourceStatGrid}>
          <div className={portalStyles.resourceStatCard}>
            <div className={portalStyles.resourceStatTop}>
              <div>
                <span className={portalStyles.resourceStatValue}>{portal.visibleCourses.length}</span>
                <p className={portalStyles.resourceStatLabel}>Active courses</p>
              </div>
              <div className={portalStyles.resourceStatIcon}>
                <BookOpen aria-hidden="true" className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className={portalStyles.resourceStatCard}>
            <div className={portalStyles.resourceStatTop}>
              <div>
                <span className={portalStyles.resourceStatValue}>{liveTests.length}</span>
                <p className={portalStyles.resourceStatLabel}>Live tests</p>
              </div>
              <div className={portalStyles.resourceStatIcon}>
                <ClipboardList aria-hidden="true" className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className={portalStyles.resourceStatCard}>
            <div className={portalStyles.resourceStatTop}>
              <div>
                <span className={portalStyles.resourceStatValue}>{portal.state.resources.length}</span>
                <p className={portalStyles.resourceStatLabel}>Total resources</p>
              </div>
              <div className={portalStyles.resourceStatIcon}>
                <FolderOpen aria-hidden="true" className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className={portalStyles.resourceStatCard}>
            <div className={portalStyles.resourceStatTop}>
              <div>
                <span className={portalStyles.resourceStatValue}>{totalStudents}</span>
                <p className={portalStyles.resourceStatLabel}>Students</p>
              </div>
              <div className={portalStyles.resourceStatIcon}>
                <Users aria-hidden="true" className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Latest Resources</p>
              <h2>Recent test links and material.</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {portal.visibleResources.slice(0, 5).map((resource) => (
              <div
                key={resource.id}
                className="rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[1rem] font-black text-[#10252b]">{resource.title}</h3>
                    <p className="mt-1 text-sm text-[#627579]">{resource.description}</p>
                  </div>
                  <Badge variant="secondary">{resource.course}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{resource.category}</Badge>
                  <Badge variant="outline">{resource.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={portalStyles.panel}>
          <div className={portalStyles.panelHeader}>
            <div>
              <p>Students</p>
              <h2>Read-only student list.</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {portal.state.users
              .filter((user) => user.role === "student")
              .map((student) => (
                <div key={student.id} className="rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-white p-4">
                  <strong className="block text-[#10252b]">{student.name}</strong>
                  <p className="mt-1 text-sm text-[#627579]">{student.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {student.courses.map((course) => (
                      <Badge key={course} variant="secondary">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherResourceView({ portal }: TeacherPortalScreenProps) {
  return (
    <div className={portalStyles.panel}>
      <div className={portalStyles.panelHeader}>
        <div>
          <p>Test Builder</p>
          <h2>Create tests and add resource links.</h2>
          <span>Use the shared resource form. The portal keeps the flow consistent with admin.</span>
        </div>
        <Button type="button" onClick={() => portal.openResourceDialog()}>
          <PlusCircle aria-hidden="true" className="mr-2 h-4 w-4" />
          Open form
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-5">
          <p className={portalKicker}>Workflow</p>
          <h3 className="mt-2 text-xl font-black text-[#10252b]">Create a new live test</h3>
          <p className="mt-2 text-sm leading-6 text-[#627579]">
            Add the title, course, and resource link. The same form can also store a resource note or answer link.
          </p>
          <Button type="button" className="mt-4" onClick={() => portal.openResourceDialog()}>
            Create test
          </Button>
        </div>

        <div className="rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-5">
          <p className={portalKicker}>Recent activity</p>
          <h3 className="mt-2 text-xl font-black text-[#10252b]">Most recent resource</h3>
          <p className="mt-2 text-sm text-[#627579]">{portal.latestResource?.title ?? "No resources yet."}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {portal.latestResource ? (
              <>
                <Badge>{portal.latestResource.course}</Badge>
                <Badge variant="outline">{portal.latestResource.category}</Badge>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherStudentsView({ portal }: TeacherPortalScreenProps) {
  return (
    <div className={portalStyles.panel}>
      <div className={portalStyles.panelHeader}>
        <div>
          <p>Students</p>
          <h2>View student access without admin controls.</h2>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {portal.state.users
          .filter((user) => user.role === "student")
          .map((student) => (
            <div key={student.id} className="rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-4">
              <strong className="block text-[#10252b]">{student.name}</strong>
              <p className="mt-1 text-sm text-[#627579]">{student.email}</p>
              <p className="mt-3 text-sm text-[#627579]">
                Courses: {student.courses.join(", ") || "No courses"}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export function TeacherPortalScreen({ portal }: TeacherPortalScreenProps) {
  const activeView = portal.activeAdminView;

  return (
    <main className={portalStyles.adminGrid}>
      <AdminSidebar portal={portal} />

      <div className="min-w-0 px-6 py-6 sm:px-8 lg:px-10 xl:px-12">
        {activeView === "overview" ? <TeacherOverview portal={portal} /> : null}
        {activeView === "create-test" || activeView === "add-resource" ? <TeacherResourceView portal={portal} /> : null}
        {activeView === "students" ? <TeacherStudentsView portal={portal} /> : null}
        {activeView === "resources" ? <TeacherOverview portal={portal} /> : null}
      </div>

      <ResourceFormCard portal={portal} />
    </main>
  );
}
