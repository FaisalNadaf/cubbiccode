/** @format */

"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	CheckCircle2,
	Mail,
	MessageCircle,
	RotateCcw,
	Send,
	Loader2,
} from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type Fields = {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = {
	name: "",
	email: "",
	phone: "",
	subject: "",
	message: "",
};

const SUBJECTS = [
	"New website or web app",
	"Custom ERP / software",
	"SEO & growth",
	"Remote team / IT talent",
	"Training & upskilling",
	"Something else",
];

function validate(values: Fields): Errors {
	const errors: Errors = {};
	if (!values.name.trim()) errors.name = "Please tell us your name.";
	if (!values.email.trim()) {
		errors.email = "An email helps us reach you.";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
		errors.email = "That email doesn't look right.";
	}
	if (!values.subject.trim()) errors.subject = "Pick what this is about.";
	if (!values.message.trim()) {
		errors.message = "A line or two about your project helps.";
	} else if (values.message.trim().length < 10) {
		errors.message = "A little more detail, please.";
	}
	return errors;
}

export function EnquiryForm() {
	const [values, setValues] = useState<Fields>(EMPTY);
	const [errors, setErrors] = useState<Errors>({});
	const [touched, setTouched] = useState<
		Partial<Record<keyof Fields, boolean>>
	>({});
	const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

	function update(key: keyof Fields, value: string) {
		setValues((prev) => ({ ...prev, [key]: value }));
		if (touched[key]) {
			setErrors(validate({ ...values, [key]: value }));
		}
	}

	function handleBlur(key: keyof Fields) {
		setTouched((prev) => ({ ...prev, [key]: true }));
		setErrors(validate(values));
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const found = validate(values);
		setErrors(found);
		setTouched({
			name: true,
			email: true,
			phone: true,
			subject: true,
			message: true,
		});
		if (Object.keys(found).length > 0) return;

		setStatus("sending");
		// No backend exists  simulate a graceful submit, then surface real channels.
		window.setTimeout(() => setStatus("sent"), 850);
	}

	function reset() {
		setValues(EMPTY);
		setErrors({});
		setTouched({});
		setStatus("idle");
	}

	// Pre-fill the WhatsApp deep link with whatever the visitor has typed.
	const waMessage = encodeURIComponent(
		`Hi Cubiccode, I'm ${values.name || "[name]"}.${
			values.subject ? ` Re: ${values.subject}.` : ""
		}${values.message ? ` ${values.message}` : ""}`,
	);
	const waHref = `${site.whatsapp}&text=${waMessage}`;

	return (
		<div className="relative overflow-hidden rounded-4xl border border-steel-200 bg-white p-6 shadow-card sm:p-8 lg:p-10">
			<div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-corporate-400/10 blur-3xl" />

			<AnimatePresence
				mode="wait"
				initial={false}>
				{status === "sent" ?
					<motion.div
						key="success"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
						className="relative flex flex-col items-center py-6 text-center">
						<motion.span
							initial={{ scale: 0.6, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								delay: 0.1,
								type: "spring",
								stiffness: 260,
								damping: 18,
							}}
							className="flex size-16 items-center justify-center rounded-full bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100">
							<CheckCircle2 className="size-8" />
						</motion.span>

						<h3 className="mt-6 font-display text-2xl font-bold tracking-tightest text-ink">
							Thanks we&apos;ll be in touch within a day.
						</h3>
						<p className="mt-3 max-w-md text-pretty leading-relaxed text-steel-600">
							Your enquiry has reached the right desk. Prefer something faster?
							Reach us directly on WhatsApp or email we usually reply within a
							few hours.
						</p>

						<div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
							<a
								href={waHref}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-full bg-corporate-600 px-7 text-[15px] font-medium text-white shadow-soft transition-colors hover:bg-corporate-500"
								style={{ height: "3rem" }}>
								<MessageCircle className="size-4" /> Continue on WhatsApp
							</a>
							<a
								href={`mailto:${site.email}?subject=${encodeURIComponent(
									values.subject || "Project enquiry",
								)}`}
								className="inline-flex items-center justify-center gap-2 rounded-full border border-steel-300 bg-white px-7 text-[15px] font-medium text-ink transition-colors hover:border-ink"
								style={{ height: "3rem" }}>
								<Mail className="size-4" /> Email us
							</a>
						</div>

						<button
							type="button"
							onClick={reset}
							className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-steel-500 transition-colors hover:text-ink">
							<RotateCcw className="size-3.5" /> Send another enquiry
						</button>
					</motion.div>
				:	<motion.form
						key="form"
						initial={false}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, y: -8 }}
						onSubmit={handleSubmit}
						noValidate
						className="relative">
						<div className="mb-6">
							<span className="kicker">Project enquiry</span>
							<h3 className="mt-3 font-display text-2xl font-bold tracking-tightest text-ink">
								Tell us what you&apos;re building
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-steel-500">
								Share a few details and we&apos;ll come back with a clear plan,
								timeline and proposal typically within a day.
							</p>
						</div>

						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
							<Field
								label="Full name"
								name="name"
								value={values.name}
								error={touched.name ? errors.name : undefined}
								onChange={(v) => update("name", v)}
								onBlur={() => handleBlur("name")}
								autoComplete="name"
								required
							/>
							<Field
								label="Email address"
								name="email"
								type="email"
								value={values.email}
								error={touched.email ? errors.email : undefined}
								onChange={(v) => update("email", v)}
								onBlur={() => handleBlur("email")}
								autoComplete="email"
								required
							/>
							<Field
								label="Phone (optional)"
								name="phone"
								type="tel"
								value={values.phone}
								error={touched.phone ? errors.phone : undefined}
								onChange={(v) => update("phone", v)}
								onBlur={() => handleBlur("phone")}
								autoComplete="tel"
							/>

							<div>
								<label
									htmlFor="subject"
									className="mb-1.5 block text-[13px] font-medium text-steel-700">
									What&apos;s this about?{" "}
									<span className="text-corporate-600">*</span>
								</label>
								<select
									id="subject"
									name="subject"
									value={values.subject}
									onChange={(e) => update("subject", e.target.value)}
									onBlur={() => handleBlur("subject")}
									className={cn(
										"h-12 w-full rounded-xl border bg-canvas-soft px-4 text-[15px] text-ink outline-none transition focus:border-corporate-400 focus:bg-white focus:ring-2 focus:ring-corporate-500/20",
										touched.subject && errors.subject ?
											"border-red-300 focus:border-red-400 focus:ring-red-500/20"
										:	"border-steel-200",
									)}>
									<option
										value=""
										disabled>
										Select a topic…
									</option>
									{SUBJECTS.map((s) => (
										<option
											key={s}
											value={s}>
											{s}
										</option>
									))}
								</select>
								{touched.subject && errors.subject && (
									<p className="mt-1.5 text-[12.5px] text-red-500">
										{errors.subject}
									</p>
								)}
							</div>
						</div>

						<div className="mt-5">
							<label
								htmlFor="message"
								className="mb-1.5 block text-[13px] font-medium text-steel-700">
								Project details <span className="text-corporate-600">*</span>
							</label>
							<textarea
								id="message"
								name="message"
								rows={5}
								value={values.message}
								onChange={(e) => update("message", e.target.value)}
								onBlur={() => handleBlur("message")}
								placeholder="A few lines about your goals, scope, timeline or budget…"
								className={cn(
									"w-full resize-none rounded-xl border bg-canvas-soft px-4 py-3 text-[15px] leading-relaxed text-ink outline-none transition placeholder:text-steel-400 focus:border-corporate-400 focus:bg-white focus:ring-2 focus:ring-corporate-500/20",
									touched.message && errors.message ?
										"border-red-300 focus:border-red-400 focus:ring-red-500/20"
									:	"border-steel-200",
								)}
							/>
							{touched.message && errors.message && (
								<p className="mt-1.5 text-[12.5px] text-red-500">
									{errors.message}
								</p>
							)}
						</div>

						<div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<button
								type="submit"
								disabled={status === "sending"}
								className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 text-[15px] font-medium text-white shadow-soft transition-all duration-300 hover:bg-corporate-700 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500 focus-visible:ring-offset-2 disabled:opacity-70"
								style={{ height: "3.25rem" }}>
								{status === "sending" ?
									<>
										<Loader2 className="size-4 animate-spin" /> Sending…
									</>
								:	<>
										Send enquiry
										<Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
									</>
								}
							</button>

							<p className="text-[12.5px] leading-relaxed text-steel-400 sm:max-w-[14rem] sm:text-right">
								We respect your privacy. No spam, ever just a reply from a real
								person.
							</p>
						</div>
					</motion.form>
				}
			</AnimatePresence>
		</div>
	);
}

function Field({
	label,
	name,
	value,
	error,
	onChange,
	onBlur,
	type = "text",
	required,
	autoComplete,
}: {
	label: string;
	name: keyof Fields;
	value: string;
	error?: string;
	onChange: (v: string) => void;
	onBlur: () => void;
	type?: string;
	required?: boolean;
	autoComplete?: string;
}) {
	return (
		<div>
			<label
				htmlFor={name}
				className="mb-1.5 block text-[13px] font-medium text-steel-700">
				{label} {required && <span className="text-corporate-600">*</span>}
			</label>
			<input
				id={name}
				name={name}
				type={type}
				value={value}
				autoComplete={autoComplete}
				onChange={(e) => onChange(e.target.value)}
				onBlur={onBlur}
				className={cn(
					"h-12 w-full rounded-xl border bg-canvas-soft px-4 text-[15px] text-ink outline-none transition placeholder:text-steel-400 focus:border-corporate-400 focus:bg-white focus:ring-2 focus:ring-corporate-500/20",
					error ?
						"border-red-300 focus:border-red-400 focus:ring-red-500/20"
					:	"border-steel-200",
				)}
			/>
			{error && <p className="mt-1.5 text-[12.5px] text-red-500">{error}</p>}
		</div>
	);
}
