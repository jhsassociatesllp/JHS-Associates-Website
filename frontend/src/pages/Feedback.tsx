import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Feedback.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
console.log("API Base URL", API_BASE_URL)

interface ReferenceRow {
  id: string
  companyName: string
  nameDesignation: string
  phone: string
  email: string
}

export default function Feedback() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    natureOfAssignment: '',
    periodOfAssignment: '',
    assignmentReporting: 'CEO',
    assignmentSPOC: '',
    
    // On-boarding ratings
    onboardingReason: 0,
    competitiveFees: 0,
    technicallyBetter: 0,
    referredBySomeone: 0,
    
    // Fees Range ratings
    valueForMoney: 0,
    reasonable: 0,
    
    // Quality ratings
    delivery: 0,
    statusReview: 0,
    draftDiscussions: 0,
    reporting: 0,
    timelines: 0,
    
    // Communication ratings
    projectTeam: 0,
    responseTime: 0,
    
    // Overall ratings
    overall: 0,
    meetServiceObjectives: 0,
    knowledge: 0,
    researchPublications: 0,
    
    // Yes/No questions
    wouldRefer: '',
    delightedByService: '',
    
    // Testimonial
    testimonial: '',
    
    // Your Details
    name: '',
    designation: ''
  })

  const [references, setReferences] = useState<ReferenceRow[]>([
    { id: '1', companyName: '', nameDesignation: '', phone: '', email: '' }
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (field: string, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }))
  }

  const handleRadioChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addReference = () => {
    setReferences(prev => [
      ...prev,
      { id: Date.now().toString(), companyName: '', nameDesignation: '', phone: '', email: '' }
    ])
  }

  const removeReference = (id: string) => {
    if (references.length > 1) {
      setReferences(prev => prev.filter(ref => ref.id !== id))
    }
  }

  const handleReferenceChange = (id: string, field: keyof ReferenceRow, value: string) => {
    setReferences(prev =>
      prev.map(ref => (ref.id === id ? { ...ref, [field]: value } : ref))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Transform form data to match backend schema
      const payload = {
        client_name: formData.clientName,
        nature_of_assignment: formData.natureOfAssignment,
        period_of_assignment: formData.periodOfAssignment,
        assignment_reporting: formData.assignmentReporting,
        assignment_spoc: formData.assignmentSPOC,
        
        onboarding_reason: formData.onboardingReason,
        competitive_fees: formData.competitiveFees,
        technically_better: formData.technicallyBetter,
        referred_by_someone: formData.referredBySomeone,
        
        value_for_money: formData.valueForMoney,
        reasonable: formData.reasonable,
        
        delivery: formData.delivery,
        status_review: formData.statusReview,
        draft_discussions: formData.draftDiscussions,
        reporting: formData.reporting,
        timelines: formData.timelines,
        
        project_team: formData.projectTeam,
        response_time: formData.responseTime,
        
        overall: formData.overall,
        meet_service_objectives: formData.meetServiceObjectives,
        knowledge: formData.knowledge,
        research_publications: formData.researchPublications,
        
        would_refer: formData.wouldRefer,
        delighted_by_service: formData.delightedByService,
        
        references: references.map(ref => ({
          company_name: ref.companyName,
          name_designation: ref.nameDesignation,
          phone: ref.phone,
          email: ref.email
        })),
        
        testimonial: formData.testimonial,
        name: formData.name,
        designation: formData.designation
      }

      const response = await axios.post(`${API_BASE_URL}/feedback/`, payload)
      
      if (response.status === 201) {
        alert('Thank you! Your feedback has been submitted successfully.')
        // Reset form or redirect
        navigate('/')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const StarRating = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`star ${value >= star ? 'active' : ''}`}
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-header">
          <h1 className="feedback-title">Client Feedback</h1>
          <p className="feedback-subtitle">
            We value your feedback and strive to continuously improve our services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          
          {/* Basic Information */}
          <section className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clientName">Client Name</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="natureOfAssignment">Nature of Assignment</label>
                <input
                  type="text"
                  id="natureOfAssignment"
                  name="natureOfAssignment"
                  value={formData.natureOfAssignment}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="periodOfAssignment">Period of Assignment</label>
                <input
                  type="text"
                  id="periodOfAssignment"
                  name="periodOfAssignment"
                  value={formData.periodOfAssignment}
                  onChange={handleInputChange}
                  placeholder="e.g., Jan 2024 - Dec 2024"
                />
              </div>
              <div className="form-group">
                <label htmlFor="assignmentReporting">Assignment Reporting</label>
                <select
                  id="assignmentReporting"
                  name="assignmentReporting"
                  value={formData.assignmentReporting}
                  onChange={handleInputChange}
                >
                  <option value="CEO">CEO</option>
                  <option value="CFO">CFO</option>
                  <option value="COO">COO</option>
                  <option value="Director">Director</option>
                  <option value="Manager">Manager</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="assignmentSPOC">Assignment SPOC</label>
                <input
                  type="text"
                  id="assignmentSPOC"
                  name="assignmentSPOC"
                  value={formData.assignmentSPOC}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          {/* Rating Instructions */}
          <div className="rating-instructions">
            Please share your feedback in Star Rating, where <strong>5 - Very Satisfied</strong>, <strong>4 - Satisfied</strong>, <strong>3 - Fair</strong>, <strong>2 - Dissatisfied</strong> & <strong>1 - Very Dissatisfied</strong>.
          </div>

          {/* Three Column Layout for Ratings */}
          <div className="ratings-grid">
            
            {/* Column 1: On-boarding */}
            <section className="rating-section">
              <h3 className="section-title">On-boarding</h3>
              
              <div className="rating-group">
                <label>Reason for onboarding us:</label>
                <div className="rating-item">
                  <span>Existing Relationship/ Trust</span>
                  <StarRating
                    value={formData.onboardingReason}
                    onChange={(rating) => handleRatingChange('onboardingReason', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Competitive Fees Structure</span>
                  <StarRating
                    value={formData.competitiveFees}
                    onChange={(rating) => handleRatingChange('competitiveFees', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Technically better</span>
                  <StarRating
                    value={formData.technicallyBetter}
                    onChange={(rating) => handleRatingChange('technicallyBetter', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Referred by someone</span>
                  <StarRating
                    value={formData.referredBySomeone}
                    onChange={(rating) => handleRatingChange('referredBySomeone', rating)}
                  />
                </div>
              </div>

              <div className="rating-group">
                <label>Fees Range</label>
                <div className="rating-item">
                  <span>Value for money</span>
                  <StarRating
                    value={formData.valueForMoney}
                    onChange={(rating) => handleRatingChange('valueForMoney', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Reasonable</span>
                  <StarRating
                    value={formData.reasonable}
                    onChange={(rating) => handleRatingChange('reasonable', rating)}
                  />
                </div>
              </div>
            </section>

            {/* Column 2: Quality */}
            <section className="rating-section">
              <h3 className="section-title">Quality</h3>
              
              <div className="rating-group">
                <label>Delivery:</label>
                <div className="rating-item">
                  <span>Planning</span>
                  <StarRating
                    value={formData.delivery}
                    onChange={(rating) => handleRatingChange('delivery', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Status Review</span>
                  <StarRating
                    value={formData.statusReview}
                    onChange={(rating) => handleRatingChange('statusReview', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Draft Discussions</span>
                  <StarRating
                    value={formData.draftDiscussions}
                    onChange={(rating) => handleRatingChange('draftDiscussions', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Reporting</span>
                  <StarRating
                    value={formData.reporting}
                    onChange={(rating) => handleRatingChange('reporting', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Timelines</span>
                  <StarRating
                    value={formData.timelines}
                    onChange={(rating) => handleRatingChange('timelines', rating)}
                  />
                </div>
              </div>

              <div className="rating-group">
                <label>Communication:</label>
                <div className="rating-item">
                  <span>Project Team</span>
                  <StarRating
                    value={formData.projectTeam}
                    onChange={(rating) => handleRatingChange('projectTeam', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Response Time</span>
                  <StarRating
                    value={formData.responseTime}
                    onChange={(rating) => handleRatingChange('responseTime', rating)}
                  />
                </div>
              </div>
            </section>

            {/* Column 3: Overall */}
            <section className="rating-section">
              <h3 className="section-title">Overall</h3>
              
              <div className="rating-group">
                <label>Overall:</label>
                <div className="rating-item">
                  <span>Relationship Management</span>
                  <StarRating
                    value={formData.overall}
                    onChange={(rating) => handleRatingChange('overall', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Meet Service Objectives</span>
                  <StarRating
                    value={formData.meetServiceObjectives}
                    onChange={(rating) => handleRatingChange('meetServiceObjectives', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Knowledge</span>
                  <StarRating
                    value={formData.knowledge}
                    onChange={(rating) => handleRatingChange('knowledge', rating)}
                  />
                </div>
                <div className="rating-item">
                  <span>Research Publications</span>
                  <StarRating
                    value={formData.researchPublications}
                    onChange={(rating) => handleRatingChange('researchPublications', rating)}
                  />
                </div>
              </div>

              <div className="rating-group">
                <div className="radio-group">
                  <label>Would you refer our firm?</label>
                  <div className="radio-options">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="wouldRefer"
                        value="Yes"
                        checked={formData.wouldRefer === 'Yes'}
                        onChange={(e) => handleRadioChange('wouldRefer', e.target.value)}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="wouldRefer"
                        value="No"
                        checked={formData.wouldRefer === 'No'}
                        onChange={(e) => handleRadioChange('wouldRefer', e.target.value)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div className="radio-group">
                  <label>Delighted by our service</label>
                  <div className="radio-options">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="delightedByService"
                        value="Yes"
                        checked={formData.delightedByService === 'Yes'}
                        onChange={(e) => handleRadioChange('delightedByService', e.target.value)}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="delightedByService"
                        value="No"
                        checked={formData.delightedByService === 'No'}
                        onChange={(e) => handleRadioChange('delightedByService', e.target.value)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* References Section */}
          <section className="form-section references-section">
            <h3 className="section-title">If you would like to recommend us, kindly provide your references below:</h3>
            
            {references.map((ref, index) => (
              <div key={ref.id} className="reference-row">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name of the Company</label>
                    <input
                      type="text"
                      value={ref.companyName}
                      onChange={(e) => handleReferenceChange(ref.id, 'companyName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Name & Designation</label>
                    <input
                      type="text"
                      value={ref.nameDesignation}
                      onChange={(e) => handleReferenceChange(ref.id, 'nameDesignation', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={ref.phone}
                      onChange={(e) => handleReferenceChange(ref.id, 'phone', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={ref.email}
                      onChange={(e) => handleReferenceChange(ref.id, 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="reference-buttons">
              <button type="button" className="btn-add" onClick={addReference}>
                ⊕ Add
              </button>
              {references.length > 1 && (
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeReference(references[references.length - 1].id)}
                >
                  ⊖ Remove
                </button>
              )}
            </div>
          </section>

          {/* Testimonial */}
          <section className="form-section">
            <div className="form-group">
              <label htmlFor="testimonial">Please write a few words as testimonial for the services delivered:</label>
              <textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleInputChange}
                rows={5}
                placeholder="Share your experience with our services..."
              />
            </div>
          </section>

          {/* Your Details */}
          <section className="form-section">
            <h3 className="section-title">Your Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="designation">Designation</label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
