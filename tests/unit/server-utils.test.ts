import { describe, expect, it } from "vitest";
import { generateTemporaryPassword } from "@/lib/portal/server-utils";

describe("temporary password generation", () => {
  it("creates strong, shareable, non-identical passwords", () => {
    const passwords = Array.from({ length: 25 }, () => generateTemporaryPassword());

    for (const password of passwords) {
      expect(password.length).toBeGreaterThanOrEqual(14);
      expect(password).toMatch(/[A-Za-z]/);
      expect(password).toMatch(/\d/);
      expect(password).toMatch(/[^A-Za-z0-9]/);
    }

    expect(new Set(passwords).size).toBeGreaterThan(1);
  });
});
