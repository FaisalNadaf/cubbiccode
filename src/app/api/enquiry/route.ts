/**
 * Contact-form delivery, sent straight over SMTP — no third-party form or email
 * SaaS. The browser POSTs the enquiry here and this route mails it to the
 * enquiry inbox using the account credentials in the environment.
 *
 * Runs on the Node runtime (not edge): Nodemailer opens a raw TLS socket to the
 * SMTP server, which the edge runtime has no `net`/`tls` for.
 *
 * @format
 */

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
// The form is dynamic; never let this handler be statically optimised/cached.
export const dynamic = "force-dynamic";

type Body = {
	name?: string;
	email?: string;
	phone?: string;
	subject?: string;
	message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Escape user text before it lands in the HTML body of the email. */
function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
	let body: Body;
	try {
		body = (await req.json()) as Body;
	} catch {
		return NextResponse.json(
			{ success: false, error: "Bad request." },
			{ status: 400 },
		);
	}

	const name = (body.name ?? "").trim();
	const email = (body.email ?? "").trim();
	const phone = (body.phone ?? "").trim();
	const subject = (body.subject ?? "").trim();
	const message = (body.message ?? "").trim();

	// Re-validate on the server — the client checks are for UX only and can be
	// bypassed. Mirrors the rules in EnquiryForm's `validate`.
	if (!name || !EMAIL_RE.test(email) || !subject || message.length < 10) {
		return NextResponse.json(
			{ success: false, error: "Please complete the form correctly." },
			{ status: 422 },
		);
	}

	const {
		SMTP_HOST,
		SMTP_PORT,
		SMTP_USER,
		SMTP_PASS,
		ENQUIRY_TO,
		ENQUIRY_FROM,
	} = process.env;

	if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
		// A configuration problem, not the visitor's fault — surface it as a server
		// error so the form shows its "try WhatsApp/email" fallback.
		console.error(
			"Enquiry email not sent: SMTP_* environment variables are missing.",
		);
		return NextResponse.json(
			{ success: false, error: "Email is not configured yet." },
			{ status: 503 },
		);
	}

	const port = Number(SMTP_PORT);
	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port,
		// 465 = implicit TLS; anything else (587) upgrades with STARTTLS.
		secure: port === 465,
		auth: { user: SMTP_USER, pass: SMTP_PASS },
	});

	const to = ENQUIRY_TO || SMTP_USER;
	const from = ENQUIRY_FROM || `Cubiccode Website <${SMTP_USER}>`;

	const lines = [
		`Name:    ${name}`,
		`Email:   ${email}`,
		`Phone:   ${phone || "—"}`,
		`Topic:   ${subject}`,
		"",
		"Message:",
		message,
	];

	const html = `
		<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6;color:#0B1B3A">
			<h2 style="margin:0 0 16px">New website enquiry</h2>
			<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
				<tr><td style="padding:2px 16px 2px 0;color:#64748b">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>
				<tr><td style="padding:2px 16px 2px 0;color:#64748b">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
				<tr><td style="padding:2px 16px 2px 0;color:#64748b">Phone</td><td>${escapeHtml(phone || "—")}</td></tr>
				<tr><td style="padding:2px 16px 2px 0;color:#64748b">Topic</td><td>${escapeHtml(subject)}</td></tr>
			</table>
			<p style="margin:16px 0 6px;color:#64748b">Message</p>
			<p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
		</div>`;

	try {
		await transporter.sendMail({
			from,
			to,
			// Replies go straight back to the visitor.
			replyTo: `${name} <${email}>`,
			subject: `New enquiry: ${subject} — ${name}`,
			text: lines.join("\n"),
			html,
		});
		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("Enquiry email failed to send:", err);
		return NextResponse.json(
			{ success: false, error: "Could not send your enquiry." },
			{ status: 502 },
		);
	}
}
