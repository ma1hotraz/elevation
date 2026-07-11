import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  accountInputSchema,
  firstZodError,
  paymentSchema,
  performanceSchema,
  resourceSchema,
  scoreSchema,
} from "@/lib/portal/schemas";
import type {
  AccountFormState,
  PaymentFormState,
  PerformanceFormState,
  PortalState,
  PortalUser,
  EnquiryStatus,
  ResetPasswordResult,
  ResourceFormState,
  ScoreFormState,
  StudentPaymentRecord,
  StudentScore,
  TestResource,
} from "./portal.types";

type Client = SupabaseClient<Database>;
type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string };

function errorResult<T>(message: string): ServiceResult<T> {
  return { ok: false, error: message };
}

function normalizeError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return fallback;
}

export async function loadPortalSnapshot(client: Client, currentUserId: string): Promise<ServiceResult<PortalState>> {
  const [profilesResult, coursesResult, resourcesResult, performanceResult, scoresResult, paymentsResult, enquiriesResult] = await Promise.all([
    client.from("profiles").select("*").order("created_at", { ascending: true }),
    client.from("user_courses").select("*").order("created_at", { ascending: true }),
    client.from("resources").select("*").order("created_at", { ascending: false }),
    client.from("student_performance").select("*"),
    client.from("student_scores").select("*").order("assessment_date", { ascending: false }).order("created_at", { ascending: false }),
    client.from("payments").select("*").order("payment_date", { ascending: false }).order("created_at", { ascending: false }),
    client.from("enquiries").select("*").order("created_at", { ascending: false }),
  ]);

  const failed = [profilesResult, coursesResult, resourcesResult, performanceResult, scoresResult, paymentsResult, enquiriesResult].find(
    (result) => result.error,
  );
  if (failed?.error) {
    return errorResult(normalizeError(failed.error, "Unable to load the portal data."));
  }

  const profiles = profilesResult.data ?? [];
  if (!profiles.some((profile) => profile.id === currentUserId)) {
    return errorResult("Your portal profile is missing or you do not have access. Ask an administrator to review the account.");
  }

  const coursesByUser = new Map<string, PortalUser["courses"]>();
  for (const row of coursesResult.data ?? []) {
    const existing = coursesByUser.get(row.user_id) ?? [];
    if (!existing.includes(row.course)) existing.push(row.course);
    coursesByUser.set(row.user_id, existing);
  }

  const scoresByStudent = new Map<string, StudentScore[]>();
  for (const row of scoresResult.data ?? []) {
    const existing = scoresByStudent.get(row.student_id) ?? [];
    existing.push({
      id: row.id,
      test: row.test_name,
      score: Number(row.score),
      date: row.assessment_date,
      course: row.course,
      notes: row.notes || undefined,
    });
    scoresByStudent.set(row.student_id, existing);
  }

  const paymentsByStudent = new Map<string, StudentPaymentRecord[]>();
  for (const row of paymentsResult.data ?? []) {
    const existing = paymentsByStudent.get(row.student_id) ?? [];
    existing.push({
      id: row.id,
      label: row.label,
      amount: Number(row.amount),
      date: row.payment_date,
      method: row.method,
      invoice: row.invoice_number,
      status: row.status,
    });
    paymentsByStudent.set(row.student_id, existing);
  }

  const performanceByStudent = new Map(
    (performanceResult.data ?? []).map((row) => [row.student_id, row] as const),
  );

  const users: PortalUser[] = profiles.map((profile) => {
    const scoreHistory = scoresByStudent.get(profile.id) ?? [];
    const paymentRecords = paymentsByStudent.get(profile.id) ?? [];
    const performance = performanceByStudent.get(profile.id);
    const averageScore = scoreHistory.length
      ? Math.round((scoreHistory.reduce((sum, item) => sum + item.score, 0) / scoreHistory.length) * 10) / 10
      : 0;
    const paid = paymentRecords.filter((record) => record.status === "Paid").reduce((sum, record) => sum + record.amount, 0);
    const due = paymentRecords.filter((record) => record.status === "Pending").reduce((sum, record) => sum + record.amount, 0);
    const refunded = paymentRecords.filter((record) => record.status === "Refunded").reduce((sum, record) => sum + record.amount, 0);
    const nextDue = paymentRecords
      .filter((record) => record.status === "Pending")
      .map((record) => record.date)
      .sort()[0];

    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      role: profile.role,
      accountStatus: profile.account_status,
      courses: coursesByUser.get(profile.id) ?? [],
      joinedOn: profile.joined_on,
      lastSeenAt: profile.last_seen_at ?? undefined,
      mustChangePassword: profile.must_change_password,
      phone: profile.phone,
      guardianName: profile.guardian_name,
      address: profile.address,
      performance:
        profile.role === "student"
          ? {
              averageScore,
              attendance: performance?.attendance ?? 0,
              completion: performance?.completion ?? 0,
              rank: performance?.rank ?? 0,
              lastAssessment: performance?.last_assessment ?? scoreHistory[0]?.test ?? "No assessments yet",
            }
          : undefined,
      scoreHistory: profile.role === "student" ? scoreHistory : undefined,
      payments:
        profile.role === "student"
          ? {
              total: paid + due + refunded,
              paid,
              due,
              refunded,
              nextDue,
              records: paymentRecords,
            }
          : undefined,
    };
  });

  const resources: TestResource[] = (resourcesResult.data ?? []).map((resource) => ({
    id: resource.id,
    title: resource.title,
    course: resource.course,
    category: resource.category,
    status: resource.status,
    url: resource.url,
    answerUrl: resource.answer_url ?? undefined,
    answerReleaseStatus: resource.answer_release_status,
    description: resource.description,
    addedOn: resource.created_at.slice(0, 10),
    createdBy: resource.created_by ?? undefined,
  }));

  const enquiries = (enquiriesResult.data ?? []).map((enquiry) => ({
    id: enquiry.id,
    fullName: enquiry.full_name,
    contact: enquiry.contact,
    course: enquiry.course,
    preferredTime: enquiry.preferred_time as "Morning" | "Afternoon" | "Evening",
    message: enquiry.message,
    status: enquiry.status,
    source: enquiry.source,
    createdAt: enquiry.created_at,
    updatedAt: enquiry.updated_at,
  }));

  return { ok: true, data: { users, resources, enquiries } };
}

