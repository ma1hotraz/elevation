import { BookOpenCheck, KeyRound, Mail, Save, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalField } from "../PortalField";
import { COURSES } from "../../portal.data";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

type StudentDialogsProps = {
  portal: PortalController;
};

export function StudentDialogs({ portal }: StudentDialogsProps) {
  return (
    <>
      <Dialog open={portal.isAddStudentDialogOpen} onOpenChange={portal.setIsAddStudentDialogOpen}>
        <DialogContent className={portalStyles.dialogContent}>
          <div className={portalStyles.dialogHeader}>
            <DialogHeader className={portalStyles.dialogHeaderRow}>
              <DialogTitle className={portalStyles.dialogTitle}>Add Student</DialogTitle>
              <DialogDescription className={portalStyles.dialogDescription}>
                Create login access and choose the courses this student can view.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={portal.addStudent}>
            <div className={portalStyles.dialogBody}>
              <div className={portalStyles.dialogForm}>
                <div className={portalStyles.formGrid}>
                  <PortalField>
                    <Label className="text-[0.82rem] font-black text-[#45595e]">Student Name</Label>
                    <Input
                      className={portalStyles.dialogControl}
                      value={portal.studentForm.name}
                      onChange={(event) =>
                        portal.setStudentForm((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="Student name"
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
                      value={portal.studentForm.email}
                      onChange={(event) =>
                        portal.setStudentForm((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="student@email.com"
                      required
                    />
                  </PortalField>
                </div>

                <PortalField>
                  <Label className="inline-flex items-center gap-2 text-[0.82rem] font-black text-[#45595e]">
                    <KeyRound aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                    Password
                  </Label>
                  <Input
                    className={portalStyles.dialogControl}
                    value={portal.studentForm.password}
                    onChange={(event) =>
                      portal.setStudentForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Temporary password"
                    required
                  />
                </PortalField>

                <div className={portalStyles.dialogSection}>
                  <div className="flex items-center gap-2">
                    <BookOpenCheck aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                    <p className={portalStyles.dialogSectionTitle}>Course Access</p>
                  </div>
                  <div className={portalStyles.courseChoiceGrid}>
                    {COURSES.map((course) => (
                      <label key={course} className={portalStyles.courseChoice}>
                        <Checkbox
                          checked={portal.studentForm.courses.includes(course)}
                          onCheckedChange={() => portal.toggleStudentCourse(course)}
                        />
                        <span>{course}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={portalStyles.dialogFooter}>
              <Button
                type="button"
                variant="secondary"
                className="h-10 px-4 text-[0.85rem] font-black"
                icon={<X />}
                onClick={() => portal.setIsAddStudentDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="h-10 px-4 text-[0.85rem] font-black"
                icon={<UserPlus />}
              >
                Add Student
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(portal.editingStudentId)} onOpenChange={(open) => !open && portal.cancelEditingStudent()}>
        <DialogContent className={portalStyles.dialogContent}>
          <div className={portalStyles.dialogHeader}>
            <DialogHeader className={portalStyles.dialogHeaderRow}>
              <DialogTitle className={portalStyles.dialogTitle}>Edit Student</DialogTitle>
              <DialogDescription className={portalStyles.dialogDescription}>
                Update login details and course access for this student.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={portal.saveStudentEdit}>
            <div className={portalStyles.dialogBody}>
              <div className={portalStyles.dialogForm}>
                <div className={portalStyles.formGrid}>
                  <PortalField>
                    <Label className="text-[0.82rem] font-black text-[#45595e]">Student Name</Label>
                    <Input
                      className={portalStyles.dialogControl}
                      value={portal.editStudentForm.name}
                      onChange={(event) =>
                        portal.setEditStudentForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
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
                      value={portal.editStudentForm.email}
                      onChange={(event) =>
                        portal.setEditStudentForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      required
                    />
                  </PortalField>
                </div>

                <PortalField>
                  <Label className="inline-flex items-center gap-2 text-[0.82rem] font-black text-[#45595e]">
                    <KeyRound aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                    Password
                  </Label>
                  <Input
                    className={portalStyles.dialogControl}
                    value={portal.editStudentForm.password}
                    onChange={(event) =>
                      portal.setEditStudentForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    required
                  />
                </PortalField>

                <div className={portalStyles.dialogSection}>
                  <div className="flex items-center gap-2">
                    <BookOpenCheck aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                    <p className={portalStyles.dialogSectionTitle}>Course Access</p>
                  </div>
                  <div className={portalStyles.courseChoiceGrid}>
                    {COURSES.map((course) => (
                      <label key={course} className={portalStyles.courseChoice}>
                        <Checkbox
                          checked={portal.editStudentForm.courses.includes(course)}
                          onCheckedChange={() => portal.toggleEditStudentCourse(course)}
                        />
                        <span>{course}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={portalStyles.dialogFooter}>
              <Button
                type="button"
                variant="secondary"
                className="h-10 px-4 text-[0.85rem] font-black"
                icon={<X />}
                onClick={portal.cancelEditingStudent}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="h-10 px-4 text-[0.85rem] font-black"
                icon={<Save />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
