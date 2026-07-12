import type { ReactNode } from "react";
import { ArrowUpRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "../usePortalToast";

/**
 * Shared, app-wide stat/info primitives. Every portal screen renders its
 * metric, pulse, highlight, info, and action cards through these so the
 * visual language stays identical across admin, teacher, and student views.
 */

const metricSurface =
  "rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4 shadow-[0_14px_34px_rgba(9,72,69,0.04)]";

const softSurface =
  "rounded-[20px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#f8fcfb)] p-4 shadow-[0_16px_40px_rgba(9,72,69,0.06)]";

const heroSurface =
  "relative overflow-hidden rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(116,237,198,0.24),transparent_24%),linear-gradient(135deg,#083f3b_0%,#0b5d54_54%,#11806e_100%)] p-6 text-white shadow-[0_26px_72px_rgba(4,39,36,0.18)]";

const pageHeaderSurface =
  "relative overflow-hidden rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(116,237,198,0.18),transparent_24%),linear-gradient(180deg,#ffffff,#f7fbfa)] p-5 shadow-[0_22px_60px_rgba(9,72,69,0.08)]";

export function PortalPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-[rgba(8,47,43,0.08)] bg-white p-[18px] shadow-[0_20px_58px_rgba(9,72,69,0.06)]", className)}>
      {children}
    </section>
  );
}

export function PortalSectionHeader({
  eyebrow,
  title,
  lead,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-4 max-[640px]:flex-col", className)}>
      <div>
        {eyebrow ? <p className="mb-2 mt-0 text-[0.74rem] font-black uppercase tracking-[0.14em] text-[#087365]">{eyebrow}</p> : null}
        <h2 className="m-0 text-[1.28rem] font-black tracking-normal text-[#10252b]">{title}</h2>
        {lead ? <p className="m-0 mt-2 max-w-2xl text-[0.94rem] leading-[1.6] text-[#627579]">{lead}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap justify-end gap-2.5 max-[640px]:w-full max-[640px]:flex-col max-[640px]:items-stretch">{actions}</div> : null}
    </div>
  );
}

export function PortalPageHeader({
  eyebrow,
  title,
  lead,
  actions,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(pageHeaderSurface, className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#0d7b68]">{eyebrow}</p>
          <h1 className="m-0 mt-2 text-[1.65rem] font-black leading-tight tracking-[-0.04em] text-[#10252b]">{title}</h1>
          {lead ? <p className="m-0 mt-3 max-w-2xl text-[0.94rem] leading-[1.65] text-[#627579]">{lead}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center justify-end gap-2.5 max-[640px]:w-full max-[640px]:flex-col">{actions}</div> : null}
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

export function PortalHero({
  eyebrow,
  title,
  lead,
  actions,
  metrics,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  actions?: ReactNode;
  metrics?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className={heroSurface}>
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="m-0 text-[0.74rem] font-black uppercase tracking-[0.16em] text-[#9df4d6]">{eyebrow}</p>
          <h1 className="m-0 mt-3 text-[clamp(2rem,3.3vw,3rem)] font-black leading-[0.98] tracking-[-0.05em]">{title}</h1>
          {lead ? <p className="m-0 mt-3 max-w-2xl text-[0.98rem] leading-[1.7] text-white/82">{lead}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2.5 max-[640px]:w-full max-[640px]:flex-col">{actions}</div> : null}
      </div>
      {metrics ? <div className="relative z-10 mt-6 grid gap-3 lg:grid-cols-4 sm:grid-cols-2">{metrics}</div> : null}
      {children ? <div className="relative z-10 mt-5">{children}</div> : null}
      <div className="absolute inset-y-0 right-[-8%] hidden w-[34%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_66%)] blur-2xl lg:block" />
    </section>
  );
}

export function HeroMetric({
  label,
  value,
  icon,
  tone,
  detail,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: string;
  detail?: string;
}) {
  return (
    <article className="rounded-[20px] border border-white/10 bg-white/[0.08] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        {icon ? <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-white/[0.14] text-[#9df4d6]">{icon}</span> : null}
        {tone ? <span className="rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-[0.64rem] font-black uppercase tracking-[0.14em] text-white/72">{tone}</span> : null}
      </div>
      <strong className="mt-5 block text-[1.85rem] font-black leading-none tracking-[-0.05em]">{value}</strong>
      <span className="mt-2 block text-[0.82rem] font-bold text-white/72">{label}</span>
      {detail ? <p className="m-0 mt-2 text-[0.82rem] leading-[1.5] text-white/62">{detail}</p> : null}
    </article>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <article className={metricSurface}>
      <div className="flex items-start justify-between gap-3">
        <span className="block text-[0.8rem] font-bold text-[#627579]">{label}</span>
        {icon ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-[#e9fbf5] text-[#087365] [&_svg]:h-5 [&_svg]:w-5">
            {icon}
          </span>
        ) : null}
      </div>
      <strong className="mt-2 block text-[1.6rem] font-black leading-none tracking-[-0.05em] text-[#10252b]">
        {value}
      </strong>
      {detail ? <p className="m-0 mt-2 text-[0.84rem] leading-[1.5] text-[#627579]">{detail}</p> : null}
    </article>
  );
}

export function PulseCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <article className={metricSurface}>
      <span className="text-[0.74rem] font-black uppercase tracking-[0.14em] text-[#0d7b68]">{title}</span>
      <strong className="mt-3 block text-[1.5rem] font-black leading-none tracking-[-0.05em] text-[#10252b]">
        {value}
      </strong>
      <p className="m-0 mt-2 text-[0.86rem] leading-[1.55] text-[#627579]">{detail}</p>
    </article>
  );
}

export function HighlightCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className={softSurface}>
      <div className="flex items-center gap-2 text-[#0d7b68]">
        <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[#e9fbf5]">{icon}</span>
        <strong className="text-[0.92rem] font-black text-[#10252b]">{title}</strong>
      </div>
      <p className="m-0 mt-3 text-[0.92rem] leading-[1.65] text-[#627579]">{body}</p>
    </article>
  );
}

export function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <article className={metricSurface}>
      <span className="text-[0.74rem] font-black uppercase tracking-[0.14em] text-[#0d7b68]">{label}</span>
      <p className="m-0 mt-2 text-[0.98rem] font-black text-[#10252b]">{value}</p>
    </article>
  );
}

