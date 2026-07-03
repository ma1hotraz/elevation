import type {
  Course,
  PortalState,
  ResourceFormState,
  ResourceStatus,
  ResourceType,
  PaymentFormState,
  StudentFormState,
} from "./portal.types";

export const COURSES: Course[] = ["PCM", "IELTS", "French"];
export const CATEGORIES: ResourceType[] = ["Live Test", "Previous Test", "Revision Material", "Study Material"];
export const RESOURCE_STATUSES: ResourceStatus[] = ["Upcoming", "Live", "Archived"];

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
      id: "teacher-1",
      name: "Priya Verma",
      email: "teacher@elevation.test",
      password: "teacher123",
      role: "teacher",
      courses: ["PCM", "IELTS"],
    },
    {
      id: "student-1",
      name: "Riya Sharma",
      email: "riya@elevation.test",
      password: "student123",
      role: "student",
      courses: ["IELTS"],
      joinedOn: "2026-07-01",
      phone: "+91 98765 43210",
      guardianName: "Anita Sharma",
      address: "Pune, Maharashtra",
      performance: {
        averageScore: 78,
        attendance: 96,
        completion: 88,
        rank: 4,
        lastAssessment: "IELTS Mock 3",
      },
      scoreHistory: [
        { test: "IELTS Mock 1", score: 74, date: "2026-06-18" },
        { test: "IELTS Mock 2", score: 79, date: "2026-06-25" },
        { test: "IELTS Mock 3", score: 81, date: "2026-07-02" },
      ],
      payments: {
        total: 18000,
        paid: 12000,
        refunded: 0,
        due: 6000,
        nextDue: "2026-07-15",
        records: [
          { id: "pay-1", label: "Admission Fee", amount: 6000, date: "2026-05-12", method: "UPI", invoice: "INV-001", status: "Paid" },
          { id: "pay-2", label: "June Installment", amount: 6000, date: "2026-06-12", method: "Card", invoice: "INV-002", status: "Paid" },
          { id: "pay-3", label: "July Installment", amount: 6000, date: "2026-07-15", method: "UPI", invoice: "INV-003", status: "Pending" },
        ],
      },
    },
    {
      id: "student-2",
      name: "Arjun Mehta",
      email: "arjun@elevation.test",
      password: "student123",
      role: "student",
      courses: ["PCM", "IELTS"],
      joinedOn: "2026-07-02",
      phone: "+91 98111 22334",
      guardianName: "Rajesh Mehta",
      address: "Delhi",
      performance: {
        averageScore: 84,
        attendance: 91,
        completion: 93,
        rank: 2,
        lastAssessment: "PCM Unit Test 5",
      },
      scoreHistory: [
        { test: "PCM Unit Test 3", score: 82, date: "2026-06-14" },
        { test: "PCM Unit Test 4", score: 85, date: "2026-06-24" },
        { test: "PCM Unit Test 5", score: 88, date: "2026-07-03" },
      ],
      payments: {
        total: 22000,
        paid: 22000,
        refunded: 0,
        due: 0,
        nextDue: "2026-08-01",
        records: [
          { id: "pay-4", label: "Admission Fee", amount: 8000, date: "2026-05-10", method: "UPI", invoice: "INV-004", status: "Paid" },
          { id: "pay-5", label: "June Installment", amount: 7000, date: "2026-06-10", method: "Cash", invoice: "INV-005", status: "Paid" },
          { id: "pay-6", label: "July Installment", amount: 7000, date: "2026-07-01", method: "UPI", invoice: "INV-006", status: "Paid" },
        ],
      },
    },
  ],
  resources: [
    {
      id: "resource-1",
      title: "IELTS Reading Sample Test 1",
      course: "IELTS",
      category: "Live Test",
      status: "Upcoming",
      url: "https://forms.gle/vbc4L2bRRFuPqYdu9",
      answerUrl: "",
      answerReleaseStatus: "Hidden",
      description: "Sample reading test format shared through Google Forms.",
      addedOn: "2026-07-01",
    },
    {
      id: "resource-2",
      title: "IELTS Reading Previous Practice",
      course: "IELTS",
      category: "Previous Test",
      status: "Live",
      url: "https://forms.gle/vbc4L2bRRFuPqYdu9",
      answerUrl: "https://example.com/ielts-reading-answers",
      answerReleaseStatus: "Published",
      description: "Demo previous test entry for revision workflow.",
      addedOn: "2026-07-01",
    },
    {
      id: "resource-3",
      title: "PCM Diagnostic Format Preview",
      course: "PCM",
      category: "Revision Material",
      status: "Live",
      url: "https://example.com/pcm-sample",
      answerUrl: "",
      answerReleaseStatus: "Hidden",
      description: "Demo placeholder for a future PCM sample resource.",
      addedOn: "2026-07-01",
    },
    {
      id: "resource-4",
      title: "French Level Check Preview",
      course: "French",
      category: "Study Material",
      status: "Live",
      url: "https://example.com/french-sample",
      answerUrl: "",
      answerReleaseStatus: "Hidden",
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

export const emptyPaymentForm: PaymentFormState = {
  studentId: "",
  label: "",
  amount: "",
  method: "UPI",
  date: new Date().toISOString().slice(0, 10),
  status: "Paid",
  invoice: "",
};

export const emptyResourceForm: ResourceFormState = {
  title: "",
  course: "IELTS",
  category: "Live Test",
  status: "Upcoming",
  url: "",
  answerUrl: "",
  answerReleaseStatus: "Hidden",
  description: "",
};
