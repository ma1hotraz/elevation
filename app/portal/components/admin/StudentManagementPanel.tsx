import { Ban, Eye, KeyRound, Pencil, ShieldAlert, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { PortalFilterBar, PortalFilterSummary, PortalSearchFilter, PortalSelectFilter } from "../PortalFilters";
import { PortalTableShell, TablePagination } from "../PortalTable";
import { COURSES } from "../../portal.data";
import { MetricCard, PortalPageHeader } from "../PortalStat";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

export function StudentManagementPanel({ portal }: { portal: PortalController }) {
  const suspendedAccounts = portal.filteredAccountRows.filter((account) => account.accountStatus === "suspended").length;
  const teacherCount = portal.filteredAccountRows.filter((account) => account.role === "teacher").length;
  const studentCount = portal.filteredAccountRows.filter((account) => account.role === "student").length;

  return (
    <section className={portalStyles.studentPageShell}>
      <PortalPageHeader
        eyebrow="Account control"
        title="Manage student and teacher accounts"
        lead="Create access, assign courses, reset passwords, and control account status from one place."
        actions={
          <>
            <Button type="button" variant="secondary" icon={<Users />} onClick={() => portal.openCreateAccount("teacher")}>
              Add Teacher
            </Button>
            <Button type="button" icon={<UserPlus />} onClick={() => portal.openCreateAccount("student")}>
              Add Student
            </Button>
          </>
        }
      >
        <div className="mt-5 grid gap-3 lg:grid-cols-4 sm:grid-cols-2">
          <MetricCard
            label="Visible accounts"
            value={portal.filteredAccountRows.length}
            detail="Current result set after filters."
          />
          <MetricCard
            label="Students"
            value={studentCount}
            detail="Learners currently shown in the table."
          />
          <MetricCard
            label="Teachers"
            value={teacherCount}
            detail="Teaching accounts currently shown in the table."
          />
          <MetricCard
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
      </PortalPageHeader>

      <PortalTableShell
        mobileContent={<MobileAccountCards portal={portal} />}
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
      </PortalTableShell>
    </section>
  );
}

function MobileAccountCards({ portal }: { portal: PortalController }) {
  const rows = portal.accountsTable.getRowModel().rows;

  if (!rows.length) {
    return <p className={portalStyles.emptyState}>No accounts match these filters.</p>;
  }

  return (
    <>
      {rows.map((row) => {
        const account = row.original;
        const isSuspended = account.accountStatus === "suspended";

        return (
          <article key={account.id} className="rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-white p-4 shadow-[0_12px_34px_rgba(9,72,69,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <strong className="block truncate text-[1rem] text-[#10252b]">{account.name}</strong>
                <span className="mt-1 block truncate text-[0.82rem] font-semibold text-[#627579]">{account.email}</span>
              </div>
              <span className={cn(portalStyles.studentStatusBadge, isSuspended ? portalStyles.studentStatusDisabled : portalStyles.studentStatusActive)}>
                {isSuspended ? "Suspended" : "Active"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-[#e1ecea] bg-[#fbfefd] px-2 py-1 text-[0.7rem] font-bold text-[#5f7378]">
                {account.role}
              </span>
              {account.courses.length ? (
                account.courses.map((course) => (
                  <span key={course} className="rounded-full bg-[#e9fbf5] px-2 py-1 text-[0.7rem] font-bold text-[#087365]">
                    {course}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-[#eef2f2] px-2 py-1 text-[0.7rem] font-bold text-[#5f7378]">No courses</span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" size="sm" icon={<Eye />} onClick={() => portal.openAccountDetails(account)}>
                View
              </Button>
              <Button type="button" variant="secondary" size="sm" icon={<Pencil />} onClick={() => portal.openEditAccount(account)}>
                Edit
              </Button>
              <Button type="button" variant="secondary" size="sm" icon={<KeyRound />} onClick={() => void portal.requestPasswordReset(account.id)}>
                Reset
              </Button>
              <Button type="button" variant="secondary" size="sm" icon={isSuspended ? <ShieldCheck /> : <Ban />} onClick={() => void portal.toggleManagedAccountStatus(account.id)}>
                {isSuspended ? "Reactivate" : "Suspend"}
              </Button>
              <Button type="button" variant="destructive" size="sm" className="col-span-2" icon={<Trash2 />} onClick={() => portal.removeManagedAccount(account.id)}>
                Delete
              </Button>
            </div>
          </article>
        );
      })}
    </>
  );
}
