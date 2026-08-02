import { useEffect, useState } from 'react';
import './SpotlightPages.css';
import './Alumni.css';
import { imageUrl } from '../../utils/imageUrl'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
console.log("API Base URL", API_BASE_URL)

const ALUMNI_PROFILES = [
  {
    id: 1,
    name: "Riddhi Kishnadwala",
    // role: "Articleship",
    desc: "JHS was my first job post CA qualification. It was a great learning experience and guidance was provided whenever needed. Executional excellence and quality deliverables were the key corners of all the projects I worked on. A good place to learn and grow.",
    image: imageUrl('Riddhi Kishnadwala.jpeg')
  },
  {
    id: 2,
    name: "Prerna Jain",
    // role: " Tax Advisory",
    desc: "JHS has an empowering vision for its employees. It provides a friendly work space to employees.",
    image: imageUrl('Prerna-Jain.png')
  },
  {
    id: 3,
    name: "Ankit Mehta",
    // role: "Alumnus, Consulting",
    desc: "At JHS, I was entrusted with responsibilities in Internal Audit despite starting from scratch, which accelerated my learning. The freedom to work independently, along with consistent support, helped me build confidence and leadership abilities.",
    image: imageUrl('Ankit Mehta.jpeg')
  },
  {
    id: 4,
    name: "Pratik Mantri",
    // role: "Auditor, Risk Advisory",
    desc: "The work culture at JHS encouraged learning, accountability, and collaborative problem-solving. Being part of the Risk Advisory & Internal Audit team provided invaluable exposure to build a strong foundation in risk assessment, controls, and compliance.",
    image: imageUrl('Pratik mantri.jpeg')
  },
  {
    id: 5,
    name: "Riya Almeida",
    // role: "Articleship",
    desc: "My stint at JHS & Associates LLP provided me with valuable hands-on experience and instilled a disciplined, detail-oriented approach to work. The guidance and exposure during this period played a key role in shaping my professional mindset.",
    image: imageUrl('Riya Almeida.jpeg')
  },
  {
    id: 6,
    name: "Sabir Shaikh",
    // role: "Alumnus, Consulting",
    desc: "My experience at JHS helped me build a strong foundation in risk assessment, internal controls, and business process understanding. It shaped my professional approach towards analytical review, compliance, and operational efficiency, which continues to help me in my business and decision-making today.",
    image: imageUrl('Shabbir Shaikh.jpeg')
  }
];

interface AlumniFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  tenure: string;
  last_role: string;
  message: string;
}

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
)

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
)

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

