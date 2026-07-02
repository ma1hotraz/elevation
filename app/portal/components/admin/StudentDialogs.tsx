import { Save, UserPlus, X } from "lucide-react";
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
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Create login access and choose the courses this student can view.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={portal.addStudent}>
            <PortalField>
              <Label>Student Name</Label>
              <Input
                value={portal.studentForm.name}
                onChange={(event) =>
                  portal.setStudentForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Student name"
                required
              />
            </PortalField>
            <PortalField>
              <Label>Email</Label>
              <Input
                type="email"
                value={portal.studentForm.email}
                onChange={(event) =>
                  portal.setStudentForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="student@email.com"
                required
              />
            </PortalField>
            <PortalField>
              <Label>Password</Label>
              <Input
                value={portal.studentForm.password}
                onChange={(event) =>
                  portal.setStudentForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="temporary password"
                required
              />
            </PortalField>
            <div className={portalStyles.checkboxGroup}>
              <strong>Courses</strong>
              {COURSES.map((course) => (
                <label key={course}>
                  <Checkbox
                    checked={portal.studentForm.courses.includes(course)}
                    onCheckedChange={() => portal.toggleStudentCourse(course)}
                  />
                  {course}
                </label>
              ))}
            </div>
            <div className={portalStyles.editActions}>
              <Button type="submit" variant="primary">
                <UserPlus aria-hidden="true" />
                Add Student
              </Button>
              <Button type="button" variant="secondary" onClick={() => portal.setIsAddStudentDialogOpen(false)}>
                <X aria-hidden="true" />
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(portal.editingStudentId)} onOpenChange={(open) => !open && portal.cancelEditingStudent()}>
        <DialogContent className={portalStyles.dialogContent}>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update login details and course access for this student.</DialogDescription>
          </DialogHeader>
          <form onSubmit={portal.saveStudentEdit}>
            <div className={portalStyles.formGrid}>
              <PortalField>
                <Label>Student Name</Label>
                <Input
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
                <Label>Email</Label>
                <Input
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
              <Label>Password</Label>
              <Input
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
            <div className={portalStyles.checkboxGroup}>
              <strong>Courses</strong>
              {COURSES.map((course) => (
                <label key={course}>
                  <Checkbox
                    checked={portal.editStudentForm.courses.includes(course)}
                    onCheckedChange={() => portal.toggleEditStudentCourse(course)}
                  />
                  {course}
                </label>
              ))}
            </div>
            <div className={portalStyles.editActions}>
              <Button type="submit" variant="primary">
                <Save aria-hidden="true" />
                Save Changes
              </Button>
              <Button type="button" variant="secondary" onClick={portal.cancelEditingStudent}>
                <X aria-hidden="true" />
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