async function adminRequest<T>(url: string, init: RequestInit): Promise<ServiceResult<T>> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string } & T;
    if (!response.ok) return errorResult(payload.error || "The request could not be completed.");
    return { ok: true, data: payload };
  } catch (error) {
    return errorResult(normalizeError(error, "Network error. Check your connection and try again."));
  }
}

export async function createAccount(input: AccountFormState): Promise<ServiceResult<ResetPasswordResult>> {
  const parsed = accountInputSchema.safeParse(input);
  if (!parsed.success) return errorResult(firstZodError(parsed.error));
  const response = await adminRequest<{ result: ResetPasswordResult }>("/api/admin/accounts", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.ok ? { ok: true, data: response.data.result } : response;
}

export async function updateAccount(userId: string, input: AccountFormState): Promise<ServiceResult<void>> {
  const parsed = accountInputSchema.safeParse(input);
  if (!parsed.success) return errorResult(firstZodError(parsed.error));
  const response = await adminRequest<{ ok: true }>(`/api/admin/accounts/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ ...input, role: undefined }),
  });
  return response.ok ? { ok: true, data: undefined } : response;
}

export async function resetAccountPassword(userId: string): Promise<ServiceResult<ResetPasswordResult>> {
  const response = await adminRequest<{ result: ResetPasswordResult }>(`/api/admin/accounts/${userId}/password`, {
    method: "POST",
  });
  return response.ok ? { ok: true, data: response.data.result } : response;
}

export async function setAccountStatus(userId: string, status: PortalUser["accountStatus"]): Promise<ServiceResult<void>> {
  const response = await adminRequest<{ ok: true }>(`/api/admin/accounts/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response.ok ? { ok: true, data: undefined } : response;
}

export async function deleteAccount(userId: string): Promise<ServiceResult<void>> {
  const response = await adminRequest<{ ok: true }>(`/api/admin/accounts/${userId}`, { method: "DELETE" });
  return response.ok ? { ok: true, data: undefined } : response;
}

export async function saveResourceRecord(
  client: Client,
  actorId: string,
  form: ResourceFormState,
  editingResourceId: string | null,
): Promise<ServiceResult<void>> {
  const parsed = resourceSchema.safeParse(form);
  if (!parsed.success) return errorResult(firstZodError(parsed.error));
  const value = parsed.data;
  const payload = {
    title: value.title,
    course: value.course,
    category: value.category,
    status: value.category === "Live Test" ? value.status : value.status === "Upcoming" ? "Live" as const : value.status,
    url: value.url,
    answer_url: value.answerUrl || null,
    answer_release_status: value.answerUrl ? value.answerReleaseStatus : "Hidden" as const,
    description: value.description,
  };

  const result = editingResourceId
    ? await client.from("resources").update(payload).eq("id", editingResourceId)
    : await client.from("resources").insert({ ...payload, created_by: actorId });
  if (result.error) return errorResult(result.error.message);
  return { ok: true, data: undefined };
}

export async function removeResourceRecord(client: Client, resourceId: string): Promise<ServiceResult<void>> {
  const { error } = await client.from("resources").delete().eq("id", resourceId);
  return error ? errorResult(error.message) : { ok: true, data: undefined };
}

export async function savePaymentRecord(
  client: Client,
  actorId: string,
  form: PaymentFormState,
  paymentId?: string,
): Promise<ServiceResult<void>> {
  const parsed = paymentSchema.safeParse(form);
  if (!parsed.success) return errorResult(firstZodError(parsed.error));
  const value = parsed.data;
  const payload = {
    student_id: value.studentId,
    label: value.label,
    amount: value.amount,
    method: value.method,
    payment_date: value.date,
    status: value.status,
  };
  const result = paymentId
    ? await client.from("payments").update(payload).eq("id", paymentId)
    : await client.from("payments").insert({ ...payload, created_by: actorId });
  return result.error ? errorResult(result.error.message) : { ok: true, data: undefined };
}

export async function deletePaymentRecord(client: Client, paymentId: string): Promise<ServiceResult<void>> {
  const { error } = await client.from("payments").delete().eq("id", paymentId);
  return error ? errorResult(error.message) : { ok: true, data: undefined };
}

export async function savePerformanceRecord(
  client: Client,
  actorId: string,
  studentId: string,
  form: PerformanceFormState,
): Promise<ServiceResult<void>> {
  const parsed = performanceSchema.safeParse(form);
  if (!parsed.success) return errorResult(firstZodError(parsed.error));
  const value = parsed.data;
  const { error } = await client.from("student_performance").upsert({
    student_id: studentId,
    attendance: value.attendance,
    completion: value.completion,
    rank: value.rank,
    last_assessment: value.lastAssessment,
    updated_by: actorId,
  });
  return error ? errorResult(error.message) : { ok: true, data: undefined };
}

export async function createScoreRecord(
  client: Client,
  actorId: string,
  studentId: string,
  form: ScoreFormState,
): Promise<ServiceResult<void>> {
  const parsed = scoreSchema.safeParse({ ...form, studentId });
  if (!parsed.success) return errorResult(firstZodError(parsed.error));
  const value = parsed.data;
  const { error } = await client.from("student_scores").insert({
    student_id: value.studentId,
    course: value.course,
    test_name: value.test,
    score: value.score,
    assessment_date: value.date,
    notes: value.notes,
    created_by: actorId,
  });
  return error ? errorResult(error.message) : { ok: true, data: undefined };
}

export async function deleteScoreRecord(client: Client, scoreId: string): Promise<ServiceResult<void>> {
  const { error } = await client.from("student_scores").delete().eq("id", scoreId);
  return error ? errorResult(error.message) : { ok: true, data: undefined };
}

export function getEmptyAccountForm(role: AccountFormState["role"] = "student"): AccountFormState {
  return {
    role,
    name: "",
    email: "",
    courses: role === "teacher" ? ["PCM"] : ["IELTS"],
    phone: "",
    guardianName: "",
    address: "",
    accountStatus: "active",
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

export async function updateEnquiryStatus(
  client: Client,
  enquiryId: string,
  status: EnquiryStatus,
): Promise<ServiceResult<void>> {
  const { error } = await client.from("enquiries").update({ status }).eq("id", enquiryId);
  return error ? errorResult(error.message) : { ok: true, data: undefined };
}
