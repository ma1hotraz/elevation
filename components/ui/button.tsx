import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-[8px] border bg-clip-padding px-3 text-[12px] font-semibold leading-none whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] outline-none select-none focus-visible:ring-2 focus-visible:ring-[#0d7b68]/20 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        primary:
          "border-[#07695f] bg-[linear-gradient(180deg,#0b7f73_0%,#06695f_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(7,45,44,0.14)] hover:border-[#065d54] hover:bg-[linear-gradient(180deg,#08766b_0%,#055f57_100%)] hover:text-white",
        default:
          "border-[#07695f] bg-[linear-gradient(180deg,#0b7f73_0%,#06695f_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(7,45,44,0.14)] hover:border-[#065d54] hover:bg-[linear-gradient(180deg,#08766b_0%,#055f57_100%)] hover:text-white",
        outline:
          "border-[#e2e9e8] bg-[linear-gradient(180deg,#fbfefe_0%,#eef6f5_100%)] text-[#0b7366] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_1px_2px_rgba(9,72,69,0.05)] hover:border-[#d4e2e0] hover:bg-[linear-gradient(180deg,#f7fbfb_0%,#eaf3f1_100%)] hover:text-[#0b7366]",
        secondary:
          "border-[#e2e9e8] bg-[linear-gradient(180deg,#fbfefe_0%,#eef6f5_100%)] text-[#0b7366] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_1px_2px_rgba(9,72,69,0.05)] hover:border-[#d4e2e0] hover:bg-[linear-gradient(180deg,#f7fbfb_0%,#eaf3f1_100%)] hover:text-[#0b7366]",
        ghost:
          "border-transparent bg-transparent text-[#0b7366] shadow-none hover:bg-[#edf7f4] hover:text-[#0b7366]",
        destructive:
          "border-[rgba(180,35,24,0.12)] bg-[#fff2f1] text-[#b42318] shadow-none hover:bg-[#ffe6e4] hover:text-[#b42318]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-7 gap-1.5 rounded-[7px] px-2.5 text-[11px] in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-[8px] px-3 text-[12px] in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-8 gap-1.5 rounded-[8px] px-3 text-[12px] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        icon: "size-8 rounded-[8px]",
        "icon-xs":
          "size-7 rounded-[7px] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[8px] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-9 rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  children,
  icon,
  iconPosition = "start",
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    icon?: React.ReactNode
    iconPosition?: "start" | "end"
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const iconSlot = icon ? (
    <span
      aria-hidden="true"
      data-icon={`inline-${iconPosition}`}
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center"
    >
      {icon}
    </span>
  ) : null
  const renderedChildren = asChild ? children : (
    <>
      {iconPosition === "start" ? iconSlot : null}
      {children}
      {iconPosition === "end" ? iconSlot : null}
    </>
  )

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {renderedChildren}
    </Comp>
  )
}

export { Button, buttonVariants }
