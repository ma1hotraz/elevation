import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EnquiryForm } from "@/app/components/home/Hero/EnquiryForm";

afterEach(() => {
  vi.restoreAllMocks();
});

function completeRequiredFields() {
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Aman Singh" } });
  fireEvent.change(screen.getByLabelText(/select course/i), { target: { value: "IELTS Hybrid" } });
  fireEvent.change(screen.getByLabelText(/phone \/ email/i), { target: { value: "aman@example.com" } });
  fireEvent.change(screen.getByLabelText(/preferred time/i), { target: { value: "Evening" } });
}

describe("EnquiryForm", () => {
  it("submits valid details and resets the form", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 201, headers: { "Content-Type": "application/json" } }),
    );
    render(<EnquiryForm />);
    completeRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: /enquire now/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/contact you shortly/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/inquiries",
      expect.objectContaining({ method: "POST" }),
    );
    expect(screen.getByLabelText(/full name/i)).toHaveValue("");
  });

  it("shows the API error and keeps the user's values", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Too many enquiries were submitted." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }),
    );
    render(<EnquiryForm />);
    completeRequiredFields();

    fireEvent.submit(screen.getByRole("button", { name: /enquire now/i }).closest("form")!);

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/too many enquiries/i));
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Aman Singh");
  });
});
