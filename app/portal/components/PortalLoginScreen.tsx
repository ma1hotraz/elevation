import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, BookOpen, ChartNoAxesCombined, Eye, EyeOff, GraduationCap, LogIn, ShieldCheck, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { portalStyles } from "../portalShared";
import type { PortalController } from "../usePortalState";
import { PortalField } from "./PortalField";

type PortalLoginScreenProps = {
  portal: PortalController;
};

export function PortalLoginScreen({ portal }: PortalLoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    portal.handleLogin(event);
  }

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
          <p className="mb-[26px] border-l-2 border-[#79eecd]/70 pl-4 text-[0.76rem] font-black uppercase tracking-[0.16em] text-[#8ff4d1] max-[520px]:mb-[18px] max-[520px]:pl-[10px] max-[520px]:text-[0.62rem] max-[520px]:leading-[1.45] max-[520px]:tracking-[0.11em]">
            Focused access for every learner
          </p>

          <h1
            className="m-0 max-w-[14ch] text-[clamp(3.15rem,4.1vw,4.8rem)] leading-[1.01] tracking-[-0.03em] text-white max-[860px]:max-w-full max-[860px]:text-[clamp(2.55rem,7.6vw,3.7rem)] max-[520px]:text-[clamp(2.1rem,9.2vw,2.9rem)]"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            Access everything, you need to <span className="text-[#74edc6] drop-shadow-[0_20px_70px_rgba(101,228,196,0.22)]">succeed</span>
          </h1>

          <p className="mt-[26px] mb-[26px] max-w-[520px] text-[1.02rem] leading-[1.74] tracking-[0.01em] text-white/84 max-[860px]:max-w-[620px] max-[860px]:text-[1rem] max-[860px]:leading-[1.7] max-[520px]:mt-[17px] max-[520px]:mb-5 max-[520px]:max-w-[36ch] max-[520px]:text-[0.91rem] max-[520px]:leading-[1.6]">
            Find course resources, live test links, previous tests, study materials, and results in one place.
          </p>

          <div className="mt-[22px] grid w-full max-w-[700px] grid-cols-4 gap-0 max-[760px]:grid-cols-2 max-[520px]:hidden">
            <FeatureTile icon={<BookOpen aria-hidden="true" />} title={"Course\nResources"} />
            <FeatureTile icon={<Target aria-hidden="true" />} title={"Live Tests &\nPrevious Tests"} />
            <FeatureTile icon={<GraduationCap aria-hidden="true" />} title={"Study\nMaterials"} />
            <FeatureTile icon={<ChartNoAxesCombined aria-hidden="true" />} title={"Results &\nPerformance"} />
          </div>
        </div>

        <Card className={portalStyles.loginCard}>
          <CardHeader className="px-6 pb-3 pt-7 sm:px-8 sm:pt-8">
            <div className="grid justify-items-center gap-3 text-center">
              <div className={portalStyles.loginCardIcon}>
                <ShieldCheck aria-hidden="true" />
              </div>
              <CardTitle className={portalStyles.loginCardTitle}>Welcome back</CardTitle>
              <p className={portalStyles.loginCardSubtitle}>Sign in to your Elevation Institute account</p>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-7 pt-2 sm:px-8 sm:pb-8">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <PortalField>
                <Label className="text-[0.82rem] font-extrabold text-[#45595e]">Email</Label>
                <Input
                  type="email"
                  value={portal.email}
                  onChange={(event) => portal.setEmail(event.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="h-12 rounded-[12px] border-[#d6e3e1] bg-white px-4 text-[0.95rem] text-[#10252b] shadow-[inset_0_1px_0_rgba(16,37,43,0.02)] placeholder:text-[#8b9ca1] focus-visible:border-[#0d8a74] focus-visible:ring-[#0d8a74]/15"
                />
              </PortalField>

              <PortalField>
                <Label className="text-[0.82rem] font-extrabold text-[#45595e]">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={portal.password}
                    onChange={(event) => portal.setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-12 rounded-[12px] border-[#d6e3e1] bg-white pl-4 pr-12 text-[0.95rem] text-[#10252b] shadow-[inset_0_1px_0_rgba(16,37,43,0.02)] placeholder:text-[#8b9ca1] focus-visible:border-[#0d8a74] focus-visible:ring-[#0d8a74]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md border-0 bg-transparent p-0 text-[#5f7378] shadow-none transition hover:bg-[#eef7f5] hover:text-[#087365] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d8a74]/20"
                  >
                    {showPassword ? <EyeOff aria-hidden="true" className="h-4.5 w-4.5" /> : <Eye aria-hidden="true" className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </PortalField>

              <div className={portalStyles.loginFormRow}>
                <label className={portalStyles.loginRemember}>
                  <input type="checkbox" defaultChecked />
                  Remember me
                </label>
                <a href="#" className={portalStyles.loginForgot}>
                  Forgot password?
                </a>
              </div>

              {portal.error ? <p className={portalStyles.error}>{portal.error}</p> : null}

              <Button type="submit" variant="primary" className={cn(portalStyles.fullWidthButton, "h-12 rounded-[12px]")}> 
                <LogIn aria-hidden="true" />
                Sign In
              </Button>

              <div className={portalStyles.loginSecureDivider} aria-hidden="true">
                <ShieldCheck />
              </div>
              <p className={portalStyles.loginSecureText}>Secure access for students, teachers, and admins</p>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function FeatureTile({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="border-l border-white/10 px-[clamp(0.75rem,1.2vw,1.25rem)] first:border-l-0 last:pr-0 max-[520px]:border-l-0 max-[520px]:border-t max-[520px]:py-4 max-[520px]:first:border-t-0">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg border border-[#8ef1ce]/20 bg-white/[0.06] text-[#72edca] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <p className="m-0 max-w-[11rem] whitespace-pre-line text-[0.86rem] font-medium leading-[1.28] text-white/78">
        {title}
      </p>
    </div>
  );
}
