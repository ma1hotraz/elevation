import { emptyAccountForm, emptyResourceForm } from "./portal.data";
import { createId } from "./portal.storage";
import type {
  AccountFormState,
  ChangeOwnPasswordInput,
  CreateUserInput,
  PaymentFormState,
  PortalState,
  PortalUser,
  ResetPasswordResult,
  ResourceFormState,
  TestResource,
  UpdateOwnProfileInput,
  UpdateUserInput,
  UserRole,
} from "./portal.types";

type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type SignInResult = {
  userId: string;
  mustChangePassword: boolean;
};

const adjectives = ["Amber", "Cedar", "Mint", "Silver", "River", "Bright", "Golden", "Maple"];
const nouns = ["Fox", "Stone", "Hawk", "Bridge", "Lake", "Field", "Orbit", "Garden"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validateEmailUniqueness(state: PortalState, email: string, excludeUserId?: string) {
  const normalized = normalizeEmail(email);
  return !state.users.some((user) => user.id !== excludeUserId && normalizeEmail(user.email) === normalized);
}

function validatePassword(nextPassword: string) {
  if (nextPassword.trim().length < 8) {
    return "Use at least 8 characters for the password.";
  }

  if (!/[A-Za-z]/.test(nextPassword) || !/\d/.test(nextPassword)) {
    return "Include at least one letter and one number in the password.";
  }

  return null;
}

function validateCourses(role: UserRole, courses: string[], status: string) {
  if (role !== "admin" && status === "active" && courses.length === 0) {
    return "Active accounts need at least one assigned course.";
  }

  return null;
}

function generateTemporaryPassword() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const digits = String(1000 + Math.floor(Math.random() * 9000));
  return `${adjective}-${noun}-${digits}`;
}

function buildStudentDefaults(role: AccountFormState["role"]) {
  if (role !== "student") {
    return {
      performance: undefined,
      scoreHistory: undefined,
      payments: undefined,
    };
  }

  return {
    performance: {
      averageScore: 0,
      attendance: 0,
      completion: 0,
      rank: 0,
      lastAssessment: "No assessments yet",
    },
    scoreHistory: [],
    payments: {
      total: 0,
      paid: 0,
      due: 0,
      refunded: 0,
      nextDue: undefined,
      records: [],
    },
  };
}

function mapFormToUser(form: AccountFormState, existing?: PortalUser): PortalUser {
  const trimmedRole = form.role;
  const studentDefaults = buildStudentDefaults(trimmedRole);

  return {
    id: existing?.id ?? createId(trimmedRole),
    name: form.name.trim(),
    email: normalizeEmail(form.email),
    role: trimmedRole,
    accountStatus: form.accountStatus,
    courses: [...form.courses],
    joinedOn: existing?.joinedOn ?? today(),
    phone: form.phone.trim(),
    guardianName: trimmedRole === "student" ? form.guardianName.trim() : "",
    address: form.address.trim(),
    performance: trimmedRole === "student" ? existing?.performance ?? studentDefaults.performance : undefined,
    scoreHistory: trimmedRole === "student" ? existing?.scoreHistory ?? studentDefaults.scoreHistory : undefined,
    payments: trimmedRole === "student" ? existing?.payments ?? studentDefaults.payments : undefined,
  };
}

export function getEmptyAccountForm(role: AccountFormState["role"] = "student"): AccountFormState {
  return {
    ...emptyAccountForm,
    role,
    courses: role === "teacher" ? ["PCM"] : ["IELTS"],
    guardianName: role === "teacher" ? "" : emptyAccountForm.guardianName,
  };
}

export async function signIn(state: PortalState, email: string, password: string): Promise<ServiceResult<SignInResult>> {
  const user = state.users.find((candidate) => normalizeEmail(candidate.email) === normalizeEmail(email));
  const credential = user ? state.credentials.find((candidate) => candidate.userId === user.id) : undefined;

  if (!user || !credential || credential.password !== password) {
    return { ok: false, error: "Check your email and password, then try again." };
  }

  if (user.accountStatus === "suspended") {
    return { ok: false, error: "This account is suspended. Ask an admin to restore access." };
  }

  return {
    ok: true,
    data: {
      userId: user.id,
      mustChangePassword: credential.mustChangePassword,
    },
  };
}

export async function createAccount(state: PortalState, input: CreateUserInput): Promise<ServiceResult<{ state: PortalState; result: ResetPasswordResult }>> {
  if (!input.name.trim()) {
    return { ok: false, error: "Enter the account holder's name." };
  }

  if (!input.email.trim()) {
    return { ok: false, error: "Enter an email address." };
  }

  if (!validateEmailUniqueness(state, input.email)) {
    return { ok: false, error: "That email is already in use." };
  }

  const courseError = validateCourses(input.role, input.courses, input.accountStatus);
  if (courseError) {
    return { ok: false, error: courseError };
  }

  const user = mapFormToUser(input);
  const temporaryPassword = generateTemporaryPassword();

  return {
    ok: true,
    data: {
      state: {
        ...state,
        users: [...state.users, user],
        credentials: [
          ...state.credentials,
          {
            userId: user.id,
            password: temporaryPassword,
            mustChangePassword: true,
            passwordUpdatedOn: today(),
          },
        ],
      },
      result: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role as "student" | "teacher",
        temporaryPassword,
      },
    },
  };
}

