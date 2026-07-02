import { portalShell, portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";
import { AdminSidebar } from "./AdminSidebar";
import { AdminOverview } from "./AdminOverview";
import { ResourceLibraryPanel } from "./ResourceLibraryPanel";
import { ResourceFormCard } from "./ResourceFormCard";
import { StudentManagementPanel } from "./StudentManagementPanel";
import { StudentDialogs } from "./StudentDialogs";

type AdminPortalScreenProps = {
  portal: PortalController;
};

export function AdminPortalScreen({ portal }: AdminPortalScreenProps) {
  return (
    <main className={portalShell}>
      <section className={portalStyles.adminGrid}>
        <AdminSidebar portal={portal} />

        <div className="min-w-0 px-6 py-6 sm:px-8 lg:px-10 xl:px-12">
          {portal.activeAdminView === "overview" ? <AdminOverview portal={portal} /> : null}
          {portal.activeAdminView === "library" ? <ResourceLibraryPanel portal={portal} /> : null}
          {portal.activeAdminView === "add-link" ? <ResourceFormCard portal={portal} /> : null}
          {portal.activeAdminView === "students" ? <StudentManagementPanel portal={portal} /> : null}
        </div>
      </section>

      <StudentDialogs portal={portal} />
    </main>
  );
}