export default function Alumni() {
  const [formData, setFormData] = useState<AlumniFormData>({
    first_name: '', last_name: '', email: '', phone: '', company: '', designation: '', tenure: '', last_role: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = `${API_BASE_URL}/alumni/`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmitted(true);
      setFormData({
        first_name: '', last_name: '', email: '', phone: '', company: '', designation: '', tenure: '', last_role: '', message: ''
      });
      setTimeout(() => setSubmitted(false), 7000);
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Failed to send registration. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="sp-page">
      {/* Hero Section */}
      <section
        className="alumni-hero"
        style={{ backgroundImage: `url(${imageUrl('WebPoster3.jpeg')})` }}
      >
        <div className="alumni-hero__overlay" />
        <div className="alumni-hero__content">
          {/* <span className="alumni-hero__eyebrow">EST. 1981</span> */}
          <h1 className="alumni-hero__title">Celebrating Our Legacy, Connecting Our Future</h1>
          <p className="alumni-hero__subtitle">
            A global network of excellence, bringing together generations of leaders, innovators and visionaries from around the world.
          </p>
          {/* <div className="alumni-hero__actions">
            <button
              onClick={() => {
                document.getElementById('alumni-directory')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="alumni-hero__btn alumni-hero__btn--primary"
            >
              Explore Directory
            </button>
            <a href="/about/story" className="alumni-hero__btn alumni-hero__btn--secondary">
              Our History
            </a>
          </div> */}
        </div>
      </section>

      {/* Alumni Directory Section */}
      <section id="alumni-directory" className="alumni-section">
        <div className="alumni-container">
          <div className="alumni-header">
            <div className="alumni-header-left">
              <h2>Alumni Directory</h2>
              <p>
                Discover the achievements of our distinguished alumni. Our network spans diverse industries, reflecting the core values established during their time at JHS.
              </p>
            </div>
          </div>

          <div className="alumni-grid">
            {ALUMNI_PROFILES.map((profile) => (
              <div key={profile.id} className="alumni-card">
                <div className="alumni-card__top">
                  <div className="alumni-card__image-wrapper">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="alumni-card__image"
                      loading="lazy"
                    />
                  </div>
                  <div className="alumni-card__info">
                    <h3 className="alumni-card__name">{profile.name}</h3>
                    <span className="alumni-card__badge">Alumnus</span>
                  </div>
                </div>

                <div className="alumni-card__role">{profile.role}</div>
                <p className="alumni-card__desc">"{profile.desc}"</p>

                {/*<a href="#" className="alumni-card__link">
                  View Profile &rarr;
                </a>*/}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect / Form Section */}
      <section className="alumni-connect-section">
        <div className="alumni-connect-layout">

          <div className="alumni-connect-info">
            <h2>Stay Connected</h2>
            <p>
              Whether you're looking to mentor current professionals, organize a reunion, or simply update your contact details, your presence in our network is what keeps this legacy alive.
            </p>
            <div className="alumni-contact-list">
              <div className="alumni-contact-item">
                <IconMail />
                <span>connect@jhsassociates.in</span>
              </div>
              <div className="alumni-contact-item">
                <IconPhone />
                <span>1800 120 1022</span>
              </div>
              <div className="alumni-contact-item">
                <IconPin />
                <span>JHS & Associates LLP, Head Office, Mumbai</span>
              </div>
            </div>
          </div>

          <div className="alumni-form-wrapper">
            <h3>Join the Network</h3>

            {submitted && (
              <div style={{ backgroundColor: '#e6ffe6', color: '#006600', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>
                Registration submitted successfully! Thank you for staying connected.
              </div>
            )}

            <form className="alumni-form" onSubmit={handleSubmit}>
              <div className="alumni-form-row">
                <div className="alumni-form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="alumni-form-input" placeholder="Enter your first name" required />
                </div>
                <div className="alumni-form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="alumni-form-input" placeholder="Enter your last name" required />
                </div>
              </div>

              <div className="alumni-form-row">
                <div className="alumni-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="alumni-form-input" placeholder="name@email.com" required />
                </div>
                <div className="alumni-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="alumni-form-input" placeholder="+91 XXXX XXXXXX" />
                </div>
              </div>

              <div className="alumni-form-row">
                <div className="alumni-form-group">
                  <label htmlFor="company">Current Company</label>
                  <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="alumni-form-input" placeholder="Where do you work now?" required />
                </div>
                <div className="alumni-form-group">
                  <label htmlFor="designation">Current Designation</label>
                  <input type="text" id="designation" name="designation" value={formData.designation} onChange={handleChange} className="alumni-form-input" placeholder="e.g. Finance Director" required />
                </div>
              </div>

              <div className="alumni-form-row">
                <div className="alumni-form-group">
                  <label htmlFor="tenure">Years at JHS</label>
                  <input type="text" id="tenure" name="tenure" value={formData.tenure} onChange={handleChange} className="alumni-form-input" placeholder="e.g. 2015 - 2020" required />
                </div>
                <div className="alumni-form-group">
                  <label htmlFor="last_role">Last Role at JHS</label>
                  <input type="text" id="last_role" name="last_role" value={formData.last_role} onChange={handleChange} className="alumni-form-input" placeholder="e.g. Senior Manager" required />
                </div>
              </div>

              <div className="alumni-form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} className="alumni-form-input" placeholder="Tell us how you'd like to get involved..."></textarea>
              </div>

              <button type="submit" className="alumni-form-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Connection Request"}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
