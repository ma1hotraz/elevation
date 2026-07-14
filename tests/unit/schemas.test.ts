import { describe, expect, it } from "vitest";
import {
  accountInputSchema,
  enquirySchema,
  paymentSchema,
  performanceSchema,
  resourceSchema,
  scoreSchema,
} from "@/lib/portal/schemas";

describe("portal input validation", () => {
  it("accepts a valid active student account", () => {
    const result = accountInputSchema.safeParse({
      role: "student",
      name: "Aman Singh",
      email: " AMAN@EXAMPLE.COM ",
      courses: ["IELTS"],
      phone: "+91 98765 43210",
      guardianName: "Parent",
      address: "Punjab",
      accountStatus: "active",
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("aman@example.com");
  });

  it("rejects an active account without a course", () => {
    const result = accountInputSchema.safeParse({
      role: "teacher",
      name: "Test Teacher",
      email: "teacher@example.com",
      courses: [],
      phone: "",
      guardianName: "",
      address: "",
      accountStatus: "active",
    });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.path).toEqual(["courses"]);
  });

  it("rejects invalid and honeypot enquiry data", () => {
    expect(
      enquirySchema.safeParse({
        fullName: "A",
        contact: "12",
        course: "IELTS",
        preferredTime: "Night",
        message: "",
        website: "spam.example",
      }).success,
    ).toBe(false);
  });

  it("accepts valid operational records", () => {
    expect(resourceSchema.safeParse({
      title: "IELTS Reading Mock 4",
      course: "IELTS",
      category: "Live Test",
      status: "Live",
      url: "https://example.com/test",
      answerUrl: "https://example.com/answer",
      answerReleaseStatus: "Published",
      description: "Timed reading practice.",
    }).success).toBe(true);

    expect(paymentSchema.safeParse({
      studentId: "11111111-1111-4111-8111-111111111111",
      label: "July tuition",
      amount: "4500",
      method: "UPI",
      date: "2026-07-12",
      status: "Paid",
    }).success).toBe(true);

    expect(performanceSchema.safeParse({
      attendance: 91,
      completion: 82,
      rank: 4,
      lastAssessment: "Reading mock 4",
    }).success).toBe(true);

    expect(scoreSchema.safeParse({
      studentId: "11111111-1111-4111-8111-111111111111",
      course: "IELTS",
      test: "Reading mock 4",
      score: 84.5,
      date: "2026-07-12",
      notes: "Good accuracy.",
    }).success).toBe(true);
  });

  it("rejects unsafe resource and impossible payment values", () => {
    expect(resourceSchema.safeParse({
      title: "Test",
      course: "PCM",
      category: "Study Material",
      status: "Live",
      url: "javascript:alert(1)",
      answerUrl: "",
      answerReleaseStatus: "Hidden",
      description: "",
    }).success).toBe(false);

    expect(paymentSchema.safeParse({
      studentId: "not-a-uuid",
      label: "Fee",
      amount: -1,
      method: "Cash",
      date: "2026-99-99",
      status: "Paid",
    }).success).toBe(false);
  });
});
