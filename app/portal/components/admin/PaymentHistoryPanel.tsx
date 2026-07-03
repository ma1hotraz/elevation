import { Download, Link2, Plus, ReceiptText, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

function PaymentStatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <article className="grid gap-3 rounded-[14px] border border-[rgba(8,47,43,0.08)] bg-white p-4 shadow-[0_12px_34px_rgba(9,72,69,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="block text-[0.8rem] font-bold text-[#7a8b90]">{label}</span>
          <strong className="block text-[1.5rem] font-black leading-none text-[#10252b]">{value}</strong>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#e9fbf5] text-[#087365] [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </span>
      </div>
    </article>
  );
}

type PaymentHistoryPanelProps = {
  portal: PortalController;
};

export function PaymentHistoryPanel({ portal }: PaymentHistoryPanelProps) {
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

  function clearFilters() {
    setPaymentSearch("");
    setActiveStudent("All");
    setActiveStatus("All");
  }

  function resetForm(nextStudents = students) {
    setPaymentForm({
      ...emptyPaymentForm,
      studentId: nextStudents[0]?.id ?? "",
    });
  }

  function handleSave() {
    portal.savePaymentRecord(paymentForm);
    setIsDialogOpen(false);
    resetForm();
  }

  return (
    <section className={portalStyles.paymentPageShell}>
      <div className={portalStyles.paymentHeader}>
        <div>
          <p className={portalStyles.paymentKicker}>Payments</p>
          <h1 className={portalStyles.paymentTitle}>Payment History</h1>
          <p className={portalStyles.paymentLead}>Manual records for student payments and transactions.</p>
        </div>

        <div className={portalStyles.paymentHeaderActions}>
          <Button type="button" variant="secondary" className={portalStyles.resourceToolbarButton} icon={<Download />}>
            Export
          </Button>
          <Button type="button" className={portalStyles.resourceToolbarButton} icon={<Plus />} onClick={() => setIsDialogOpen(true)}>
            Add Payment
          </Button>
        </div>
      </div>

      <div className={portalStyles.paymentStatGrid}>
        <PaymentStatCard label="Total Revenue" value={formatMoney(totals.totalRevenue)} icon={<ReceiptText aria-hidden="true" />} />
        <PaymentStatCard label="Paid" value={formatMoney(totals.paid)} icon={<ReceiptText aria-hidden="true" />} />
        <PaymentStatCard label="Pending" value={formatMoney(totals.pending)} icon={<ReceiptText aria-hidden="true" />} />
        <PaymentStatCard label="Refunded" value={formatMoney(totals.refunded)} icon={<ReceiptText aria-hidden="true" />} />
      </div>

      <div className={portalStyles.paymentFilterGrid}>
        <div className="grid gap-2">
          <Label className="sr-only">Search payments</Label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9a9d]" />
            <Input
              className="h-10 rounded-[10px] border-[#d6e3e1] bg-white pl-10 text-[0.9rem]"
              value={paymentSearch}
              onChange={(event) => setPaymentSearch(event.target.value)}
              placeholder="Search student, invoice, or method..."
            />
          </div>
        </div>

        <Select value={activeStudent} onValueChange={setActiveStudent}>
          <SelectTrigger className="h-10 w-full rounded-[10px] border-[#d6e3e1] bg-white px-4 text-[0.9rem]">
            <SelectValue placeholder="All Students" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Students</SelectItem>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={activeStatus} onValueChange={(value) => setActiveStatus(value as PaymentRow["status"] | "All")}>
          <SelectTrigger className="h-10 w-full rounded-[10px] border-[#d6e3e1] bg-white px-4 text-[0.9rem]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={portalStyles.paymentCountRow}>
        <Button type="button" variant="secondary" className={portalStyles.resourceToolbarButton} onClick={clearFilters}>
          Clear filters
        </Button>
        <span>{filteredRows.length} payments found</span>
      </div>

      <div className={portalStyles.paymentTableFrame}>
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
                <TableCell>
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
                    aria-label={`Preview invoice ${row.invoice}`}
                    onClick={() => navigator.clipboard.writeText(row.invoice)}
                    icon={<Link2 aria-hidden="true" />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredRows.length === 0 ? <p className={portalStyles.emptyState}>No payment records match these filters.</p> : null}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={portalStyles.dialogContent} showCloseButton>
          <div className={portalStyles.dialogHeader}>
            <DialogHeader className={portalStyles.dialogHeaderRow}>
              <DialogTitle className={portalStyles.dialogTitle}>Add Payment</DialogTitle>
              <DialogDescription className={portalStyles.dialogDescription}>
                Manually enter a new payment record for a student.
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
                <Input className={portalStyles.dialogControl} placeholder="Label" value={paymentForm.label} onChange={(event) => setPaymentForm((current) => ({ ...current, label: event.target.value }))} />
                <Input className={portalStyles.dialogControl} type="number" placeholder="Amount" value={paymentForm.amount} onChange={(event) => setPaymentForm((current) => ({ ...current, amount: event.target.value }))} />
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

              <div className="grid gap-3 sm:grid-cols-2">
                <Input className={portalStyles.dialogControl} type="date" value={paymentForm.date} onChange={(event) => setPaymentForm((current) => ({ ...current, date: event.target.value }))} />
                <Input className={portalStyles.dialogControl} placeholder="Invoice number" value={paymentForm.invoice} onChange={(event) => setPaymentForm((current) => ({ ...current, invoice: event.target.value }))} />
              </div>
            </div>
          </div>

          <div className={portalStyles.dialogFooter}>
            <Button type="button" variant="secondary" className="h-10 px-4 text-[0.85rem] font-black" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="h-10 px-4 text-[0.85rem] font-black" onClick={handleSave}>
              Save Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
