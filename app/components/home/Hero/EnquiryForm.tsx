"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dropdownControlClass } from "@/components/ui/control-styles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const inputBase =
  "mt-1 w-full rounded-[11px] border border-[#dce7e7] bg-white px-3 py-2.5 text-[0.93rem] text-[#15282d] outline-none transition focus:border-[rgba(20,143,123,0.55)] focus:shadow-[0_0_0_4px_rgba(101,228,196,0.18)] disabled:cursor-not-allowed disabled:bg-[#f5f8f7] max-[520px]:rounded-[10px] max-[520px]:py-2 max-[520px]:text-[0.88rem]";

const fieldLabelClass =
  "block text-[0.78rem] font-black text-[#45595e] max-[520px]:text-[0.72rem]";

const heroSelectTriggerClass =
  "mt-1 w-full justify-between !text-[0.78rem] !font-black data-placeholder:!text-[#757575] max-[520px]:!text-[0.72rem]";

const courseOptions = [
  "Math - Online",
  "Math - Offline",
  "Physics - Online",
  "Physics - Offline",
  "Chemistry - Online",
  "Chemistry - Offline",
  "IELTS Hybrid",
  "French Online",
];

const preferredTimeOptions = ["Morning", "Afternoon", "Evening"];

const initialForm = {
  fullName: "",
  course: "",
  contact: "",
  preferredTime: "",
  message: "",
  website: "",
};

export function EnquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.course || !form.preferredTime) {
      setStatus("error");
      setMessage("Please select a course and preferred time.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not submit your enquiry.");

      setStatus("success");
      setMessage("Thank you. The institute will contact you shortly.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not submit your enquiry. Please try again.");
    }
  }

  const busy = status === "submitting";

  return (
    <form
      id="contact"
      onSubmit={submit}
      className="w-full max-w-[340px] justify-self-end rounded-[24px] border border-[rgba(11,49,47,0.08)] bg-white/98 p-[22px_22px_18px] text-[#15282d] shadow-[0_22px_58px_rgba(0,0,0,0.18)] max-[1180px]:col-span-2 max-[1180px]:max-w-[650px] max-[860px]:justify-self-stretch max-[520px]:rounded-[22px] max-[520px]:p-[18px_18px_16px]"
      aria-busy={busy}
    >
      <h2 className="m-0 mb-1.5 text-[1.5rem] tracking-[-0.05em] max-[520px]:text-[1.35rem]">Enquire Now</h2>
      <p className="m-0 mb-[13px] text-[0.86rem] font-semibold text-[#7b8b8f] max-[520px]:mb-3 max-[520px]:text-[0.8rem]">Book your free counselling</p>

      <label className="mb-3 block text-[0.78rem] font-black text-[#45595e] max-[520px]:mb-2.5 max-[520px]:text-[0.72rem]">
        Full Name
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          disabled={busy}
          className={inputBase}
        />
      </label>

      <div className="mb-3 max-[520px]:mb-2.5">
        <span className={fieldLabelClass}>Select Course</span>
        <Select value={form.course} onValueChange={(value) => updateField("course", value)} disabled={busy}>
          <SelectTrigger aria-label="Select course" className={cn(dropdownControlClass, heroSelectTriggerClass)}>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courseOptions.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <label className="mb-3 block text-[0.78rem] font-black text-[#45595e] max-[520px]:mb-2.5 max-[520px]:text-[0.72rem]">
        Phone / Email
        <input
          type="text"
          name="contact"
          value={form.contact}
          onChange={(event) => updateField("contact", event.target.value)}
          placeholder="Your phone or email"
          autoComplete="email"
          minLength={5}
          maxLength={160}
          required
          disabled={busy}
          className={inputBase}
        />
      </label>

      <div className="mb-3 max-[520px]:mb-2.5">
        <span className={fieldLabelClass}>Preferred Time</span>
        <Select value={form.preferredTime} onValueChange={(value) => updateField("preferredTime", value)} disabled={busy}>
          <SelectTrigger aria-label="Preferred time" className={cn(dropdownControlClass, heroSelectTriggerClass)}>
            <SelectValue placeholder="Select preferred time" />
          </SelectTrigger>
          <SelectContent>
            {preferredTimeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <label className="mb-0 block text-[0.78rem] font-black text-[#45595e] max-[520px]:text-[0.72rem]">
        Message <span className="font-medium text-[#8c999b]">(Optional)</span>
        <textarea
          name="message"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="How can we help you?"
          maxLength={1500}
          disabled={busy}
          className={`${inputBase} min-h-[56px] resize-y`}
        />
      </label>

      <label className="sr-only" aria-hidden="true">
        Website
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      {message ? (
        <p
          className={`mt-3 flex items-start gap-2 rounded-[10px] px-3 py-2 text-[0.8rem] font-bold leading-[1.45] ${
            status === "success" ? "bg-[#e9fbf5] text-[#087365]" : "bg-[#fff1f0] text-[#a3342c]"
          }`}
          role={status === "error" ? "alert" : "status"}
        >
          {status === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : null}
          {message}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        className="mt-3 h-12 w-full rounded-[12px] px-4 text-[0.95rem] font-black"
        disabled={busy}
        icon={
          busy ? (
            <LoaderCircle aria-hidden="true" className="h-[18px] w-[18px] animate-spin" />
          ) : (
            <ArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
          )
        }
        iconPosition="end"
      >
        {busy ? "Submitting..." : "Enquire Now"}
      </Button>
    </form>
  );
}
