"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Ban,
  Eye,
  KeyRound,
  Link2,
  Pencil,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  CATEGORIES,
  COURSES,
  emptyPaymentForm,
  emptyResourceForm,
  initialState,
} from "./portal.data";
import { getAccountFormFromUser, getEmptyAccountForm, createAccount, createPaymentRecord, changeOwnPassword, removeAccount, resetAccountPassword, saveResourceRecord, signIn, toggleAccountStatus, updateAccount, updateOwnProfile } from "./portal.service";
import { portalStyles } from "./portalShared";
import { loadPortalState, savePortalState, SESSION_KEY } from "./portal.storage";
import type {
  AccountFormState,
  AccountStatus,
  AdminWorkspaceView,
  ChangeOwnPasswordInput,
  Course,
  PaymentFormState,
  PortalState,
  PortalUser,
  ResourceFormState,
  ResourceStatus,
  ResourceType,
  ResetPasswordResult,
  StudentWorkspaceView,
  TeacherWorkspaceView,
  TestResource,
  UpdateOwnProfileInput,
  UserRole,
} from "./portal.types";
import { SortHeader } from "./components/PortalTable";

type TanstackTable<TData> = ReturnType<typeof useReactTable<TData>>;
type AuthView = "login" | "password-reset";
type AccountRoleFilter = "All" | "student" | "teacher";
type AccountDialogMode = "create" | "edit" | null;

export type PortalController = {
  state: PortalState;
  currentUser: PortalUser | null;
  authView: AuthView;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  authError: string;
  setAuthError: (value: string) => void;
  authInfo: string;
  setAuthInfo: (value: string) => void;
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
  handleLogin: (event: FormEvent<HTMLFormElement>) => void;
  logout: () => void;
  handlePasswordSetup: (nextPassword: string, confirmPassword: string) => Promise<string | null>;
  saveOwnPassword: (input: ChangeOwnPasswordInput, confirmPassword: string) => Promise<string | null>;
  saveOwnProfile: (input: UpdateOwnProfileInput) => Promise<string | null>;
  saveAccount: (event: FormEvent<HTMLFormElement>) => void;
  toggleAccountCourse: (course: Course) => void;
  requestPasswordReset: (userId: string) => Promise<void>;
  toggleManagedAccountStatus: (userId: string) => Promise<void>;
  savePaymentRecord: (record: PaymentFormState) => Promise<string | null>;
  saveResource: (event: FormEvent<HTMLFormElement>) => void;
  exportResources: () => void;
  startEditingResource: (resource: TestResource) => void;
  removeResource: (resourceId: string) => void;
  removeManagedAccount: (userId: string) => Promise<void>;
  removeSelectedAccounts: () => Promise<void>;
  clearResourceFilters: () => void;
  clearAccountFilters: () => void;
  resetDemoData: () => void;
};

