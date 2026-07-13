"use client";

import { useMemo, useState } from "react";
import { Clock3, Mail, MessageSquareText, Phone, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { dropdownControlClass } from "@/components/ui/control-styles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PortalPageHeader } from "../PortalStat";
import {
  PortalFilterBar,
  PortalFilterSummary,
  PortalSearchFilter,
  PortalSelectFilter,
} from "../PortalFilters";
import type { EnquiryStatus } from "../../portal.types";
import type { PortalController } from "../../usePortalState";

const statusOptions: Array<{ value: EnquiryStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusClass(status: EnquiryStatus) {
  if (status === "new") return "bg-[#e9fbf5] text-[#087365]";
  if (status === "contacted") return "bg-[#eef4ff] text-[#315f9f]";
  if (status === "qualified") return "bg-[#fff7df] text-[#8a6514]";
  return "bg-[#f0f3f3] text-[#5f7378]";
}

export function EnquiriesPanel({ portal }: { portal: PortalController }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EnquiryStatus | "All">("All");
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return portal.state.enquiries.filter((enquiry) => {
      const matchesStatus = status === "All" || enquiry.status === status;
      const matchesSearch =
        !query ||
        [enquiry.fullName, enquiry.contact, enquiry.course, enquiry.message].some((value) =>
          value.toLowerCase().includes(query),
        );
      return matchesStatus && matchesSearch;
    });
  }, [portal.state.enquiries, search, status]);

  const counts = useMemo(
    () => ({
      new: portal.state.enquiries.filter((item) => item.status === "new").length,
      contacted: portal.state.enquiries.filter((item) => item.status === "contacted").length,
      qualified: portal.state.enquiries.filter((item) => item.status === "qualified").length,
    }),
    [portal.state.enquiries],
  );

  async function changeStatus(id: string, nextStatus: EnquiryStatus) {
    setSavingId(id);
    setError("");
    const nextError = await portal.changeEnquiryStatus(id, nextStatus);
    setError(nextError ?? "");
    setSavingId(null);
  }

  function clearFilters() {
    setSearch("");
    setStatus("All");
  }

  return (
    <section className="grid gap-5">
      <PortalPageHeader
        eyebrow="Admissions"
        title="Website enquiries"
        lead="Review new counselling requests, contact prospective students, and keep each lead's next step clear."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="New" value={counts.new} icon={<Sparkles aria-hidden="true" />} />
          <Metric label="Contacted" value={counts.contacted} icon={<Phone aria-hidden="true" />} />
          <Metric label="Qualified" value={counts.qualified} icon={<MessageSquareText aria-hidden="true" />} />
        </div>
      </PortalPageHeader>

      <div className="rounded-[22px] border border-[rgba(8,47,43,0.08)] bg-white p-4 shadow-[0_18px_48px_rgba(9,72,69,0.05)] sm:p-5">
        <PortalFilterBar className="grid-cols-[minmax(0,1fr)_220px_max-content] items-end max-[900px]:grid-cols-1">
          <PortalSearchFilter
            label="Search enquiries"
            value={search}
            onChange={setSearch}
            placeholder="Search name, contact, course, or message..."
          />
          <PortalSelectFilter
            label="Status"
            value={status}
            onValueChange={(value) => setStatus(value as EnquiryStatus | "All")}
            placeholder="All statuses"
          >
            <SelectItem value="All">All statuses</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </PortalSelectFilter>
          <PortalFilterSummary onClear={clearFilters} clearLabel="Reset" />
        </PortalFilterBar>

        {error ? (
          <p className="mb-0 mt-3 rounded-[10px] bg-[#fff1f0] px-3 py-2 text-sm font-bold text-[#a3342c]" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {filtered.length ? (
        <div className="grid gap-3 xl:grid-cols-2">
          {filtered.map((enquiry) => {
            const isEmail = enquiry.contact.includes("@");
            return (
              <article
                key={enquiry.id}
                className="rounded-[22px] border border-[rgba(8,47,43,0.08)] bg-white p-5 shadow-[0_16px_40px_rgba(9,72,69,0.05)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="m-0 text-[1.1rem] font-black tracking-[-0.025em] text-[#10252b]">
                        {enquiry.fullName}
                      </h2>
                      <Badge className={statusClass(enquiry.status)}>
                        {statusOptions.find((item) => item.value === enquiry.status)?.label}
                      </Badge>
                    </div>
                    <p className="mb-0 mt-1 text-[0.86rem] font-semibold text-[#627579]">{enquiry.course}</p>
                  </div>
                  <Select
                    value={enquiry.status}
                    disabled={savingId === enquiry.id}
                    onValueChange={(value) => void changeStatus(enquiry.id, value as EnquiryStatus)}
                  >
                    <SelectTrigger
                      aria-label={`Update ${enquiry.fullName}'s enquiry status`}
                      className={cn(dropdownControlClass, "w-[150px] justify-between max-[520px]:w-full")}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 grid gap-2 text-[0.86rem] text-[#45595e]">
                  <a
                    href={`${isEmail ? "mailto" : "tel"}:${enquiry.contact}`}
                    className="flex items-center gap-2 font-bold text-[#0d7b68] hover:underline"
                  >
                    {isEmail ? <Mail className="h-4 w-4" aria-hidden="true" /> : <Phone className="h-4 w-4" aria-hidden="true" />}
                    {enquiry.contact}
                  </a>
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[#0d7b68]" aria-hidden="true" />
                    Prefers {enquiry.preferredTime.toLowerCase()} - {formatDate(enquiry.createdAt)}
                  </span>
                </div>

                <div className="mt-4 rounded-[14px] border border-[#e4edeb] bg-[#f8fcfb] p-3.5">
                  <p className="m-0 whitespace-pre-wrap text-[0.88rem] leading-[1.6] text-[#45595e]">
                    {enquiry.message || "No additional message provided."}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-[#bfd4d0] bg-[#f8fcfb] px-6 py-12 text-center">
          <MessageSquareText className="mx-auto h-8 w-8 text-[#0d7b68]" aria-hidden="true" />
          <h2 className="mb-0 mt-3 text-[1.1rem] font-black text-[#10252b]">No enquiries match this view</h2>
          <p className="mb-0 mt-2 text-[0.88rem] text-[#627579]">New website submissions will appear here automatically.</p>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <article className="flex items-center gap-3 rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-white p-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9fbf5] text-[#087365] [&_svg]:h-4.5 [&_svg]:w-4.5">{icon}</span>
      <div>
        <span className="block text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#6b7f84]">{label}</span>
        <strong className="mt-1 block text-[1.45rem] font-black leading-none text-[#10252b]">{value}</strong>
      </div>
    </article>
  );
}
