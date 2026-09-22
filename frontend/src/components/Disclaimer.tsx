import { useState } from "react";
import "./Disclaimer.css";

const COOKIE_NAME = "jhs_disclaimer_accepted";
const COOKIE_DAYS = 30;

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

export default function Disclaimer() {
  const [visible, setVisible] = useState(() => !getCookie(COOKIE_NAME));
  const [agreed, setAgreed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleAccept = () => {
    setCookie(COOKIE_NAME, "true", COOKIE_DAYS);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="disclaimer-banner" role="region" aria-label="Website Disclaimer" data-lenis-prevent>
      <div className="disclaimer-banner-inner">
        <div className="disclaimer-banner-header">
          <span className="disclaimer-firm-name">JHS &amp; Associates LLP</span>
          <span className="disclaimer-badge">IMPORTANT NOTICE</span>
        </div>

        <div className="disclaimer-banner-body">
          <h2 className="disclaimer-banner-title">Disclaimer &amp; Terms of Use</h2>
          <p className="disclaimer-banner-summary">
            This website is intended for general informational purposes only and does not
            constitute legal, financial, tax, or professional advice. It does not create a
            client&ndash;firm relationship, nor is it a solicitation of our services.{" "}
            <button
              type="button"
              className="disclaimer-banner-toggle"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Read full disclaimer"}
            </button>
          </p>

          {expanded && (
            <div className="disclaimer-sections">
              <div className="disclaimer-section">
                <h3 className="disclaimer-section-title">General Information Only</h3>
                <p>
                  The content published on this website is intended solely for general
                  informational purposes. It does not constitute legal, financial, tax,
                  regulatory, or professional advice of any kind, and must not be relied
                  upon as such.
                </p>
              </div>

              <div className="disclaimer-section">
                <h3 className="disclaimer-section-title">No Client Relationship</h3>
                <p>
                  Accessing this website does not create a client–firm relationship between
                  you and JHS &amp; Associates LLP. For advice specific to your circumstances,
                  please consult a qualified professional directly.
                </p>
              </div>

              <div className="disclaimer-section">
                <h3 className="disclaimer-section-title">No Solicitation</h3>
                <p>
                  Nothing on this website constitutes an advertisement, solicitation, or
                  invitation to engage our services. Information about our services is
                  provided purely for awareness purposes.
                </p>
              </div>

              <div className="disclaimer-section">
                <h3 className="disclaimer-section-title">Accuracy &amp; Updates</h3>
                <p>
                  While we endeavour to keep the information current and accurate, JHS &amp;
                  Associates LLP makes no representations or warranties, express or implied,
                  regarding the completeness, accuracy, or reliability of any content on
                  this website.
                </p>
              </div>

              <div className="disclaimer-section">
                <h3 className="disclaimer-section-title">Regulatory Compliance</h3>
                <p>
                  This website complies with the guidelines issued by the Institute of
                  Chartered Accountants of India (ICAI) and all applicable regulations
                  governing the professional conduct of Chartered Accountants in India.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="disclaimer-banner-footer">
          <label className="disclaimer-checkbox-row">
            <input
              type="checkbox"
              className="disclaimer-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I have read and understood the above disclaimer.</span>
          </label>
          <button
            className="disclaimer-btn disclaimer-btn--accept"
            onClick={handleAccept}
            disabled={!agreed}
            aria-disabled={!agreed}
          >
            I Understand &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
