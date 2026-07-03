import { BookOpenCheck, FileText, Link2, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PortalField } from "../PortalField";
import { CATEGORIES, COURSES } from "../../portal.data";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

type ResourceFormDialogProps = {
  portal: PortalController;
};

export function ResourceFormCard({ portal }: ResourceFormDialogProps) {
  const isEditing = portal.editingResourceId !== null;

  return (
    <Dialog open={portal.isResourceDialogOpen} onOpenChange={(open) => (open ? portal.openResourceDialog() : portal.closeResourceDialog())}>
      <DialogContent className={portalStyles.dialogContent} showCloseButton>
        <div className={portalStyles.dialogHeader}>
          <DialogHeader className={portalStyles.dialogHeaderRow}>
            <DialogTitle className={portalStyles.dialogTitle}>
              {isEditing ? "Edit Test" : "Add Test"}
            </DialogTitle>
            <DialogDescription className={portalStyles.dialogDescription}>
              {isEditing
                ? "Update the link, attach answer access, or adjust visibility for this resource."
                : "Create a new test, previous paper, or revision material. Everything stays link-based, with no file upload."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={portal.saveResource}>
          <div className={portalStyles.dialogBody}>
            <div className={portalStyles.dialogForm}>
              <PortalField>
                <Label className="inline-flex items-center gap-2 text-[0.82rem] font-black text-[#45595e]">
                  <FileText aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                  Title
                </Label>
                <Input
                  className={portalStyles.dialogControl}
                  value={portal.resourceForm.title}
                  onChange={(event) =>
                    portal.setResourceForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="e.g. IELTS Reading Test 2"
                  required
                />
              </PortalField>

              <div className="grid gap-3">
                <PortalField>
                  <Label className="inline-flex items-center gap-2 text-[0.82rem] font-black text-[#45595e]">
                    <BookOpenCheck aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                    Course
                  </Label>
                  <Select
                    value={portal.resourceForm.course}
                    onValueChange={(value) =>
                      portal.setResourceForm((current) => ({
                        ...current,
                        course: value as (typeof COURSES)[number],
                      }))
                    }
                  >
                    <SelectTrigger className={`${portalStyles.dialogControl} w-full justify-between`}>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSES.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </PortalField>

              </div>

              <div className={portalStyles.dialogSection}>
                <p className={portalStyles.dialogSectionTitle}>Resource Type</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {CATEGORIES.map((category) => {
                    const active = portal.resourceForm.category === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        className={
                          active
                            ? "min-h-[48px] rounded-[10px] border border-[#0d7b68] bg-[#e8fbf5] px-3 text-[0.8rem] font-black text-[#0a7a68] shadow-[inset_0_0_0_1px_rgba(13,123,104,0.08)]"
                            : "min-h-[48px] rounded-[10px] border border-[#d8e6e3] bg-white px-3 text-[0.8rem] font-black text-[#5d7075] transition hover:border-[#b9d6d1] hover:bg-[#f7fbfb]"
                        }
                        onClick={() =>
                          portal.setResourceForm((current) => ({
                            ...current,
                            category,
                            status:
                              category === "Live Test"
                                ? current.status === "Archived"
                                  ? "Upcoming"
                                  : current.status
                                : current.status === "Upcoming"
                                  ? "Live"
                                  : current.status,
                          }))
                        }
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <PortalField>
                <Label className="inline-flex items-center gap-2 text-[0.82rem] font-black text-[#45595e]">
                  <Link2 aria-hidden="true" className="h-4 w-4 text-[#0d7b68]" />
                  Link
                </Label>
                <Input
                  className={portalStyles.dialogControl}
                  type="url"
                  value={portal.resourceForm.url}
                  onChange={(event) =>
                    portal.setResourceForm((current) => ({ ...current, url: event.target.value }))
                  }
                  placeholder="https://forms.gle/..."
                  required
                />
              </PortalField>

              <PortalField>
                <div className="flex items-end justify-between gap-3">
                  <Label className="text-[0.82rem] font-black text-[#45595e]">Answer Link</Label>
                  <span className="text-[0.68rem] font-black uppercase tracking-[0.13em] text-[#8a9a9d]">
                    Optional
                  </span>
                </div>
                <Input
                  className={portalStyles.dialogControl}
                  type="url"
                  value={portal.resourceForm.answerUrl}
                  onChange={(event) =>
                    portal.setResourceForm((current) => ({ ...current, answerUrl: event.target.value }))
                  }
                  placeholder="https://forms.gle/answer-key..."
                />
                <p className="m-0 text-[0.78rem] leading-[1.5] text-[#6c7d81]">
                  Leave this blank until the live test is closed. You can return later and attach the answer link.
                </p>
              </PortalField>

              <PortalField>
                <Label className="text-[0.82rem] font-black text-[#45595e]">
                  Description <span className="font-semibold text-[#8a9a9d]">(Optional)</span>
                </Label>
                <Textarea
                  value={portal.resourceForm.description}
                  onChange={(event) =>
                    portal.setResourceForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Short note for students..."
                  className="min-h-[112px] rounded-[10px] border-[#d6e3e1] bg-white px-4 py-3 text-[0.94rem] text-[#10252b] placeholder:text-[#8b9ca1] focus-visible:border-[#0d8a74] focus-visible:ring-[#0d8a74]/15"
                />
              </PortalField>
            </div>
          </div>

          <div className={portalStyles.dialogFooter}>
            <Button
              type="button"
              variant="secondary"
              className="h-10 px-4 text-[0.85rem] font-black"
              icon={<X />}
              onClick={portal.closeResourceDialog}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="h-10 px-4 text-[0.85rem] font-black"
              icon={isEditing ? <Save /> : <Plus />}
            >
              {isEditing ? "Save Changes" : "Add Test"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
