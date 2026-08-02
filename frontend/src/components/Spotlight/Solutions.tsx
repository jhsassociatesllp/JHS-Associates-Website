import { useEffect } from 'react';
import './Solutions.css';
import { imageUrl } from '../../utils/imageUrl'

// Data structure organized by sector
const SOLUTIONS_DATA = {
  assurance: {
    title: 'ASSURANCE SOLUTIONS',
    subtitle: 'Strengthening Trust, Governance & Compliance',
    sectors: {
      BFSI: [
        'Statutory & Internal Audits',
        'Cyber Security & Digital KYC Audits',
        'Concurrent & Continuous Monitoring Audits',
        'Transfer Pricing Certification',
        'SOC & SSAE-21 Certifications',
        'Related Party Transactions Certification'
      ],
      Healthcare: [
        'Statutory & Internal Audits',
        'Cyber Security & Digital KYC Audits',
        'Related Party Transactions Certification'
      ],
      Manufacturing: [
        'Statutory & Internal Audits',
        'Concurrent & Continuous Monitoring Audits',
        'Transfer Pricing Certification',
        'Related Party Transactions Certification'
      ],
      Retail: [
        'Statutory & Internal Audits',
        'Cyber Security & Digital KYC Audits'
      ],
      Startups: [
        'Statutory & Internal Audits',
        'Cyber Security & Digital KYC Audits',
        'Transfer Pricing Certification',
        'SOC & SSAE-21 Certifications',
        'Related Party Transactions Certification'
      ],
      NGOs: [
        'Statutory & Internal Audits'
      ]
    }
  },
  consulting: {
    title: 'CONSULTING SOLUTIONS',
    subtitle: 'Advisory that Drives Clarity, Control & Growth',
    sectors: {
      BFSI: [
        'Risk Management Frameworks',
        'Efficiency Improvement & Process Optimization',
        'Internal Control Evaluation',
        'Financial Forecasting & Valuation Support'
      ],
      Healthcare: [
        'Risk Management Frameworks',
        'Efficiency Improvement & Process Optimization',
        'Internal Control Evaluation',
        'Financial Forecasting & Valuation Support'
      ],
      Manufacturing: [
        'Risk Management Frameworks',
        'Efficiency Improvement & Process Optimization',
        'Internal Control Evaluation',
        'Financial Forecasting & Valuation Support'
      ],
      Retail: [
        'Risk Management Frameworks',
        'Efficiency Improvement & Process Optimization',
        'Internal Control Evaluation',
        'Financial Forecasting & Valuation Support'
      ],
      Startups: [
        'Efficiency Improvement & Process Optimization',
        'Financial Forecasting & Valuation Support'
      ]
    }
  },
  outsourcing: {
    title: 'OUTSOURCING SOLUTIONS',
    subtitle: 'Reliable Finance, Compliance & Operational Support',
    sectors: {
      BFSI: [
        'MIS & Domestic Bookkeeping',
        'Corporate Training Programs',
        'Risk Assessment',
        'Risk Register Maintenance'
      ],
      Healthcare: [
        'MIS & Domestic Bookkeeping',
        'Corporate Training Programs',
        'Risk Assessment',
        'Risk Register Maintenance'
      ],
      Manufacturing: [
        'MIS & Domestic Bookkeeping',
        'Corporate Training Programs',
        'Risk Assessment',
        'Risk Register Maintenance'
      ],
      Retail: [
        'MIS & Domestic Bookkeeping',
        'Corporate Training Programs',
        'Risk Assessment',
        'Risk Register Maintenance'
      ],
      Startups: [
        'MIS & Domestic Bookkeeping',
        'Corporate Training Programs',
        'Risk Assessment',
        'Risk Register Maintenance'
      ],
      NGOs: [
        'MIS & Domestic Bookkeeping',
        'Corporate Training Programs',
        'Risk Assessment',
        'Risk Register Maintenance'
      ]
    }
  },
  taxation: {
    title: 'TAXATION SOLUTIONS',
    subtitle: 'Strategic, Compliant & Litigation-Ready Solutions',
    sectors: {
      BFSI: [
        'GST Return Filing',
        'Retainership & Indirect Tax Advisory',
        'Assessments, Appeals & Litigation',
        'Tax Audits, Digitalisation & Registrations'
      ],
      Healthcare: [
        'GST Return Filing',
        'Retainership & Indirect Tax Advisory',
        'Assessments, Appeals & Litigation',
        'Tax Audits, Digitalisation & Registrations'
      ],
      Manufacturing: [
        'GST Return Filing',
        'Retainership & Indirect Tax Advisory',
        'Assessments, Appeals & Litigation',
        'Tax Audits, Digitalisation & Registrations'
      ],
      Retail: [
        'GST Return Filing',
        'Retainership & Indirect Tax Advisory',
        'Assessments, Appeals & Litigation',
        'Tax Audits, Digitalisation & Registrations'
      ],
      Startups: [
        'GST Return Filing',
        'Retainership & Indirect Tax Advisory',
        'Assessments, Appeals & Litigation',
        'Tax Audits, Digitalisation & Registrations'
      ],
      NGOs: [
        'Tax Audits, Digitalisation & Registrations'
      ]
    }
  }
};

export default function Solutions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderSolutionSection = (solutionKey: 'assurance' | 'consulting' | 'outsourcing' | 'taxation', colorClass: string) => {
    const solution = SOLUTIONS_DATA[solutionKey];

    return (
      <div className={`sol-section ${colorClass}`}>
        <div className="sol-section__header">
          <h2 className="sol-section__title">{solution.title}</h2>
          <p className="sol-section__subtitle">{solution.subtitle}</p>
        </div>

        <div className="sol-sectors-grid">
          {Object.entries(solution.sectors).map(([sector, services]) => (
            <div key={sector} className="sol-sector-card">
              <div className="sol-sector-card__header">
                <span className="sol-sector-icon">●</span>
                <h3 className="sol-sector-card__title">{sector}</h3>
              </div>
              <ul className="sol-service-list">
                {services.map((service, idx) => (
                  <li key={idx} className="sol-service-item">
                    <span className="sol-bullet">•</span>
                    <span className="sol-service-text">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="sol-page">
      {/* Hero Section */}
      <section className="sol-hero">
        <div
          className="sol-hero__bg"
          style={{ backgroundImage: `url(${imageUrl('business-and-professional-services.jpg')})` }}
        />
        <div className="sol-hero__overlay" />
        <div className="sol-container">
          <div className="sol-hero__content">
            <span className="sol-eyebrow">Spotlight</span>
            <h1 className="sol-title">Integrated Professional Services</h1>
            <p className="sol-subtitle">
              Comprehensive solutions across Assurance, Consulting, Outsourcing & Taxation
              tailored for BFSI, Healthcare, Manufacturing, Retail, Startups & NGOs
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Sections */}
      <section className="sol-content">
        <div className="sol-container">
          {renderSolutionSection('assurance', 'sol-section--red')}
          {renderSolutionSection('consulting', 'sol-section--blue')}
          {renderSolutionSection('outsourcing', 'sol-section--green')}
          {renderSolutionSection('taxation', 'sol-section--purple')}
        </div>
      </section>
    </div>
  );
}
