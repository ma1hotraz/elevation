"use client";

import { AdminPortalScreen } from "./components/admin/AdminPortalScreen";
import { PortalLoginScreen } from "./components/PortalLoginScreen";
import { PortalStudentScreen } from "./components/PortalStudentScreen";
import { TeacherPortalScreen } from "./components/TeacherPortalScreen";
import { usePortalState } from "./usePortalState";

export function PortalApp() {
  const portal = usePortalState();

  if (!portal.currentUser) {
    return <PortalLoginScreen portal={portal} />;
  }

  if (portal.currentUser.role === "student") {
    return <PortalStudentScreen portal={portal} />;
  }

  if (portal.currentUser.role === "teacher") {
    return <TeacherPortalScreen portal={portal} />;
  }

  return <AdminPortalScreen portal={portal} />;
}
