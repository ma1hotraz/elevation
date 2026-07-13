import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { siteConfig } from "@/lib/site-config";

export type EnquiryMailData = {
  fullName: string;
  contact: string;
  course: string;
  preferredTime: "Morning" | "Afternoon" | "Evening";
  message: string;
};

type MailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function extractEmail(value: string) {
  const match = value.trim().match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0] || "";
}

function renderText(data: EnquiryMailData) {
  return [
    "New website enquiry",
    "",
    `Name: ${data.fullName}`,
    `Course: ${data.course}`,
    `Preferred time: ${data.preferredTime}`,
    `Contact: ${data.contact}`,
    "",
    "Message:",
    data.message || "(No message provided)",
    "",
    `Source: ${siteConfig.name}`,
  ].join("\n");
}

function renderHtml(data: EnquiryMailData) {
  const messageBlock = data.message
    ? `<p style="margin:0;white-space:pre-wrap;line-height:1.75;color:#355359;">${nl2br(data.message)}</p>`
    : '<p style="margin:0;line-height:1.75;color:#708084;">No message was provided.</p>';

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f3f8f7;padding:32px 12px;font-family:Segoe UI,Arial,sans-serif;color:#10252b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border:1px solid #dce8e5;border-radius:18px;overflow:hidden;box-shadow:0 24px 70px rgba(7,67,61,0.09);">
            <tr>
              <td style="height:4px;background:linear-gradient(90deg,#8ef1ce 0%,#20b992 45%,#063d3a 100%);font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:32px 36px;background:linear-gradient(145deg,#063d3a 0%,#042d2a 100%);">
                <div style="display:inline-block;margin-bottom:18px;padding:6px 12px;border-radius:999px;background:rgba(142,241,206,0.14);color:#8ef1ce;font-size:11px;font-weight:800;letter-spacing:0.18em;line-height:1;text-transform:uppercase;">New enquiry</div>
                <h1 style="margin:0;color:#ffffff;font-size:32px;line-height:1.12;letter-spacing:-0.04em;">${escapeHtml(data.fullName)}</h1>
                <p style="margin:12px 0 0;color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;">
                  Interested in <span style="color:#ffffff;font-weight:700;">${escapeHtml(data.course)}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 36px 34px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-bottom:1px solid #e3ecea;margin-bottom:28px;">
                  <tr>
                    <td width="50%" valign="top" style="padding:0 18px 22px 0;">
                      <div style="margin-bottom:8px;color:#748784;font-size:11px;font-weight:800;letter-spacing:0.14em;line-height:1.2;text-transform:uppercase;">Contact</div>
                      <div style="color:#10252b;font-size:15px;font-weight:600;line-height:1.55;word-break:break-word;">${escapeHtml(data.contact)}</div>
                    </td>
                    <td width="50%" valign="top" style="padding:0 0 22px 18px;border-left:1px solid #e3ecea;">
                      <div style="margin-bottom:8px;color:#748784;font-size:11px;font-weight:800;letter-spacing:0.14em;line-height:1.2;text-transform:uppercase;">Preferred time</div>
                      <div style="color:#10252b;font-size:15px;font-weight:600;line-height:1.55;">${escapeHtml(data.preferredTime)}</div>
                    </td>
                  </tr>
                </table>

                <div style="margin-bottom:10px;color:#0d7b68;font-size:11px;font-weight:800;letter-spacing:0.14em;line-height:1.2;text-transform:uppercase;">Message</div>
                <div style="padding:16px 17px;border:1px solid #dce9e6;border-radius:12px;background:#f7fbfa;">${messageBlock}</div>

                <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e3ecea;color:#80908e;font-size:12px;line-height:1.65;">
                  Submitted through the <span style="color:#526864;font-weight:700;">${escapeHtml(siteConfig.name)}</span> website.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function createTransport(): Transporter {
  const smtpUrl = process.env.SMTP_URL?.trim() || "";

  if (smtpUrl) {
    return nodemailer.createTransport(smtpUrl);
  }

  const host = process.env.SMTP_HOST?.trim() || "";
  const port = Number(process.env.SMTP_PORT?.trim() || "587");
  const user = process.env.SMTP_USER?.trim() || "";
  const password = process.env.SMTP_PASSWORD?.trim() || "";
  const secureValue = process.env.SMTP_SECURE?.trim();
  const secure = secureValue ? secureValue === "true" : port === 465;

  if (!host || !user || !password) {
    throw new Error("Missing SMTP configuration. Add SMTP_URL or SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: password,
    },
  });
}

export function buildEnquiryMailPayload(data: EnquiryMailData): MailPayload | null {
  const from = process.env.ENQUIRY_EMAIL_FROM?.trim() || "";
  const to = process.env.ENQUIRY_EMAIL_TO?.trim() || siteConfig.contactEmail;

  if (!from || !to) {
    return null;
  }

  return {
    from,
    to,
    subject: `New enquiry from ${data.fullName}`,
    html: renderHtml(data),
    text: renderText(data),
    replyTo: extractEmail(data.contact) || undefined,
  };
}

export async function sendEnquiryMail(data: EnquiryMailData) {
  const payload = buildEnquiryMailPayload(data);
  if (!payload) {
    return { sent: false as const, skipped: true as const };
  }

  const transport = createTransport();
  await transport.sendMail(payload);
  return { sent: true as const, skipped: false as const };
}
