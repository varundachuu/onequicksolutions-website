import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-shell">
      <div className="section-inner">
        <div className="not-found-panel surface-panel">
          <span className="section-kicker">404</span>
          <h1 className="section-title">This page could not be found</h1>
          <p className="section-copy">
            The route may have changed, the page may no longer exist, or the link may be out of
            date. Try one of the main pages below.
          </p>
          <div className="page-hero__actions">
            <Link href="/" className="page-hero__button page-hero__button--primary">
              Go to homepage
            </Link>
            <Link href="/services" className="page-hero__button page-hero__button--secondary">
              Browse services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
