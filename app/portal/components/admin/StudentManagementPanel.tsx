import { Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TablePagination } from "../PortalTable";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

type StudentManagementPanelProps = {
  portal: PortalController;
};

export function StudentManagementPanel({ portal }: StudentManagementPanelProps) {
  return (
    <section className={portalStyles.studentList}>
      <div className={portalStyles.panelHeader}>
        <div>
          <p>Student Access</p>
          <h2>Manage student logins</h2>
        </div>
        <div className={portalStyles.panelHeaderActions}>
          <Badge>{portal.studentUsers.length} students</Badge>
          <Button type="button" onClick={() => portal.setIsAddStudentDialogOpen(true)}>
            <UserPlus aria-hidden="true" />
            Add Student
          </Button>
        </div>
      </div>

      <div className={portalStyles.tableToolbar}>
        <span>{portal.selectedStudentIds.length} selected</span>
        <Button
          type="button"
          variant="secondary"
          onClick={portal.removeSelectedStudents}
          disabled={portal.selectedStudentIds.length === 0}
        >
          <Trash2 aria-hidden="true" />
          Remove Selected
        </Button>
      </div>

      <div className={portalStyles.tableFrame}>
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
          <p className={portalStyles.emptyState}>No students found.</p>
        ) : null}
      </div>
      {portal.studentUsers.length > 0 ? (
        <TablePagination table={portal.studentsTable} label="students on this page" />
      ) : null}
    </section>
  );
}
