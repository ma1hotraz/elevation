import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type PortalTabsProps = ComponentProps<typeof Tabs> & {
  className?: string;
};

function PortalTabs({ className, ...props }: PortalTabsProps) {
  return <Tabs className={cn("grid gap-4", className)} {...props} />;
}

function PortalTabsList({
  className,
  ...props
}: ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      variant="line"
      className={cn(
        "w-full justify-start rounded-[12px] border border-[rgba(8,47,43,0.08)] bg-white p-1",
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
        "h-9 rounded-[10px] px-4 text-[0.88rem] font-black text-[#61767b] data-active:bg-[#e9fbf5] data-active:text-[#087365]",
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
