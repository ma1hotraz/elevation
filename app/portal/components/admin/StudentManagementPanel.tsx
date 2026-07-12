import { ShieldAlert, Trash2, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { PortalFilterBar, PortalFilterSummary, PortalSearchFilter, PortalSelectFilter } from "../PortalFilters";
import { PortalTableShell, TablePagination } from "../PortalTable";
import { COURSES } from "../../portal.data";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

function AccountMetric({
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

export function StudentManagementPanel({ portal }: { portal: PortalController }) {
  const suspendedAccounts = portal.filteredAccountRows.filter((account) => account.accountStatus === "suspended").length;
  const teacherCount = portal.filteredAccountRows.filter((account) => account.role === "teacher").length;
  const studentCount = portal.filteredAccountRows.filter((account) => account.role === "student").length;

  return (
    <section className={portalStyles.studentPageShell}>
      <div className="relative overflow-hidden rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(116,237,198,0.18),transparent_24%),linear-gradient(180deg,#ffffff,#f7fbfa)] p-5 shadow-[0_22px_60px_rgba(9,72,69,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#0d7b68]">
              Account control
            </p>
            <h1 className={portalStyles.studentPageTitle}>Manage student and teacher accounts</h1>
            <p className={portalStyles.studentPageSubtitle}>
              Create access, assign courses, reset passwords, and control account status from one place.
            </p>
          </div>
          <div className={portalStyles.studentHeaderActions}>
            <Button type="button" variant="secondary" icon={<Users />} onClick={() => portal.openCreateAccount("teacher")}>
              Add Teacher
            </Button>
            <Button type="button" icon={<UserPlus />} onClick={() => portal.openCreateAccount("student")}>
              Add Student
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-4 sm:grid-cols-2">
          <AccountMetric
            label="Visible accounts"
            value={portal.filteredAccountRows.length}
            detail="Current result set after filters."
          />
          <AccountMetric
            label="Students"
            value={studentCount}
            detail="Learners currently shown in the table."
          />
          <AccountMetric
            label="Teachers"
            value={teacherCount}
            detail="Teaching accounts currently shown in the table."
          />
          <AccountMetric
            label="Suspended"
            value={suspendedAccounts}
            detail="Accounts needing review or reactivation."
          />
        </div>

        {portal.selectedAccountIds.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[rgba(180,35,24,0.12)] bg-[#fff8f7] p-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#b42318]">
                <ShieldAlert aria-hidden="true" className="h-4 w-4" />
                <strong className="text-[0.92rem] text-[#10252b]">Bulk action ready</strong>
              </div>
              <p className="m-0 mt-2 text-[0.88rem] leading-[1.55] text-[#7b4e4a]">
                {portal.selectedAccountIds.length} account{portal.selectedAccountIds.length === 1 ? "" : "s"} selected for removal.
              </p>
            </div>
            <Button type="button" variant="destructive" icon={<Trash2 />} onClick={() => void portal.removeSelectedAccounts()}>
              Remove Selected
            </Button>
          </div>
        ) : null}
      </div>

      <PortalTableShell
        toolbar={
          <PortalFilterBar className="grid-cols-[minmax(0,1.3fr)_minmax(160px,0.55fr)_minmax(160px,0.55fr)_minmax(160px,0.55fr)_max-content] max-[1200px]:grid-cols-1">
            <PortalSearchFilter
              label="Search accounts"
              value={portal.accountSearch}
              onChange={portal.setAccountSearch}
              placeholder="Search by name, email, or course..."
            />
            <PortalSelectFilter
              label="Role"
              value={portal.activeAccountRole}
              onValueChange={(value) => portal.setActiveAccountRole(value as PortalController["activeAccountRole"])}
              placeholder="All roles"
            >
              <SelectItem value="All">All roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="teacher">Teachers</SelectItem>
            </PortalSelectFilter>
            <PortalSelectFilter
              label="Course"
              value={portal.activeAccountCourse}
              onValueChange={(value) => portal.setActiveAccountCourse(value as PortalController["activeAccountCourse"])}
              placeholder="All courses"
            >
              <SelectItem value="All">All courses</SelectItem>
              {COURSES.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </PortalSelectFilter>
            <PortalSelectFilter
              label="Status"
              value={portal.activeAccountStatus}
              onValueChange={(value) => portal.setActiveAccountStatus(value as PortalController["activeAccountStatus"])}
              placeholder="All status"
            >
              <SelectItem value="All">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </PortalSelectFilter>
            <PortalFilterSummary onClear={portal.clearAccountFilters} />
          </PortalFilterBar>
        }
        footer={
          portal.filteredAccountRows.length > 0 ? <TablePagination table={portal.accountsTable} label="accounts on this page" /> : null
        }
      >
        <Table>
          <TableHeader>
            {portal.accountsTable.getHeaderGroups().map((headerGroup) => (
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
            {portal.accountsTable.getRowModel().rows.map((row) => (
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
        {portal.accountsTable.getRowModel().rows.length === 0 ? (
          <p className={portalStyles.emptyState}>No accounts match these filters.</p>
        ) : null}
        {portal.selectedAccountIds.length > 0 ? (
          <div className="flex justify-end border-t border-[#e5eeec] px-3 py-3">
            <Button type="button" variant="destructive" icon={<Trash2 />} onClick={() => void portal.removeSelectedAccounts()}>
              Remove Selected
            </Button>
          </div>
        ) : null}
      </PortalTableShell>
    </section>
  );
}
