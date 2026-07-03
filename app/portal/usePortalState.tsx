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
  BookOpen,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  Eye,
  Link2,
  FileText,
  Globe2,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type {
  AdminView,
  Course,
  PortalState,
  PortalUser,
  ResourceFormState,
  ResourceStatus,
  ResourceType,
  PaymentFormState,
  StudentFormState,
  TestResource,
} from "./portal.types";
import { COURSES, CATEGORIES, emptyPaymentForm, emptyResourceForm, emptyStudentForm, initialState } from "./portal.data";
import { portalStyles } from "./portalShared";
import { createId, loadPortalState, savePortalState, SESSION_KEY } from "./portal.storage";
import { SortHeader } from "./components/PortalTable";

type TanstackTable<TData> = ReturnType<typeof useReactTable<TData>>;

export type PortalController = {
  state: PortalState;
  currentUser: PortalUser | null;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  error: string;
  setError: (value: string) => void;
  activeCourse: Course | "All";
  setActiveCourse: (value: Course | "All") => void;
  activeResourceCategory: ResourceType | "All";
  setActiveResourceCategory: (value: ResourceType | "All") => void;
  activeStudentCourse: Course | "All";
  setActiveStudentCourse: (value: Course | "All") => void;
  activeStudentStatus: "All" | "Active" | "Disabled";
  setActiveStudentStatus: (value: "All" | "Active" | "Disabled") => void;
  studentSearch: string;
  setStudentSearch: (value: string) => void;
  activeResourceStatus: ResourceStatus | "All";
  setActiveResourceStatus: (value: ResourceStatus | "All") => void;
  resourceSearch: string;
  setResourceSearch: (value: string) => void;
  activeAdminView: AdminView;
  setActiveAdminView: (value: AdminView) => void;
  loginRole: PortalUser["role"];
  setLoginRole: (value: PortalUser["role"]) => void;
  studentForm: StudentFormState;
  setStudentForm: Dispatch<SetStateAction<StudentFormState>>;
  resourceForm: ResourceFormState;
  setResourceForm: Dispatch<SetStateAction<ResourceFormState>>;
  editingResourceId: string | null;
  isResourceDialogOpen: boolean;
  openResourceDialog: (resource?: TestResource) => void;
  closeResourceDialog: () => void;
  editingStudentId: string | null;
  editStudentForm: StudentFormState;
  setEditStudentForm: Dispatch<SetStateAction<StudentFormState>>;
  isAddStudentDialogOpen: boolean;
  setIsAddStudentDialogOpen: Dispatch<SetStateAction<boolean>>;
  selectedStudentId: string | null;
  selectedStudent: PortalUser | undefined;
  resourcePagination: PaginationState;
  setResourcePagination: Dispatch<SetStateAction<PaginationState>>;
  studentPagination: PaginationState;
  setStudentPagination: Dispatch<SetStateAction<PaginationState>>;
  studentRowSelection: RowSelectionState;
  setStudentRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  visibleCourses: Course[];
  visibleResources: TestResource[];
  studentUsers: PortalUser[];
  filteredStudentRows: PortalUser[];
  courseSummaries: Array<{ course: Course; students: number; resources: number }>;
  latestResource: TestResource | undefined;
  groupedResources: Array<{ category: ResourceType; resources: TestResource[] }>;
  filteredResourceRows: TestResource[];
  selectedStudentIds: string[];
  resourcesTable: TanstackTable<TestResource>;
  studentsTable: TanstackTable<PortalUser>;
  handleLogin: (event: FormEvent<HTMLFormElement>) => void;
  logout: () => void;
  toggleStudentCourse: (course: Course) => void;
  toggleEditStudentCourse: (course: Course) => void;
  startEditingStudent: (student: PortalUser) => void;
  cancelEditingStudent: () => void;
  saveStudentEdit: (event: FormEvent<HTMLFormElement>) => void;
  addStudent: (event: FormEvent<HTMLFormElement>) => void;
  openStudentDetails: (student: PortalUser) => void;
  closeStudentDetails: () => void;
  savePaymentRecord: (record: PaymentFormState) => void;
  saveResource: (event: FormEvent<HTMLFormElement>) => void;
  exportResources: () => void;
  startEditingResource: (resource: TestResource) => void;
  removeResource: (resourceId: string) => void;
  removeStudent: (userId: string) => void;
  removeSelectedStudents: () => void;
  clearResourceFilters: () => void;
  resetDemoData: () => void;
};

