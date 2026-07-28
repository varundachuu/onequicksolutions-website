import type { ReactNode } from "react";
import Link from "next/link";

type HeroAction = {
  label: string;
  href: string;
};

type PageHeroProps = {
  kicker: string;
  title: string;
  description: string;
  chips?: string[];
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  highlights?: Array<{ title: string; copy: string }>;
  breadcrumbs?: ReactNode;
};

export function PageHero({
  kicker,
  title,
  description,
  chips = [],
  primaryAction,
  secondaryAction,
  highlights = [],
  breadcrumbs,
}: PageHeroProps) {
  const renderAction = (action: HeroAction | undefined, variant: "primary" | "secondary") => {
    if (!action) {
      return null;
    }

    return (
      <Link href={action.href} className={`page-hero__button page-hero__button--${variant}`}>
        {action.label}
      </Link>
    );
  };

  return (
    <section className="page-hero section-shell">
      <div className="section-inner page-hero__layout">
        <div className="page-hero__copy">
          {breadcrumbs}
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

        {highlights.length > 0 && (
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
        )}
      </div>
    </section>
  );
}
