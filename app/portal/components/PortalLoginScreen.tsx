import Link from "next/link";
import type { FormEvent } from "react";
import { ArrowLeft, LogIn, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { portalStyles } from "../portalShared";
import { PortalField } from "./PortalField";

type PortalLoginScreenProps = {
  email: string;
  password: string;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onResetDemo: () => void;
};

export function PortalLoginScreen({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onResetDemo,
}: PortalLoginScreenProps) {
  return (
    <main className={cn(portalStyles.page, portalStyles.loginPage)}>
      <header className={portalStyles.loginTopbar}>
        <Link href="/" className={portalStyles.logoRow}>
          <img src="/logo2.png" alt="Elevation Institute" className={portalStyles.loginLogo} />
        </Link>
        <Link href="/" className={portalStyles.loginBackLink}>
          <ArrowLeft aria-hidden="true" />
          Back to site
        </Link>
      </header>

      <section className={portalStyles.loginShell}>
        <div className={portalStyles.loginIntro}>
          <h1 className={portalStyles.loginIntroTitle}>
            Log in to access the Elevation <span className={portalStyles.loginHeadingAccent}>learning portal</span>
          </h1>
          <p className={portalStyles.loginIntroText}>
            Find course test links, previous tests, and revision materials in one organized place.
          </p>
          <div className={portalStyles.demoBox}>
            <strong>Demo logins</strong>
            <span>Admin: admin@elevation.test / admin123</span>
            <span>Student: riya@elevation.test / student123</span>
          </div>
        </div>

        <Card className={portalStyles.loginCard}>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <PortalField>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder="admin@elevation.test"
                  required
                />
              </PortalField>
              <PortalField>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder="admin123"
                  required
                />
              </PortalField>
              {error ? <p className={portalStyles.error}>{error}</p> : null}
              <Button type="submit" variant="primary" className={portalStyles.fullWidthButton}>
                <LogIn aria-hidden="true" />
                Sign In
              </Button>
              <Button type="button" variant="secondary" className={portalStyles.fullWidthButton} onClick={onResetDemo}>
                <RotateCcw aria-hidden="true" />
                Reset Demo Data
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
