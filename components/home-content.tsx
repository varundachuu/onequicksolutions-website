import {
  audienceProfiles,
  businessChallengeCards,
  engagementApproaches,
  solutionBuildCards,
} from "@/data/site";

export function BusinessChallengesSection() {
  return (
    <section className="section-shell service-detail-section service-detail-section--soft">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Business challenges</span>
          <h2 className="section-title">Technology Solutions for Real Business Challenges</h2>
          <p className="section-copy">
            We focus on practical digital solutions that reduce friction, improve visibility and
            help businesses move beyond manual or disconnected ways of working.
          </p>
        </div>

        <div className="detail-card-grid detail-card-grid--three">
          {businessChallengeCards.map((item) => (
            <article key={item.title} className="detail-card surface-panel interactive-panel">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AudienceSection() {
  return (
    <section className="section-shell service-detail-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Who we work with</span>
          <h2 className="section-title">Who Our Services Are Designed For</h2>
          <p className="section-copy">
            OneQuickSolutions is suitable for businesses and institutions that need clearer
            systems, better digital presentation or more structured workflow support.
          </p>
        </div>

        <div className="detail-card-grid detail-card-grid--three">
          {audienceProfiles.map((item) => (
            <article key={item.title} className="detail-card surface-panel interactive-panel">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SolutionsWeBuildSection() {
  return (
    <section className="section-shell service-detail-section service-detail-section--soft">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">What we build</span>
          <h2 className="section-title">Solutions We Can Build</h2>
          <p className="section-copy">
            Our work can cover public-facing websites, internal portals, workflow systems,
            reporting dashboards, product platforms and AI-assisted business processes.
          </p>
        </div>

        <div className="detail-card-grid detail-card-grid--three">
          {solutionBuildCards.map((item) => (
            <article key={item.title} className="detail-card surface-panel interactive-panel">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EngagementModelsSection() {
  return (
    <section className="section-shell service-detail-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Ways to work with us</span>
          <h2 className="section-title">Flexible ways to start and grow the work</h2>
          <p className="section-copy">
            You do not need to start with the biggest possible scope. We can begin with the phase
            that best fits the current clarity, urgency and business goal.
          </p>
        </div>

        <div className="detail-card-grid detail-card-grid--two">
          {engagementApproaches.map((item) => (
            <article key={item.title} className="detail-card surface-panel interactive-panel">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
