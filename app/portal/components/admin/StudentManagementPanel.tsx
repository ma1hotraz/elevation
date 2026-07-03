import { BadgeCheck, BadgeMinus, Filter, Search, Trash2, UserPlus, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TablePagination } from "../PortalTable";
import { COURSES } from "../../portal.data";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

type StudentManagementPanelProps = {
  portal: PortalController;
};

export function StudentManagementPanel({ portal }: StudentManagementPanelProps) {
  const canManageStudents = portal.currentUser?.role === "admin";
  const activeStudents = portal.studentUsers.filter((student) => student.courses.length > 0).length;
  const disabledStudents = portal.studentUsers.length - activeStudents;

  function clearStudentFilters() {
    portal.setStudentSearch("");
    portal.setActiveStudentCourse("All");
    portal.setActiveStudentStatus("All");
  }

  return (
    <section className={portalStyles.studentPageShell}>
      <div className={portalStyles.studentPageHeader}>
        <div>
          <h1 className={portalStyles.studentPageTitle}>
            Manage student logins <span>and course access</span>
          </h1>
          <p className={portalStyles.studentPageSubtitle}>
            {canManageStudents ? "Create, edit, or manage students." : "Review student logins and course access."}
          </p>
        </div>
        <div className={portalStyles.studentHeaderActions}>
          {canManageStudents ? (
            <Button type="button" icon={<UserPlus />} onClick={() => portal.setIsAddStudentDialogOpen(true)}>
              Add Student
            </Button>
          ) : null}
          <Button type="button" variant="secondary" size="icon" aria-label="Clear student filters" onClick={clearStudentFilters}>
            <Filter aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className={portalStyles.studentStatGrid}>
        <article className={portalStyles.studentStatCard}>
          <span className={portalStyles.studentStatIcon}>
            <UsersRound aria-hidden="true" />
          </span>
          <div>
            <span className={portalStyles.studentStatLabel}>Total Students</span>
            <strong className={portalStyles.studentStatValue}>{portal.studentUsers.length}</strong>
          </div>
        </article>
        <article className={portalStyles.studentStatCard}>
          <span className={portalStyles.studentStatIcon}>
            <BadgeCheck aria-hidden="true" />
          </span>
          <div>
            <span className={portalStyles.studentStatLabel}>Active Students</span>
            <strong className={portalStyles.studentStatValue}>{activeStudents}</strong>
          </div>
        </article>
        <article className={portalStyles.studentStatCard}>
          <span className={portalStyles.studentStatIcon}>
            <BadgeMinus aria-hidden="true" />
          </span>
          <div>
            <span className={portalStyles.studentStatLabel}>Disabled Students</span>
            <strong className={portalStyles.studentStatValue}>{disabledStudents}</strong>
          </div>
        </article>
      </div>

      <div className={portalStyles.studentFilterGrid}>
        <div className="grid gap-2">
          <Label className="sr-only">Search students</Label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9a9d]" />
            <Input
              className="h-10 rounded-[10px] border-[#d6e3e1] bg-white pl-10 text-[0.9rem]"
              value={portal.studentSearch}
              onChange={(event) => portal.setStudentSearch(event.target.value)}
              placeholder="Search students by name or email..."
            />
          </div>
        </div>

        <Select
          value={portal.activeStudentCourse}
          onValueChange={(value) => portal.setActiveStudentCourse(value as PortalController["activeStudentCourse"])}
        >
          <SelectTrigger className="h-10 w-full rounded-[10px] border-[#d6e3e1] bg-white px-4 text-[0.9rem]">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Courses</SelectItem>
            {COURSES.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={portal.activeStudentStatus}
          onValueChange={(value) => portal.setActiveStudentStatus(value as PortalController["activeStudentStatus"])}
        >
          <SelectTrigger className="h-10 w-full rounded-[10px] border-[#d6e3e1] bg-white px-4 text-[0.9rem]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={portalStyles.studentTableFrame}>
        <Table>
          <TableHeader>
            {portal.studentsTable.getHeaderGroups().map((headerGroup) => (
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
            {portal.studentsTable.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className={cn(row.getIsSelected() && portalStyles.selectedRow)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {portal.studentsTable.getRowModel().rows.length === 0 ? (
          <p className={portalStyles.emptyState}>No students match these filters.</p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5eeec] px-3 py-3 text-[0.84rem] font-bold text-[#6b7f84]">
          <span>
            Showing {portal.studentsTable.getRowModel().rows.length} of {portal.filteredStudentRows.length} students
          </span>
          {canManageStudents && portal.selectedStudentIds.length > 0 ? (
            <Button type="button" variant="destructive" icon={<Trash2 />} onClick={portal.removeSelectedStudents}>
              Remove Selected
            </Button>
          ) : null}
        </div>
      </div>

      {portal.filteredStudentRows.length > 0 ? (
        <TablePagination table={portal.studentsTable} label="students on this page" />
      ) : null}
    </section>
  );
}
