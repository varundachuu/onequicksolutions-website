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
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
};

const contactMethods = [
  {
    icon: faEnvelope,
    label: "Email us",
    value: "onequicksolutionsinfo@gmail.com",
  },
  {
    icon: faPhone,
    label: "Call us",
    value: "+91 8073981290 / +91 9110863957",
  },
  {
    icon: faClock,
    label: "Response time",
    value: "Usually within one business day",
  },
];

export const ContactUs = () => {
  const form = useRef();
  const contact = useRef(null);

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
          toast.success("Will get back soon!");
          form.current.reset();
        },
        (error) => {
          toast.error("There was an error sending the message. Please try again.");
          console.error("FAILED...", error.text);
        }
      );
  };

  return (
    <section ref={contact} id="contact" className="contact-us section-shell">
      <div className="section-inner contact-layout">
        <div className="contact-copy">
          <span className="section-kicker">Contact us</span>
          <h2 className="section-title">Let&apos;s plan the next step together</h2>
          <p className="section-copy">
            Whether you need a sharper website, a custom SaaS workflow, or a
            more dependable digital system, we are ready to help you define the
            right solution.
          </p>

          <div className="contact-methods">
            {contactMethods.map((method) => (
              <article key={method.label} className="contact-method-card">
                <span className="contact-method-icon">
                  <FontAwesomeIcon icon={method.icon} />
                </span>
                <div>
                  <h3>{method.label}</h3>
                  <p>{method.value}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="contact-card">
          <form ref={form} onSubmit={sendEmail} className="contact-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="contact-name">Name</label>
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
                <label htmlFor="contact-email">Email</label>
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
                <label htmlFor="contact-phone">Phone</label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="user_phone"
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="Tell us what you need"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Share your goals, timeline, or the challenge you are solving"
                  required
                />
              </div>
            </div>

            <button type="submit" className="contact-button">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
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
