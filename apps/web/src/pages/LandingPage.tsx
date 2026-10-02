import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  FileCheck2,
  GitBranch,
  Layers3,
  MapPinned,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react';
import './LandingPage.css';

const workflow = [
  {
    number: '01',
    title: 'Bring your evidence',
    description: 'Combine cadastral records, deeds, and spatial datasets in one place.',
    icon: FileCheck2,
    route: '/app/data-intake',
  },
  {
    number: '02',
    title: 'Reconcile in 3D',
    description: 'Turn source data into candidate property volumes and boundaries.',
    icon: Box,
    route: '/app/property-3d',
  },
  {
    number: '03',
    title: 'Find relationships',
    description: 'Surface overlaps, easements, and other spatial conflicts.',
    icon: GitBranch,
    route: '/app/conflict-graph',
  },
  {
    number: '04',
    title: 'Review with context',
    description: 'Inspect supporting evidence and record a human decision.',
    icon: ShieldCheck,
    route: '/app/verification',
  },
];

const capabilities = [
  {
    eyebrow: '01 / UNDERSTAND',
    title: 'See property in three dimensions.',
    description: 'Explore candidate building volumes alongside parcel boundaries and source data.',
    icon: Box,
    route: '/app/property-3d',
    action: 'Explore 3D properties',
  },
  {
    eyebrow: '02 / CONNECT',
    title: 'Make spatial relationships visible.',
    description: 'Trace parcel, ownership, and easement relationships to understand where records disagree.',
    icon: GitBranch,
    route: '/app/conflict-graph',
    action: 'View conflict graph',
  },
  {
    eyebrow: '03 / VERIFY',
    title: 'Keep people in the decision loop.',
    description: 'Review candidate findings against evidence before recording a verification outcome.',
    icon: FileCheck2,
    route: '/app/verification',
    action: 'Open review workbench',
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing">
      <header className="landing-header">
        <a className="landing-brand" href="#top" aria-label="Salaahkaar home" onClick={closeMenu}>
          <span className="landing-brand__mark"><Layers3 size={21} strokeWidth={2.2} /></span>
          <span>Salaahkaar</span>
        </a>

        <button
          className="landing-menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="landing-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav
          className={`landing-nav${menuOpen ? ' landing-nav--open' : ''}`}
          id="landing-navigation"
          aria-label="Main navigation"
        >
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <a href="#platform-features" onClick={closeMenu}>Platform</a>
          <a href="#use-cases" onClick={closeMenu}>Who it’s for</a>
          <a href="#about" onClick={closeMenu}>About</a>
        </nav>

        <div className="landing-header__actions">
          <button className="landing-sign-in" type="button" onClick={() => navigate('/app')}>
            Sign in
          </button>
          <button className="landing-button landing-button--small" type="button" onClick={() => navigate('/app')}>
            Enter workspace <ArrowUpRight size={15} />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="landing-hero">
          <div className="landing-hero__glow" aria-hidden="true" />
          <div className="landing-hero__content">
            <p className="landing-eyebrow"><span /> Spatial property intelligence</p>
            <h1>Land, understood in <span>every dimension.</span></h1>
            <p className="landing-hero__description">
              Bring property records and the real world into the same view.
              Explore boundaries, buildings, and the evidence that connects them.
            </p>
            <div className="landing-hero__actions">
              <button className="landing-button" type="button" onClick={() => navigate('/app')}>
                Enter the workspace <ArrowRight size={17} />
              </button>
              <a className="landing-text-link" href="#how-it-works">
                Discover the workflow <ArrowRight size={16} />
              </a>
            </div>
            <div className="landing-hero__note">
              <ShieldCheck size={16} />
              <span>Evidence-led review, with people in control.</span>
            </div>
          </div>

          <div className="landing-visual" aria-label="Illustration of a 3D parcel review">
            <video className="landing-visual__video" autoPlay muted loop playsInline aria-hidden="true">
              <source src="/bg-video.mp4" type="video/mp4" />
            </video>
            <div className="landing-visual__shade" />
            <div className="landing-visual__topline">
              <span className="landing-visual__live"><span /> SPATIAL REVIEW</span>
              <span className="landing-visual__coords">27°10' N &nbsp; 78°01' E</span>
            </div>
            <div className="landing-visual__plot" aria-hidden="true">
              <div className="landing-visual__grid" />
              <div className="landing-parcel landing-parcel--one"><span>PCL-0847</span></div>
              <div className="landing-parcel landing-parcel--two"><span>PU-018</span></div>
              <div className="landing-parcel landing-parcel--three" />
              <div className="landing-visual__conflict"><span /> Boundary review</div>
            </div>
            <div className="landing-visual__caption">
              <div>
                <span className="landing-visual__caption-label">CANDIDATE PROPERTY</span>
                <strong>Parcel PCL-0847</strong>
              </div>
              <span className="landing-visual__status"><span /> Ready to review</span>
            </div>
          </div>
        </section>

        <section className="landing-proof" aria-label="Platform principles">
          <p>One connected view for</p>
          <div><MapPinned size={17} /><span>Parcel boundaries</span></div>
          <div><Box size={17} /><span>3D property volumes</span></div>
          <div><GitBranch size={17} /><span>Spatial relationships</span></div>
          <div><FileCheck2 size={17} /><span>Reviewable evidence</span></div>
        </section>

        <section className="landing-section landing-intro" id="how-it-works">
          <div className="landing-section__heading">
            <p className="landing-eyebrow landing-eyebrow--dark">A clearer picture of property</p>
            <h2>Maps show where.<br /><span>Salaahkaar helps show what connects.</span></h2>
            <p className="landing-section__lede">
              A parcel is more than a line on a map. Bring physical structures,
              legal records, and spatial relationships together for informed review.
            </p>
          </div>
          <div className="landing-workflow">
            {workflow.map(({ number, title, description, icon: Icon, route }) => (
              <button
                className="landing-workflow__step"
                key={number}
                type="button"
                onClick={() => navigate(route)}
              >
                <span className="landing-workflow__top">
                  <span className="landing-workflow__icon"><Icon size={19} /></span>
                  <span className="landing-workflow__number">{number}</span>
                </span>
                <strong>{title}</strong>
                <span className="landing-workflow__description">{description}</span>
                <span className="landing-workflow__arrow"><ArrowUpRight size={17} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="landing-features" id="platform-features">
          <div className="landing-features__heading">
            <div>
              <p className="landing-eyebrow">Built for complex property questions</p>
              <h2>From data to a decision<br />you can stand behind.</h2>
            </div>
            <p>Follow every candidate finding back to the context and evidence that matters.</p>
          </div>
          <div className="landing-capabilities">
            {capabilities.map(({ eyebrow, title, description, icon: Icon, route, action }) => (
              <article className="landing-capability" key={eyebrow}>
                <span className="landing-capability__eyebrow">{eyebrow}</span>
                <span className="landing-capability__icon"><Icon size={21} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <button type="button" onClick={() => navigate(route)}>
                  {action} <ArrowRight size={15} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-audience" id="use-cases">
          <div className="landing-audience__heading">
            <p className="landing-eyebrow landing-eyebrow--dark">Made for collaborative review</p>
            <h2>One shared view.<br /><span>Different perspectives.</span></h2>
          </div>
          <div className="landing-audience__list">
            <div><span>01</span><strong>Cadastral &amp; land administration teams</strong><p>Bring parcel records and spatial context together.</p></div>
            <div><span>02</span><strong>Surveyors &amp; geospatial practitioners</strong><p>Explore candidate volumes, boundaries, and overlaps.</p></div>
            <div><span>03</span><strong>Legal &amp; verification teams</strong><p>Review evidence and keep decisions traceable.</p></div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-cta__texture" aria-hidden="true" />
          <div>
            <p className="landing-eyebrow">Start with the evidence</p>
            <h2>Make spatial complexity<br />easier to understand.</h2>
          </div>
          <button className="landing-button landing-button--light" type="button" onClick={() => navigate('/app')}>
            Enter workspace <ArrowRight size={17} />
          </button>
        </section>
      </main>

      <footer className="landing-footer" id="about">
        <a className="landing-brand landing-brand--footer" href="#top">
          <span className="landing-brand__mark"><Layers3 size={20} strokeWidth={2.2} /></span>
          <span>Salaahkaar</span>
        </a>
        <p>Spatial property intelligence for clearer, evidence-led review.</p>
        <span className="landing-footer__disclaimer">Candidate representations are not legal determinations.</span>
        <span className="landing-footer__copyright">© 2026 Salaahkaar</span>
      </footer>
    </div>
  );
}

export default LandingPage;
