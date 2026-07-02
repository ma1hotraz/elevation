"use client";

import { PortalLoginScreen } from "./components/PortalLoginScreen";
import { AdminPortalScreen } from "./components/admin/AdminPortalScreen";
import { PortalStudentScreen } from "./components/PortalStudentScreen";
import { usePortalState } from "./usePortalState";

export function PortalApp() {
  const portal = usePortalState();

  if (!portal.currentUser) {
    return (
      <PortalLoginScreen
        email={portal.email}
        password={portal.password}
        error={portal.error}
        onEmailChange={portal.setEmail}
        onPasswordChange={portal.setPassword}
        onSubmit={portal.handleLogin}
        onResetDemo={portal.resetDemoData}
      />
    );
  }

  return portal.currentUser.role === "admin" ? (
    <AdminPortalScreen portal={portal} />
  ) : (
    <PortalStudentScreen portal={portal} />
  );
}
