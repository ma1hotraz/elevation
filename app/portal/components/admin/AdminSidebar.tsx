import { ClipboardList, FolderOpen, KeyRound, LayoutDashboard, Link2, LogOut, ReceiptText, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { portalKicker, portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

type NavItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

function getNavItems(portal: PortalController): NavItem[] {
  const role = portal.currentUser?.role;

  if (role === "teacher") {
    return [
      {
        key: "overview",
        label: "Overview",
        icon: <LayoutDashboard aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.teacherView === "overview",
        onClick: () => portal.setTeacherView("overview"),
      },
      {
        key: "resources",
        label: "Resources",
        icon: <FolderOpen aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.teacherView === "resources",
        onClick: () => portal.setTeacherView("resources"),
      },
      {
        key: "students",
        label: "Students",
        icon: <Users aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.teacherView === "students",
        onClick: () => {
          portal.closeAccountDetails();
          portal.setTeacherView("students");
        },
      },
      {
        key: "profile",
        label: "Profile",
        icon: <User aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.teacherView === "profile",
        onClick: () => portal.setTeacherView("profile"),
      },
      {
        key: "security",
        label: "Security",
        icon: <KeyRound aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.teacherView === "security",
        onClick: () => portal.setTeacherView("security"),
      },
    ];
  }

  if (role === "student") {
    return [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.studentView === "dashboard",
        onClick: () => portal.setStudentView("dashboard"),
      },
      {
        key: "resources",
        label: "Resources",
        icon: <FolderOpen aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.studentView === "resources",
        onClick: () => portal.setStudentView("resources"),
      },
      {
        key: "live-tests",
        label: "Live Tests",
        icon: <Link2 aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.studentView === "live-tests",
        onClick: () => portal.setStudentView("live-tests"),
      },
      {
        key: "performance",
        label: "Performance",
        icon: <ClipboardList aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.studentView === "performance",
        onClick: () => portal.setStudentView("performance"),
      },
      {
        key: "payments",
        label: "Payments",
        icon: <ReceiptText aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.studentView === "payments",
        onClick: () => portal.setStudentView("payments"),
      },
      {
        key: "profile",
        label: "Profile",
        icon: <User aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.studentView === "profile",
        onClick: () => portal.setStudentView("profile"),
      },
      {
        key: "security",
        label: "Security",
        icon: <KeyRound aria-hidden="true" className="h-[17px] w-[17px]" />,
        active: portal.studentView === "security",
        onClick: () => portal.setStudentView("security"),
      },
    ];
  }

  return [
    {
      key: "overview",
      label: "Overview",
      icon: <LayoutDashboard aria-hidden="true" className="h-[17px] w-[17px]" />,
      active: portal.adminView === "overview",
      onClick: () => portal.setAdminView("overview"),
    },
    {
      key: "library",
      label: "Resources",
      icon: <FolderOpen aria-hidden="true" className="h-[17px] w-[17px]" />,
      active: portal.adminView === "library",
      onClick: () => portal.setAdminView("library"),
    },
    {
      key: "accounts",
      label: "Accounts",
      icon: <Users aria-hidden="true" className="h-[17px] w-[17px]" />,
      active: portal.adminView === "accounts",
      onClick: () => {
        portal.closeAccountDetails();
        portal.setAdminView("accounts");
      },
    },
    {
      key: "payments",
      label: "Payments",
      icon: <ReceiptText aria-hidden="true" className="h-[17px] w-[17px]" />,
      active: portal.adminView === "payments",
      onClick: () => portal.setAdminView("payments"),
    },
  ];
}

function getWorkspaceMeta(portal: PortalController) {
  const role = portal.currentUser?.role;

  if (role === "student") {
    return {
      label: "Student workspace",
      note: portal.hasCourseAccess ? "Your course links, tests, progress, and payments stay in one place." : "Your profile is active, but no course access has been assigned yet.",
    };
  }

  if (role === "teacher") {
    return {
      label: "Teacher workspace",
      note: portal.hasCourseAccess ? "Manage resources for your assigned courses and review student progress." : "Your profile is active, but no course access has been assigned yet.",
    };
  }

  return {
    label: "Admin workspace",
    note: "Create accounts, reset access, manage payments, and keep every course resource up to date.",
  };
}

export function AdminSidebar({ portal }: { portal: PortalController }) {
  const currentUser = portal.currentUser;
  const userInitials =
    currentUser?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "EA";

  const navItems = getNavItems(portal);
  const meta = getWorkspaceMeta(portal);
  const roleLabel = currentUser?.role ? `${currentUser.role.charAt(0).toUpperCase()}${currentUser.role.slice(1)} access` : "Admin access";

  return (
    <aside className={portalStyles.adminSidebar} aria-label="Portal navigation">
      <div className={portalStyles.sidebarTop}>
        <a href="/" className={portalStyles.sidebarBrand}>
          <img src="/logo2.png" alt="Elevation Institute" className={portalStyles.sidebarLogo} />
        </a>

        <div className={portalStyles.sidebarNavGroup}>
          <p className={cn(portalKicker, portalStyles.sidebarKicker)}>Workspace</p>
          <nav className={portalStyles.sidebarNav}>
            {navItems.map((item) => (
              <Button
                key={item.key}
                type="button"
                variant="ghost"
                data-active={item.active}
                className={cn(portalStyles.sidebarItemBase, item.active && portalStyles.sidebarItemActive)}
                onClick={item.onClick}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <div className={portalStyles.sidebarLatestCard}>
          <strong>{meta.label}</strong>
          <span>{meta.note}</span>
          {portal.latestResource ? (
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="border-white/15 bg-white/[0.05] text-white/85">
                {portal.latestResource.course}
              </Badge>
              <Badge variant="outline" className="border-white/15 bg-white/[0.05] text-white/85">
                {portal.latestResource.category}
              </Badge>
            </div>
          ) : null}
        </div>
      </div>

      <div className={portalStyles.sidebarFooter}>
        <div className={portalStyles.sidebarAccount}>
          <div className={portalStyles.sidebarAvatar} aria-hidden="true">
            {userInitials}
          </div>
          <div className={portalStyles.sidebarUserMeta}>
            <strong>{currentUser?.name ?? "Portal User"}</strong>
            <span>{roleLabel}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={portal.logout}
            className={portalStyles.sidebarSignOutButton}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