export function usePortalState(): PortalController {
  const [state, setState] = useState<PortalState>(initialState);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeCourse, setActiveCourse] = useState<Course | "All">("All");
  const [activeResourceCategory, setActiveResourceCategory] = useState<ResourceType | "All">("All");
  const [activeStudentCourse, setActiveStudentCourse] = useState<Course | "All">("All");
  const [activeStudentStatus, setActiveStudentStatus] = useState<"All" | "Active" | "Disabled">("All");
  const [studentSearch, setStudentSearch] = useState("");
  const [activeResourceStatus, setActiveResourceStatus] = useState<ResourceStatus | "All">("All");
  const [resourceSearch, setResourceSearch] = useState("");
  const [activeAdminView, setActiveAdminView] = useState<AdminView>("overview");
  const [loginRole, setLoginRole] = useState<PortalUser["role"]>("student");
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [resourceForm, setResourceForm] = useState(emptyResourceForm);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editStudentForm, setEditStudentForm] = useState(emptyStudentForm);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [resourceSorting, setResourceSorting] = useState<SortingState>([]);
  const [studentSorting, setStudentSorting] = useState<SortingState>([]);
  const [resourcePagination, setResourcePagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [studentPagination, setStudentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });
  const [studentRowSelection, setStudentRowSelection] = useState<RowSelectionState>({});

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
  const selectedStudent = useMemo(
    () => state.users.find((user) => user.id === selectedStudentId && user.role === "student"),
    [selectedStudentId, state.users],
  );

  const visibleCourses = currentUser?.role === "admin" ? COURSES : currentUser?.courses ?? [];

  const visibleResources = useMemo(() => {
    if (!currentUser) return [];

    const courseAccess = currentUser.role === "admin" ? COURSES : currentUser.courses;

    return state.resources.filter((resource) => {
      const hasCourseAccess = courseAccess.includes(resource.course);
      const matchesActiveCourse = activeCourse === "All" || resource.course === activeCourse;

      return hasCourseAccess && matchesActiveCourse;
    });
  }, [activeCourse, currentUser, state.resources]);

  const studentUsers = useMemo(
    () => state.users.filter((user) => user.role === "student"),
    [state.users],
  );

  const filteredStudentRows = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();

    return studentUsers.filter((student) => {
      const status = student.courses.length > 0 ? "Active" : "Disabled";
      const matchesCourse = activeStudentCourse === "All" || student.courses.includes(activeStudentCourse);
      const matchesStatus = activeStudentStatus === "All" || status === activeStudentStatus;
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.courses.join(" ").toLowerCase().includes(query);

      return matchesCourse && matchesStatus && matchesSearch;
    });
  }, [activeStudentCourse, activeStudentStatus, studentSearch, studentUsers]);

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

  const groupedResources = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        resources: visibleResources.filter((resource) => resource.category === category),
      })),
    [visibleResources],
  );

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

  const selectedStudentIds = useMemo(
    () => Object.keys(studentRowSelection).filter((id) => studentRowSelection[id]),
    [studentRowSelection],
  );
  const canManageStudents = currentUser?.role === "admin";

  function getResourceTypeMeta(category: ResourceType) {
    if (category === "Live Test") {
      return { className: portalStyles.resourceTypeLive, Icon: Link2 };
    }
    if (category === "Previous Test") {
      return { className: portalStyles.resourceTypePrevious, Icon: FileText };
    }
    if (category === "Study Material") {
      return { className: portalStyles.resourceTypeStudy, Icon: BookOpen };
    }
    return { className: portalStyles.resourceTypeRevision, Icon: BookOpenCheck };
  }

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

  function openStudentDetails(student: PortalUser) {
    setSelectedStudentId(student.id);
    setActiveAdminView("students");
  }

  function closeStudentDetails() {
    setSelectedStudentId(null);
  }

  function savePaymentRecord(record: PaymentFormState) {
    if (!record.studentId) return;

    const amount = Number(record.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;

    updateState((current) => ({
      ...current,
      users: current.users.map((user) => {
        if (user.id !== record.studentId || user.role !== "student") return user;

        const currentRecords = user.payments?.records ?? [];
        const nextRecords = [
          {
            id: createId("payment"),
            label: record.label.trim(),
            amount,
            date: record.date,
            method: record.method,
            invoice: record.invoice.trim() || `INV-${createId("inv").slice(-4)}`,
            status: record.status,
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
    }));
  }

  function updateState(updater: (current: PortalState) => PortalState) {
    setState((current) => {
      const nextState = updater(current);
      savePortalState(nextState);
      return nextState;
    });
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = state.users.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.trim().toLowerCase() &&
        candidate.password === password &&
        candidate.role === loginRole,
    );

    if (!user) {
      setError(`Check the ${loginRole} email and password, then try again.`);
      return;
    }

    window.localStorage.setItem(SESSION_KEY, user.id);
    setCurrentUserId(user.id);
    setLoginRole(user.role);
    setActiveCourse("All");
    setActiveResourceCategory("All");
    setActiveResourceStatus("All");
    setResourceSearch("");
    closeStudentDetails();
    setError("");
    setEmail("");
    setPassword("");
  }

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    setCurrentUserId(null);
    setActiveCourse("All");
    setActiveResourceCategory("All");
    setActiveResourceStatus("All");
    setResourceSearch("");
    closeStudentDetails();
    setStudentRowSelection({});
    closeResourceDialog();
  }

  function clearResourceFilters() {
    setActiveCourse("All");
    setActiveResourceCategory("All");
    setActiveResourceStatus("All");
    setResourceSearch("");
    setResourcePagination((current) => ({ ...current, pageIndex: 0 }));
  }

  function toggleStudentCourse(course: Course) {
    setStudentForm((current) => {
      const hasCourse = current.courses.includes(course);
      const nextCourses = hasCourse
        ? current.courses.filter((candidate) => candidate !== course)
        : [...current.courses, course];

      return {
        ...current,
        courses: nextCourses.length > 0 ? nextCourses : current.courses,
      };
    });
  }

  function toggleEditStudentCourse(course: Course) {
    setEditStudentForm((current) => {
      const hasCourse = current.courses.includes(course);
      const nextCourses = hasCourse
        ? current.courses.filter((candidate) => candidate !== course)
        : [...current.courses, course];

      return {
        ...current,
        courses: nextCourses.length > 0 ? nextCourses : current.courses,
      };
    });
  }

  function startEditingStudent(student: PortalUser) {
    setEditingStudentId(student.id);
    setEditStudentForm({
      name: student.name,
      email: student.email,
      password: student.password,
      courses: student.courses,
    });
  }

  function cancelEditingStudent() {
    setEditingStudentId(null);
    setEditStudentForm(emptyStudentForm);
  }

  function saveStudentEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingStudentId) return;

    updateState((current) => ({
      ...current,
      users: current.users.map((user) =>
        user.id === editingStudentId
          ? {
              ...user,
              name: editStudentForm.name.trim(),
              email: editStudentForm.email.trim(),
              password: editStudentForm.password,
              courses: editStudentForm.courses,
            }
          : user,
      ),
    }));
    cancelEditingStudent();
  }

  function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateState((current) => ({
      ...current,
      users: [
        ...current.users,
        {
          id: createId("student"),
          role: "student",
          name: studentForm.name.trim(),
          email: studentForm.email.trim(),
          password: studentForm.password,
          courses: studentForm.courses,
          joinedOn: new Date().toISOString().slice(0, 10),
        },
      ],
    }));
    setStudentForm(emptyStudentForm);
    setStudentRowSelection({});
    setStudentPagination((current) => ({ ...current, pageIndex: 0 }));
    setActiveAdminView("students");
    setIsAddStudentDialogOpen(false);
  }

  function openResourceDialog(resource?: TestResource) {
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
      setResourceForm(emptyResourceForm);
    }

    setIsResourceDialogOpen(true);
  }

  function closeResourceDialog() {
    setIsResourceDialogOpen(false);
    setEditingResourceId(null);
    setResourceForm(emptyResourceForm);
  }

  function saveResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateState((current) => ({
      ...current,
      resources:
        editingResourceId === null
          ? [
              {
                id: createId("resource"),
                addedOn: new Date().toISOString().slice(0, 10),
                title: resourceForm.title.trim(),
                course: resourceForm.course,
                category: resourceForm.category,
                status: resourceForm.status,
                url: resourceForm.url.trim(),
                answerUrl: resourceForm.answerUrl.trim() || undefined,
                answerReleaseStatus: resourceForm.answerUrl.trim()
                  ? resourceForm.answerReleaseStatus
                  : "Hidden",
                description: resourceForm.description.trim(),
              },
              ...current.resources,
            ]
          : current.resources.map((resource) =>
              resource.id === editingResourceId
                ? {
                    ...resource,
                    title: resourceForm.title.trim(),
                    course: resourceForm.course,
                    category: resourceForm.category,
                    status: resourceForm.status,
                    url: resourceForm.url.trim(),
                    answerUrl: resourceForm.answerUrl.trim() || undefined,
                    answerReleaseStatus: resourceForm.answerUrl.trim()
                      ? resourceForm.answerReleaseStatus
                      : "Hidden",
                    description: resourceForm.description.trim(),
                  }
                : resource,
            ),
    }));
    closeResourceDialog();
    setResourcePagination((current) => ({ ...current, pageIndex: 0 }));
    setActiveAdminView("library");
  }

  function startEditingResource(resource: TestResource) {
    openResourceDialog(resource);
    setActiveAdminView("library");
  }

  function exportResources() {
    const headers = ["Title", "Course", "Type", "URL", "Answer URL", "Description", "Added On"];
    const rows = filteredResourceRows.map((resource) => [
      resource.title,
      resource.course,
      resource.category,
      resource.status,
      resource.url,
      resource.answerUrl ?? "",
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

  function removeResource(resourceId: string) {
    updateState((current) => ({
      ...current,
      resources: current.resources.filter((resource) => resource.id !== resourceId),
    }));
  }

  function removeStudent(userId: string) {
    updateState((current) => ({
      ...current,
      users: current.users.filter((user) => user.id !== userId),
    }));
    setStudentRowSelection((current) => {
      const next = { ...current };
      delete next[userId];
      return next;
    });
    if (editingStudentId === userId) {
      cancelEditingStudent();
    }
    if (selectedStudentId === userId) {
      closeStudentDetails();
    }
  }

  function removeSelectedStudents() {
    updateState((current) => ({
      ...current,
      users: current.users.filter((user) => !selectedStudentIds.includes(user.id)),
    }));
    if (editingStudentId && selectedStudentIds.includes(editingStudentId)) {
      cancelEditingStudent();
    }
    setStudentRowSelection({});
  }

  function resetDemoData() {
    savePortalState(initialState);
    window.localStorage.removeItem(SESSION_KEY);
    setState(initialState);
    setCurrentUserId(null);
    setActiveCourse("All");
    setActiveResourceCategory("All");
    setActiveResourceStatus("All");
    setResourceSearch("");
    setStudentRowSelection({});
    setIsAddStudentDialogOpen(false);
    closeStudentDetails();
    closeResourceDialog();
    cancelEditingStudent();
  }

  useEffect(() => {
    setResourcePagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    );
  }, [resourceSearch, activeCourse, activeResourceCategory, activeResourceStatus]);

  useEffect(() => {
    setStudentPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    );
  }, [studentSearch, activeStudentCourse, activeStudentStatus]);

  useEffect(() => {
    setResourcePagination((current) => {
      const maxPage = Math.max(0, Math.ceil(filteredResourceRows.length / current.pageSize) - 1);
      return current.pageIndex > maxPage ? { ...current, pageIndex: maxPage } : current;
    });
  }, [filteredResourceRows.length]);

  useEffect(() => {
    setStudentPagination((current) => {
      const maxPage = Math.max(0, Math.ceil(filteredStudentRows.length / current.pageSize) - 1);
      return current.pageIndex > maxPage ? { ...current, pageIndex: maxPage } : current;
    });
  }, [filteredStudentRows.length]);

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
            <small>{row.original.url}</small>
            {row.original.answerUrl ? <small className={portalStyles.resourceAnswerText}>Answer link added</small> : null}
          </div>
        ),
      },
      {
        accessorKey: "course",
        header: ({ column }) => (
          <SortHeader title="Course" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => <Badge variant="secondary">{row.original.course}</Badge>,
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <SortHeader title="Type" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => {
          const { className, Icon } = getResourceTypeMeta(row.original.category);

          return (
            <span className={cn(portalStyles.resourceTypeChip, className)}>
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {row.original.category}
            </span>
          );
        },
      },
      {
        accessorKey: "addedOn",
        header: ({ column }) => (
          <SortHeader title="Added On" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
      },

      {
        id: "actions",
        enableSorting: false,
        header: () => <SortHeader title="Actions" />,
        cell: ({ row }) => (
          <div className={portalStyles.tableActions}>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              aria-label="Open link preview"
              onClick={() => window.open(row.original.url, "_blank", "noreferrer")}
              icon={<Link2 aria-hidden="true" />}
            />

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
          </div>
        ),
      },
    ],
    [removeResource, startEditingResource],
  );

  const studentColumns = useMemo<ColumnDef<PortalUser>[]>(
    () => [
      ...(canManageStudents
        ? [
            {
              id: "select",
              enableSorting: false,
              header: ({ table }: { table: TanstackTable<PortalUser> }) => (
                <Checkbox
                  checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
                  aria-label="Select all students"
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
          ]
        : []),
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
        id: "courses",
        accessorFn: (row) => row.courses.join(", "),
        header: ({ column }) => (
          <SortHeader title="Courses" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => (
          <div className={portalStyles.coursePills}>
            {row.original.courses.map((course) => (
              <Badge key={course}>{course}</Badge>
            ))}
          </div>
        ),
      },
      {
        id: "status",
        accessorFn: (row) => (row.courses.length > 0 ? "Active" : "Disabled"),
        header: ({ column }) => (
          <SortHeader title="Status" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => {
          const status = row.original.courses.length > 0 ? "Active" : "Disabled";

          return (
            <span
              className={cn(
                portalStyles.studentStatusBadge,
                status === "Active" ? portalStyles.studentStatusActive : portalStyles.studentStatusDisabled,
              )}
            >
              {status}
            </span>
          );
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
        cell: ({ row }) => (
          <div className={portalStyles.tableActions}>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              aria-label="View student details"
              onClick={() => openStudentDetails(row.original)}
              icon={<Eye aria-hidden="true" />}
            />
            {canManageStudents ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  aria-label="Edit student"
                  onClick={() => startEditingStudent(row.original)}
                  icon={<Pencil aria-hidden="true" />}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  aria-label="Remove student"
                  onClick={() => removeStudent(row.original.id)}
                  icon={<Trash2 aria-hidden="true" />}
                />
              </>
            ) : null}
          </div>
        ),
      },
    ],
    [canManageStudents, openStudentDetails, removeStudent, startEditingStudent],
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

  const studentsTable = useReactTable({
    data: filteredStudentRows,
    columns: studentColumns,
    state: {
      sorting: studentSorting,
      pagination: studentPagination,
      rowSelection: studentRowSelection,
    },
    enableRowSelection: true,
    getRowId: (row) => row.id,
    onSortingChange: setStudentSorting,
    onPaginationChange: setStudentPagination,
    onRowSelectionChange: setStudentRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    state,
    currentUser,
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    activeCourse,
    setActiveCourse,
    activeResourceCategory,
    setActiveResourceCategory,
    activeStudentCourse,
    setActiveStudentCourse,
    activeStudentStatus,
    setActiveStudentStatus,
    studentSearch,
    setStudentSearch,
    activeResourceStatus,
    setActiveResourceStatus,
    resourceSearch,
    setResourceSearch,
    activeAdminView,
    setActiveAdminView,
    loginRole,
    setLoginRole,
    studentForm,
    setStudentForm,
    resourceForm,
    setResourceForm,
    editingResourceId,
    isResourceDialogOpen,
    openResourceDialog,
    closeResourceDialog,
    editingStudentId,
    editStudentForm,
    setEditStudentForm,
    isAddStudentDialogOpen,
    setIsAddStudentDialogOpen,
    resourcePagination,
    setResourcePagination,
    studentPagination,
    setStudentPagination,
    studentRowSelection,
    setStudentRowSelection,
    visibleCourses,
    visibleResources,
    studentUsers,
    filteredStudentRows,
    selectedStudentId,
    selectedStudent,
    courseSummaries,
    latestResource,
    groupedResources,
    filteredResourceRows,
    selectedStudentIds,
    resourcesTable,
    studentsTable,
    handleLogin,
    logout,
    toggleStudentCourse,
    toggleEditStudentCourse,
    startEditingStudent,
    cancelEditingStudent,
    saveStudentEdit,
    addStudent,
    openStudentDetails,
    closeStudentDetails,
    savePaymentRecord,
    saveResource,
    startEditingResource,
    exportResources,
    removeResource,
    removeStudent,
    removeSelectedStudents,
    clearResourceFilters,
    resetDemoData,
  };
}
