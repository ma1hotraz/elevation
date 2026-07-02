import Link from "next/link";
import { ClipboardList, FolderOpen, Link as LinkIcon, LogOut, UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { portalKicker, portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

type AdminSidebarProps = {
  portal: PortalController;
};

export function AdminSidebar({ portal }: AdminSidebarProps) {
  const currentUser = portal.currentUser;
  const userInitials =
    currentUser?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "EA";

  const adminNavItems = [
    {
      key: "overview" as const,
      label: "Overview",
      icon: <ClipboardList aria-hidden="true" className="h-[17px] w-[17px]" />,
      onClick: () => portal.setActiveAdminView("overview"),
    },
    {
      key: "library" as const,
      label: "Resource Library",
      icon: <FolderOpen aria-hidden="true" className="h-[17px] w-[17px]" />,
      onClick: () => portal.setActiveAdminView("library"),
    },
    {
      key: "add-link" as const,
      label: "Add Test Link",
      icon: <LinkIcon aria-hidden="true" className="h-[17px] w-[17px]" />,
      onClick: () => portal.setActiveAdminView("add-link"),
    },
    {
      key: "student-add" as const,
      label: "Add Student",
      icon: <UserPlus aria-hidden="true" className="h-[17px] w-[17px]" />,
      onClick: () => portal.setIsAddStudentDialogOpen(true),
    },
    {
      key: "students" as const,
      label: "Students",
      icon: <Users aria-hidden="true" className="h-[17px] w-[17px]" />,
      onClick: () => portal.setActiveAdminView("students"),
    },
  ] as const;

  return (
    <aside className={portalStyles.adminSidebar} aria-label="Admin shortcuts">
      <div className={portalStyles.sidebarTop}>
        <Link href="/" className={portalStyles.sidebarBrand}>
          <img src="/logo2.png" alt="Elevation Institute" className={portalStyles.sidebarLogo} />
        </Link>

        <div className={portalStyles.sidebarNavGroup}>
          <p className={cn(portalKicker, portalStyles.sidebarKicker)}>Workspace</p>
          <nav className={portalStyles.sidebarNav}>
            {adminNavItems.map((item) => (
              <Button
                key={item.key}
                type="button"
                variant="ghost"
                data-active={portal.activeAdminView === item.key}
                className={cn(
                  portalStyles.sidebarItemBase,
                  portal.activeAdminView === item.key && portalStyles.sidebarItemActive,
                )}
                onClick={item.onClick}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <div className={portalStyles.sidebarLatestCard}>
          <strong>{portal.latestResource?.title ?? "No resources yet"}</strong>
          <span>
            {portal.latestResource ? `Latest ${portal.latestResource.category}` : "Add the first test link"}
          </span>
        </div>
      </div>

      <div className={portalStyles.sidebarFooter}>
        <div className={portalStyles.sidebarAccount}>
          <div className={portalStyles.sidebarAvatar} aria-hidden="true">
            {userInitials}
          </div>
          <div className={portalStyles.sidebarUserMeta}>
            <p>Signed in as</p>
            <strong>{currentUser?.name ?? "Admin User"}</strong>
            <span>{currentUser?.email ?? "admin@elevation.test"}</span>
          </div>
          <span className={portalStyles.sidebarRoleBadge}>{currentUser?.role ?? "admin"}</span>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={portal.logout}
          className={portalStyles.sidebarSignOutButton}
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
