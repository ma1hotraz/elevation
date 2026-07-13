import { portalShell, portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";
import { AdminSidebar } from "./AdminSidebar";
import { AdminOverview } from "./AdminOverview";
import { ResourceLibraryPanel } from "./ResourceLibraryPanel";
import { ResourceFormCard } from "./ResourceFormCard";
import { StudentManagementPanel } from "./StudentManagementPanel";
import { StudentDetailsPanel } from "./StudentDetailsPanel";
import { PaymentHistoryPanel } from "./PaymentHistoryPanel";
import { StudentDialogs } from "./StudentDialogs";
import { EnquiriesPanel } from "./EnquiriesPanel";

type AdminPortalScreenProps = {
  portal: PortalController;
};

export function AdminPortalScreen({ portal }: AdminPortalScreenProps) {
  return (
    <main className={portalShell}>
      <section className={portalStyles.adminGrid}>
        <AdminSidebar portal={portal} />

        <div className="min-w-0 px-6 py-6 sm:px-8 lg:px-10 xl:px-12">
          {portal.adminView === "overview" ? <AdminOverview portal={portal} /> : null}
          {portal.adminView === "library" ? (
            <ResourceLibraryPanel portal={portal} />
          ) : null}
          {portal.adminView === "accounts" && portal.selectedAccount ? (
            <StudentDetailsPanel portal={portal} />
          ) : null}
          {portal.adminView === "accounts" && !portal.selectedAccount ? (
            <StudentManagementPanel portal={portal} />
          ) : null}
          {portal.adminView === "payments" ? <PaymentHistoryPanel portal={portal} /> : null}
          {portal.adminView === "enquiries" ? <EnquiriesPanel portal={portal} /> : null}
        </div>
      </section>

      <ResourceFormCard portal={portal} />
      <StudentDialogs portal={portal} />
    </main>
  );
}

