"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
  useReactTable,
} from "@tanstack/react-table";
import { Ban, Eye, KeyRound, Link2, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { COURSES, emptyResourceForm, initialState } from "./portal.data";
import {
  createAccount,
  deletePaymentRecord,
  savePaymentRecord as savePaymentRecordInDatabase,
  createScoreRecord,
  deleteAccount,
  deleteScoreRecord,
  getAccountFormFromUser,
  getEmptyAccountForm,
  loadPortalSnapshot,
  removeResourceRecord,
  resetAccountPassword,
  savePerformanceRecord,
  saveResourceRecord,
  setAccountStatus,
  updateAccount,
  updateEnquiryStatus,
} from "./portal.repository";
import { portalStyles } from "./portalShared";
import type {
  AccountFormState,
  AccountStatus,
  AdminWorkspaceView,
  ChangeOwnPasswordInput,
  Course,
  PaymentFormState,
  PerformanceFormState,
  PortalState,
  PortalUser,
  ResourceFormState,
  ResourceStatus,
  ResourceType,
  ResetPasswordResult,
  ScoreFormState,
  EnquiryStatus,
  StudentWorkspaceView,
  TeacherWorkspaceView,
  TestResource,
  UpdateOwnProfileInput,
} from "./portal.types";
import { SortHeader } from "./components/PortalTable";
import { useToast } from "./usePortalToast";

type AuthView = "login" | "password-reset";
type AccountRoleFilter = "All" | "student" | "teacher";
type AccountDialogMode = "create" | "edit" | null;
export type PortalConfirmation = {
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
};

export type PortalController = {
  state: PortalState;
  currentUser: PortalUser | null;
  authView: AuthView;
  isInitializing: boolean;
  isMutating: boolean;
  configurationError: string;
  fatalError: string;
  retry: () => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  authError: string;
  setAuthError: (value: string) => void;
  authInfo: string;
  setAuthInfo: (value: string) => void;
  requestPasswordResetEmail: () => Promise<void>;
  activeCourse: Course | "All";
  setActiveCourse: (value: Course | "All") => void;
  activeResourceCategory: ResourceType | "All";
  setActiveResourceCategory: (value: ResourceType | "All") => void;
  activeResourceStatus: ResourceStatus | "All";
  setActiveResourceStatus: (value: ResourceStatus | "All") => void;
  resourceSearch: string;
  setResourceSearch: (value: string) => void;
  accountSearch: string;
  setAccountSearch: (value: string) => void;
  activeAccountCourse: Course | "All";
  setActiveAccountCourse: (value: Course | "All") => void;
  activeAccountStatus: "All" | AccountStatus;
  setActiveAccountStatus: (value: "All" | AccountStatus) => void;
  activeAccountRole: AccountRoleFilter;
  setActiveAccountRole: (value: AccountRoleFilter) => void;
  adminView: AdminWorkspaceView;
  setAdminView: (value: AdminWorkspaceView) => void;
  teacherView: TeacherWorkspaceView;
  setTeacherView: (value: TeacherWorkspaceView) => void;
  studentView: StudentWorkspaceView;
  setStudentView: (value: StudentWorkspaceView) => void;
  accountForm: AccountFormState;
  setAccountForm: Dispatch<SetStateAction<AccountFormState>>;
  accountDialogMode: AccountDialogMode;
  accountDialogError: string;
  setAccountDialogError: (value: string) => void;
  editingAccountId: string | null;
  openCreateAccount: (role?: "student" | "teacher") => void;
  openEditAccount: (account: PortalUser) => void;
  closeAccountDialog: () => void;
  credentialNotice: ResetPasswordResult | null;
  dismissCredentialNotice: () => void;
  selectedAccountId: string | null;
  selectedAccount: PortalUser | undefined;
  openAccountDetails: (account: PortalUser) => void;
  closeAccountDetails: () => void;
  resourceForm: ResourceFormState;
  setResourceForm: Dispatch<SetStateAction<ResourceFormState>>;
  resourceDialogError: string;
  setResourceDialogError: (value: string) => void;
  editingResourceId: string | null;
  isResourceDialogOpen: boolean;
  openResourceDialog: (resource?: TestResource) => void;
  closeResourceDialog: () => void;
  resourcePagination: PaginationState;
  setResourcePagination: Dispatch<SetStateAction<PaginationState>>;
  accountPagination: PaginationState;
  setAccountPagination: Dispatch<SetStateAction<PaginationState>>;
  accountRowSelection: RowSelectionState;
  setAccountRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  visibleCourses: Course[];
  visibleResources: TestResource[];
  studentUsers: PortalUser[];
  teacherUsers: PortalUser[];
  teacherStudentUsers: PortalUser[];
  managedAccounts: PortalUser[];
  filteredAccountRows: PortalUser[];
  courseSummaries: Array<{ course: Course; students: number; resources: number }>;
  latestResource: TestResource | undefined;
  filteredResourceRows: TestResource[];
  selectedAccountIds: string[];
  resourcesTable: TanstackTable<TestResource>;
  accountsTable: TanstackTable<PortalUser>;
  hasCourseAccess: boolean;
  confirmation: PortalConfirmation | null;
  cancelConfirmation: () => void;
  confirmPendingAction: () => Promise<void>;
  handleLogin: (event?: FormEvent<HTMLFormElement>) => void;
  logout: () => void;
  handlePasswordSetup: (nextPassword: string, confirmPassword: string) => Promise<string | null>;
  saveOwnPassword: (input: ChangeOwnPasswordInput, confirmPassword: string) => Promise<string | null>;
  saveOwnProfile: (input: UpdateOwnProfileInput) => Promise<string | null>;
  saveAccount: (event: FormEvent<HTMLFormElement>) => void;
  toggleAccountCourse: (course: Course) => void;
  requestPasswordReset: (userId: string) => Promise<void>;
  toggleManagedAccountStatus: (userId: string) => Promise<void>;
  savePaymentRecord: (record: PaymentFormState, paymentId?: string) => Promise<string | null>;
  removePaymentRecord: (paymentId: string, label: string) => void;
  changeEnquiryStatus: (enquiryId: string, status: EnquiryStatus) => Promise<string | null>;
  saveStudentPerformance: (studentId: string, form: PerformanceFormState) => Promise<string | null>;
  addStudentScore: (studentId: string, form: ScoreFormState) => Promise<string | null>;
  removeStudentScore: (scoreId: string) => Promise<void>;
  saveResource: (event: FormEvent<HTMLFormElement>) => void;
  exportResources: () => void;
  startEditingResource: (resource: TestResource) => void;
  removeResource: (resourceId: string) => void;
  removeManagedAccount: (userId: string) => void;
  removeSelectedAccounts: () => void;
  clearResourceFilters: () => void;
  clearAccountFilters: () => void;
};

function formatPortalDate(dateValue?: string) {
  if (!dateValue) return "—";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function getStatusMeta(status: AccountStatus) {
  return status === "active"
    ? { label: "Active", className: portalStyles.studentStatusActive }
    : { label: "Suspended", className: portalStyles.studentStatusDisabled };
}

function validatePassword(password: string, confirmation: string) {
  if (password !== confirmation) return "The new password and confirmation do not match.";
  if (password.length < 10) return "Use at least 10 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return "Include a letter, number, and special character.";
  }
  return null;
}

export function usePortalState(): PortalController {
  const [state, setState] = useState<PortalState>(initialState);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [configurationError] = useState(() =>
    isSupabaseConfigured() ? "" : "Supabase is not configured yet. Add the environment variables listed in .env.example.",
  );
  const [fatalError, setFatalError] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authInfo, setAuthInfo] = useState("");
  const [activeCourse, setActiveCourse] = useState<Course | "All">("All");
  const [activeResourceCategory, setActiveResourceCategory] = useState<ResourceType | "All">("All");
  const [activeResourceStatus, setActiveResourceStatus] = useState<ResourceStatus | "All">("All");
  const [resourceSearch, setResourceSearch] = useState("");
  const [accountSearch, setAccountSearch] = useState("");
  const [activeAccountCourse, setActiveAccountCourse] = useState<Course | "All">("All");
  const [activeAccountStatus, setActiveAccountStatus] = useState<"All" | AccountStatus>("All");
  const [activeAccountRole, setActiveAccountRole] = useState<AccountRoleFilter>("All");
  const [adminView, setAdminView] = useState<AdminWorkspaceView>("overview");
  const [teacherView, setTeacherView] = useState<TeacherWorkspaceView>("overview");
  const [studentView, setStudentView] = useState<StudentWorkspaceView>("dashboard");
  const [accountForm, setAccountForm] = useState<AccountFormState>(getEmptyAccountForm());
  const [accountDialogMode, setAccountDialogMode] = useState<AccountDialogMode>(null);
  const [accountDialogError, setAccountDialogError] = useState("");
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [credentialNotice, setCredentialNotice] = useState<ResetPasswordResult | null>(null);
  const [confirmation, setConfirmation] = useState<PortalConfirmation | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [resourceForm, setResourceForm] = useState<ResourceFormState>(emptyResourceForm);
  const [resourceDialogError, setResourceDialogError] = useState("");
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [resourceSorting, setResourceSorting] = useState<SortingState>([]);
  const [accountSorting, setAccountSorting] = useState<SortingState>([]);
  const [resourcePagination, setResourcePagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });
  const [accountPagination, setAccountPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 6 });
  const [accountRowSelection, setAccountRowSelection] = useState<RowSelectionState>({});
  const realtimeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();

  const refreshSnapshot = useCallback(async (userId: string, silent = false) => {
    const client = getSupabaseBrowserClient();
    if (!client) return false;
    if (!silent) setFatalError("");
    const result = await loadPortalSnapshot(client, userId);
    if (!result.ok) {
      setFatalError(result.error);
      return false;
    }
    setState(result.data);
    return true;
  }, []);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setIsInitializing(false);
      return;
    }
    const supabase = client;
    let active = true;

    async function initialize() {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      if (error && !error.message.toLowerCase().includes("session")) setAuthError(error.message);
      if (data.user) {
        setCurrentUserId(data.user.id);
        setEmail(data.user.email ?? "");
        await refreshSnapshot(data.user.id);
      }
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("recovery") === "1") setRecoveryMode(true);
        if (params.get("authError") === "invalid-link") {
          setAuthError("This password-reset link is invalid or has expired. Request a new link and try again.");
        }
        if (params.has("recovery") || params.has("authError")) {
          window.history.replaceState({}, "", window.location.pathname);
        }
      }
      if (active) setIsInitializing(false);
    }
    void initialize();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      window.setTimeout(() => {
        if (!active) return;
        if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
        if (!session?.user) {
          setCurrentUserId(null);
          setState(initialState);
          return;
        }
        setCurrentUserId(session.user.id);
        setEmail(session.user.email ?? "");
        void refreshSnapshot(session.user.id, true);
      }, 0);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshSnapshot, reloadToken]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client || !currentUserId) return;
    const channel = client
      .channel(`portal-sync-${currentUserId}`)
      .on("postgres_changes", { event: "*", schema: "public" }, () => {
        if (realtimeTimer.current) clearTimeout(realtimeTimer.current);
        realtimeTimer.current = setTimeout(() => void refreshSnapshot(currentUserId, true), 250);
      })
      .subscribe();
    return () => {
      if (realtimeTimer.current) clearTimeout(realtimeTimer.current);
      void client.removeChannel(channel);
    };
  }, [currentUserId, refreshSnapshot]);

  const currentUser = useMemo(() => state.users.find((user) => user.id === currentUserId) ?? null, [currentUserId, state.users]);
  const authView: AuthView = currentUser && (currentUser.mustChangePassword || recoveryMode) ? "password-reset" : "login";
  const selectedAccount = useMemo(
    () => state.users.find((user) => user.id === selectedAccountId && user.role !== "admin"),
    [selectedAccountId, state.users],
  );
  const teacherUsers = useMemo(() => state.users.filter((user) => user.role === "teacher"), [state.users]);
  const studentUsers = useMemo(() => state.users.filter((user) => user.role === "student"), [state.users]);
  const managedAccounts = useMemo(() => state.users.filter((user) => user.role !== "admin"), [state.users]);
  const visibleCourses = currentUser?.role === "admin" ? COURSES : currentUser?.courses ?? [];
  const hasCourseAccess = currentUser?.role === "admin" || visibleCourses.length > 0;
  const visibleResources = useMemo(() => {
    if (!currentUser) return [];
    const access = currentUser.role === "admin" ? COURSES : currentUser.courses;
    return state.resources.filter((resource) => access.includes(resource.course) && (activeCourse === "All" || resource.course === activeCourse));
  }, [activeCourse, currentUser, state.resources]);
  const teacherStudentUsers = useMemo(() => {
    if (currentUser?.role !== "teacher") return studentUsers;
    return studentUsers.filter((student) => student.courses.some((course) => currentUser.courses.includes(course)));
  }, [currentUser, studentUsers]);
  const filteredAccountRows = useMemo(() => {
    const query = accountSearch.trim().toLowerCase();
    return managedAccounts.filter((account) => {
      const search = !query || account.name.toLowerCase().includes(query) || account.email.toLowerCase().includes(query) || account.courses.join(" ").toLowerCase().includes(query);
      return (activeAccountRole === "All" || account.role === activeAccountRole) &&
        (activeAccountStatus === "All" || account.accountStatus === activeAccountStatus) &&
        (activeAccountCourse === "All" || account.courses.includes(activeAccountCourse)) && search;
    });
  }, [accountSearch, activeAccountCourse, activeAccountRole, activeAccountStatus, managedAccounts]);
  const courseSummaries = useMemo(() => COURSES.map((course) => ({
    course,
    students: studentUsers.filter((student) => student.courses.includes(course)).length,
    resources: state.resources.filter((resource) => resource.course === course).length,
  })), [state.resources, studentUsers]);
  const latestResource = state.resources[0];
  const filteredResourceRows = useMemo(() => {
    const query = resourceSearch.trim().toLowerCase();
    return visibleResources.filter((resource) => {
      const search = !query || [resource.title, resource.description, resource.url, resource.answerUrl ?? "", resource.course, resource.category, resource.status]
        .some((value) => value.toLowerCase().includes(query));
      return (activeResourceCategory === "All" || resource.category === activeResourceCategory) &&
        (activeResourceStatus === "All" || resource.status === activeResourceStatus) && search;
    });
  }, [activeResourceCategory, activeResourceStatus, resourceSearch, visibleResources]);
  const selectedAccountIds = useMemo(() => Object.keys(accountRowSelection).filter((id) => accountRowSelection[id]), [accountRowSelection]);

  function retry() { setReloadToken((value) => value + 1); setIsInitializing(true); }
  function openCreateAccount(role: "student" | "teacher" = "student") { setAccountForm(getEmptyAccountForm(role)); setEditingAccountId(null); setAccountDialogMode("create"); setAccountDialogError(""); }
  function openEditAccount(account: PortalUser) { if (account.role === "admin") return; setAccountForm(getAccountFormFromUser(account)); setEditingAccountId(account.id); setAccountDialogMode("edit"); setAccountDialogError(""); }
  function closeAccountDialog() { setAccountDialogMode(null); setEditingAccountId(null); setAccountDialogError(""); setAccountForm(getEmptyAccountForm()); }
  function dismissCredentialNotice() { setCredentialNotice(null); }
  function cancelConfirmation() { setConfirmation(null); }
  async function confirmPendingAction() { const pending = confirmation; if (!pending) return; setConfirmation(null); await pending.onConfirm(); }
  function openAccountDetails(account: PortalUser) {
    setSelectedAccountId(account.id);
    if (currentUser?.role === "teacher") setTeacherView("students");
    else setAdminView("accounts");
  }
  function closeAccountDetails() { setSelectedAccountId(null); }
  function openResourceDialog(resource?: TestResource) {
    setResourceDialogError("");
    if (resource) {
      setEditingResourceId(resource.id);
      setResourceForm({ title: resource.title, course: resource.course, category: resource.category, status: resource.status, url: resource.url, answerUrl: resource.answerUrl ?? "", answerReleaseStatus: resource.answerReleaseStatus, description: resource.description });
    } else {
      setEditingResourceId(null);
      setResourceForm({ ...emptyResourceForm, course: visibleCourses[0] ?? emptyResourceForm.course });
    }
    setIsResourceDialogOpen(true);
  }
  function closeResourceDialog() { setIsResourceDialogOpen(false); setEditingResourceId(null); setResourceDialogError(""); setResourceForm({ ...emptyResourceForm, course: visibleCourses[0] ?? emptyResourceForm.course }); }
  function toggleAccountCourse(course: Course) { setAccountForm((current) => ({ ...current, courses: current.courses.includes(course) ? current.courses.filter((item) => item !== course) : [...current.courses, course] })); }

  function handleLogin(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    void (async () => {
      const client = getSupabaseBrowserClient();
      if (!client) return;
      setIsMutating(true); setAuthError(""); setAuthInfo("");
      const { data, error } = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (error || !data.user) { setAuthError(error?.message || "Unable to sign in."); setIsMutating(false); return; }
      const loaded = await refreshSnapshot(data.user.id);
      if (loaded) {
        setCurrentUserId(data.user.id);
        void client.rpc("touch_last_seen");
      } else {
        await client.auth.signOut();
      }
      setPassword(""); setIsMutating(false);
    })();
  }

  async function requestPasswordResetEmail() {
    const client = getSupabaseBrowserClient();
    const cleanEmail = email.trim().toLowerCase();
    if (!client || !cleanEmail) { setAuthError("Enter your email first."); return; }
    setIsMutating(true); setAuthError(""); setAuthInfo("");
    const redirectTo = `${window.location.origin}/auth/confirm?next=/portal`;
    const { error } = await client.auth.resetPasswordForEmail(cleanEmail, { redirectTo });
    if (error) setAuthError(error.message);
    else setAuthInfo("Check your email for a secure password reset link.");
    setIsMutating(false);
  }

  function logout() {
    void (async () => {
      const client = getSupabaseBrowserClient();
      setIsMutating(true);
      if (client) await client.auth.signOut();
      setState(initialState); setCurrentUserId(null); setPassword(""); setAuthError(""); setAuthInfo(""); setRecoveryMode(false); setIsMutating(false);
    })();
  }

  async function handlePasswordSetup(nextPassword: string, confirmPassword: string) {
    const validation = validatePassword(nextPassword, confirmPassword);
    if (validation) return validation;
    const client = getSupabaseBrowserClient();
    if (!client || !currentUser) return "No active account is available for password setup.";
    setIsMutating(true);
    const { error } = await client.auth.updateUser({ password: nextPassword });
    if (!error) await client.rpc("mark_password_changed");
    setIsMutating(false);
    if (error) return error.message;
    setRecoveryMode(false); setAuthInfo("Password updated. Your account is ready to use.");
    await refreshSnapshot(currentUser.id);
    toast.success("Password updated", "Your account is ready to use.");
    return null;
  }

  async function saveOwnPassword(input: ChangeOwnPasswordInput, confirmPassword: string) {
    const validation = validatePassword(input.nextPassword, confirmPassword);
    if (validation) return validation;
    const client = getSupabaseBrowserClient();
    if (!client || !currentUser) return "No active account is available.";
    if (input.currentPassword) {
      const check = await client.auth.signInWithPassword({ email: currentUser.email, password: input.currentPassword });
      if (check.error) return "Your current password is incorrect.";
    }
    const { error } = await client.auth.updateUser({ password: input.nextPassword });
    if (error) return error.message;
    await client.rpc("mark_password_changed");
    toast.success("Password updated");
    return null;
  }

  async function saveOwnProfile(input: UpdateOwnProfileInput) {
    const client = getSupabaseBrowserClient();
    if (!client || !currentUser) return "No active account is available.";
    const { error } = await client.rpc("update_my_profile", { p_phone: input.phone.trim(), p_guardian_name: input.guardianName.trim(), p_address: input.address.trim() });
    if (error) return error.message;
    await refreshSnapshot(currentUser.id);
    toast.success("Profile updated", "Your contact details were saved.");
    return null;
  }

  function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void (async () => {
      setIsMutating(true); setAccountDialogError("");
      if (accountDialogMode === "create") {
        const result = await createAccount(accountForm);
        if (!result.ok) setAccountDialogError(result.error);
        else { setCredentialNotice(result.data); closeAccountDialog(); setAdminView("accounts"); if (currentUserId) await refreshSnapshot(currentUserId); toast.success("Account created", result.data.name); }
      } else if (!editingAccountId) setAccountDialogError("Choose an account to edit.");
      else {
        const result = await updateAccount(editingAccountId, accountForm);
        if (!result.ok) setAccountDialogError(result.error);
        else { closeAccountDialog(); if (currentUserId) await refreshSnapshot(currentUserId); toast.success("Account updated"); }
      }
      setIsMutating(false);
    })();
  }

  async function requestPasswordReset(userId: string) {
    setIsMutating(true);
    const result = await resetAccountPassword(userId);
    if (!result.ok) setAccountDialogError(result.error);
    else { setCredentialNotice(result.data); if (currentUserId) await refreshSnapshot(currentUserId); toast.success("Password reset", "A temporary password was issued securely."); }
    setIsMutating(false);
  }
  async function toggleManagedAccountStatus(userId: string) {
    const user = state.users.find((item) => item.id === userId); if (!user) return;
    setIsMutating(true);
    const next = user.accountStatus === "active" ? "suspended" : "active";
    const result = await setAccountStatus(userId, next);
    if (!result.ok) toast.error("Could not update account", result.error);
    else { if (currentUserId) await refreshSnapshot(currentUserId); toast.success(next === "active" ? "Account reactivated" : "Account suspended", `${user.name}'s access was updated.`); }
    setIsMutating(false);
  }
  async function removeManagedAccountNow(userId: string) {
    setIsMutating(true);
    const user = state.users.find((item) => item.id === userId);
    const result = await deleteAccount(userId);
    if (!result.ok) toast.error("Could not remove account", result.error);
    else { if (currentUserId) await refreshSnapshot(currentUserId); setAccountRowSelection((current) => { const next = { ...current }; delete next[userId]; return next; }); if (selectedAccountId === userId) closeAccountDetails(); toast.success("Account removed", user?.name); }
    setIsMutating(false);
  }
  function requestRemoveManagedAccount(userId: string) {
    const user = state.users.find((item) => item.id === userId);
    setConfirmation({ title: "Remove account?", description: `${user?.name ?? "This account"} and its linked records will be permanently deleted. This cannot be undone.`, confirmLabel: "Remove account", destructive: true, onConfirm: () => removeManagedAccountNow(userId) });
  }
  async function removeSelectedAccountsNow() {
    for (const userId of selectedAccountIds) {
      const result = await deleteAccount(userId);
      if (!result.ok) { toast.error("Could not remove accounts", result.error); return; }
    }
    setAccountRowSelection({}); if (currentUserId) await refreshSnapshot(currentUserId); toast.success(`${selectedAccountIds.length} account${selectedAccountIds.length === 1 ? "" : "s"} removed`);
  }
  function requestRemoveSelectedAccounts() {
    if (!selectedAccountIds.length) return;
    setConfirmation({ title: `Remove ${selectedAccountIds.length} selected account${selectedAccountIds.length === 1 ? "" : "s"}?`, description: "The selected accounts and their linked records will be permanently deleted.", confirmLabel: "Remove selected", destructive: true, onConfirm: removeSelectedAccountsNow });
  }

  async function savePaymentRecord(record: PaymentFormState, paymentId?: string) {
    const client = getSupabaseBrowserClient(); if (!client || !currentUser) return "You are not signed in.";
    const result = await savePaymentRecordInDatabase(client, currentUser.id, record, paymentId);
    if (!result.ok) return result.error;
    await refreshSnapshot(currentUser.id);
    toast.success(paymentId ? "Payment updated" : "Payment recorded", record.label);
    return null;
  }
  function removePaymentRecord(paymentId: string, label: string) {
    setConfirmation({
      title: "Remove payment record?",
      description: `${label} will be permanently removed. Use this only to correct an incorrect record.`,
      confirmLabel: "Remove payment",
      destructive: true,
      onConfirm: async () => {
        const client = getSupabaseBrowserClient();
        if (!client || !currentUser) return;
        const result = await deletePaymentRecord(client, paymentId);
        if (!result.ok) toast.error("Could not remove payment", result.error);
        else { await refreshSnapshot(currentUser.id); toast.success("Payment removed", label); }
      },
    });
  }
  async function changeEnquiryStatus(enquiryId: string, status: EnquiryStatus) {
    const client = getSupabaseBrowserClient(); if (!client || !currentUser) return "You are not signed in.";
    const result = await updateEnquiryStatus(client, enquiryId, status);
    if (!result.ok) return result.error;
    await refreshSnapshot(currentUser.id); toast.success("Enquiry updated"); return null;
  }
  async function saveStudentPerformance(studentId: string, form: PerformanceFormState) {
    const client = getSupabaseBrowserClient(); if (!client || !currentUser) return "You are not signed in.";
    const result = await savePerformanceRecord(client, currentUser.id, studentId, form);
    if (!result.ok) return result.error;
    await refreshSnapshot(currentUser.id); toast.success("Progress updated"); return null;
  }
  async function addStudentScore(studentId: string, form: ScoreFormState) {
    const client = getSupabaseBrowserClient(); if (!client || !currentUser) return "You are not signed in.";
    const result = await createScoreRecord(client, currentUser.id, studentId, form);
    if (!result.ok) return result.error;
    await refreshSnapshot(currentUser.id); toast.success("Assessment added", form.test); return null;
  }
  async function removeStudentScore(scoreId: string) {
    const score = selectedAccount?.scoreHistory?.find((item) => item.id === scoreId);
    setConfirmation({
      title: "Remove assessment?",
      description: `${score?.test ?? "This assessment"} will be permanently removed from the student's score history.`,
      confirmLabel: "Remove assessment",
      destructive: true,
      onConfirm: async () => {
        const client = getSupabaseBrowserClient();
        if (!client || !currentUser) return;
        const result = await deleteScoreRecord(client, scoreId);
        if (!result.ok) toast.error("Could not remove assessment", result.error);
        else { await refreshSnapshot(currentUser.id); toast.success("Assessment removed"); }
      },
    });
  }

  function saveResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void (async () => {
      const client = getSupabaseBrowserClient(); if (!client || !currentUser) return;
      if (currentUser.role === "teacher" && !currentUser.courses.includes(resourceForm.course)) { setResourceDialogError("Teachers can only manage resources for assigned courses."); return; }
      setIsMutating(true);
      const result = await saveResourceRecord(client, currentUser.id, resourceForm, editingResourceId);
      if (!result.ok) setResourceDialogError(result.error);
      else {
        await refreshSnapshot(currentUser.id);
        toast.success(editingResourceId ? "Resource updated" : "Resource created", resourceForm.title);
        closeResourceDialog();
        if (currentUser.role === "teacher") setTeacherView("resources");
        else setAdminView("library");
      }
      setIsMutating(false);
    })();
  }
  function startEditingResource(resource: TestResource) {
    openResourceDialog(resource);
    if (currentUser?.role === "teacher") setTeacherView("resources");
    else setAdminView("library");
  }
  async function removeResourceNow(resourceId: string) {
    const client = getSupabaseBrowserClient(); if (!client || !currentUser) return;
    const target = state.resources.find((resource) => resource.id === resourceId);
    const result = await removeResourceRecord(client, resourceId);
    if (!result.ok) toast.error("Could not remove resource", result.error);
    else { await refreshSnapshot(currentUser.id); toast.success("Resource removed", target?.title); }
  }
  function requestRemoveResource(resourceId: string) {
    const target = state.resources.find((resource) => resource.id === resourceId);
    setConfirmation({ title: "Remove resource?", description: `${target?.title ?? "This resource"} will be permanently removed from the library.`, confirmLabel: "Remove resource", destructive: true, onConfirm: () => removeResourceNow(resourceId) });
  }

  function exportResources() {
    const headers = ["Title", "Course", "Type", "Status", "URL", "Answer URL", "Answer Visibility", "Description", "Added On"];
    const rows = filteredResourceRows.map((resource) => [resource.title, resource.course, resource.category, resource.status, resource.url, resource.answerUrl ?? "", resource.answerReleaseStatus, resource.description, resource.addedOn]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `elevation-resources-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    toast.success("Resources exported", `${filteredResourceRows.length} rows downloaded as CSV.`);
  }
  function clearResourceFilters() { setActiveCourse("All"); setActiveResourceCategory("All"); setActiveResourceStatus("All"); setResourceSearch(""); setResourcePagination((current) => ({ ...current, pageIndex: 0 })); }
  function clearAccountFilters() { setAccountSearch(""); setActiveAccountCourse("All"); setActiveAccountStatus("All"); setActiveAccountRole("All"); setAccountPagination((current) => ({ ...current, pageIndex: 0 })); }

  useEffect(() => { setResourcePagination((current) => current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }); }, [resourceSearch, activeCourse, activeResourceCategory, activeResourceStatus]);
  useEffect(() => { setAccountPagination((current) => current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }); }, [accountSearch, activeAccountCourse, activeAccountStatus, activeAccountRole]);
  useEffect(() => { setResourcePagination((current) => { const maxPage = Math.max(0, Math.ceil(filteredResourceRows.length / current.pageSize) - 1); return current.pageIndex > maxPage ? { ...current, pageIndex: maxPage } : current; }); }, [filteredResourceRows.length]);
  useEffect(() => { setAccountPagination((current) => { const maxPage = Math.max(0, Math.ceil(filteredAccountRows.length / current.pageSize) - 1); return current.pageIndex > maxPage ? { ...current, pageIndex: maxPage } : current; }); }, [filteredAccountRows.length]);
  const resourceColumns: ColumnDef<TestResource>[] = [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <SortHeader title="Resource" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => (
          <div className={portalStyles.resourceTitleCell}>
            <strong>{row.original.title}</strong>
            <span>{row.original.description}</span>
            {row.original.answerUrl ? (
              <small className={portalStyles.resourceAnswerText}>
                {row.original.answerReleaseStatus === "Published" ? "Answer link published" : "Answer link hidden"}
              </small>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "course",
        header: ({ column }) => (
          <SortHeader title="Course" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => (
          <Badge className="inline-flex min-h-[28px] w-fit items-center rounded-full bg-[#e9fbf5] px-2.5 py-1 text-[0.72rem] font-black leading-none text-[#087365]">
            {row.original.course}
          </Badge>
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <SortHeader title="Type" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => (
          <span className="inline-flex min-h-[28px] w-fit items-center rounded-full border border-[#e1ecea] bg-[#fbfefd] px-2.5 py-1 text-[0.72rem] font-black leading-none text-[#5f7378]">
            {row.original.category}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <SortHeader title="Status" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => (
          <span
            className={cn(
              portalStyles.resourceStatusBadge,
              row.original.status === "Live"
                ? portalStyles.resourceStatusLive
                : row.original.status === "Archived"
                  ? portalStyles.resourceStatusArchived
                  : portalStyles.resourceStatusUpcoming,
            )}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "addedOn",
        header: ({ column }) => (
          <SortHeader title="Added On" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => formatPortalDate(row.original.addedOn),
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => <SortHeader title="Actions" />,
        cell: ({ row }) => {
          const canManage = currentUser?.role === "admin" || (currentUser?.role === "teacher" && currentUser.courses.includes(row.original.course));

          return (
            <div className={portalStyles.tableActions}>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label="Open resource link"
                onClick={() => window.open(row.original.url, "_blank", "noreferrer")}
                icon={<Link2 aria-hidden="true" />}
              />
              {canManage ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    aria-label="Edit resource"
                    onClick={() => startEditingResource(row.original)}
                    icon={<Pencil aria-hidden="true" />}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                aria-label="Remove resource"
                    onClick={() => requestRemoveResource(row.original.id)}
                    icon={<Trash2 aria-hidden="true" />}
                  />
                </>
              ) : null}
            </div>
          );
        },
      },
    ];

  const accountColumns: ColumnDef<PortalUser>[] = [
      {
        id: "select",
        enableSorting: false,
        header: ({ table }: { table: TanstackTable<PortalUser> }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
            aria-label="Select all accounts"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
            aria-label={`Select ${row.original.name}`}
          />
        ),
      } as ColumnDef<PortalUser>,
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortHeader title="Name" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => <strong>{row.original.name}</strong>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <SortHeader title="Email" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <SortHeader title="Role" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.role}</Badge>
        ),
      },
      {
        id: "courses",
        accessorFn: (row) => row.courses.join(", "),
        header: ({ column }) => (
          <SortHeader title="Courses" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => (
          <div className={portalStyles.coursePills}>
            {row.original.courses.length ? row.original.courses.map((course) => <Badge key={course}>{course}</Badge>) : <span>No courses</span>}
          </div>
        ),
      },
      {
        accessorKey: "accountStatus",
        header: ({ column }) => (
          <SortHeader title="Status" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => {
          const status = getStatusMeta(row.original.accountStatus);
          return <span className={cn(portalStyles.studentStatusBadge, status.className)}>{status.label}</span>;
        },
      },
      {
        accessorKey: "joinedOn",
        header: ({ column }) => (
          <SortHeader title="Joined On" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => formatPortalDate(row.original.joinedOn),
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => <SortHeader title="Actions" />,
        cell: ({ row }) => {
          const isSuspended = row.original.accountStatus === "suspended";

          return (
            <div className={portalStyles.tableActions}>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label="View account details"
                onClick={() => openAccountDetails(row.original)}
                icon={<Eye aria-hidden="true" />}
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label="Edit account"
                onClick={() => openEditAccount(row.original)}
                icon={<Pencil aria-hidden="true" />}
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label="Reset password"
                onClick={() => void requestPasswordReset(row.original.id)}
                icon={<KeyRound aria-hidden="true" />}
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label={isSuspended ? "Reactivate account" : "Suspend account"}
                onClick={() => void toggleManagedAccountStatus(row.original.id)}
                icon={isSuspended ? <ShieldCheck aria-hidden="true" /> : <Ban aria-hidden="true" />}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                aria-label="Delete account"
                onClick={() => requestRemoveManagedAccount(row.original.id)}
                icon={<Trash2 aria-hidden="true" />}
              />
            </div>
          );
        },
      },
    ];

  const resourcesTable = useReactTable({
    data: filteredResourceRows,
    columns: resourceColumns,
    state: {
      sorting: resourceSorting,
      pagination: resourcePagination,
    },
    onSortingChange: setResourceSorting,
    onPaginationChange: setResourcePagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const accountsTable = useReactTable({
    data: filteredAccountRows,
    columns: accountColumns,
    state: {
      sorting: accountSorting,
      pagination: accountPagination,
      rowSelection: accountRowSelection,
    },
    enableRowSelection: true,
    getRowId: (row) => row.id,
    onSortingChange: setAccountSorting,
    onPaginationChange: setAccountPagination,
    onRowSelectionChange: setAccountRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    state, currentUser, authView, isInitializing, isMutating, configurationError, fatalError, retry,
    email, setEmail, password, setPassword, authError, setAuthError, authInfo, setAuthInfo, requestPasswordResetEmail,
    activeCourse, setActiveCourse, activeResourceCategory, setActiveResourceCategory, activeResourceStatus, setActiveResourceStatus,
    resourceSearch, setResourceSearch, accountSearch, setAccountSearch, activeAccountCourse, setActiveAccountCourse,
    activeAccountStatus, setActiveAccountStatus, activeAccountRole, setActiveAccountRole, adminView, setAdminView,
    teacherView, setTeacherView, studentView, setStudentView, accountForm, setAccountForm, accountDialogMode,
    accountDialogError, setAccountDialogError, editingAccountId, openCreateAccount, openEditAccount, closeAccountDialog,
    credentialNotice, dismissCredentialNotice, selectedAccountId, selectedAccount, openAccountDetails, closeAccountDetails,
    resourceForm, setResourceForm, resourceDialogError, setResourceDialogError, editingResourceId, isResourceDialogOpen,
    openResourceDialog, closeResourceDialog, resourcePagination, setResourcePagination, accountPagination, setAccountPagination,
    accountRowSelection, setAccountRowSelection, visibleCourses, visibleResources, studentUsers, teacherUsers,
    teacherStudentUsers, managedAccounts, filteredAccountRows, courseSummaries, latestResource, filteredResourceRows,
    selectedAccountIds, resourcesTable, accountsTable, hasCourseAccess, confirmation, cancelConfirmation,
    confirmPendingAction, handleLogin, logout, handlePasswordSetup, saveOwnPassword, saveOwnProfile, saveAccount,
    toggleAccountCourse, requestPasswordReset, toggleManagedAccountStatus, savePaymentRecord, removePaymentRecord, changeEnquiryStatus, saveStudentPerformance,
    addStudentScore, removeStudentScore, saveResource, exportResources, startEditingResource,
    removeResource: requestRemoveResource, removeManagedAccount: requestRemoveManagedAccount,
    removeSelectedAccounts: requestRemoveSelectedAccounts, clearResourceFilters, clearAccountFilters,
  };
}
