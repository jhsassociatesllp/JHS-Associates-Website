import LegalPage from './LegalPage'
import type { LegalBlock } from './LegalPage'

const blocks: LegalBlock[] = [
  { type: 'h2', text: '1. Introduction' },
  {
    type: 'p',
    text: 'JHS & Associates LLP is referred to in this TOB as "JHS", "us", "we" or "our" which, where appropriate, includes our successor and predecessor entities and our staff. References in the TOB to "the Company" or "you" or "your" are to the persons or entities who are our clients for the Engagement.',
  },

  { type: 'h2', text: '2. Entire Agreement' },
  {
    type: 'p',
    text: 'Unless otherwise specifically agreed in the Letter, the Letter replaces any previous agreements between us in relation to or in contemplation of the Engagement and shall apply to any future engagements we carry out on your behalf unless varied or replaced. The Letter (which includes the TOB) constitutes the entire agreement between us. In entering into this Letter you acknowledge that you have not relied on, and shall have no right or remedy in respect of, any statement, representation, assurance or warranty (whether made negligently or innocently) other than as expressly set out in the Letter.',
  },

  { type: 'h2', text: '3. Engagement Team' },
  {
    type: 'p',
    text: 'The Partner/Director in charge will be supported by a team of manager, experienced consultants and staff, as may be decided by JHS from time to time and mutually agreed upon. We will inform you of any significant changes which need to be made to our team rendering the Services prior to making such significant changes.',
  },

  { type: 'h2', text: '4. Deliverables Management' },
  {
    type: 'p',
    text: "During the course of the engagement JHS may share draft deliverables with the Company. This will be done on the basis that they are 'work in progress' and are subject to revision and alteration. The draft deliverables shall be reviewed by the Company for factual inaccuracies as the primary sources of financial information reside within the Company.",
  },
  { type: 'p', text: "JHS hereby assures that the deliverables, subject to the terms and conditions provided herein, shall be as per the Company's requirements." },

  { type: 'h2', text: '5. Circulation of Reports' },
  {
    type: 'p',
    text: "JHS's Deliverables including any drafts thereof are private and confidential and are prepared for the addressees' only. Deliverables and draft Deliverables should not be used, reproduced or circulated for any other purpose and to any third party, whether in whole or in part, without the prior written consent of JHS, which consent may be given only after consideration of the circumstance existing at the time and may include the provision of an indemnity.",
  },
  {
    type: 'p',
    text: 'Notwithstanding anything contained in paragraph 8.1 of the TOB, you may disclose the Deliverables and draft Deliverables within your organisation, to your professional advisors acting in such capacity or as required by law, court order or any regulatory and professional body.',
  },
  {
    type: 'p',
    text: "The Services, information, records, data, advice or recommendation contained in any Deliverables, draft Deliverables, material, presentation or other communication, written or otherwise, in draft or final form, provided by JHS are intended solely for the benefit, information and use of the Company's management. Please be aware that copying or summarising our advice, Deliverables, draft Deliverables or information to others, including your other employees or your shareholders, may result in Loss or waiver of privilege in that advice.",
  },

  { type: 'h2', text: '6. Mode of Instructions' },
  {
    type: 'p',
    text: 'You authorise us to act from time to time on instructions given in any manner (including but not limited to verbal and electronic instructions) in circumstances where we reasonably believe those instructions have emanated from you or any person with authority to act on your behalf.',
  },
  {
    type: 'p',
    text: 'You understand and acknowledge that the electronic transmission of information via the internet or otherwise has inherent risks (particularly the risk of access by unauthorised parties). Unless otherwise agreed, despite the inherent risks, you authorise us to communicate electronically with you and relevant third parties on relevant matters related to the Engagement. Accordingly, you agree that we shall have no liability to you for any Loss arising directly from the use of electronic communications, except where caused by our own negligence.',
  },

  { type: 'h2', text: '7. Limitation of Liability' },
  {
    type: 'p',
    text: 'JHS may use personnel from across its group including associated JHS entities for the performance of the Services or otherwise for performance of its obligations under this. In all circumstances JHS shall be solely responsible for the performance of the Services and the Company shall be entitled to rely on JHS for performance of such Services. The Company shall have no recourse and shall bring no claim against any staff or any of their personal assets directly (whether the claim is based on breach of contract, strict liability, tort, breach of warranty, negligence etc. or otherwise). This exclusion shall not apply to fraud.',
  },
  {
    type: 'p',
    text: 'In no circumstances shall JHS be responsible for any consequential, special, direct, indirect, punitive or incidental loss, damages or expenses (including loss of profits, data, business, opportunity cost, goodwill or indemnification) in connection with the performance of the services, whether such damages are based on breach of contract, tort, strict liability, breach of warranty, negligence, or otherwise, even if the Company had contemplated and communicated to JHS the likelihood of such damages. Any decision to act upon the deliverables is to be made by the Company and no communication by JHS should be treated as an invitation or inducement to engage the Company to act upon the deliverables.',
  },
  {
    type: 'p',
    text: 'The aggregate liability in respect of performance of the Service or otherwise under this Letter shall be limited to the actual professional fees paid (excluding out of pocket expenses and taxes if any paid) for the Services rendered by JHS, regardless of whether the liability is based on breach of contract, tort, strict liability, breach of warranty, negligence, or otherwise.',
  },
  {
    type: 'p',
    text: 'JHS will not be liable if any Loss is due to the provision of false, misleading or incomplete information or documentation, or due to the acts or omissions of any person(s) other than us and the personnel used for the assignment under reference from across associated JHS entities.',
  },

  { type: 'h2', text: '8. Provision of Specialised Services' },
  {
    type: 'p',
    text: 'We may, with your consent, refer you to associated JHS entities for the provision of specialised services. They will send you separate engagement letters if you choose to use their services. We do not accept any liability for work carried out by any associated JHS entities.',
  },

  { type: 'h2', text: '9. Confidentiality' },
  {
    type: 'p',
    text: 'JHS agrees to keep confidential all information received from the Company during the course of this engagement ("Confidential Information") and not to make unwarranted copies of any Confidential Information, and to use the Confidential Information only for the purpose for which it has been disclosed to us.',
  },
  {
    type: 'p',
    text: 'Confidential Information means any information given or provided by the Company to JHS in any written form or through e-mails or fax or any other electronic means. Confidential Information shall include, but not be limited to, product specifications, analytical methodology, safety and efficacy data, testing data and financial data, know-how, trade secrets, internal policies whether published or not, ideas and other information of a technical, scientific or economic nature.',
  },
  {
    type: 'p',
    text: 'Confidential Information shall not include any information or documents previously known to JHS; or independently developed by JHS and/or associated JHS entities in the course of execution of this or any other engagement; or acquired by JHS from a third party without breaching the provisions of this Letter; or which is or becomes publicly available through no breach by JHS of this Letter; or special permission was obtained by JHS in writing from the Company.',
  },
  {
    type: 'p',
    text: 'In the event JHS receives a validly issued administrative or judicial process requiring disclosure of the Confidential Information, JHS shall, if possible, provide prompt notice to the Company of such receipt and thereafter be entitled to disclose any Confidential Information in order to comply with such administrative or judicial process.',
  },

  { type: 'h2', text: '10. Non-Solicitation' },
  {
    type: 'p',
    text: 'Except as may be otherwise agreed in writing between the Parties, during the term of this Agreement and for twelve (12) months thereafter, neither the client nor any of its affiliates shall offer employment to or employ any person employed (then or within the preceding twelve (12) months) by JHS.',
  },

  { type: 'h2', text: '11. Additional Terms and Conditions of Engagement' },
  {
    type: 'p',
    text: "JHS will exercise all reasonable and proper skill and attention necessarily required to discharge its duty of care to the Company for rendering the Services. However, JHS's work is not designed to investigate nor interrogate for fraud and/or dishonesty (actual or possible) and accordingly the same shall not be deemed to be a part of JHS's scope of work unless specifically agreed to between the Company and JHS. Additionally, JHS's reviews will not constitute audits in accordance with the 'Auditing Standards' and JHS will not express an opinion on the financial statements which may be reviewed by us during the course of our work.",
  },
  {
    type: 'p',
    text: "JHS's staff that may be deployed on this assignment from time to time have a specific agreement with JHS which prevents them from employment opportunities with any of our clients without JHS's specific prior consent. In the event that the Company contemplates offering an employment opportunity to any of JHS's existing staff, the same must not be in respect of a staff member with whom you have had dealings in connection with the Engagement during the 12 (twelve) months immediately prior to your approach, without JHS's specific prior written consent.",
  },
  {
    type: 'p',
    text: 'The Company acknowledges and agrees not to defame or publicly criticize JHS and its Director/Partner, its business, integrity, veracity or personal or professional reputation or any of its officers, partners, employees, affiliates, agents, or franchisees thereof, in either a professional or personal manner, either during the term of this Engagement or thereafter.',
  },

  { type: 'h2', text: '12. Use of Name' },
  {
    type: 'p',
    text: "Except as expressly permitted by this Letter, neither party shall use publicly the other party's name, trademark, service mark or logo in connection with the Services or any of the reports without the prior written consent of such other party.",
  },
  {
    type: 'p',
    text: "Notwithstanding anything contained herein to the contrary, JHS may disclose to present or prospective clients, or otherwise in its marketing materials, that it has performed the Services for the Company, and may use the Company's name and trademark solely for that purpose, in accordance with applicable professional obligations. JHS may use the Company's name, trademark, service mark and logo as reasonably necessary to perform the Services and in correspondence, including proposals, from JHS to the Company.",
  },

  { type: 'h2', text: '13. Force Majeure' },
  {
    type: 'p',
    text: 'We will not be liable for any delays or failures in performance or breach of contract due to events or circumstances beyond our reasonable control, including acts of God, war, acts by governments and regulators, acts of terrorism, accident, fire, flood or storm, or civil disturbance.',
  },

  { type: 'h2', text: '14. Jurisdiction' },
  {
    type: 'p',
    text: "In case any dispute arises between the parties during the subsistence or thereafter, in connection with or arising out of this Assignment, the dispute shall be referred to Arbitration under the Arbitration and Conciliation Act, 1996 by a sole Arbitrator appointed mutually by both the Parties. Arbitration shall be held in Mumbai. The proceedings of Arbitration shall be in the English language. The Arbitrator's award shall be final and binding on the parties, and the agreement shall be subject to the exclusive Jurisdiction of the Courts at Mumbai.",
  },
]

export default function TermsOfBusiness() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Business"
      lastUpdated="January 27, 2025"
      intro='The terms of business ("TOB") of the Engagement are set out below.'
      blocks={blocks}
    />
  )
}
