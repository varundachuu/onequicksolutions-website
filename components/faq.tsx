"use client";

import { useState } from "react";

import type { FAQItem } from "@/data/faqs";

type FAQSectionProps = {
  items: FAQItem[];
  sectionId?: string;
  kicker?: string;
  title?: string;
  description?: string;
};

export function FAQSection({
  items,
  sectionId = "faq",
  kicker = "Frequently asked questions",
  title = "Common questions about working with OneQuickSolutions",
  description = "If you are planning a conversation with our team, these answers will help you understand how we approach delivery and support.",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id={sectionId} className="section-shell faq-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">{kicker}</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">{description}</p>
        </div>

        <div className="faq-list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={item.question} className="faq-item">
                <button
                  type="button"
                  className="faq-item__trigger"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`${sectionId}-panel-${index}`}
                >
                  <span>{item.question}</span>
                  <span className="faq-item__icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div id={`${sectionId}-panel-${index}`} className="faq-item__panel">
                    <p>{item.answer}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
