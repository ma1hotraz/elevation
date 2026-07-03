export type Course = "PCM" | "IELTS" | "French";
export type ResourceType = "Live Test" | "Previous Test" | "Revision Material" | "Study Material";
export type ResourceStatus = "Upcoming" | "Live" | "Archived";
export type AnswerReleaseStatus = "Hidden" | "Published";
export type UserRole = "admin" | "teacher" | "student";
export type AdminView =
  | "overview"
  | "library"
  | "add-link"
  | "students"
  | "payments"
  | "profile"
  | "performance"
  | "resources"
  | "live-test"
  | "create-test"
  | "add-resource";

export type StudentPerformance = {
  averageScore: number;
  attendance: number;
  completion: number;
  rank: number;
  lastAssessment: string;
};

export type StudentScore = {
  test: string;
  score: number;
  date: string;
};

export type StudentPaymentRecord = {
  id: string;
  label: string;
  amount: number;
  date: string;
  method: "UPI" | "Card" | "Cash" | "Bank Transfer" | "Other";
  invoice: string;
  status: "Paid" | "Pending" | "Refunded";
};

export type StudentPayments = {
  total: number;
  paid: number;
  due: number;
  refunded: number;
  nextDue?: string;
  records: StudentPaymentRecord[];
};

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  courses: Course[];
  joinedOn?: string;
  phone?: string;
  guardianName?: string;
  address?: string;
  performance?: StudentPerformance;
  scoreHistory?: StudentScore[];
  payments?: StudentPayments;
};

export type TestResource = {
  id: string;
  title: string;
  course: Course;
  category: ResourceType;
  status: ResourceStatus;
  url: string;
  answerUrl?: string;
  answerReleaseStatus: AnswerReleaseStatus;
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

export type PaymentFormState = {
  studentId: string;
  label: string;
  amount: string;
  method: "UPI" | "Card" | "Cash" | "Bank Transfer" | "Other";
  date: string;
  status: "Paid" | "Pending" | "Refunded";
  invoice: string;
};

export type ResourceFormState = {
  title: string;
  course: Course;
  category: ResourceType;
  status: ResourceStatus;
  url: string;
  answerUrl: string;
  answerReleaseStatus: AnswerReleaseStatus;
  description: string;
};
