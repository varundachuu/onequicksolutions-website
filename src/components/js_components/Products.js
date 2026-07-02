import React from "react";
import { FaBoxOpen } from "react-icons/fa";
import "../css-files/services.css";

const Products = () => {
  return (
    <section id="products" className="service-showcase service-showcase--feature section-shell">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Product spotlight</span>
          <h2 className="section-title">A flagship product built for real utility</h2>
          <p className="section-copy">
            We also create focused digital products that solve recurring
            operational problems with a cleaner, more dependable user
            experience.
          </p>
        </div>

        <div className="service-showcase__feature">
          <article className="service-card service-card--feature">
            <span className="service-card__icon">
              <FaBoxOpen />
            </span>
            <div className="service-card__feature-copy">
              <h3 className="service-card__title">Flagship business product</h3>
              <p className="service-card__description">
                A focused product experience designed to streamline key business
                tasks, improve visibility, and give teams a more polished way
                to manage important workflows.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Products;