export function ActionCard({
  title,
  body,
  actionLabel,
  onClick,
}: {
  title: string;
  body: string;
  actionLabel: string;
  onClick: () => void;
}) {
  return (
    <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-4">
      <strong className="block text-[0.98rem] text-[#10252b]">{title}</strong>
      <p className="m-0 mt-2 text-[0.9rem] leading-[1.6] text-[#627579]">{body}</p>
      <Button type="button" variant="secondary" className="mt-4" icon={<ArrowUpRight />} onClick={onClick}>
        {actionLabel}
      </Button>
    </article>
  );
}

export function PortalEmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="m-0 rounded-xl border border-dashed border-[rgba(8,47,43,0.18)] bg-white/60 p-[18px]">
      <strong className="block text-[0.94rem] text-[#10252b]">{title}</strong>
      {body ? <p className="m-0 mt-1 text-[0.88rem] leading-[1.55] text-[#708084]">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function PortalStatusBadge({
  status,
  tone = "neutral",
  className,
}: {
  status: string;
  tone?: "success" | "warning" | "danger" | "neutral" | "info";
  className?: string;
}) {
  const toneClass = {
    success: "bg-[#e9fbf1] text-[#16845f]",
    warning: "bg-[#fff6e7] text-[#b96800]",
    danger: "bg-[#fff0f1] text-[#cf4c5a]",
    neutral: "bg-[#eef2f2] text-[#5f7378]",
    info: "bg-[#e9fbf5] text-[#087365]",
  }[tone];

  return (
    <span className={cn("inline-flex min-h-[26px] items-center rounded-full px-2.5 py-1 text-[0.72rem] font-black leading-none", toneClass, className)}>
      {status}
    </span>
  );
}

export function PortalCopyButton({
  value,
  label = "Copy",
  ariaLabel,
  copiedTitle = "Copied",
  copiedDescription,
  className,
}: {
  value: string;
  label?: string;
  ariaLabel?: string;
  copiedTitle?: string;
  copiedDescription?: string;
  className?: string;
}) {
  const toast = useToast();

  function copyValue() {
    void navigator.clipboard
      .writeText(value)
      .then(() => toast.success(copiedTitle, copiedDescription ?? value))
      .catch(() => toast.error("Copy failed", "Your browser blocked clipboard access."));
  }

  return (
    <Button
      type="button"
      variant="secondary"
      icon={<Copy aria-hidden="true" />}
      className={className}
      aria-label={ariaLabel ?? label}
      title={ariaLabel ?? label}
      onClick={copyValue}
    >
      {label}
    </Button>
  );
}

export function PortalConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <DialogContent className="max-w-[460px] gap-0 overflow-hidden rounded-[18px] border border-[rgba(8,47,43,0.12)] bg-white p-0 text-[#10252b] shadow-[0_30px_96px_rgba(4,39,36,0.28)]" showCloseButton>
        <div className="border-b border-[#e5eeec] px-6 py-4">
          <DialogHeader className="gap-1">
            <DialogTitle className="m-0 text-[1.18rem] font-black leading-tight tracking-normal text-[#10252b]">{title}</DialogTitle>
            <DialogDescription className="m-0 text-[0.92rem] font-medium leading-[1.55] text-[#627579]">{description}</DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2.5 bg-[#fbfefd] px-6 py-4 max-[640px]:flex-col-reverse max-[640px]:items-stretch">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={destructive ? "destructive" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
