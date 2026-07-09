import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type PortalTabsProps = ComponentProps<typeof Tabs> & {
  className?: string;
};

function PortalTabs({ className, ...props }: PortalTabsProps) {
  return <Tabs className={cn("grid gap-5", className)} {...props} />;
}

function PortalTabsList({
  className,
  ...props
}: ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      variant="line"
      className={cn(
        "w-full justify-start gap-1.5 rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-1.5 shadow-[0_10px_28px_rgba(9,72,69,0.04)]",
        className,
      )}
      {...props}
    />
  );
}

function PortalTabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        "h-10 rounded-[11px] px-5 text-[0.92rem] font-black text-[#718287] data-active:bg-white data-active:text-[#0b7a67] data-active:shadow-[0_8px_20px_rgba(9,72,69,0.05)]",
        className,
      )}
      {...props}
    />
  );
}

function PortalTabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsContent>) {
  return <TabsContent className={cn("outline-none", className)} {...props} />;
}

export { PortalTabs, PortalTabsList, PortalTabsTrigger, PortalTabsContent };