export async function updateAccount(state: PortalState, userId: string, input: UpdateUserInput): Promise<ServiceResult<PortalState>> {
  const existing = state.users.find((user) => user.id === userId);
  if (!existing) {
    return { ok: false, error: "That account no longer exists." };
  }
  if (existing.role === "admin") {
    return { ok: false, error: "Admin accounts are not editable from this panel." };
  }

  if (!input.name.trim()) {
    return { ok: false, error: "Enter the account holder's name." };
  }

  if (!input.email.trim()) {
    return { ok: false, error: "Enter an email address." };
  }

  if (!validateEmailUniqueness(state, input.email, userId)) {
    return { ok: false, error: "That email is already in use." };
  }

  const courseError = validateCourses(existing.role, input.courses, input.accountStatus);
  if (courseError) {
    return { ok: false, error: courseError };
  }

  const nextUser = mapFormToUser({ ...input, role: existing.role }, existing);

  return {
    ok: true,
    data: {
      ...state,
      users: state.users.map((user) => (user.id === userId ? nextUser : user)),
    },
  };
}

export async function resetAccountPassword(state: PortalState, userId: string): Promise<ServiceResult<{ state: PortalState; result: ResetPasswordResult }>> {
  const user = state.users.find((candidate) => candidate.id === userId);
  if (!user || user.role === "admin") {
    return { ok: false, error: "Only teacher and student accounts can be reset from this panel." };
  }

  const temporaryPassword = generateTemporaryPassword();

  return {
    ok: true,
    data: {
      state: {
        ...state,
        credentials: state.credentials.map((credential) =>
          credential.userId === userId
            ? {
                ...credential,
                password: temporaryPassword,
                mustChangePassword: true,
                passwordUpdatedOn: today(),
              }
            : credential,
        ),
      },
      result: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role as "student" | "teacher",
        temporaryPassword,
      },
    },
  };
}

export async function changeOwnPassword(
  state: PortalState,
  userId: string,
  input: ChangeOwnPasswordInput,
  requireCurrentPassword: boolean,
): Promise<ServiceResult<PortalState>> {
  const credential = state.credentials.find((candidate) => candidate.userId === userId);
  if (!credential) {
    return { ok: false, error: "Unable to update the password for this account." };
  }

  if (requireCurrentPassword && credential.password !== input.currentPassword) {
    return { ok: false, error: "Your current password is incorrect." };
  }

  const passwordError = validatePassword(input.nextPassword);
  if (passwordError) {
    return { ok: false, error: passwordError };
  }

  return {
    ok: true,
    data: {
      ...state,
      credentials: state.credentials.map((candidate) =>
        candidate.userId === userId
          ? {
              ...candidate,
              password: input.nextPassword,
              mustChangePassword: false,
              passwordUpdatedOn: today(),
            }
          : candidate,
      ),
    },
  };
}

export async function updateOwnProfile(state: PortalState, userId: string, input: UpdateOwnProfileInput): Promise<ServiceResult<PortalState>> {
  const user = state.users.find((candidate) => candidate.id === userId);
  if (!user) {
    return { ok: false, error: "Unable to update this profile right now." };
  }

  return {
    ok: true,
    data: {
      ...state,
      users: state.users.map((candidate) =>
        candidate.id === userId
          ? {
              ...candidate,
              phone: input.phone.trim(),
              address: input.address.trim(),
              guardianName: candidate.role === "student" ? input.guardianName.trim() : "",
            }
          : candidate,
      ),
    },
  };
}

export async function toggleAccountStatus(state: PortalState, userId: string): Promise<ServiceResult<PortalState>> {
  const user = state.users.find((candidate) => candidate.id === userId);
  if (!user || user.role === "admin") {
    return { ok: false, error: "This account cannot be suspended here." };
  }

  const nextStatus = user.accountStatus === "active" ? "suspended" : "active";

  return {
    ok: true,
    data: {
      ...state,
      users: state.users.map((candidate) =>
        candidate.id === userId
          ? {
              ...candidate,
              accountStatus: nextStatus,
            }
          : candidate,
      ),
    },
  };
}

export async function removeAccount(state: PortalState, userId: string): Promise<ServiceResult<PortalState>> {
  const user = state.users.find((candidate) => candidate.id === userId);
  if (!user || user.role === "admin") {
    return { ok: false, error: "This account cannot be removed here." };
  }

  return {
    ok: true,
    data: {
      ...state,
      users: state.users.filter((candidate) => candidate.id !== userId),
      credentials: state.credentials.filter((candidate) => candidate.userId !== userId),
    },
  };
}

