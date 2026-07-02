import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

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
      className="h-8 px-0 font-semibold text-foreground hover:bg-transparent"
      onClick={onClick}
    >
      {title}
      <ArrowUpDown aria-hidden="true" />
    </Button>
  );
}

export function TablePagination<TData>({ table, label }: { table: TanstackTable<TData>; label: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(8,47,43,0.08)] bg-white px-4 py-3">
      <span className="text-sm font-semibold text-[#627579]">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#627579]">
          {table.getRowModel().rows.length} {label}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft aria-hidden="true" />
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
