import React from "react";
import "../css-files/PageHero.css";

function PageHero({
  kicker,
  title,
  description,
  primaryAction,
  secondaryAction,
  chips = [],
  highlights = [],
}) {
  const renderAction = (action, variant) => {
    if (!action) {
      return null;
    }

    return (
      <button
        type="button"
        className={`page-hero__button page-hero__button--${variant}`}
        onClick={action.onClick}
      >
        {action.label}
      </button>
    );
  };

  return (
    <section className="page-hero section-shell">
      <div className="section-inner page-hero__layout">
        <div className="page-hero__copy">
          <span className="section-kicker">{kicker}</span>
          <h1 className="section-title page-hero__title">{title}</h1>
          <p className="section-copy page-hero__description">{description}</p>

          {chips.length > 0 && (
            <div className="page-hero__chips" aria-label="Key topics">
              {chips.map((chip) => (
                <span key={chip} className="page-hero__chip">
                  {chip}
                </span>
              ))}
            </div>
          )}

          <div className="page-hero__actions">
            {renderAction(primaryAction, "primary")}
            {renderAction(secondaryAction, "secondary")}
          </div>
        </div>

        <aside className="page-hero__panel surface-panel">
          <span className="page-hero__panel-label">At a glance</span>
          <div className="page-hero__panel-grid">
            {highlights.map((item) => (
              <article key={item.title} className="page-hero__panel-card">
                <strong>{item.title}</strong>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default PageHero;
