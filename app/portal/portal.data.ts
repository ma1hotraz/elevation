import type { Course, ResourceType, StudentFormState, ResourceFormState, PortalState } from "./portal.types";

export const COURSES: Course[] = ["PCM", "IELTS", "French"];
export const CATEGORIES: ResourceType[] = ["Test Link", "Previous Test", "Revision Material"];

export const initialState: PortalState = {
  users: [
    {
      id: "admin-1",
      name: "Elevation Admin",
      email: "admin@elevation.test",
      password: "admin123",
      role: "admin",
      courses: ["PCM", "IELTS", "French"],
    },
    {
      id: "student-1",
      name: "Riya Sharma",
      email: "riya@elevation.test",
      password: "student123",
      role: "student",
      courses: ["IELTS"],
    },
    {
      id: "student-2",
      name: "Arjun Mehta",
      email: "arjun@elevation.test",
      password: "student123",
      role: "student",
      courses: ["PCM", "IELTS"],
    },
  ],
  resources: [
    {
      id: "resource-1",
      title: "IELTS Reading Sample Test 1",
      course: "IELTS",
      category: "Test Link",
      url: "https://forms.gle/vbc4L2bRRFuPqYdu9",
      description: "Sample reading test format shared through Google Forms.",
      addedOn: "2026-07-01",
    },
    {
      id: "resource-2",
      title: "IELTS Reading Previous Practice",
      course: "IELTS",
      category: "Previous Test",
      url: "https://forms.gle/vbc4L2bRRFuPqYdu9",
      description: "Demo previous test entry for revision workflow.",
      addedOn: "2026-07-01",
    },
    {
      id: "resource-3",
      title: "PCM Diagnostic Format Preview",
      course: "PCM",
      category: "Revision Material",
      url: "https://example.com/pcm-sample",
      description: "Demo placeholder for a future PCM sample resource.",
      addedOn: "2026-07-01",
    },
    {
      id: "resource-4",
      title: "French Level Check Preview",
      course: "French",
      category: "Revision Material",
      url: "https://example.com/french-sample",
      description: "Demo placeholder for a future French sample resource.",
      addedOn: "2026-07-01",
    },
  ],
};

export const emptyStudentForm: StudentFormState = {
  name: "",
  email: "",
  password: "",
  courses: ["IELTS"],
};

export const emptyResourceForm: ResourceFormState = {
  title: "",
  course: "IELTS",
  category: "Test Link",
  url: "",
  description: "",
};
