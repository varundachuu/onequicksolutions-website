"use client";

import { FormEvent, useMemo, useState } from "react";
import { FaClock, FaEnvelope, FaPhone } from "react-icons/fa6";
import { usePathname } from "next/navigation";

import { serviceCards } from "@/data/services";
import { contactMethods } from "@/data/site";

type ContactFormSectionProps = {
  defaultService?: string;
  sourcePath?: string;
  kicker?: string;
  heading?: string;
  description?: string;
};

type FormStatus =
  | { type: "idle"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const iconMap = {
  mail: FaEnvelope,
  phone: FaPhone,
  clock: FaClock,
};

export function ContactFormSection({
  defaultService = "",
  sourcePath,
  kicker = "Contact us",
  heading = "Tell us what you want to build, improve, or launch next",
  description = "Whether you need a premium website, a custom software system, a SaaS platform, better reporting, recruitment support, or a training-led digital initiative, we are ready to help you define the right path.",
}: ContactFormSectionProps) {
  const pathname = usePathname();
  const [selectedService, setSelectedService] = useState(defaultService);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  const serviceOptions = useMemo(
    () => [...serviceCards.map((service) => service.title), "Training and Education"],
    [],
  );

  const resolvedSourcePath = sourcePath ?? pathname ?? "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = String(formData.get("company_website") ?? "").trim();

    if (honeypot) {
      setStatus({
        type: "success",
        message: "Thanks. Your request has been received.",
      });
      form.reset();
      return;
    }

    const payload = {
      user_name: String(formData.get("user_name") ?? ""),
      user_email: String(formData.get("user_email") ?? ""),
      user_phone: String(formData.get("user_phone") ?? ""),
      company_name: String(formData.get("company_name") ?? ""),
      service_interest: String(formData.get("service_interest") ?? selectedService),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      source_page: resolvedSourcePath,
      service_name: selectedService || String(formData.get("service_interest") ?? ""),
      submitted_at: new Date().toISOString(),
    };

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message || "There was an error sending the message. Please try again.");
      }

      setStatus({
        type: "success",
        message: result?.message || "Thanks for reaching out. We will get back to you soon.",
      });
      form.reset();
      setSelectedService(defaultService);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "There was an error sending the message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="contact-us section-shell">
      <div className="section-inner contact-layout">
        <div className="contact-copy">
          <span className="section-kicker">{kicker}</span>
          <h2 className="section-title">{heading}</h2>
          <p className="section-copy">{description}</p>

          <div className="contact-methods">
            {contactMethods.map((method) => {
              const Icon = iconMap[method.icon as keyof typeof iconMap] ?? FaEnvelope;
              const content = (
                <>
                  <span className="contact-method-icon">
                    <Icon />
                  </span>
                  <div>
                    <h3>{method.label}</h3>
                    <p>{method.value}</p>
                  </div>
                </>
              );

              return method.href ? (
                <a key={method.label} className="contact-method-card" href={method.href}>
                  {content}
                </a>
              ) : (
                <article key={method.label} className="contact-method-card">
                  {content}
                </article>
              );
            })}
          </div>

          <div className="contact-trust-note">
            <strong>What helps us guide you faster:</strong>
            <span>
              Your business type, the challenge you want to solve, your target timeline, and
              whether you need strategy, design, development, or full delivery support.
            </span>
          </div>
        </div>

        <div className="contact-card">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="company_website"
              className="contact-honeypot"
              tabIndex={-1}
              autoComplete="off"
            />
            <input type="hidden" name="source_page" value={resolvedSourcePath} />
            <input type="hidden" name="service_name" value={selectedService} />

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="contact-name">Full name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="user_name"
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Business email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="user_email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-phone">Phone number</label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="user_phone"
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-company">Company or institution</label>
                <input
                  id="contact-company"
                  type="text"
                  name="company_name"
                  placeholder="Enter your company name"
                  autoComplete="organization"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-service">Service needed</label>
                <select
                  id="contact-service"
                  name="service_interest"
                  value={selectedService}
                  onChange={(event) => setSelectedService(event.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Project focus</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="Tell us what you want to improve"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="contact-message">Project details</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Share your goals, current challenge, expected timeline, or the kind of solution you have in mind"
                  required
                />
              </div>
            </div>

            <div className="contact-form__footer">
              <div>
                <p className="contact-form__privacy">
                  We use your message only to respond to your enquiry and plan the right next
                  step.
                </p>
                {status.message ? (
                  <p className={`contact-form__status contact-form__status--${status.type}`} role="status">
                    {status.message}
                  </p>
                ) : null}
              </div>
              <button type="submit" className="contact-button" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send your enquiry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
