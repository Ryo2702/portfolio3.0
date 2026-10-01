import { ArrowUp, Check, Copy, ExternalLink, MessageCircle } from "lucide-react";
import { useState } from "react";
import { site } from "../../data/portfolio";

export function Footer() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  async function copyEmail() {
    setCopyFailed(false);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <footer className="site-footer section-anchor" id="contact">
      <div className="footer-main">
        <div>
          <p className="eyebrow">09 / Start a project</p>
          <h2>Have a useful idea? Let’s make the next step clear.</h2>
        </div>
        <div className="footer-contact">
          <p className="mini-label">Email</p>
          <a className="contact-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a className="contact-whatsapp" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">
            <MessageCircle size={17} aria-hidden="true" /> +{site.whatsapp}
          </a>
          <div className="footer-actions">
            <button className="button button-light" type="button" onClick={copyEmail}>
              {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              {copied ? "Copied" : "Copy email"}
            </button>
            <a className="button button-outline-light" href={site.github} target="_blank" rel="noreferrer">
              GitHub <ExternalLink size={17} aria-hidden="true" />
            </a>
          </div>
          <p className="copy-status" aria-live="polite">
            {copyFailed ? "Copy failed — the email above remains selectable." : copied ? "Email copied to clipboard." : ""}
          </p>
        </div>
      </div>
      <div className="footer-bottomline">
        <span>© {new Date().getFullYear()} {site.shortName}</span>
        <span>Web development / WordPress / SEO</span>
        <a className="back-to-top" href="#home">
          Back to top <ArrowUp size={16} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
