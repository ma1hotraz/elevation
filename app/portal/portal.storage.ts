import { initialState } from "./portal.data";
import type {
  AnswerReleaseStatus,
  Course,
  PortalState,
  ResourceStatus,
  ResourceType,
  TestResource,
} from "./portal.types";

export const STORAGE_KEY = "elevation-portal-state-v1";
export const SESSION_KEY = "elevation-portal-session-v1";

export function loadPortalState(): PortalState {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  try {
    const parsedState = normalizePortalState(JSON.parse(stored) as Partial<PortalState>);
    const hydratedState = mergeDemoDefaults(parsedState);

    savePortalState(hydratedState);
    return hydratedState;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }
}

export function savePortalState(state: PortalState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizePortalState(state: Partial<PortalState>): PortalState {
  const users = Array.isArray(state.users) ? state.users : initialState.users;
  const resources = Array.isArray(state.resources) ? state.resources : initialState.resources;

  return {
    users: users.map((user) => ({
      ...user,
      id: user.id ?? createId("user"),
      name: user.name ?? "",
      email: user.email ?? "",
      password: user.password ?? "",
      role: user.role === "student" || user.role === "teacher" ? user.role : "admin",
      courses: Array.isArray(user.courses) ? user.courses.filter(isCourse) : ["IELTS"],
    })),
    resources: resources.map(normalizeResource),
  };
}

export function mergeDemoDefaults(state: PortalState): PortalState {
  const usersByEmail = new Map(state.users.map((user) => [user.email.toLowerCase(), user]));
  const resourcesById = new Map(state.resources.map((resource) => [resource.id, resource]));

  return {
    users: [
      ...state.users,
      ...initialState.users.filter((user) => !usersByEmail.has(user.email.toLowerCase())),
    ],
    resources: [
      ...state.resources,
      ...initialState.resources.filter((resource) => !resourcesById.has(resource.id)),
    ],
  };
}

function normalizeResource(resource: Partial<TestResource> & { category?: string; status?: string }): TestResource {
  const category = normalizeResourceType(resource.category);
  const status = normalizeResourceStatus(resource.status) ?? defaultStatusForType(category);
  const answerUrl = resource.answerUrl?.trim() || undefined;

  return {
    id: resource.id ?? createId("resource"),
    title: resource.title?.trim() ?? "",
    course: isCourse(resource.course) ? resource.course : "IELTS",
    category,
    status,
    url: resource.url?.trim() ?? "",
    answerUrl,
    answerReleaseStatus: normalizeAnswerReleaseStatus(resource.answerReleaseStatus, {
      category,
      status,
      answerUrl,
    }),
    description: resource.description?.trim() ?? "",
    addedOn: isDateString(resource.addedOn) ? resource.addedOn : new Date().toISOString().slice(0, 10),
  };
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

function defaultStatusForType(type: ResourceType): ResourceStatus {
  return type === "Live Test" ? "Upcoming" : "Live";
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

function isCourse(value: unknown): value is Course {
  return value === "PCM" || value === "IELTS" || value === "French";
}

function isDateString(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
