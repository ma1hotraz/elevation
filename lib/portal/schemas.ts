import { z } from "zod";

export const courseSchema = z.enum(["PCM", "IELTS", "French"]);
export const roleSchema = z.enum(["teacher", "student"]);
export const accountStatusSchema = z.enum(["active", "suspended"]);

const optionalShortText = (max: number) => z.string().trim().max(max).default("");

const accountBaseSchema = z.object({
  role: roleSchema,
  name: z.string().trim().min(2, "Enter the account holder's name.").max(100),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  courses: z.array(courseSchema).max(3),
  phone: optionalShortText(30),
  guardianName: optionalShortText(100),
  address: optionalShortText(300),
  accountStatus: accountStatusSchema,
});

function requireCourseForActiveAccount(
  value: { accountStatus: "active" | "suspended"; courses: Array<"PCM" | "IELTS" | "French"> },
  context: z.RefinementCtx,
) {
  if (value.accountStatus === "active" && value.courses.length === 0) {
    context.addIssue({
      code: "custom",
      path: ["courses"],
      message: "Active accounts need at least one assigned course.",
    });
  }
}

export const accountInputSchema = accountBaseSchema.superRefine(requireCourseForActiveAccount);
export const accountUpdateSchema = accountBaseSchema
  .omit({ role: true })
  .superRefine(requireCourseForActiveAccount);

export const accountStatusInputSchema = z.object({
  status: accountStatusSchema,
});

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  contact: z.string().trim().min(5).max(160),
  course: z.string().trim().min(2).max(100),
  preferredTime: z.enum(["Morning", "Afternoon", "Evening"]),
  message: z.string().trim().max(1500).default(""),
  website: z.string().max(0).optional(),
});

const httpUrlSchema = z
  .url("Enter a valid URL.")
  .max(2000)
  .refine((value) => value.startsWith("https://") || value.startsWith("http://"), {
    message: "Use a valid http:// or https:// URL.",
  });

export const resourceSchema = z.object({
  title: z.string().trim().min(2).max(160),
  course: courseSchema,
  category: z.enum(["Live Test", "Previous Test", "Revision Material", "Study Material"]),
  status: z.enum(["Upcoming", "Live", "Archived"]),
  url: httpUrlSchema,
  answerUrl: z.union([z.literal(""), httpUrlSchema]),
  answerReleaseStatus: z.enum(["Hidden", "Published"]),
  description: z.string().trim().max(1000),
});

export const paymentSchema = z.object({
  studentId: z.uuid(),
  label: z.string().trim().min(2).max(120),
  amount: z.coerce.number().positive().max(10_000_000),
  method: z.enum(["UPI", "Card", "Cash", "Bank Transfer", "Other"]),
  date: z.iso.date(),
  status: z.enum(["Paid", "Pending", "Refunded"]),
});

export const performanceSchema = z.object({
  attendance: z.coerce.number().int().min(0).max(100),
  completion: z.coerce.number().int().min(0).max(100),
  rank: z.coerce.number().int().min(0).max(1_000_000),
  lastAssessment: z.string().trim().min(2).max(160),
});

export const scoreSchema = z.object({
  studentId: z.uuid(),
  course: courseSchema,
  test: z.string().trim().min(2).max(160),
  score: z.coerce.number().min(0).max(100),
  date: z.iso.date(),
  notes: z.string().trim().max(500).default(""),
});

export function firstZodError(error: z.ZodError) {
  return error.issues[0]?.message || "Check the form and try again.";
}
