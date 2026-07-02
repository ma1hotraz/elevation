import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { portalStyles } from "../portalShared";

export function PortalField({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(portalStyles.formField, className)} {...props} />;
}