function formatPortalDate(dateValue?: string) {
  if (!dateValue) return "01 Jul 2026";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusMeta(status: AccountStatus) {
  if (status === "active") {
    return {
      label: "Active",
      className: portalStyles.studentStatusActive,
    };
  }

  return {
    label: "Suspended",
    className: portalStyles.studentStatusDisabled,
  };
}

export function usePortalState(): PortalController {
  const [state, setState] = useState<PortalState>(initialState);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [resourceForm, setResourceForm] = useState<ResourceFormState>(emptyResourceForm);
  const [resourceDialogError, setResourceDialogError] = useState("");
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [resourceSorting, setResourceSorting] = useState<SortingState>([]);
  const [accountSorting, setAccountSorting] = useState<SortingState>([]);
  const [resourcePagination, setResourcePagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [accountPagination, setAccountPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });
  const [accountRowSelection, setAccountRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    const nextState = loadPortalState();
    const sessionUserId = window.localStorage.getItem(SESSION_KEY);
    const sessionUserExists = nextState.users.some((user) => user.id === sessionUserId);

    setState(nextState);
    setCurrentUserId(sessionUserExists ? sessionUserId : null);
  }, []);

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === currentUserId) ?? null,
    [currentUserId, state.users],
  );
  const currentCredential = useMemo(
    () => state.credentials.find((credential) => credential.userId === currentUserId) ?? null,
    [currentUserId, state.credentials],
  );
  const authView: AuthView = currentUser && currentCredential?.mustChangePassword ? "password-reset" : "login";
  const selectedAccount = useMemo(
    () => state.users.find((user) => user.id === selectedAccountId && user.role !== "admin"),
    [selectedAccountId, state.users],
  );

  const teacherUsers = useMemo(
    () => state.users.filter((user) => user.role === "teacher"),
    [state.users],
  );
  const studentUsers = useMemo(
    () => state.users.filter((user) => user.role === "student"),
    [state.users],
  );
  const managedAccounts = useMemo(
    () => state.users.filter((user) => user.role !== "admin"),
    [state.users],
  );

  const visibleCourses = currentUser?.role === "admin" ? COURSES : currentUser?.courses ?? [];
  const hasCourseAccess = currentUser?.role === "admin" || visibleCourses.length > 0;

  const visibleResources = useMemo(() => {
    if (!currentUser) return [];

    const courseAccess = currentUser.role === "admin" ? COURSES : currentUser.courses;

    return state.resources.filter((resource) => {
      const hasCourseMatch = courseAccess.includes(resource.course);
      const matchesCourseFilter = activeCourse === "All" || resource.course === activeCourse;

      return hasCourseMatch && matchesCourseFilter;
    });
  }, [activeCourse, currentUser, state.resources]);

  const teacherStudentUsers = useMemo(() => {
    if (currentUser?.role !== "teacher") {
      return studentUsers;
    }

    return studentUsers.filter((student) =>
      student.courses.some((course) => currentUser.courses.includes(course)),
    );
  }, [currentUser, studentUsers]);

  const filteredAccountRows = useMemo(() => {
    const query = accountSearch.trim().toLowerCase();

    return managedAccounts.filter((account) => {
      const matchesRole = activeAccountRole === "All" || account.role === activeAccountRole;
      const matchesStatus = activeAccountStatus === "All" || account.accountStatus === activeAccountStatus;
      const matchesCourse = activeAccountCourse === "All" || account.courses.includes(activeAccountCourse);
      const matchesSearch =
        !query ||
        account.name.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query) ||
        account.courses.join(" ").toLowerCase().includes(query);

      return matchesRole && matchesStatus && matchesCourse && matchesSearch;
    });
  }, [accountSearch, activeAccountCourse, activeAccountRole, activeAccountStatus, managedAccounts]);

  const courseSummaries = useMemo(
    () =>
      COURSES.map((course) => ({
        course,
        students: studentUsers.filter((student) => student.courses.includes(course)).length,
        resources: state.resources.filter((resource) => resource.course === course).length,
      })),
    [state.resources, studentUsers],
  );

  const latestResource = state.resources[0];

  const filteredResourceRows = useMemo(() => {
    const query = resourceSearch.trim().toLowerCase();

    return visibleResources.filter((resource) => {
      const matchesCategory =
        activeResourceCategory === "All" || resource.category === activeResourceCategory;
      const matchesStatus = activeResourceStatus === "All" || resource.status === activeResourceStatus;
      const matchesSearch =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.url.toLowerCase().includes(query) ||
        resource.answerUrl?.toLowerCase().includes(query) ||
        resource.course.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query) ||
        resource.status.toLowerCase().includes(query);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [activeResourceCategory, activeResourceStatus, resourceSearch, visibleResources]);

  const selectedAccountIds = useMemo(
    () => Object.keys(accountRowSelection).filter((id) => accountRowSelection[id]),
    [accountRowSelection],
  );

  function updateState(nextState: PortalState) {
    setState(nextState);
    savePortalState(nextState);
  }

  function clearAuthFields() {
    setEmail("");
    setPassword("");
    setAuthError("");
  }

  function openCreateAccount(role: "student" | "teacher" = "student") {
    setAccountForm(getEmptyAccountForm(role));
    setEditingAccountId(null);
    setAccountDialogMode("create");
    setAccountDialogError("");
  }

  function openEditAccount(account: PortalUser) {
    if (account.role === "admin") return;
    setAccountForm(getAccountFormFromUser(account));
    setEditingAccountId(account.id);
    setAccountDialogMode("edit");
    setAccountDialogError("");
  }

  function closeAccountDialog() {
    setAccountDialogMode(null);
    setEditingAccountId(null);
    setAccountDialogError("");
    setAccountForm(getEmptyAccountForm());
  }

  function dismissCredentialNotice() {
    setCredentialNotice(null);
  }

  function openAccountDetails(account: PortalUser) {
    setSelectedAccountId(account.id);
    if (currentUser?.role === "teacher") {
      setTeacherView("students");
    } else {
      setAdminView("accounts");
    }
  }

  function closeAccountDetails() {
    setSelectedAccountId(null);
  }

  function openResourceDialog(resource?: TestResource) {
    setResourceDialogError("");

    if (resource) {
      setEditingResourceId(resource.id);
      setResourceForm({
        title: resource.title,
        course: resource.course,
        category: resource.category,
        status: resource.status,
        url: resource.url,
        answerUrl: resource.answerUrl ?? "",
        answerReleaseStatus: resource.answerReleaseStatus,
        description: resource.description,
      });
    } else {
      setEditingResourceId(null);
      setResourceForm({
        ...emptyResourceForm,
        course: visibleCourses[0] ?? emptyResourceForm.course,
      });
    }

    setIsResourceDialogOpen(true);
  }

  function closeResourceDialog() {
    setIsResourceDialogOpen(false);
    setEditingResourceId(null);
    setResourceDialogError("");
    setResourceForm({
      ...emptyResourceForm,
      course: visibleCourses[0] ?? emptyResourceForm.course,
    });
  }

  function toggleAccountCourse(course: Course) {
    setAccountForm((current) => {
      const hasCourse = current.courses.includes(course);
      const nextCourses = hasCourse
        ? current.courses.filter((candidate) => candidate !== course)
        : [...current.courses, course];

      return {
        ...current,
        courses: nextCourses,
      };
    });
  }

  async function handlePasswordSetup(nextPassword: string, confirmPassword: string) {
    if (!currentUser) {
      return "No active account is available for password setup.";
    }

    if (nextPassword !== confirmPassword) {
      return "The new password and confirmation do not match.";
    }

    const result = await changeOwnPassword(
      state,
      currentUser.id,
      { nextPassword },
      false,
    );

    if (!result.ok) {
      return result.error;
    }

    updateState(result.data);
    setAuthInfo("Password updated. Your account is ready to use.");
    setPassword("");
    return null;
  }

  async function saveOwnPassword(input: ChangeOwnPasswordInput, confirmPassword: string) {
    if (!currentUser) {
      return "No active account is available.";
    }

    if (input.nextPassword !== confirmPassword) {
      return "The new password and confirmation do not match.";
    }

    const result = await changeOwnPassword(state, currentUser.id, input, true);

    if (!result.ok) {
      return result.error;
    }

    updateState(result.data);
    return null;
  }

  async function saveOwnProfile(input: UpdateOwnProfileInput) {
    if (!currentUser) {
      return "No active account is available.";
    }

    const result = await updateOwnProfile(state, currentUser.id, input);

    if (!result.ok) {
      return result.error;
    }

    updateState(result.data);
    return null;
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void (async () => {
      const result = await signIn(state, email, password);

      if (!result.ok) {
        setAuthError(result.error);
        return;
      }

      window.localStorage.setItem(SESSION_KEY, result.data.userId);
      setCurrentUserId(result.data.userId);
      setAdminView("overview");
      setTeacherView("overview");
      setStudentView("dashboard");
      setActiveCourse("All");
      setActiveResourceCategory("All");
      setActiveResourceStatus("All");
      setResourceSearch("");
      setAccountSearch("");
      setActiveAccountCourse("All");
      setActiveAccountStatus("All");
      setActiveAccountRole("All");
      setAccountRowSelection({});
      closeAccountDetails();
      setAuthInfo(result.data.mustChangePassword ? "Set a new password before continuing." : "");
      clearAuthFields();
    })();
  }

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    setCurrentUserId(null);
    setAuthInfo("");
    clearAuthFields();
    setActiveCourse("All");
    setActiveResourceCategory("All");
    setActiveResourceStatus("All");
    setResourceSearch("");
    clearAccountFilters();
    closeAccountDetails();
    closeAccountDialog();
    closeResourceDialog();
    setAccountRowSelection({});
  }

  function clearResourceFilters() {
    setActiveCourse("All");
    setActiveResourceCategory("All");
    setActiveResourceStatus("All");
    setResourceSearch("");
    setResourcePagination((current) => ({ ...current, pageIndex: 0 }));
  }

  function clearAccountFilters() {
    setAccountSearch("");
    setActiveAccountCourse("All");
    setActiveAccountStatus("All");
    setActiveAccountRole("All");
    setAccountPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void (async () => {
      if (accountDialogMode === "create") {
        const result = await createAccount(state, accountForm);

        if (!result.ok) {
          setAccountDialogError(result.error);
          return;
        }

        updateState(result.data.state);
        setCredentialNotice(result.data.result);
        closeAccountDialog();
        setAdminView("accounts");
        return;
      }

      if (!editingAccountId) {
        setAccountDialogError("Choose an account to edit.");
        return;
      }

      const result = await updateAccount(state, editingAccountId, accountForm);

      if (!result.ok) {
        setAccountDialogError(result.error);
        return;
      }

      updateState(result.data);
      closeAccountDialog();
    })();
  }

  async function requestPasswordReset(userId: string) {
    const result = await resetAccountPassword(state, userId);

    if (!result.ok) {
      setAccountDialogError(result.error);
      return;
    }

    updateState(result.data.state);
    setCredentialNotice(result.data.result);
  }

  async function toggleManagedAccountStatus(userId: string) {
    const result = await toggleAccountStatus(state, userId);

    if (!result.ok) {
      setAccountDialogError(result.error);
      return;
    }

    updateState(result.data);

    if (userId === currentUserId) {
      logout();
    }
  }

  async function removeManagedAccount(userId: string) {
    const result = await removeAccount(state, userId);

    if (!result.ok) {
      setAccountDialogError(result.error);
      return;
    }

    updateState(result.data);
    setAccountRowSelection((current) => {
      const next = { ...current };
      delete next[userId];
      return next;
    });

    if (selectedAccountId === userId) {
      closeAccountDetails();
    }
  }

  async function removeSelectedAccounts() {
    for (const userId of selectedAccountIds) {
      await removeManagedAccount(userId);
    }

    setAccountRowSelection({});
  }

  async function savePaymentRecord(record: PaymentFormState) {
    const result = await createPaymentRecord(state, record);

    if (!result.ok) {
      return result.error;
    }

    updateState(result.data);
    return null;
  }

  function saveResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void (async () => {
      if (currentUser?.role === "teacher" && !currentUser.courses.includes(resourceForm.course)) {
        setResourceDialogError("Teachers can only manage resources for their assigned courses.");
        return;
      }

      const result = await saveResourceRecord(state, resourceForm, editingResourceId);

      if (!result.ok) {
        setResourceDialogError(result.error);
        return;
      }

      updateState(result.data);
      closeResourceDialog();
      setResourcePagination((current) => ({ ...current, pageIndex: 0 }));
      if (currentUser?.role === "teacher") {
        setTeacherView("resources");
      } else {
        setAdminView("library");
      }
    })();
  }

  function startEditingResource(resource: TestResource) {
    openResourceDialog(resource);
    if (currentUser?.role === "teacher") {
      setTeacherView("resources");
    } else {
      setAdminView("library");
    }
  }

  function removeResource(resourceId: string) {
    const target = state.resources.find((resource) => resource.id === resourceId);
    if (!target) return;

    if (currentUser?.role === "teacher" && !currentUser.courses.includes(target.course)) {
      return;
    }

    updateState({
      ...state,
      resources: state.resources.filter((resource) => resource.id !== resourceId),
    });
  }

  function exportResources() {
    const headers = ["Title", "Course", "Type", "Status", "URL", "Answer URL", "Answer Visibility", "Description", "Added On"];
    const rows = filteredResourceRows.map((resource) => [
      resource.title,
      resource.course,
      resource.category,
      resource.status,
      resource.url,
      resource.answerUrl ?? "",
      resource.answerReleaseStatus,
      resource.description,
      resource.addedOn,
    ]);
    const escapeCsvValue = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `kulkaran-resources-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function resetDemoData() {
    savePortalState(initialState);
    window.localStorage.removeItem(SESSION_KEY);
    setState(initialState);
    setCurrentUserId(null);
    setAuthInfo("");
    clearAuthFields();
    clearResourceFilters();
    clearAccountFilters();
    closeAccountDetails();
    closeAccountDialog();
    closeResourceDialog();
    setCredentialNotice(null);
    setAccountRowSelection({});
  }

  useEffect(() => {
    setResourcePagination((current) => (current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }));
  }, [resourceSearch, activeCourse, activeResourceCategory, activeResourceStatus]);

  useEffect(() => {
    setAccountPagination((current) => (current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }));
  }, [accountSearch, activeAccountCourse, activeAccountStatus, activeAccountRole]);

  useEffect(() => {
    setResourcePagination((current) => {
      const maxPage = Math.max(0, Math.ceil(filteredResourceRows.length / current.pageSize) - 1);
      return current.pageIndex > maxPage ? { ...current, pageIndex: maxPage } : current;
    });
  }, [filteredResourceRows.length]);

  useEffect(() => {
    setAccountPagination((current) => {
      const maxPage = Math.max(0, Math.ceil(filteredAccountRows.length / current.pageSize) - 1);
      return current.pageIndex > maxPage ? { ...current, pageIndex: maxPage } : current;
    });
  }, [filteredAccountRows.length]);

  const resourceColumns = useMemo<ColumnDef<TestResource>[]>(
    () => [
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
                    onClick={() => removeResource(row.original.id)}
                    icon={<Trash2 aria-hidden="true" />}
                  />
                </>
              ) : null}
            </div>
          );
        },
      },
    ],
    [currentUser, removeResource, startEditingResource],
  );

  const accountColumns = useMemo<ColumnDef<PortalUser>[]>(
    () => [
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
        cell: ({ row }: { row: any }) => (
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
                onClick={() => void removeManagedAccount(row.original.id)}
                icon={<Trash2 aria-hidden="true" />}
              />
            </div>
          );
        },
      },
    ],
    [openAccountDetails, openEditAccount, removeManagedAccount, requestPasswordReset, toggleManagedAccountStatus],
  );

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
    state,
    currentUser,
    authView,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    setAuthError,
    authInfo,
    setAuthInfo,
    activeCourse,
    setActiveCourse,
    activeResourceCategory,
    setActiveResourceCategory,
    activeResourceStatus,
    setActiveResourceStatus,
    resourceSearch,
    setResourceSearch,
    accountSearch,
    setAccountSearch,
    activeAccountCourse,
    setActiveAccountCourse,
    activeAccountStatus,
    setActiveAccountStatus,
    activeAccountRole,
    setActiveAccountRole,
    adminView,
    setAdminView,
    teacherView,
    setTeacherView,
    studentView,
    setStudentView,
    accountForm,
    setAccountForm,
    accountDialogMode,
    accountDialogError,
    setAccountDialogError,
    editingAccountId,
    openCreateAccount,
    openEditAccount,
    closeAccountDialog,
    credentialNotice,
    dismissCredentialNotice,
    selectedAccountId,
    selectedAccount,
    openAccountDetails,
    closeAccountDetails,
    resourceForm,
    setResourceForm,
    resourceDialogError,
    setResourceDialogError,
    editingResourceId,
    isResourceDialogOpen,
    openResourceDialog,
    closeResourceDialog,
    resourcePagination,
    setResourcePagination,
    accountPagination,
    setAccountPagination,
    accountRowSelection,
    setAccountRowSelection,
    visibleCourses,
    visibleResources,
    studentUsers,
    teacherUsers,
    teacherStudentUsers,
    managedAccounts,
    filteredAccountRows,
    courseSummaries,
    latestResource,
    filteredResourceRows,
    selectedAccountIds,
    resourcesTable,
    accountsTable,
    hasCourseAccess,
    handleLogin,
    logout,
    handlePasswordSetup,
    saveOwnPassword,
    saveOwnProfile,
    saveAccount,
    toggleAccountCourse,
    requestPasswordReset,
    toggleManagedAccountStatus,
    savePaymentRecord,
    saveResource,
    exportResources,
    startEditingResource,
    removeResource,
    removeManagedAccount,
    removeSelectedAccounts,
    clearResourceFilters,
    clearAccountFilters,
    resetDemoData,
  };
}
