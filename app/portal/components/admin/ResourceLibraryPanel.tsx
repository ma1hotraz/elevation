import { Download, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { PortalField } from "../PortalField";
import { TablePagination } from "../PortalTable";
import { CATEGORIES } from "../../portal.data";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

type ResourceLibraryPanelProps = {
  portal: PortalController;
};

export function ResourceLibraryPanel({ portal }: ResourceLibraryPanelProps) {
  return (
    <section className={portalStyles.resourceLibraryShell}>
      <div className={portalStyles.resourceFilterGrid}>
        <PortalField className={cn(portalStyles.searchField, portalStyles.resourceFilterField)}>
          <Label>Search resources</Label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#708084]" />
            <Input
              className={portalStyles.resourceFilterControl}
              value={portal.resourceSearch}
              onChange={(event) => portal.setResourceSearch(event.target.value)}
              placeholder="Search title, description, URL, or answer link"
            />
          </div>
        </PortalField>
        <PortalField className={portalStyles.resourceFilterField}>
          <Label>Course</Label>
          <Select
            value={portal.activeCourse}
            onValueChange={(value) => portal.setActiveCourse(value as PortalController["activeCourse"])}
          >
            <SelectTrigger className={cn(portalStyles.selectTrigger, portalStyles.resourceFilterControl)}>
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All courses</SelectItem>
              {portal.visibleCourses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PortalField>
        <PortalField className={portalStyles.resourceFilterField}>
          <Label>Type</Label>
          <Select
            value={portal.activeResourceCategory}
            onValueChange={(value) =>
              portal.setActiveResourceCategory(value as PortalController["activeResourceCategory"])
            }
          >
            <SelectTrigger className={cn(portalStyles.selectTrigger, portalStyles.resourceFilterControl)}>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All types</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PortalField>

      </div>

      <div className={portalStyles.resourceCountRow}>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" onClick={portal.clearResourceFilters}>
            Clear filters
          </Button>
          <span>{portal.filteredResourceRows.length} resources found</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2.5 max-[640px]:w-full max-[640px]:justify-stretch [&_[data-slot=button]]:max-[640px]:flex-1">
          <Badge variant="outline">{portal.filteredResourceRows.length} shown</Badge>
          <Button type="button" icon={<Plus />} onClick={() => portal.openResourceDialog()}>
            Add Test
          </Button>
          <Button type="button" variant="secondary" icon={<Download />} onClick={portal.exportResources}>
            Export
          </Button>
        </div>
      </div>

      <div className={portalStyles.resourceTableWrap}>
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
      </div>
      {portal.filteredResourceRows.length > 0 ? (
        <TablePagination table={portal.resourcesTable} label="resources on this page" />
      ) : null}
    </section>
  );
}
