export type Course = "PCM" | "IELTS" | "French";
export type ResourceType = "Live Test" | "Previous Test" | "Revision Material" | "Study Material";
export type ResourceStatus = "Upcoming" | "Live" | "Archived";
export type AnswerReleaseStatus = "Hidden" | "Published";
export type UserRole = "admin" | "teacher" | "student";
export type AccountStatus = "active" | "suspended";

export type AdminWorkspaceView = "overview" | "library" | "accounts" | "payments";
export type TeacherWorkspaceView = "overview" | "resources" | "students" | "profile" | "security";
export type StudentWorkspaceView = "dashboard" | "resources" | "live-tests" | "performance" | "payments" | "profile" | "security";

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
  role: UserRole;
  accountStatus: AccountStatus;
  courses: Course[];
  joinedOn?: string;
  phone?: string;
  guardianName?: string;
  address?: string;
  performance?: StudentPerformance;
  scoreHistory?: StudentScore[];
  payments?: StudentPayments;
};

export type PortalCredential = {
  userId: string;
  password: string;
  mustChangePassword: boolean;
  passwordUpdatedOn: string;
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

export type PortalCounters = {
  invoice: number;
};

export type PortalState = {
  users: PortalUser[];
  credentials: PortalCredential[];
  resources: TestResource[];
  counters: PortalCounters;
};

export type AccountFormState = {
  role: Exclude<UserRole, "admin">;
  name: string;
  email: string;
  courses: Course[];
  phone: string;
  guardianName: string;
  address: string;
  accountStatus: AccountStatus;
};

export type PaymentFormState = {
  studentId: string;
  label: string;
  amount: string;
  method: "UPI" | "Card" | "Cash" | "Bank Transfer" | "Other";
  date: string;
  status: "Paid" | "Pending" | "Refunded";
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

export type CreateUserInput = AccountFormState;

export type UpdateUserInput = AccountFormState;

export type ResetPasswordResult = {
  userId: string;
  name: string;
  email: string;
  role: Exclude<UserRole, "admin">;
  temporaryPassword: string;
};

export type UpdateOwnProfileInput = {
  phone: string;
  guardianName: string;
  address: string;
};

export type ChangeOwnPasswordInput = {
  currentPassword?: string;
  nextPassword: string;
};
