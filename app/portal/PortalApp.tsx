"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Database, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPortalScreen } from "./components/admin/AdminPortalScreen";
import { PortalLoginScreen } from "./components/PortalLoginScreen";
import { PortalStudentScreen } from "./components/PortalStudentScreen";
import { TeacherPortalScreen } from "./components/TeacherPortalScreen";
import { PortalConfirmDialog } from "./components/PortalStat";
import { usePortalState } from "./usePortalState";
import { ToastProvider } from "./usePortalToast";

export function PortalApp() {
  return (
    <ToastProvider>
      <PortalRoot />
    </ToastProvider>
  );
}

function PortalRoot() {
  const portal = usePortalState();

  if (portal.isInitializing) {
    return (
      <PortalStatusCard
        icon={<LoaderCircle className="animate-spin" aria-hidden="true" />}
        title="Preparing your workspace"
        description="Verifying your secure session and loading the latest portal data."
      />
    );
  }

  if (portal.configurationError) {
    return (
      <PortalStatusCard
        icon={<Database aria-hidden="true" />}
        title="Connect Supabase to continue"
        description={portal.configurationError}
        detail="Copy .env.example to .env.local, add your project values, run the database migration, and restart the app."
        action={
          <Button asChild variant="secondary" icon={<ArrowLeft aria-hidden="true" />}>
            <Link href="/">Back to website</Link>
          </Button>
        }
      />
    );
  }

  if (portal.fatalError && portal.currentUser) {
    return (
      <PortalStatusCard
        icon={<AlertTriangle aria-hidden="true" />}
        title="We could not load the portal"
        description={portal.fatalError}
        detail="Your account is still secure. Retry the request, or sign out and contact an administrator if the issue continues."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={portal.retry} icon={<RefreshCw aria-hidden="true" />}>Retry</Button>
            <Button variant="secondary" onClick={portal.logout}>Sign out</Button>
          </div>
        }
      />
    );
  }

  if (!portal.currentUser || portal.authView === "password-reset") {
    return (
      <>
        <PortalLoginScreen portal={portal} />
        <PortalConfirmationRoot portal={portal} />
      </>
    );
  }

  if (portal.currentUser.role === "student") {
    return (
      <>
        <PortalStudentScreen portal={portal} />
        <PortalConfirmationRoot portal={portal} />
      </>
    );
  }

  if (portal.currentUser.role === "teacher") {
    return (
      <>
        <TeacherPortalScreen portal={portal} />
        <PortalConfirmationRoot portal={portal} />
      </>
    );
  }

  return (
    <>
      <AdminPortalScreen portal={portal} />
      <PortalConfirmationRoot portal={portal} />
    </>
  );
}

function PortalStatusCard({
  icon,
  title,
  description,
  detail,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  detail?: string;
  action?: React.ReactNode;
}) {
  return (
    <main className="grid min-h-svh place-items-center bg-[radial-gradient(circle_at_top,rgba(116,237,198,0.18),transparent_28rem),linear-gradient(145deg,#073d39,#041f1d)] p-5">
      <section className="w-full max-w-[560px] rounded-[28px] border border-white/12 bg-white p-7 text-center shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e9fbf5] text-[#087365] [&_svg]:h-6 [&_svg]:w-6">
          {icon}
        </div>
        <h1 className="mb-0 mt-5 text-[clamp(1.65rem,5vw,2.2rem)] font-black tracking-[-0.05em] text-[#10252b]">{title}</h1>
        <p className="mx-auto mb-0 mt-3 max-w-[44ch] text-[0.96rem] leading-[1.65] text-[#5f7378]">{description}</p>
        {detail ? <p className="mx-auto mb-0 mt-3 max-w-[48ch] text-[0.84rem] leading-[1.6] text-[#7b8b8f]">{detail}</p> : null}
        {action ? <div className="mt-6">{action}</div> : null}
      </section>
    </main>
  );
}

function PortalConfirmationRoot({ portal }: { portal: ReturnType<typeof usePortalState> }) {
  const confirmation = portal.confirmation;

  return (
    <PortalConfirmDialog
      open={Boolean(confirmation)}
      title={confirmation?.title ?? ""}
      description={confirmation?.description ?? ""}
      confirmLabel={confirmation?.confirmLabel ?? "Confirm"}
      destructive={confirmation?.destructive}
      onCancel={portal.cancelConfirmation}
      onConfirm={() => void portal.confirmPendingAction()}
    />
  );
}
