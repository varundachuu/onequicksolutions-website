import { NextRequest, NextResponse } from "next/server";

import { companyInfo } from "@/data/site";
import { getDefaultMailbox, getMailConfigurationMessage, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

type ContactRequestBody = {
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  company_name?: string;
  service_interest?: string;
  subject?: string;
  message?: string;
  source_page?: string;
  service_name?: string;
  company_website?: string;
  submitted_at?: string;
};

function normalizeText(value: unknown, maxLength: number) {
  return String(value ?? "").replace(/\r\n/g, "\n").trim().slice(0, maxLength);
}

function normalizeLine(value: unknown, maxLength: number) {
  return normalizeText(value, maxLength).replace(/\s+/g, " ");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildFieldRows(fields: Array<[string, string]>) {
  return fields
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;">${escapeHtml(value || "-")}</td></tr>`,
    )
    .join("");
}

export async function POST(request: NextRequest) {
  let body: ContactRequestBody;

  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const honeypot = normalizeLine(body.company_website, 200);
  if (honeypot) {
    return NextResponse.json({ message: "Thanks. Your request has been received." });
  }

  const userName = normalizeLine(body.user_name, 120);
  const userEmail = normalizeLine(body.user_email, 160).toLowerCase();
  const userPhone = normalizeLine(body.user_phone, 60);
  const companyName = normalizeLine(body.company_name, 160);
  const serviceInterest = normalizeLine(body.service_interest, 120);
  const projectFocus = normalizeLine(body.subject, 180);
  const message = normalizeText(body.message, 5000);
  const sourcePage = normalizeLine(body.source_page, 160) || "/";
  const serviceName = normalizeLine(body.service_name, 120) || serviceInterest;
  const submittedAt = normalizeLine(body.submitted_at, 80) || new Date().toISOString();

  if (!userName || !userEmail || !serviceInterest || !message) {
    return NextResponse.json(
      { message: "Please complete your name, email, service, and project details." },
      { status: 400 },
    );
  }

  if (!isValidEmail(userEmail)) {
    return NextResponse.json(
      { message: "Please enter a valid business email address." },
      { status: 400 },
    );
  }

  const subjectLine = projectFocus || serviceName || "Website enquiry";
  const recipient = String(process.env.CONTACT_TO_EMAIL || companyInfo.email || getDefaultMailbox()).trim();
  const fieldRows = buildFieldRows([
    ["Name", userName],
    ["Email", userEmail],
    ["Phone", userPhone],
    ["Company", companyName],
    ["Service", serviceInterest],
    ["Project focus", projectFocus],
    ["Source page", sourcePage],
    ["Submitted at", submittedAt],
  ]);

  const textBody = [
    "A new website enquiry was submitted.",
    "",
    `Name: ${userName}`,
    `Email: ${userEmail}`,
    `Phone: ${userPhone || "-"}`,
    `Company: ${companyName || "-"}`,
    `Service: ${serviceInterest}`,
    `Project focus: ${projectFocus || "-"}`,
    `Source page: ${sourcePage}`,
    `Submitted at: ${submittedAt}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;">
      <h2 style="margin:0 0 16px;">New OneQuickSolutions website enquiry</h2>
      <p style="margin:0 0 20px;">
        A new enquiry was submitted from <strong>${escapeHtml(sourcePage)}</strong>.
      </p>
      <table style="border-collapse:collapse;width:100%;margin:0 0 20px;">
        <tbody>${fieldRows}</tbody>
      </table>
      <div style="padding:16px;border:1px solid #dbe3f5;border-radius:12px;background:#f8fbff;">
        <p style="margin:0 0 8px;font-weight:600;">Project details</p>
        <p style="margin:0;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    </div>
  `;

  try {
    await sendMail({
      to: recipient,
      replyTo: userEmail,
      subject: `New enquiry: ${subjectLine}`,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({
      message: "Thanks for reaching out. We will get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form email failed", error);

    const errorMessage =
      error instanceof Error ? error.message : "There was an error sending the message.";
    const isConfigurationError = errorMessage === getMailConfigurationMessage();

    return NextResponse.json(
      {
        message: isConfigurationError
          ? "The contact form is not configured yet. Add the SMTP values before using it."
          : "There was an error sending the message. Please try again.",
      },
      { status: 500 },
    );
  }
}
