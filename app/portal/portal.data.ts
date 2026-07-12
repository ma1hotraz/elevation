import type {
  AccountFormState,
  PaymentFormState,
  PortalState,
  ResourceFormState,
  ResourceStatus,
  ResourceType,
  Course,
  PerformanceFormState,
  ScoreFormState,
} from "./portal.types";

export const COURSES: Course[] = ["PCM", "IELTS", "French"];
export const CATEGORIES: ResourceType[] = ["Live Test", "Previous Test", "Revision Material", "Study Material"];
export const RESOURCE_STATUSES: ResourceStatus[] = ["Upcoming", "Live", "Archived"];

export const initialState: PortalState = {
  users: [],
  resources: [],
  enquiries: [],
};

export const emptyAccountForm: AccountFormState = {
  role: "student",
  name: "",
  email: "",
  courses: ["IELTS"],
  phone: "",
  guardianName: "",
  address: "",
  accountStatus: "active",
};

export const emptyPaymentForm: PaymentFormState = {
  studentId: "",
  label: "",
  amount: "",
  method: "UPI",
  date: new Date().toISOString().slice(0, 10),
  status: "Paid",
};

export const emptyResourceForm: ResourceFormState = {
  title: "",
  course: "IELTS",
  category: "Study Material",
  status: "Live",
  url: "",
  answerUrl: "",
  answerReleaseStatus: "Hidden",
  description: "",
};

export const emptyPerformanceForm: PerformanceFormState = {
  attendance: "0",
  completion: "0",
  rank: "0",
  lastAssessment: "No assessments yet",
};

export const emptyScoreForm: ScoreFormState = {
  course: "IELTS",
  test: "",
  score: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};
