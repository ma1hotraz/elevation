import { useEffect } from "react";
import { BookOpen, ClipboardList, FolderOpen, Link as LinkIcon, LogOut, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { portalKicker, portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

type AdminSidebarProps = {
  portal: PortalController;
};

function getNavItems(portal: PortalController) {
  const role = portal.currentUser?.role;

  if (role === "teacher") {
    return [
      {
        key: "overview" as const,
        label: "Overview",
        icon: <ClipboardList aria-hidden="true" className="h-[17px] w-[17px]" />,
        onClick: () => portal.setActiveAdminView("overview"),
      },
      {
        key: "create-test" as const,
        label: "Create Test",
        icon: <BookOpen aria-hidden="true" className="h-[17px] w-[17px]" />,
        onClick: () => {
          portal.setActiveAdminView("create-test");
          portal.openResourceDialog();
        },
      },
      {
        key: "add-resource" as const,
        label: "Add Resources",
        icon: <FolderOpen aria-hidden="true" className="h-[17px] w-[17px]" />,
        onClick: () => {
          portal.setActiveAdminView("add-resource");
          portal.openResourceDialog();
        },
      },
      {
        key: "students" as const,
        label: "Students",
        icon: <Users aria-hidden="true" className="h-[17px] w-[17px]" />,
        onClick: () => portal.setActiveAdminView("students"),
      },
    ];
  }

  if (role === "student") {
    return [
      {
        key: "profile" as const,
        label: "Profile",
        icon: <User aria-hidden="true" className="h-[17px] w-[17px]" />,
        onClick: () => portal.setActiveAdminView("profile"),
      },
      {
        key: "performance" as const,
        label: "Performance",
        icon: <ClipboardList aria-hidden="true" className="h-[17px] w-[17px]" />,
        onClick: () => portal.setActiveAdminView("performance"),
      },
      {
        key: "resources" as const,
        label: "Resources",
        icon: <FolderOpen aria-hidden="true" className="h-[17px] w-[17px]" />,
        onClick: () => portal.setActiveAdminView("resources"),
      },
      {
        key: "live-test" as const,
        label: "Live Test",
        icon: <LinkIcon aria-hidden="true" className="h-[17px] w-[17px]" />,
        onClick: () => portal.setActiveAdminView("live-test"),
      },
    ];
  }

  return [
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
      onClick: () => {
        portal.setActiveAdminView("library");
        portal.openResourceDialog();
      },
    },
    {
      key: "students" as const,
      label: "Students",
      icon: <Users aria-hidden="true" className="h-[17px] w-[17px]" />,
      onClick: () => portal.setActiveAdminView("students"),
    },
  ];
}

export function AdminSidebar({ portal }: AdminSidebarProps) {
  const currentUser = portal.currentUser;
  const userInitials =
    currentUser?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "EA";

  const navItems = getNavItems(portal);
  const role = currentUser?.role ?? "admin";

  const latestLabel =
    role === "student"
      ? "Keep an eye on your latest resources"
      : role === "teacher"
        ? "Create tests and resources from here"
        : "Add the first test link";

  return (
    <aside className={portalStyles.adminSidebar} aria-label="Portal navigation">
      <div className={portalStyles.sidebarTop}>
        <a href="/" className={portalStyles.sidebarBrand}>
          <img src="/logo2.png" alt="Elevation Institute" className={portalStyles.sidebarLogo} />
        </a>

        <div className={portalStyles.sidebarNavGroup}>
          <p className={cn(portalKicker, portalStyles.sidebarKicker)}>Workspace</p>
          <nav className={portalStyles.sidebarNav}>
            {navItems.map((item) => {
              const isActive =
                item.key === "add-link" || item.key === "create-test" || item.key === "add-resource"
                  ? portal.isResourceDialogOpen
                  : portal.activeAdminView === item.key;

              return (
                <Button
                  key={item.key}
                  type="button"
                  variant="ghost"
                  data-active={isActive}
                  className={cn(portalStyles.sidebarItemBase, isActive && portalStyles.sidebarItemActive)}
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className={portalStyles.sidebarLatestCard}>
          <strong>{portal.latestResource?.title ?? "No resources yet"}</strong>
          <span>{portal.latestResource ? `${portal.latestResource.status} ${portal.latestResource.category}` : latestLabel}</span>
        </div>
      </div>

      <div className={portalStyles.sidebarFooter}>
        <div className={portalStyles.sidebarAccount}>
          <div className={portalStyles.sidebarAvatar} aria-hidden="true">
            {userInitials}
          </div>
          <div className={portalStyles.sidebarUserMeta}>
            <p>Signed in as</p>
            <strong>{currentUser?.name ?? "Portal User"}</strong>
            <span>{currentUser?.email ?? "user@elevation.test"}</span>
          </div>
          <span className={portalStyles.sidebarRoleBadge}>{role}</span>
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
