import { useEffect, useState } from 'react';
import './SpotlightPages.css';
import './Alumni.css';
import heroImg from '../../image/WebPoster3.jpeg';
import imgRiddhi from '../../image/Riddhi Kishnadwala.jpeg'

const ALUMNI_PROFILES = [
  {
    id: 1,
    name: "Riddhi Kishnadwala ",
    role: "Former Audit Partner",
    desc: "JHS was my first job post CA qualification. It was a great learning experience and guidance was provided whenever needed. Executional excellence and quality deliverables were the key corners of all the projects I worked on. A good place to learn and grow.",
    image: imgRiddhi
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Ex-Director, Tax Advisory",
    desc: "During her tenure, Priya spearheaded complex cross-border taxation strategies. She recently founded a fintech startup aimed at simplifying corporate tax compliances for emerging enterprises.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
  },
  {
    id: 3,
    name: "Karan Mehta",
    role: "Alumnus, Consulting",
    desc: "Karan's strategic insights helped scale our management consulting wing. Today, he leads a boutique venture capital fund focused on sustainable investments in the Asia-Pacific region.",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
  },
  {
    id: 4,
    name: "Sneha Patel",
    role: "Former Lead, IT Risk",
    desc: "A trailblazer in cybersecurity audits, Sneha transitioned from JHS to become the Global Head of Information Security at a top-tier retail bank, securing data across millions of transactions.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Ex-Manager, M&A",
    desc: "Vikram was instrumental in driving our early M&A advisory success. He is now a Managing Director at a prominent investment bank in London, executing high-value cross-border deals.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
  },
  {
    id: 6,
    name: "Ananya Rao",
    role: "Alumna, Corporate Advisory",
    desc: "After laying the groundwork for our sustainability advisory practice, Ananya founded a non-profit organization dedicated to advancing ESG compliance in developing nations.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
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
      const apiUrl = `http://${window.location.hostname}:8000/alumni/`;
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
      <section className="sp-hero">
        <div
          className="sp-hero__bg"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="sp-hero__overlay" />
        <div className="sp-container">
          <div className="sp-hero__content">
            <span className="sp-eyebrow">Spotlight</span>
            <h1 className="sp-title">Alumni Network</h1>
            <p className="sp-subtitle">
              Welcome to the JHS Alumni portal. A lifelong community where former colleagues connect, collaborate, and continue to grow alongside our firm's global journey.
            </p>
          </div>
        </div>
      </section>

      {/* Alumni Profiles Section */}
      <section className="alumni-section">
        <div className="sp-container">
          <div className="alumni-header">
            <h2>Our Distinguished Alumni</h2>
            <p>
              Meet the exceptional individuals who have shaped our legacy and continue to make waves across industries globally.
            </p>
          </div>

          <div className="alumni-grid">
            {ALUMNI_PROFILES.map((profile) => (
              <div key={profile.id} className="alumni-card">
                <div className="alumni-card__image-wrapper">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="alumni-card__image"
                    loading="lazy"
                  />
                </div>
                <div className="alumni-card__content">
                  <h3 className="alumni-card__name">{profile.name}</h3>
                  <div className="alumni-card__role">{profile.role}</div>
                  <p className="alumni-card__desc">{profile.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Registration Form Section */}
      <section className="alumni-form-section">
        <div className="sp-container">
          <div className="alumni-form-container">
            <div className="alumni-form-header">
              <h2>Join the Network</h2>
              <p>Register or update your details to stay connected with our community.</p>
            </div>

            {submitted && (
              <div className="alumni-success-msg" style={{ backgroundColor: '#e6ffe6', color: '#006600', padding: '15px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
                Registration submitted successfully! Thank you for staying connected.
              </div>
            )}

            <form className="alumni-form" onSubmit={handleSubmit}>
              <div className="alumni-form-row">
                <div className="alumni-form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="alumni-form-input" placeholder="Enter Your Name" required />
                </div>
                <div className="alumni-form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="alumni-form-input" placeholder="Enter Your Last Name" required />
                </div>
              </div>

              <div className="alumni-form-row">
                <div className="alumni-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="alumni-form-input" placeholder="Enter Your Email Address" required />
                </div>
                <div className="alumni-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="alumni-form-input" placeholder="Enter Your Phone Number" />
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
                  <input type="text" id="last_role" name="last_role" value={formData.last_role} onChange={handleChange} className="alumni-form-input" placeholder="e.g. Senior Manager - Audit" required />
                </div>
              </div>

              <div className="alumni-form-group">
                <label htmlFor="message">Message / Update (Optional)</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} className="alumni-form-input" placeholder="Share a brief update on what you've been up to..."></textarea>
              </div>

              <button type="submit" className="alumni-form-submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
