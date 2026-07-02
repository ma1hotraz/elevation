export type Course = "PCM" | "IELTS" | "French";
export type ResourceType = "Test Link" | "Previous Test" | "Revision Material";
export type UserRole = "admin" | "student";
export type AdminView = "overview" | "library" | "add-link" | "students";

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  courses: Course[];
};

export type TestResource = {
  id: string;
  title: string;
  course: Course;
  category: ResourceType;
  url: string;
  description: string;
  addedOn: string;
};

export type PortalState = {
  users: PortalUser[];
  resources: TestResource[];
};

export type StudentFormState = {
  name: string;
  email: string;
  password: string;
  courses: Course[];
};

export type ResourceFormState = {
  title: string;
  course: Course;
  category: ResourceType;
  url: string;
  description: string;
};
