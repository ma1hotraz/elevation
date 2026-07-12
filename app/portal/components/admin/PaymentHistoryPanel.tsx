import { Download, Link2, Plus, ReceiptText, Sparkles } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PortalFilterBar, PortalFilterSummary, PortalSearchFilter, PortalSelectFilter } from "../PortalFilters";
import { PortalTableShell } from "../PortalTable";
import { portalStyles } from "../../portalShared";
import { emptyPaymentForm } from "../../portal.data";
import type { PaymentFormState, PortalUser } from "../../portal.types";
import type { PortalController } from "../../usePortalState";

type PaymentRow = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  status: "Paid" | "Pending" | "Refunded";
  method: PaymentFormState["method"];
  date: string;
  invoice: string;
};

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusClass(status: PaymentRow["status"]) {
  if (status === "Paid") return "bg-[#e9fbf1] text-[#16845f]";
  if (status === "Refunded") return "bg-[#eef2f2] text-[#5f7378]";
  return "bg-[#fff6e7] text-[#b96800]";
}

function PaymentStatCard({ label, value, icon, detail }: { label: string; value: string; icon: ReactNode; detail: string }) {
  return (
    <article className="grid gap-3 rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] p-4 shadow-[0_12px_34px_rgba(9,72,69,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="block text-[0.8rem] font-bold text-[#7a8b90]">{label}</span>
          <strong className="block text-[1.5rem] font-black leading-none text-[#10252b]">{value}</strong>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#e9fbf5] text-[#087365] [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </span>
      </div>
      <p className="m-0 text-[0.84rem] leading-[1.5] text-[#627579]">{detail}</p>
    </article>
  );
}

export function PaymentHistoryPanel({ portal }: { portal: PortalController }) {
  const students = useMemo(
    () => portal.state.users.filter((user): user is PortalUser & { role: "student" } => user.role === "student"),
    [portal.state.users],
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>({
    ...emptyPaymentForm,
    studentId: students[0]?.id ?? "",
  });
  const [paymentSearch, setPaymentSearch] = useState("");
  const [activeStudent, setActiveStudent] = useState<string>("All");
  const [activeStatus, setActiveStatus] = useState<PaymentRow["status"] | "All">("All");
  const [paymentError, setPaymentError] = useState("");

  const paymentRows = useMemo<PaymentRow[]>(
    () =>
      students.flatMap((student) =>
        (student.payments?.records ?? []).map((record) => ({
          id: `${student.id}-${record.id}`,
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          amount: record.amount,
          status: record.status,
          method: record.method,
          date: record.date,
          invoice: record.invoice,
        })),
      ),
    [students],
  );

  const filteredRows = useMemo(() => {
    const query = paymentSearch.trim().toLowerCase();

    return paymentRows.filter((row) => {
      const matchesStudent = activeStudent === "All" || row.studentId === activeStudent;
      const matchesStatus = activeStatus === "All" || row.status === activeStatus;
      const matchesSearch =
        !query ||
        row.studentName.toLowerCase().includes(query) ||
        row.studentEmail.toLowerCase().includes(query) ||
        row.invoice.toLowerCase().includes(query) ||
        row.method.toLowerCase().includes(query) ||
        row.date.toLowerCase().includes(query);

      return matchesStudent && matchesStatus && matchesSearch;
    });
  }, [activeStatus, activeStudent, paymentSearch, paymentRows]);

  const totals = useMemo(() => {
    const totalRevenue = paymentRows.reduce((sum, row) => sum + row.amount, 0);
    const paid = paymentRows.filter((row) => row.status === "Paid").reduce((sum, row) => sum + row.amount, 0);
    const pending = paymentRows.filter((row) => row.status === "Pending").reduce((sum, row) => sum + row.amount, 0);
    const refunded = paymentRows.filter((row) => row.status === "Refunded").reduce((sum, row) => sum + row.amount, 0);

    return { totalRevenue, paid, pending, refunded };
  }, [paymentRows]);

  const largestPending = useMemo(
    () =>
      [...paymentRows]
        .filter((row) => row.status === "Pending")
        .sort((left, right) => right.amount - left.amount)[0],
    [paymentRows],
  );

  function clearFilters() {
    setPaymentSearch("");
    setActiveStudent("All");
    setActiveStatus("All");
  }

  function exportPayments() {
    const headers = ["Student", "Email", "Amount", "Status", "Method", "Date", "Invoice"];
    const rows = filteredRows.map((row) => [
      row.studentName,
      row.studentEmail,
      String(row.amount),
      row.status,
      row.method,
      row.date,
      row.invoice,
    ]);
    const escapeCsvValue = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `kulkaran-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function resetForm(nextStudents = students) {
    setPaymentForm({
      ...emptyPaymentForm,
      studentId: nextStudents[0]?.id ?? "",
    });
  }

  async function handleSave() {
    const error = await portal.savePaymentRecord(paymentForm);

    if (error) {
      setPaymentError(error);
      return;
    }

    setPaymentError("");
    setIsDialogOpen(false);
    resetForm();
  }

  return (
    <section className={portalStyles.paymentPageShell}>
      <div className="relative overflow-hidden rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(116,237,198,0.18),transparent_24%),linear-gradient(180deg,#ffffff,#f7fbfa)] p-5 shadow-[0_22px_60px_rgba(9,72,69,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className={portalStyles.paymentKicker}>Payments</p>
            <h1 className={portalStyles.paymentTitle}>Manage student payments and records</h1>
            <p className={portalStyles.paymentLead}>
              Create, audit, and export payment entries. Invoice numbers are generated automatically when you save.
            </p>
          </div>

          <div className={portalStyles.paymentHeaderActions}>
            <Button type="button" variant="secondary" className={portalStyles.resourceToolbarButton} icon={<Download />} onClick={exportPayments}>
              Export
            </Button>
            <Button type="button" className={portalStyles.resourceToolbarButton} icon={<Plus />} onClick={() => setIsDialogOpen(true)}>
              Add Payment
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-4 sm:grid-cols-2">
          <PaymentStatCard
            label="Total Revenue"
            value={formatMoney(totals.totalRevenue)}
            icon={<ReceiptText aria-hidden="true" />}
            detail="All payment records currently stored."
          />
          <PaymentStatCard
            label="Paid"
            value={formatMoney(totals.paid)}
            icon={<ReceiptText aria-hidden="true" />}
            detail="Collections already completed."
          />
          <PaymentStatCard
            label="Pending"
            value={formatMoney(totals.pending)}
            icon={<ReceiptText aria-hidden="true" />}
            detail="Outstanding dues still awaiting completion."
          />
          <PaymentStatCard
            label="Refunded"
            value={formatMoney(totals.refunded)}
            icon={<ReceiptText aria-hidden="true" />}
            detail="Entries reversed or sent back."
          />
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-4">
            <div className="flex items-center gap-2 text-[#0d7b68]">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              <strong className="text-[0.92rem] text-[#10252b]">Collection focus</strong>
            </div>
            <p className="m-0 mt-3 text-[0.88rem] leading-[1.55] text-[#627579]">
              {largestPending
                ? `${largestPending.studentName} has the largest pending entry at ${formatMoney(largestPending.amount)}.`
                : "There are no pending payment records right now."}
            </p>
          </article>
          <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-4">
            <div className="flex items-center gap-2 text-[#0d7b68]">
              <ReceiptText aria-hidden="true" className="h-4 w-4" />
              <strong className="text-[0.92rem] text-[#10252b]">Filtered records</strong>
            </div>
            <p className="m-0 mt-3 text-[0.88rem] leading-[1.55] text-[#627579]">
              {filteredRows.length} payment record{filteredRows.length === 1 ? "" : "s"} match the current search and filters.
            </p>
          </article>
          <article className="rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-4">
            <div className="flex items-center gap-2 text-[#0d7b68]">
              <Link2 aria-hidden="true" className="h-4 w-4" />
              <strong className="text-[0.92rem] text-[#10252b]">Invoice handling</strong>
            </div>
            <p className="m-0 mt-3 text-[0.88rem] leading-[1.55] text-[#627579]">
              Use the table action to copy invoice IDs directly from each row for follow-up and reconciliation.
            </p>
          </article>
        </div>
      </div>

      <PortalTableShell
        toolbar={
          <PortalFilterBar className="grid-cols-[minmax(0,1fr)_minmax(170px,0.7fr)_minmax(170px,0.7fr)_max-content] max-[1100px]:grid-cols-1">
            <PortalSearchFilter
              label="Search payments"
              value={paymentSearch}
              onChange={setPaymentSearch}
              placeholder="Search student, invoice, or method..."
            />
            <PortalSelectFilter
              label="Student"
              value={activeStudent}
              onValueChange={setActiveStudent}
              placeholder="All students"
            >
              <SelectItem value="All">All students</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </PortalSelectFilter>
            <PortalSelectFilter
              label="Status"
              value={activeStatus}
              onValueChange={(value) => setActiveStatus(value as PaymentRow["status"] | "All")}
              placeholder="All status"
            >
              <SelectItem value="All">All status</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </PortalSelectFilter>
            <PortalFilterSummary onClear={clearFilters} />
          </PortalFilterBar>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="pl-6">
                  <div className="grid gap-0.5">
                    <strong className="text-[0.92rem] text-[#10252b]">{row.studentName}</strong>
                    <span className="text-[0.78rem] font-semibold text-[#6b7f84]">{row.studentEmail}</span>
                  </div>
                </TableCell>
                <TableCell className="font-black text-[#10252b]">{formatMoney(row.amount)}</TableCell>
                <TableCell>
                  <span className={`${portalStyles.paymentStatusBadge} ${getStatusClass(row.status)}`}>{row.status}</span>
                </TableCell>
                <TableCell className="font-semibold text-[#46595e]">{row.method}</TableCell>
                <TableCell className="font-semibold text-[#46595e]">{formatDate(row.date)}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    aria-label={`Copy invoice ${row.invoice}`}
                    onClick={() => navigator.clipboard.writeText(row.invoice)}
                    icon={<Link2 aria-hidden="true" />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredRows.length === 0 ? <p className={portalStyles.emptyState}>No payment records match these filters.</p> : null}
      </PortalTableShell>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={portalStyles.dialogContent} showCloseButton>
          <div className={portalStyles.dialogHeader}>
            <DialogHeader className={portalStyles.dialogHeaderRow}>
              <DialogTitle className={portalStyles.dialogTitle}>Add Payment</DialogTitle>
              <DialogDescription className={portalStyles.dialogDescription}>
                Create a new payment record. The invoice number will be generated automatically when you save.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className={portalStyles.dialogBody}>
            <div className={portalStyles.dialogForm}>
              <Select value={paymentForm.studentId} onValueChange={(value) => setPaymentForm((current) => ({ ...current, studentId: value }))}>
                <SelectTrigger className={`${portalStyles.dialogControl} w-full justify-between`}>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  className={portalStyles.dialogControl}
                  placeholder="Label"
                  value={paymentForm.label}
                  onChange={(event) => setPaymentForm((current) => ({ ...current, label: event.target.value }))}
                />
                <Input
                  className={portalStyles.dialogControl}
                  type="number"
                  placeholder="Amount"
                  value={paymentForm.amount}
                  onChange={(event) => setPaymentForm((current) => ({ ...current, amount: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Select value={paymentForm.method} onValueChange={(value) => setPaymentForm((current) => ({ ...current, method: value as PaymentFormState["method"] }))}>
                  <SelectTrigger className={`${portalStyles.dialogControl} w-full justify-between`}>
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentForm.status} onValueChange={(value) => setPaymentForm((current) => ({ ...current, status: value as PaymentFormState["status"] }))}>
                  <SelectTrigger className={`${portalStyles.dialogControl} w-full justify-between`}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input
                className={portalStyles.dialogControl}
                type="date"
                value={paymentForm.date}
                onChange={(event) => setPaymentForm((current) => ({ ...current, date: event.target.value }))}
              />

              {paymentError ? (
                <p className="m-0 rounded-[12px] border border-[#f2d3d8] bg-[#fff7f8] px-4 py-3 text-[0.88rem] font-semibold text-[#b42318]">
                  {paymentError}
                </p>
              ) : null}
            </div>
          </div>

          <div className={portalStyles.dialogFooter}>
            <Button
              type="button"
              variant="secondary"
              className="h-10 px-4 text-[0.85rem] font-black"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" className="h-10 px-4 text-[0.85rem] font-black" onClick={() => void handleSave()}>
              Save Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
