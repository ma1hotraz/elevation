import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { portalStyles } from "../portalShared";

export function SortHeader({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) {
  if (!onClick) {
    return <span className="font-semibold text-foreground">{title}</span>;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 px-0 font-semibold text-[#36545a] hover:bg-transparent hover:text-[#123036]"
      onClick={onClick}
    >
      {title}
      <ArrowUpDown aria-hidden="true" />
    </Button>
  );
}

function getPaginationItems(pageIndex: number, pageCount: number) {
  const currentPage = pageIndex + 1;

  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis-start" | "ellipsis-end"> = [1];
  const leftBoundary = Math.max(2, currentPage - 1);
  const rightBoundary = Math.min(pageCount - 1, currentPage + 1);

  if (leftBoundary > 2) {
    items.push("ellipsis-start");
  }

  for (let page = leftBoundary; page <= rightBoundary; page += 1) {
    items.push(page);
  }

  if (rightBoundary < pageCount - 1) {
    items.push("ellipsis-end");
  }

  items.push(pageCount);
  return items;
}

export function TablePagination<TData>({ table, label }: { table: TanstackTable<TData>; label: string }) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = Math.max(1, table.getPageCount());
  const totalRows = table.getPrePaginationRowModel().rows.length;
  const rowsOnPage = table.getRowModel().rows.length;
  const startRow = totalRows === 0 ? 0 : pageIndex * table.getState().pagination.pageSize + 1;
  const endRow = totalRows === 0 ? 0 : Math.min(totalRows, startRow + rowsOnPage - 1);
  const paginationItems = getPaginationItems(pageIndex, pageCount);

  return (
    <div className="border-t border-[rgba(8,47,43,0.08)] bg-[#fbfefd] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex min-h-9 items-center rounded-full border border-[rgba(8,47,43,0.08)] bg-white px-3.5 text-[0.83rem] font-black text-[#627579] shadow-[0_10px_24px_rgba(9,72,69,0.04)]">
          {startRow === 0 ? `0 ${label}` : `${startRow} - ${endRow} of ${totalRows} ${label}`}
        </span>
        <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1.5 max-[640px]:w-full max-[640px]:justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="rounded-[10px]"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              <ChevronsLeft aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-[10px] px-3 font-black"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft aria-hidden="true" />
              Prev
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 max-[640px]:justify-center">
            {paginationItems.map((item) => {
              if (item === "ellipsis-start" || item === "ellipsis-end") {
                return (
                  <span key={item} className="inline-flex h-8 w-8 items-center justify-center text-[#8aa0a5]" aria-hidden="true">
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                );
              }

              const isActive = item === pageIndex + 1;

              return (
                <Button
                  key={item}
                  type="button"
                  variant={isActive ? "default" : "secondary"}
                  size="icon-sm"
                  className={cn(
                    "rounded-[10px] font-black",
                    isActive && "pointer-events-none shadow-[0_10px_22px_rgba(7,105,95,0.18)]",
                  )}
                  onClick={() => table.setPageIndex(item - 1)}
                  disabled={isActive}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`Page ${item}`}
                >
                  {item}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-[10px] px-3 font-black"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="rounded-[10px]"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              <ChevronsRight aria-hidden="true" />
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}

type PortalTableShellProps = {
  children: ReactNode;
  toolbar?: ReactNode;
  summary?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function PortalTableShell({ children, toolbar, summary, footer, className }: PortalTableShellProps) {
  return (
    <div className={cn(portalStyles.tableFrame, className)}>
      {toolbar ? <div className={portalStyles.tableToolbar}>{toolbar}</div> : null}
      {summary ? <div className="border-b border-[rgba(8,47,43,0.08)] bg-[#fbfefd] px-5 py-4">{summary}</div> : null}
      {children}
      {footer}
    </div>
  );
}
