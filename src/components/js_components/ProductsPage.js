import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaShieldAlt, FaUsers } from "react-icons/fa";
import PageHero from "./PageHero";
import ProductSpotlight from "./ProductSpotlight";
import "../css-files/ContentSections.css";

const productBenefits = [
  {
    title: "Built for real workflows",
    description:
      "Our products are shaped around the practical tasks teams need to complete every day, with clear journeys and purposeful features.",
    icon: FaUsers,
  },
  {
    title: "Ready to grow",
    description:
      "We plan products with scalable foundations so new capabilities, users, and integrations can be added as your needs evolve.",
    icon: FaChartLine,
  },
  {
    title: "Designed with care",
    description:
      "Clear interfaces, considered access, and dependable data handling help make each product easier to use and trust.",
    icon: FaShieldAlt,
  },
];

function ProductsPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHero
        kicker="Digital products"
        title="Focused products for smoother, more organized business operations"
        description="OneQuickSolutions develops practical digital products that turn recurring business processes into clearer, more useful experiences for teams and customers."
        chips={["Business workflows", "Secure access", "Product-led growth"]}
        primaryAction={{
          label: "Talk about your product need",
          onClick: () => navigate("/contact"),
        }}
        secondaryAction={{
          label: "Explore our services",
          onClick: () => navigate("/services"),
        }}
        highlights={[
          {
            title: "Practical by design",
            copy: "Products shaped around clear user needs and day-to-day operations.",
          },
          {
            title: "Built to evolve",
            copy: "Strong foundations for new features, users, and connected workflows.",
          },
          {
            title: "People-first experiences",
            copy: "Simple, credible interfaces that make complex work easier to manage.",
          },
        ]}
      />

      <ProductSpotlight detailed />

      <section className="section-shell">
        <div className="section-inner">
          <div className="section-intro">
            <span className="section-kicker">How we build</span>
            <h2 className="section-title">Product thinking that stays close to your business</h2>
            <p className="section-copy">
              We combine product strategy, experience design, engineering, and
              continuous improvement to create digital tools people can adopt
              with confidence.
            </p>
          </div>

          <div className="confidence-grid">
            {productBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article key={benefit.title} className="confidence-card surface-panel interactive-panel">
                  <span className="confidence-card__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductsPage;
