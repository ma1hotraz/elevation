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
    <section className={portalStyles.panel}>
      <div className={portalStyles.panelHeader}>
        <div>
          <p>Resource Library</p>
          <h2>Manage course links and revision materials</h2>
        </div>
        <div className={portalStyles.panelHeaderActions}>
          <Badge>{portal.filteredResourceRows.length} shown</Badge>
          <Button
            type="button"
            size="lg"
            icon={<Plus />}
            onClick={() => portal.setActiveAdminView("add-link")}
          >
            Add Resource
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            icon={<Download />}
            onClick={portal.exportResources}
          >
            Export
          </Button>
        </div>
      </div>

      <div className={portalStyles.libraryToolbar}>
        <PortalField className={cn(portalStyles.searchField, portalStyles.filterField)}>
          <Label>Search resources</Label>
          <div className={portalStyles.searchControl}>
            <Search aria-hidden="true" />
            <Input
              className={portalStyles.filterControl}
              value={portal.resourceSearch}
              onChange={(event) => portal.setResourceSearch(event.target.value)}
              placeholder="Search title, description, course, or URL"
            />
          </div>
        </PortalField>
        <PortalField className={portalStyles.filterField}>
          <Label>Course</Label>
          <Select
            value={portal.activeCourse}
            onValueChange={(value) => portal.setActiveCourse(value as PortalController["activeCourse"])}
          >
            <SelectTrigger className={cn(portalStyles.selectTrigger, portalStyles.filterControl)}>
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
        <PortalField className={portalStyles.filterField}>
          <Label>Category</Label>
          <Select
            value={portal.activeResourceCategory}
            onValueChange={(value) =>
              portal.setActiveResourceCategory(value as PortalController["activeResourceCategory"])
            }
          >
            <SelectTrigger className={cn(portalStyles.selectTrigger, portalStyles.filterControl)}>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PortalField>
      </div>

      <div className={portalStyles.tableFrame}>
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
