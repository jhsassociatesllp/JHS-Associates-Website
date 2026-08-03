import { useState, useEffect } from "react";
import "./Disclaimer.css";

export default function Disclaimer() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem("jhs_disclaimer_accepted"));

  useEffect(() => {
    if (visible) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [visible]);

  const handleAccept = () => {
    sessionStorage.setItem("jhs_disclaimer_accepted", "true");
    setVisible(false);
  };

  const handleDecline = () => {
    window.location.href = "about:blank";
  };

  if (!visible) return null;

  return (
    <div className="disclaimer-backdrop" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title" data-lenis-prevent>
      <div className="disclaimer-modal">
        {/* Header */}
        <div className="disclaimer-header">
          <div className="disclaimer-logo-row">
            <span className="disclaimer-firm-name">JHS & Associates LLP</span>
          </div>
          <div className="disclaimer-badge">IMPORTANT NOTICE</div>
        </div>

        {/* Body */}
        <div className="disclaimer-body">
          <h2 id="disclaimer-title" className="disclaimer-title">Disclaimer &amp; Terms of Use</h2>
          <p className="disclaimer-intro">
            Please read this disclaimer carefully before accessing or using this website.
          </p>

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
        </div>

        {/* Footer Actions */}
        <div className="disclaimer-footer">
          <p className="disclaimer-confirm-text">
            By clicking <strong>"I Agree"</strong>, you confirm that you have read,
            understood, and accepted this disclaimer and agree to the terms of use of
            this website.
          </p>
          <div className="disclaimer-actions">
            <button className="disclaimer-btn disclaimer-btn--decline" onClick={handleDecline}>
              Decline &amp; Exit
            </button>
            <button className="disclaimer-btn disclaimer-btn--accept" onClick={handleAccept}>
              I Agree &amp; Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
