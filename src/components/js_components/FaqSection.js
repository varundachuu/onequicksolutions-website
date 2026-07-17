import React, { useState } from "react";
import "../css-files/ContentSections.css";

function FaqSection({
  sectionId = "faq",
  kicker = "Frequently asked questions",
  title = "Answers to the questions buyers usually ask first",
  description,
  items,
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id={sectionId} className="section-shell faq-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">{kicker}</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">
            {description ??
              "These answers are designed to help you understand how we work, what we build, and how to take the next step with confidence."}
          </p>
        </div>

        <div className="faq-list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                key={item.question}
                className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-item__trigger"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="faq-item__icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div className="faq-item__panel" hidden={!isOpen}>
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