function summarizePaymentRecords(records: Array<{ amount: number; date: string; status: "Paid" | "Pending" | "Refunded" }>) {
  const total = records.reduce((sum, record) => sum + record.amount, 0);
  const paid = records.filter((record) => record.status === "Paid").reduce((sum, record) => sum + record.amount, 0);
  const pending = records.filter((record) => record.status === "Pending").reduce((sum, record) => sum + record.amount, 0);
  const refunded = records.filter((record) => record.status === "Refunded").reduce((sum, record) => sum + record.amount, 0);
  const nextDue = records
    .filter((record) => record.status === "Pending")
    .sort((left, right) => left.date.localeCompare(right.date))[0]?.date;

  return {
    total,
    paid,
    due: pending,
    refunded,
    nextDue,
  };
}

function nextInvoiceNumber(state: PortalState) {
  const year = new Date().getFullYear();
  const value = `INV-${year}-${String(state.counters.invoice).padStart(6, "0")}`;
  return value;
}

export async function createPaymentRecord(state: PortalState, input: PaymentFormState): Promise<ServiceResult<PortalState>> {
  const amount = Number(input.amount);
  if (!input.studentId) {
    return { ok: false, error: "Select a student for this payment." };
  }

  if (!input.label.trim()) {
    return { ok: false, error: "Enter a payment label." };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Enter a valid payment amount." };
  }

  const target = state.users.find((user) => user.id === input.studentId && user.role === "student");
  if (!target) {
    return { ok: false, error: "That student account could not be found." };
  }

  const invoice = nextInvoiceNumber(state);

  return {
    ok: true,
    data: {
      ...state,
      counters: {
        invoice: state.counters.invoice + 1,
      },
      users: state.users.map((user) => {
        if (user.id !== input.studentId || user.role !== "student") {
          return user;
        }

        const currentRecords = user.payments?.records ?? [];
        const nextRecords = [
          {
            id: createId("payment"),
            label: input.label.trim(),
            amount,
            date: input.date,
            method: input.method,
            invoice,
            status: input.status,
          },
          ...currentRecords,
        ];
        const summary = summarizePaymentRecords(nextRecords);

        return {
          ...user,
          payments: {
            total: summary.total,
            paid: summary.paid,
            due: summary.due,
            refunded: summary.refunded,
            nextDue: summary.nextDue,
            records: nextRecords,
          },
        };
      }),
    },
  };
}

function normalizeResourceForm(form: ResourceFormState, fallbackCourse: TestResource["course"]): ResourceFormState {
  const nextCategory = form.category;
  const nextStatus = nextCategory === "Live Test" ? form.status : form.status === "Upcoming" ? "Live" : form.status;
  const nextAnswerUrl = form.answerUrl.trim();

  return {
    ...form,
    title: form.title.trim(),
    course: form.course ?? fallbackCourse,
    status: nextStatus,
    url: form.url.trim(),
    answerUrl: nextAnswerUrl,
    answerReleaseStatus: nextAnswerUrl ? form.answerReleaseStatus : "Hidden",
    description: form.description.trim(),
  };
}

export async function saveResourceRecord(
  state: PortalState,
  form: ResourceFormState,
  editingResourceId: string | null,
): Promise<ServiceResult<PortalState>> {
  if (!form.title.trim()) {
    return { ok: false, error: "Enter a resource title." };
  }

  if (!form.url.trim()) {
    return { ok: false, error: "Enter the resource link." };
  }

  const normalized = normalizeResourceForm(form, emptyResourceForm.course);

  return {
    ok: true,
    data: {
      ...state,
      resources:
        editingResourceId === null
          ? [
              {
                id: createId("resource"),
                addedOn: today(),
                title: normalized.title,
                course: normalized.course,
                category: normalized.category,
                status: normalized.status,
                url: normalized.url,
                answerUrl: normalized.answerUrl || undefined,
                answerReleaseStatus: normalized.answerReleaseStatus,
                description: normalized.description,
              },
              ...state.resources,
            ]
          : state.resources.map((resource) =>
              resource.id === editingResourceId
                ? {
                    ...resource,
                    title: normalized.title,
                    course: normalized.course,
                    category: normalized.category,
                    status: normalized.status,
                    url: normalized.url,
                    answerUrl: normalized.answerUrl || undefined,
                    answerReleaseStatus: normalized.answerReleaseStatus,
                    description: normalized.description,
                  }
                : resource,
            ),
    },
  };
}

export function getAccountFormFromUser(user: PortalUser): AccountFormState {
  return {
    role: user.role === "teacher" ? "teacher" : "student",
    name: user.name,
    email: user.email,
    courses: [...user.courses],
    phone: user.phone ?? "",
    guardianName: user.guardianName ?? "",
    address: user.address ?? "",
    accountStatus: user.accountStatus,
  };
}
