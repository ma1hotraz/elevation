import { BookOpenCheck, ClipboardCheck, Mail, ShieldCheck, UserPlus, UserRoundCog, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PortalField } from "../PortalField";
import { PortalCopyButton } from "../PortalStat";
import { COURSES } from "../../portal.data";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

export function StudentDialogs({ portal }: { portal: PortalController }) {
  const isEditing = portal.accountDialogMode === "edit";
  const isTeacher = portal.accountForm.role === "teacher";

  return (
    <>
      <Dialog open={portal.accountDialogMode !== null} onOpenChange={(open) => !open && portal.closeAccountDialog()}>
        <DialogContent className={portalStyles.dialogContent} showCloseButton>
          <div className={portalStyles.dialogHeader}>
            <DialogHeader className={portalStyles.dialogHeaderRow}>
              <DialogTitle className={portalStyles.dialogTitle}>
                {isEditing ? "Edit account" : "Create account"}
              </DialogTitle>
              <DialogDescription className={portalStyles.dialogDescription}>
                {isEditing
                  ? "Update access, assigned courses, and contact details for this account."
                  : "Create a student or teacher account. The portal will generate a temporary password automatically."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={portal.saveAccount}>
            <div className={portalStyles.dialogBody}>
              <div className={portalStyles.dialogForm}>
                {!isEditing ? (
                  <PortalField>
                    <Label className="inline-flex items-center gap-2 text-[0.82rem] font-black text-[#45595e]">
                      <UserRoundCog aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                      Role
                    </Label>
                    <Select
                      value={portal.accountForm.role}
                      onValueChange={(value) =>
                        portal.setAccountForm((current) => ({
                          ...current,
                          role: value as "student" | "teacher",
                          guardianName: value === "teacher" ? "" : current.guardianName,
                          courses: current.courses.length ? current.courses : value === "teacher" ? ["PCM"] : ["IELTS"],
                        }))
                      }
                    >
                      <SelectTrigger className={`${portalStyles.dialogControl} w-full justify-between`}>
                        <SelectValue placeholder="Choose role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                  </PortalField>
                ) : (
                  <div className="rounded-[12px] border border-[#d8e6e3] bg-[#fbfefd] px-4 py-3">
                    <span className="text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#0d7b68]">Role</span>
                    <p className="mt-2 text-[0.95rem] font-black text-[#10252b]">{portal.accountForm.role}</p>
                  </div>
                )}

                <div className={portalStyles.formGrid}>
                  <PortalField>
                    <Label className="text-[0.82rem] font-black text-[#45595e]">
                      {isTeacher ? "Teacher Name" : "Student Name"}
                    </Label>
                    <Input
                      className={portalStyles.dialogControl}
                      value={portal.accountForm.name}
                      onChange={(event) =>
                        portal.setAccountForm((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder={isTeacher ? "Teacher name" : "Student name"}
                      required
                    />
                  </PortalField>
                  <PortalField>
                    <Label className="inline-flex items-center gap-2 text-[0.82rem] font-black text-[#45595e]">
                      <Mail aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                      Email
                    </Label>
                    <Input
                      className={portalStyles.dialogControl}
                      type="email"
                      value={portal.accountForm.email}
                      onChange={(event) =>
                        portal.setAccountForm((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder={isTeacher ? "teacher@email.com" : "student@email.com"}
                      required
                    />
                  </PortalField>
                </div>

                <div className={portalStyles.formGrid}>
                  <PortalField>
                    <Label className="text-[0.82rem] font-black text-[#45595e]">Phone</Label>
                    <Input
                      className={portalStyles.dialogControl}
                      value={portal.accountForm.phone}
                      onChange={(event) =>
                        portal.setAccountForm((current) => ({ ...current, phone: event.target.value }))
                      }
                      placeholder="+91 98..."
                    />
                  </PortalField>
                  <PortalField>
                    <Label className="text-[0.82rem] font-black text-[#45595e]">Status</Label>
                    <Select
                      value={portal.accountForm.accountStatus}
                      onValueChange={(value) =>
                        portal.setAccountForm((current) => ({
                          ...current,
                          accountStatus: value as "active" | "suspended",
                        }))
                      }
                    >
                      <SelectTrigger className={`${portalStyles.dialogControl} w-full justify-between`}>
                        <SelectValue placeholder="Choose status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </PortalField>
                </div>

                <PortalField>
                  <Label className="text-[0.82rem] font-black text-[#45595e]">Address</Label>
                  <Input
                    className={portalStyles.dialogControl}
                    value={portal.accountForm.address}
                    onChange={(event) =>
                      portal.setAccountForm((current) => ({ ...current, address: event.target.value }))
                    }
                    placeholder="City, state"
                  />
                </PortalField>

                {!isTeacher ? (
                  <PortalField>
                    <Label className="text-[0.82rem] font-black text-[#45595e]">Guardian Name</Label>
                    <Input
                      className={portalStyles.dialogControl}
                      value={portal.accountForm.guardianName}
                      onChange={(event) =>
                        portal.setAccountForm((current) => ({ ...current, guardianName: event.target.value }))
                      }
                      placeholder="Guardian or parent name"
                    />
                  </PortalField>
                ) : null}

                <div className={portalStyles.dialogSection}>
                  <div className="flex items-center gap-2">
                    <BookOpenCheck aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                    <p className={portalStyles.dialogSectionTitle}>Course Access</p>
                  </div>
                  <div className={portalStyles.courseChoiceGrid}>
                    {COURSES.map((course) => (
                      <label key={course} className={portalStyles.courseChoice}>
                        <Checkbox
                          checked={portal.accountForm.courses.includes(course)}
                          onCheckedChange={() => portal.toggleAccountCourse(course)}
                        />
                        <span>{course}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {portal.accountDialogError ? (
                  <p className="m-0 rounded-[12px] border border-[#f2d3d8] bg-[#fff7f8] px-4 py-3 text-[0.88rem] font-semibold text-[#b42318]">
                    {portal.accountDialogError}
                  </p>
                ) : null}

                {!isEditing ? (
                  <div className="rounded-[12px] border border-[#d8e6e3] bg-[#fbfefd] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                      <span className="text-[0.82rem] font-black text-[#10252b]">Temporary password flow</span>
                    </div>
                    <p className="mt-2 text-[0.86rem] leading-[1.6] text-[#5f7378]">
                      The portal will generate a temporary password automatically and force the user to reset it on first sign-in.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className={portalStyles.dialogFooter}>
              <Button
                type="button"
                variant="secondary"
                className="h-10 px-4 text-[0.85rem] font-black"
                icon={<X />}
                onClick={portal.closeAccountDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="h-10 px-4 text-[0.85rem] font-black"
                icon={isEditing ? <ClipboardCheck /> : <UserPlus />}
              >
                {isEditing ? "Save Changes" : "Create Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(portal.credentialNotice)} onOpenChange={(open) => !open && portal.dismissCredentialNotice()}>
        <DialogContent className={portalStyles.dialogContent} showCloseButton>
          <div className={portalStyles.dialogHeader}>
            <DialogHeader className={portalStyles.dialogHeaderRow}>
              <DialogTitle className={portalStyles.dialogTitle}>Temporary password ready</DialogTitle>
              <DialogDescription className={portalStyles.dialogDescription}>
                Share these credentials securely. The user will be prompted to create a new password on first login.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className={portalStyles.dialogBody}>
            <div className="grid gap-4">
              <div className="grid gap-2 rounded-[14px] border border-[#d8e6e3] bg-[#fbfefd] p-4">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#0d7b68]">Account</span>
                <strong className="text-[1rem] text-[#10252b]">{portal.credentialNotice?.name}</strong>
                <span className="text-[0.9rem] text-[#5f7378]">{portal.credentialNotice?.email}</span>
              </div>

              <div className="grid gap-2 rounded-[14px] border border-[#d8e6e3] bg-white p-4">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#0d7b68]">Temporary password</span>
                <div className="flex flex-wrap items-center gap-3">
                  <code className="rounded-[10px] bg-[#f4faf8] px-3 py-2 text-[1rem] font-black text-[#10252b]">
                    {portal.credentialNotice?.temporaryPassword}
                  </code>
                  <PortalCopyButton
                    value={portal.credentialNotice?.temporaryPassword ?? ""}
                    copiedTitle="Temporary password copied"
                    copiedDescription={portal.credentialNotice?.email}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={portalStyles.dialogFooter}>
            <Button type="button" onClick={portal.dismissCredentialNotice}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

