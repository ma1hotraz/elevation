import { initialState } from "./portal.data";
import type { PortalState } from "./portal.types";

export const STORAGE_KEY = "elevation-portal-state-v1";
export const SESSION_KEY = "elevation-portal-session-v1";

export function loadPortalState(): PortalState {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  try {
    const parsedState = JSON.parse(stored) as PortalState;
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

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
