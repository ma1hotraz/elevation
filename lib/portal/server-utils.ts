import { randomBytes } from "node:crypto";
import { z, type ZodError } from "zod";
import { firstZodError } from "./schemas";

const adjectives = ["Amber", "Cedar", "Mint", "Silver", "River", "Bright", "Golden", "Maple"];
const nouns = ["Fox", "Stone", "Hawk", "Bridge", "Lake", "Field", "Orbit", "Garden"];

export function generateTemporaryPassword() {
  const entropy = randomBytes(4).readUInt32BE(0);
  const adjective = adjectives[entropy % adjectives.length];
  const noun = nouns[Math.floor(entropy / adjectives.length) % nouns.length];
  const digits = String(1000 + (entropy % 9000));
  const symbol = ["!", "@", "#", "$", "%"][entropy % 5];
  return `${adjective}-${noun}-${digits}${symbol}`;
}

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (error && typeof error === "object" && "issues" in error) {
    return firstZodError(error as ZodError);
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function parseRouteUuid(value: string) {
  const result = z.uuid().safeParse(value);
  return result.success ? result.data : null;
}
