import { Search } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PortalField } from "./PortalField";

const filterShellClass =
  "grid w-full gap-4 bg-[#fbfefd] px-4 py-5 max-[1100px]:grid-cols-1";

const filterLabelClass = "text-[0.72rem] font-black uppercase tracking-[0.14em] text-[#0d7b68]";

const filterControlClass =
  "h-10 min-h-10 rounded-[11px] border-[#d6e3e1] bg-white px-4 text-[0.93rem] shadow-[inset_0_1px_0_rgba(16,37,43,0.02)] placeholder:text-[#8b9ca1] focus-visible:border-[#0d8a74] focus-visible:ring-[#0d8a74]/15";

type PortalFilterBarProps = ComponentProps<"div">;

export function PortalFilterBar({ className, ...props }: PortalFilterBarProps) {
  return <div className={cn(filterShellClass, className)} {...props} />;
}

type PortalSearchFilterProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

export function PortalSearchFilter({ label, value, onChange, placeholder, className }: PortalSearchFilterProps) {
  return (
    <PortalField className={cn("mb-0 w-full gap-2 min-w-0", className)}>
      <Label className={filterLabelClass}>{label}</Label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#708084]"
        />
        <Input
          className={cn(filterControlClass, "pl-10")}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </div>
    </PortalField>
  );
}

type PortalSelectFilterProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  className?: string;
  children: ReactNode;
};

export function PortalSelectFilter({
  label,
  value,
  onValueChange,
  placeholder,
  className,
  children,
}: PortalSelectFilterProps) {
  return (
    <PortalField className={cn("mb-0 w-full gap-2 min-w-0", className)}>
      <Label className={filterLabelClass}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn(filterControlClass, "w-full justify-between") }>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </PortalField>
  );
}

type PortalFilterSummaryProps = {
  onClear?: () => void;
  clearLabel?: string;
  actions?: ReactNode;
  className?: string;
};

export function PortalFilterSummary({
  onClear,
  clearLabel = "Clear filters",
  actions,
  className,
}: PortalFilterSummaryProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-wrap items-end justify-end gap-2.5 px-1.5 max-[640px]:w-full max-[640px]:justify-stretch",
        className,
      )}
    >
      {onClear ? (
        <Button
          type="button"
          variant="secondary"
          className="h-10 rounded-[10px] px-4 text-[0.86rem] font-black max-[640px]:w-full"
          onClick={onClear}
        >
          {clearLabel}
        </Button>
      ) : null}
      {actions ? (
        <div className="flex flex-wrap items-center justify-end gap-2.5 max-[640px]:w-full max-[640px]:justify-stretch [&_[data-slot=button]]:max-[640px]:flex-1">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
