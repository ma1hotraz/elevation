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
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  AdminView,
  Course,
  PortalState,
  PortalUser,
  ResourceFormState,
  ResourceType,
  StudentFormState,
  TestResource,
} from "./portal.types";
import { COURSES, CATEGORIES, emptyResourceForm, emptyStudentForm, initialState } from "./portal.data";
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
  resourceSearch: string;
  setResourceSearch: (value: string) => void;
  activeAdminView: AdminView;
  setActiveAdminView: (value: AdminView) => void;
  studentForm: StudentFormState;
  setStudentForm: Dispatch<SetStateAction<StudentFormState>>;
  resourceForm: ResourceFormState;
  setResourceForm: Dispatch<SetStateAction<ResourceFormState>>;
  editingStudentId: string | null;
  editStudentForm: StudentFormState;
  setEditStudentForm: Dispatch<SetStateAction<StudentFormState>>;
  isAddStudentDialogOpen: boolean;
  setIsAddStudentDialogOpen: Dispatch<SetStateAction<boolean>>;
  resourcePagination: PaginationState;
  setResourcePagination: Dispatch<SetStateAction<PaginationState>>;
  studentPagination: PaginationState;
  setStudentPagination: Dispatch<SetStateAction<PaginationState>>;
  studentRowSelection: RowSelectionState;
  setStudentRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  visibleCourses: Course[];
  visibleResources: TestResource[];
  studentUsers: PortalUser[];
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
  addResource: (event: FormEvent<HTMLFormElement>) => void;
  exportResources: () => void;
  removeResource: (resourceId: string) => void;
  removeStudent: (userId: string) => void;
  removeSelectedStudents: () => void;
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
  const [resourceSearch, setResourceSearch] = useState("");
  const [activeAdminView, setActiveAdminView] = useState<AdminView>("overview");
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [resourceForm, setResourceForm] = useState(emptyResourceForm);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editStudentForm, setEditStudentForm] = useState(emptyStudentForm);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
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
      const matchesSearch =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.url.toLowerCase().includes(query) ||
        resource.course.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeResourceCategory, resourceSearch, visibleResources]);

  const selectedStudentIds = useMemo(
    () => Object.keys(studentRowSelection).filter((id) => studentRowSelection[id]),
    [studentRowSelection],
  );

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
        candidate.password === password,
    );

    if (!user) {
      setError("Check the email and password, then try again.");
      return;
    }

    window.localStorage.setItem(SESSION_KEY, user.id);
    setCurrentUserId(user.id);
    setActiveCourse("All");
    setActiveResourceCategory("All");
    setResourceSearch("");
    setError("");
    setEmail("");
    setPassword("");
  }

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    setCurrentUserId(null);
    setActiveCourse("All");
    setActiveResourceCategory("All");
    setResourceSearch("");
    setStudentRowSelection({});
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
        },
      ],
    }));
    setStudentForm(emptyStudentForm);
    setStudentRowSelection({});
    setStudentPagination((current) => ({ ...current, pageIndex: 0 }));
    setActiveAdminView("students");
    setIsAddStudentDialogOpen(false);
  }

  function addResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateState((current) => ({
      ...current,
      resources: [
        {
          id: createId("resource"),
          addedOn: new Date().toISOString().slice(0, 10),
          title: resourceForm.title.trim(),
          course: resourceForm.course,
          category: resourceForm.category,
          url: resourceForm.url.trim(),
          description: resourceForm.description.trim(),
        },
        ...current.resources,
      ],
    }));
    setResourceForm(emptyResourceForm);
    setResourcePagination((current) => ({ ...current, pageIndex: 0 }));
    setActiveAdminView("library");
  }

  function exportResources() {
    const headers = ["Title", "Course", "Category", "URL", "Description", "Added On"];
    const rows = filteredResourceRows.map((resource) => [
      resource.title,
      resource.course,
      resource.category,
      resource.url,
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
    setResourceSearch("");
    setStudentRowSelection({});
    setIsAddStudentDialogOpen(false);
    cancelEditingStudent();
  }

  useEffect(() => {
    setResourcePagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    );
  }, [resourceSearch, activeCourse, activeResourceCategory]);

  useEffect(() => {
    setResourcePagination((current) => {
      const maxPage = Math.max(0, Math.ceil(filteredResourceRows.length / current.pageSize) - 1);
      return current.pageIndex > maxPage ? { ...current, pageIndex: maxPage } : current;
    });
  }, [filteredResourceRows.length]);

  useEffect(() => {
    setStudentPagination((current) => {
      const maxPage = Math.max(0, Math.ceil(studentUsers.length / current.pageSize) - 1);
      return current.pageIndex > maxPage ? { ...current, pageIndex: maxPage } : current;
    });
  }, [studentUsers.length]);

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
          </div>
        ),
      },
      {
        accessorKey: "course",
        header: ({ column }) => (
          <SortHeader title="Course" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => <Badge>{row.original.course}</Badge>,
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <SortHeader title="Category" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
        ),
        cell: ({ row }) => <Badge>{row.original.category}</Badge>,
      },
      {
        accessorKey: "addedOn",
        header: ({ column }) => (
          <SortHeader title="Added" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
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
              size="sm"
              onClick={() => window.open(row.original.url, "_blank", "noreferrer")}
            >
              <ExternalLink aria-hidden="true" />
              Open
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeResource(row.original.id)}
            >
              <Trash2 aria-hidden="true" />
              Remove
            </Button>
          </div>
        ),
      },
    ],
    [removeResource],
  );

  const studentColumns = useMemo<ColumnDef<PortalUser>[]>(
    () => [
      {
        id: "select",
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
            aria-label="Select all students"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
            aria-label={`Select ${row.original.name}`}
          />
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortHeader title="Student" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
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
        accessorKey: "password",
        header: ({ column }) => (
          <SortHeader title="Password" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
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
              size="sm"
              onClick={() => startEditingStudent(row.original)}
            >
              <Pencil aria-hidden="true" />
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeStudent(row.original.id)}
            >
              <Trash2 aria-hidden="true" />
              Remove
            </Button>
          </div>
        ),
      },
    ],
    [removeStudent, startEditingStudent],
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
    data: studentUsers,
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
    resourceSearch,
    setResourceSearch,
    activeAdminView,
    setActiveAdminView,
    studentForm,
    setStudentForm,
    resourceForm,
    setResourceForm,
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
    addResource,
    exportResources,
    removeResource,
    removeStudent,
    removeSelectedStudents,
    resetDemoData,
  };
}
