import { initialState } from "./portal.data";
import type {
  AccountStatus,
  AnswerReleaseStatus,
  Course,
  PortalCredential,
  PortalState,
  PortalUser,
  ResourceStatus,
  ResourceType,
  TestResource,
  UserRole,
} from "./portal.types";

const LEGACY_STORAGE_KEY = "elevation-portal-state-v1";
export const STORAGE_KEY = "elevation-portal-state-v2";
export const SESSION_KEY = "elevation-portal-session-v2";

export function loadPortalState(): PortalState {
  const stored = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!stored) {
    savePortalState(initialState);
    return initialState;
  }

  try {
    const nextState = normalizePortalState(JSON.parse(stored) as Partial<PortalState>);
    savePortalState(nextState);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    return nextState;
  } catch {
    savePortalState(initialState);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    return initialState;
  }
}

export function savePortalState(state: PortalState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function normalizePortalState(state: Partial<PortalState>): PortalState {
  const usersSource = Array.isArray(state.users) ? state.users : initialState.users;
  const normalizedUsers = usersSource.map(normalizeUser);
  const resourcesSource = Array.isArray(state.resources) ? state.resources : initialState.resources;
  const normalizedResources = resourcesSource.map(normalizeResource);
  const normalizedCredentials = normalizeCredentials(state, normalizedUsers);

  return {
    users: normalizedUsers,
    credentials: normalizedCredentials,
    resources: normalizedResources,
    counters: {
      invoice: getNextInvoiceCounter(state, normalizedUsers),
    },
  };
}

function normalizeUser(user: Partial<PortalUser> & { password?: string }): PortalUser {
  return {
    id: user.id ?? createId("user"),
    name: typeof user.name === "string" ? user.name.trim() : "",
    email: typeof user.email === "string" ? user.email.trim().toLowerCase() : "",
    role: normalizeRole(user.role),
    accountStatus: normalizeAccountStatus(user.accountStatus),
    courses: Array.isArray(user.courses) ? user.courses.filter(isCourse) : [],
    joinedOn: isDateString(user.joinedOn) ? user.joinedOn : new Date().toISOString().slice(0, 10),
    phone: typeof user.phone === "string" ? user.phone.trim() : "",
    guardianName: typeof user.guardianName === "string" ? user.guardianName.trim() : "",
    address: typeof user.address === "string" ? user.address.trim() : "",
    performance: user.performance,
    scoreHistory: Array.isArray(user.scoreHistory) ? user.scoreHistory : [],
    payments: user.payments
      ? {
          ...user.payments,
          records: Array.isArray(user.payments.records) ? user.payments.records : [],
        }
      : undefined,
  };
}

function normalizeCredentials(
  state: Partial<PortalState>,
  users: PortalUser[],
): PortalCredential[] {
  if (Array.isArray(state.credentials) && state.credentials.length > 0) {
    return users.map((user) => {
      const credential = state.credentials?.find((candidate) => candidate?.userId === user.id);

      return {
        userId: user.id,
        password: typeof credential?.password === "string" ? credential.password : "change-me-123",
        mustChangePassword: Boolean(credential?.mustChangePassword),
        passwordUpdatedOn: isDateString(credential?.passwordUpdatedOn)
          ? credential.passwordUpdatedOn
          : user.joinedOn ?? new Date().toISOString().slice(0, 10),
      };
    });
  }

  return users.map((user) => {
    const legacyUser = state.users?.find((candidate) => candidate.id === user.id) as (PortalUser & { password?: string }) | undefined;

    return {
      userId: user.id,
      password: typeof legacyUser?.password === "string" ? legacyUser.password : "change-me-123",
      mustChangePassword: false,
      passwordUpdatedOn: user.joinedOn ?? new Date().toISOString().slice(0, 10),
    };
  });
}

function normalizeResource(resource: Partial<TestResource> & { category?: string; status?: string }): TestResource {
  const category = normalizeResourceType(resource.category);
  const status = normalizeResourceStatus(resource.status) ?? defaultStatusForType(category);
  const answerUrl = typeof resource.answerUrl === "string" && resource.answerUrl.trim() ? resource.answerUrl.trim() : undefined;

  return {
    id: resource.id ?? createId("resource"),
    title: typeof resource.title === "string" ? resource.title.trim() : "",
    course: isCourse(resource.course) ? resource.course : "IELTS",
    category,
    status,
    url: typeof resource.url === "string" ? resource.url.trim() : "",
    answerUrl,
    answerReleaseStatus: normalizeAnswerReleaseStatus(resource.answerReleaseStatus, {
      category,
      status,
      answerUrl,
    }),
    description: typeof resource.description === "string" ? resource.description.trim() : "",
    addedOn: isDateString(resource.addedOn) ? resource.addedOn : new Date().toISOString().slice(0, 10),
  };
}

function getNextInvoiceCounter(state: Partial<PortalState>, users: PortalUser[]) {
  const explicitCounter = state.counters?.invoice;
  if (typeof explicitCounter === "number" && Number.isFinite(explicitCounter) && explicitCounter > 0) {
    return explicitCounter;
  }

  const maxInvoice = users
    .flatMap((user) => user.payments?.records ?? [])
    .map((record) => {
      const match = record.invoice.match(/(\d{6})$/);
      return match ? Number(match[1]) : 0;
    })
    .reduce((highest, value) => Math.max(highest, value), 0);

  return maxInvoice + 1;
}

function normalizeRole(value: unknown): UserRole {
  if (value === "student" || value === "teacher" || value === "admin") {
    return value;
  }

  return "student";
}

function normalizeAccountStatus(value: unknown): AccountStatus {
  return value === "suspended" ? "suspended" : "active";
}

function normalizeResourceType(value: string | undefined): ResourceType {
  if (value === "Live Test" || value === "Previous Test" || value === "Revision Material" || value === "Study Material") {
    return value;
  }

  return "Live Test";
}

function normalizeResourceStatus(value: string | undefined): ResourceStatus | undefined {
  if (value === "Upcoming" || value === "Live" || value === "Archived") {
    return value;
  }

  return undefined;
}

function normalizeAnswerReleaseStatus(
  value: string | undefined,
  resource: Pick<TestResource, "category" | "status" | "answerUrl">,
): AnswerReleaseStatus {
  if (value === "Hidden" || value === "Published") {
    return value;
  }

  if (!resource.answerUrl) {
    return "Hidden";
  }

  return resource.category === "Previous Test" || resource.status === "Archived" ? "Published" : "Hidden";
}

function defaultStatusForType(type: ResourceType): ResourceStatus {
  return type === "Live Test" ? "Upcoming" : "Live";
}

function isCourse(value: unknown): value is Course {
  return value === "PCM" || value === "IELTS" || value === "French";
}

function isDateString(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
