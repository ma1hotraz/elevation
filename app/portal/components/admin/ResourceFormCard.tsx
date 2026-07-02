import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PortalField } from "../PortalField";
import { CATEGORIES, COURSES } from "../../portal.data";
import { portalStyles } from "../../portalShared";
import type { PortalController } from "../../usePortalState";

type ResourceFormCardProps = {
  portal: PortalController;
};

export function ResourceFormCard({ portal }: ResourceFormCardProps) {
  return (
    <Card className={portalStyles.formCard}>
      <CardHeader>
        <CardTitle>Add Test Link</CardTitle>
        <CardDescription>Create links for tests, previous tests, or revision materials.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={portal.addResource}>
          <PortalField>
            <Label>Title</Label>
            <Input
              value={portal.resourceForm.title}
              onChange={(event) =>
                portal.setResourceForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="IELTS Reading Test 2"
              required
            />
          </PortalField>
          <div className={portalStyles.formGrid}>
            <PortalField>
              <Label>Course</Label>
              <Select
                value={portal.resourceForm.course}
                onValueChange={(value) =>
                  portal.setResourceForm((current) => ({
                    ...current,
                    course: value as (typeof COURSES)[number],
                  }))
                }
              >
                <SelectTrigger className={portalStyles.selectTrigger}>
                  <SelectValue placeholder="Choose course" />
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
            <PortalField>
              <Label>Category</Label>
              <Select
                value={portal.resourceForm.category}
                onValueChange={(value) =>
                  portal.setResourceForm((current) => ({
                    ...current,
                    category: value as (typeof CATEGORIES)[number],
                  }))
                }
              >
                <SelectTrigger className={portalStyles.selectTrigger}>
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PortalField>
          </div>
          <PortalField>
            <Label>Link</Label>
            <Input
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
            <Label>Description</Label>
            <Textarea
              value={portal.resourceForm.description}
              onChange={(event) =>
                portal.setResourceForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Short note for students"
              required
            />
          </PortalField>
          <Button type="submit" variant="primary" icon={<Plus />} className={portalStyles.fullWidthButton}>
            Add Resource
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
