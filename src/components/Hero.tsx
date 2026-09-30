import { ArrowUpRight, Send } from "lucide-react";

function ArrowDownIcon() {
  return <ArrowUpRight size={18} aria-hidden="true" className="rotated-arrow" />;
}

function Portrait() {
  return (
    <div className="portrait-wrap">
      <div className="portrait-note">02 / Portrait study</div>
      <div className="portrait-frame">
        <img className="portrait-art" src="/avatar.png" alt="One-bit portrait of Charles Aeron L. Pelayo" />
      </div>
      <div className="portrait-caption">
        <span>CHARLES / AERON / PELAYO</span>
        <span className="portrait-index">03</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero section-anchor" id="home">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">01 / Freelance web developer</p>
          <h1>Web Developer | WordPress | SEO</h1>
          <p className="hero-summary">
            I build clear, responsive web experiences for people and businesses that need their work understood — from the first scroll to the first inquiry.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              Start a project <Send size={18} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="#featured">
              View my work <ArrowDownIcon />
            </a>
          </div>
          <div className="service-strip" aria-label="Core services">
            <span>Web development</span>
            <span>WordPress</span>
            <span>SEO</span>
          </div>
        </div>
        <Portrait />
      </div>
      <div className="hero-bottomline">
        <span>Scroll to explore</span>
        <span className="line" aria-hidden="true" />
        <span>Remote</span>
      </div>
    </section>
  );
}
