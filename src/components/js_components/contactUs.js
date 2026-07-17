import React, { useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";
import {
  faClock,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-toastify/dist/ReactToastify.css";
import "../css-files/contactUs.css";

const emailJsConfig = {
  serviceId:
    import.meta.env.VITE_EMAILJS_SERVICE_ID ||
    import.meta.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId:
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
    import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey:
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY ||
    import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY,
};

const contactMethods = [
  {
    icon: faEnvelope,
    label: "Email us",
    value: "onequicksolutionsinfo@gmail.com",
    href: "mailto:onequicksolutionsinfo@gmail.com",
  },
  {
    icon: faPhone,
    label: "Call us",
    value: "+91 8073981290 / +91 9110863957",
    href: "tel:+918073981290",
  },
  {
    icon: faClock,
    label: "Response time",
    value: "Usually within one business day",
  },
];

export const ContactUs = () => {
  const form = useRef(null);

  const sendEmail = (event) => {
    event.preventDefault();

    if (
      !emailJsConfig.serviceId ||
      !emailJsConfig.templateId ||
      !emailJsConfig.publicKey
    ) {
      toast.error("Contact form is not configured yet. Add the EmailJS values first.");
      return;
    }

    emailjs
      .sendForm(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        form.current,
        emailJsConfig.publicKey
      )
      .then(
        () => {
          toast.success("Thanks for reaching out. We will get back to you soon.");
          form.current.reset();
        },
        (error) => {
          toast.error("There was an error sending the message. Please try again.");
          console.error("FAILED...", error.text);
        }
      );
  };

  return (
    <section id="contact" className="contact-us section-shell">
      <div className="section-inner contact-layout">
        <div className="contact-copy">
          <span className="section-kicker">Contact us</span>
          <h2 className="section-title">Tell us what you want to build, improve, or launch next</h2>
          <p className="section-copy">
            Whether you need a premium website, a custom software system, a SaaS
            platform, better reporting, recruitment support, or a training-led
            digital initiative, we are ready to help you define the right path.
          </p>

          <div className="contact-methods">
            {contactMethods.map((method) => {
              const content = (
                <>
                  <span className="contact-method-icon">
                    <FontAwesomeIcon icon={method.icon} />
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
              Your business type, the challenge you want to solve, your target
              timeline, and whether you need strategy, design, development, or full delivery support.
            </span>
          </div>
        </div>

        <div className="contact-card">
          <form ref={form} onSubmit={sendEmail} className="contact-form">
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
                <select id="contact-service" name="service_interest" defaultValue="">
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option>Custom Software Development</option>
                  <option>Website Development</option>
                  <option>Mobile App Development</option>
                  <option>SaaS Development</option>
                  <option>AI Solutions</option>
                  <option>Data Analytics</option>
                  <option>Cloud Solutions</option>
                  <option>UI/UX Design</option>
                  <option>HR Consulting</option>
                  <option>E-Shikshana / Training</option>
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
              <p className="contact-form__privacy">
                We use your message only to respond to your enquiry and plan the right next step.
              </p>
              <button type="submit" className="contact-button">
                Send your enquiry
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </section>
  );
};

export default ContactUs;
