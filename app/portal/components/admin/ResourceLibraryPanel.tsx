import { Download, FolderOpen, Link2, Plus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { PortalFilterBar, PortalFilterSummary, PortalSearchFilter, PortalSelectFilter } from "../PortalFilters";
import { PortalTableShell, TablePagination } from "../PortalTable";
import { CATEGORIES, RESOURCE_STATUSES } from "../../portal.data";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

function ResourceMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article className="rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4 shadow-[0_14px_34px_rgba(9,72,69,0.04)]">
      <span className="block text-[0.8rem] font-bold text-[#627579]">{label}</span>
      <strong className="mt-2 block text-[1.75rem] font-black leading-none tracking-[-0.05em] text-[#10252b]">
        {value}
      </strong>
      <p className="m-0 mt-2 text-[0.84rem] leading-[1.5] text-[#627579]">{detail}</p>
    </article>
  );
}

export function ResourceLibraryPanel({ portal }: { portal: PortalController }) {
  const isTeacher = portal.currentUser?.role === "teacher";
  const liveResources = portal.filteredResourceRows.filter((resource) => resource.status === "Live").length;
  const upcomingResources = portal.filteredResourceRows.filter((resource) => resource.status === "Upcoming").length;
  const answerLinks = portal.filteredResourceRows.filter(
    (resource) => resource.answerUrl && resource.answerReleaseStatus === "Published",
  ).length;

  return (
    <section className={portalStyles.resourceLibraryShell}>
      <div className="relative overflow-hidden rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(116,237,198,0.18),transparent_24%),linear-gradient(180deg,#ffffff,#f7fbfa)] p-5 shadow-[0_22px_60px_rgba(9,72,69,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#0d7b68]">
              {isTeacher ? "Teacher resource control" : "Admin resource control"}
            </p>
            <h1 className="m-0 mt-2 text-[1.65rem] font-black leading-tight tracking-[-0.04em] text-[#10252b]">
              {isTeacher ? "Manage course resources and live tests" : "Manage resources and course materials"}
            </h1>
            <p className="m-0 mt-3 max-w-2xl text-[0.94rem] leading-[1.65] text-[#627579]">
              {isTeacher
                ? "Create, edit, or archive resources only for the courses assigned to this teacher account."
                : "Create, edit, or manage test links and study resources across the full portal."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2.5 max-[640px]:w-full max-[640px]:flex-col">
            <Button type="button" icon={<Plus />} onClick={() => portal.openResourceDialog()}>
              Add Resource
            </Button>
            <Button type="button" variant="secondary" icon={<Download />} onClick={portal.exportResources}>
              Export
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-4 sm:grid-cols-2">
          <ResourceMetric
            label="Filtered resources"
            value={portal.filteredResourceRows.length}
            detail="Current result set based on your filters."
          />
          <ResourceMetric
            label="Live now"
            value={liveResources}
            detail="Immediately visible to the assigned learners."
          />
          <ResourceMetric
            label="Upcoming"
            value={upcomingResources}
            detail="Scheduled items still waiting to go live."
          />
          <ResourceMetric
            label="Published answers"
            value={answerLinks}
            detail="Resources with visible answer links."
          />
        </div>

        {portal.latestResource ? (
          <div className="mt-5 flex flex-wrap items-start justify-between gap-3 rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#0d7b68]">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                <span className="text-[0.74rem] font-black uppercase tracking-[0.14em]">Latest resource</span>
              </div>
              <strong className="mt-2 block text-[1rem] text-[#10252b]">{portal.latestResource.title}</strong>
              <p className="m-0 mt-1 text-[0.88rem] leading-[1.55] text-[#627579]">
                {portal.latestResource.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{portal.latestResource.course}</Badge>
              <Badge>{portal.latestResource.category}</Badge>
              <Badge variant="outline">{portal.latestResource.status}</Badge>
            </div>
          </div>
        ) : null}
      </div>

      <PortalTableShell
        toolbar={
          <PortalFilterBar className="grid-cols-[minmax(0,1.2fr)_minmax(160px,0.55fr)_minmax(160px,0.55fr)_minmax(160px,0.55fr)_max-content] max-[1200px]:grid-cols-1">
            <PortalSearchFilter
              label="Search resources"
              value={portal.resourceSearch}
              onChange={portal.setResourceSearch}
              placeholder="Search title, description, URL, or answer link"
            />
            <PortalSelectFilter
              label="Course"
              value={portal.activeCourse}
              onValueChange={(value) => portal.setActiveCourse(value as PortalController["activeCourse"])}
              placeholder="All courses"
            >
              <SelectItem value="All">All courses</SelectItem>
              {portal.visibleCourses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </PortalSelectFilter>
            <PortalSelectFilter
              label="Type"
              value={portal.activeResourceCategory}
              onValueChange={(value) => portal.setActiveResourceCategory(value as PortalController["activeResourceCategory"])}
              placeholder="All types"
            >
              <SelectItem value="All">All types</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </PortalSelectFilter>
            <PortalSelectFilter
              label="Status"
              value={portal.activeResourceStatus}
              onValueChange={(value) => portal.setActiveResourceStatus(value as PortalController["activeResourceStatus"])}
              placeholder="All status"
            >
              <SelectItem value="All">All status</SelectItem>
              {RESOURCE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </PortalSelectFilter>
            <PortalFilterSummary onClear={portal.clearResourceFilters} />
          </PortalFilterBar>
        }
        footer={
          portal.filteredResourceRows.length > 0 ? (
            <TablePagination table={portal.resourcesTable} label="resources on this page" />
          ) : null
        }
      >
        <Table className={portalStyles.resourceTable}>
          <TableHeader>
            {portal.resourcesTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {portal.resourcesTable.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {portal.resourcesTable.getRowModel().rows.length === 0 ? (
          <p className={portalStyles.emptyState}>No resources match these filters.</p>
        ) : null}
      </PortalTableShell>

      <div className="grid gap-3 xl:grid-cols-3">
        <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-4 shadow-[0_14px_34px_rgba(9,72,69,0.04)]">
          <div className="flex items-center gap-2 text-[#0d7b68]">
            <FolderOpen aria-hidden="true" className="h-4 w-4" />
            <strong className="text-[0.92rem] text-[#10252b]">Library hygiene</strong>
          </div>
          <p className="m-0 mt-3 text-[0.88rem] leading-[1.55] text-[#627579]">
            Keep status and answer visibility current so student-facing screens stay trustworthy.
          </p>
        </article>
        <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-4 shadow-[0_14px_34px_rgba(9,72,69,0.04)]">
          <div className="flex items-center gap-2 text-[#0d7b68]">
            <Link2 aria-hidden="true" className="h-4 w-4" />
            <strong className="text-[0.92rem] text-[#10252b]">Link quality</strong>
          </div>
          <p className="m-0 mt-3 text-[0.88rem] leading-[1.55] text-[#627579]">
            Use the resource table actions to audit URLs and answer links before publishing.
          </p>
        </article>
        <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-4 shadow-[0_14px_34px_rgba(9,72,69,0.04)]">
          <div className="flex items-center gap-2 text-[#0d7b68]">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            <strong className="text-[0.92rem] text-[#10252b]">Publishing flow</strong>
          </div>
          <p className="m-0 mt-3 text-[0.88rem] leading-[1.55] text-[#627579]">
            Upcoming resources form the queue; live items should represent the currently available learner experience.
          </p>
        </article>
      </div>
    </section>
  );
}
