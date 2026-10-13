import LegalPage from './LegalPage'
import type { LegalBlock } from './LegalPage'

const blocks: LegalBlock[] = [

  { type: 'h2', text: "1. Interpretation and Definitions" },
  { type: 'h3', text: "1.1 Interpretation" },
  { type: 'p', text: "The words of which the initial letter is capitalised have the meanings defined below. The following definitions apply regardless of whether they appear in the singular or plural." },
  { type: 'h3', text: "1.2 Definitions" },
  {
    type: 'dl',
    items: [
      { term: "Affiliate", desc: "An entity that controls, is controlled by, or is under common control with a party, where “control” means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for the election of directors, partners, or other managing authority." },
      { term: "Client", desc: "A person or entity that has engaged the Firm for Professional Services under a duly executed Engagement Letter." },
      { term: "Content", desc: "Refers to all text, articles, insights, alerts, downloadable material, graphics, and other information published on the Website." },
      { term: "Device", desc: "Any device that can access the Service, such as a computer, cellphone, or digital tablet." },
      { term: "Engagement Letter", desc: "A separate written agreement, letter of engagement, proposal, or contract executed between the Firm and a Client setting out the scope, fees, and terms of specific Professional Services." },
      { term: "Firm (“the Firm”, “JHS”, “We”, “Us” or “Our”)", desc: "Refers to JHS & Associates LLP, a limited liability partnership registered under the Limited Liability Partnership Act, 2008 (LLPIN AAE-6757) and a firm of Chartered Accountants registered with the ICAI (Firm Registration No. 133288W/W100099), having its registered office at B Wing, 4th Floor, Navkar Chambers, Marol Naka Metro Station, Andheri (East), Mumbai – 400059, Maharashtra, India." },
      { term: "ICAI", desc: "The Institute of Chartered Accountants of India, constituted under the Chartered Accountants Act, 1949." },
      { term: "Privacy Policy", desc: "The Privacy Policy of the Firm published on the Website, as updated from time to time." },
      { term: "Professional Services", desc: "Chartered accountancy, audit, tax, advisory, consulting, and related professional services rendered by the Firm to its Clients otherwise than through the Website." },
      { term: "Service", desc: "Refers to the Website, together with the features made available through it, such as enquiry forms and subscription facilities." },
      { term: "Terms and Conditions (also referred to as “Terms”)", desc: "These Terms and Conditions which, together with the Privacy Policy, form the entire agreement between You and the Firm regarding Your use of the Service." },
      { term: "Third-Party Services", desc: "Any website, platform, or service, or any content (including data, information, products, or services) provided by a third party, including social media platforms, that may be linked to, displayed, included, or made available by or through the Service." },
      { term: "Website", desc: "JHS & Associates LLP, accessible from www.jhsassociates.in and its sub-domains." },
      { term: "You", desc: "The individual accessing or using the Service, or the company or other legal entity on behalf of which such individual is accessing or using the Service, as applicable." },
    ],
  },

  { type: 'h2', text: "2. Acknowledgment" },
  { type: 'p', text: "These are the Terms and Conditions governing the use of the Service and the agreement that operates between You and the Firm. These Terms set out the rights and obligations of all users regarding the use of the Service." },
  { type: 'p', text: "Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service." },
  { type: 'p', text: "By accessing or using the Service, You agree to be bound by these Terms. If You disagree with any part of these Terms, You may not access the Service." },
  { type: 'p', text: "You represent that You are over the age of 18. The Firm does not permit those under 18 to use the Service." },
  { type: 'p', text: "Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Firm’s Privacy Policy, which describes how the Firm collects, uses, and discloses Your personal information. Please read the Privacy Policy carefully before using the Service." },

  { type: 'h2', text: "3. ICAI Compliance - No Solicitation or Advertisement" },
  { type: 'p', text: "JHS & Associates LLP is a firm of Chartered Accountants. The Chartered Accountants Act, 1949 and the Code of Ethics and guidelines issued by the ICAI restrict the solicitation of professional work and advertisement by Chartered Accountants, and regulate the particulars that may be published on a firm’s website. The Website is maintained only to provide information about the Firm and its services, and is not intended to be, and must not be construed as, an advertisement, solicitation, invitation, or inducement of any kind." },
  { type: 'p', text: "By accessing or using the Website, You acknowledge and confirm that:" },
  {
    type: 'ul',
    items: [
      "there has been no advertisement, personal communication, solicitation, invitation, or inducement of any sort from the Firm or any of its partners, members, or employees to solicit any work through the Website;",
      "You are accessing the Website of Your own accord and wish to gain more information about the Firm for Your own information and use;",
      "the information on the Website is made available to You only at Your specific request, and any information obtained or material downloaded from the Website is entirely at Your own volition; and",
      "the transmission, receipt, or use of the Website or its Content does not create any professional or client relationship between You and the Firm (see Section 4).",
    ],
  },
  { type: 'p', text: "If You do not agree with any of the above, please do not use the Website." },

  { type: 'h2', text: "4. Nature of the Website – No Professional Advice" },
  { type: 'p', text: "JHS & Associates LLP is a firm of Chartered Accountants regulated by the Institute of Chartered Accountants of India (ICAI). The Website is maintained for general informational purposes only – to describe the Firm, its services, and its professionals, and to share updates, alerts, and articles on accounting, audit, tax, and regulatory matters." },
  {
    type: 'ul',
    items: [
      "Nothing on the Website constitutes, or is intended to constitute, professional advice of any kind, including but not limited to audit, tax, accounting, financial, legal, or regulatory advice, and must not be relied upon as such.",
      "Content on the Website is provided on a general basis, may not reflect the most current legal or regulatory developments, and may not apply to Your specific facts and circumstances.",
      "The Firm does not undertake any obligation to update or correct Content after it is published. Please note the date of publication of any article, alert, or update, as the law or its interpretation may have changed since.",
      "No advisor-client, auditor-client, or fiduciary relationship is created between You and the Firm merely by Your accessing or using the Website, submitting an enquiry, or corresponding with the Firm through it.",
      "Before acting or refraining from acting on the basis of any Content on the Website, You should obtain specific professional advice appropriate to Your circumstances by engaging the Firm or another appropriately qualified professional.",
    ],
  },
  { type: 'p', text: "The Firm, its partners, and employees accept no responsibility for any loss occasioned to any person acting or refraining from acting as a result of any material published on the Website." },

  { type: 'h2', text: "5. Engagement of Professional Services" },
  { type: 'p', text: "These Terms govern only Your use of the Website. They do not constitute an engagement of the Firm for any Professional Services and do not create any client relationship." },
  {
    type: 'ul',
    items: [
      "Any Professional Services provided by the Firm to a Client are governed exclusively by a separate, duly signed Engagement Letter, which will set out the scope of work, fees, responsibilities, confidentiality, and limitation of liability applicable to that engagement.",
      "In the event of any conflict or inconsistency between these Terms and an applicable Engagement Letter, the terms of the Engagement Letter shall prevail in relation to the specific Professional Services covered by it.",
      "Submitting an enquiry, contact form, or request for a call-back through the Website does not, by itself, constitute acceptance of any engagement by the Firm, which remains at the Firm’s sole discretion, subject to applicable conflict-checks and regulatory requirements, including under the Code of Ethics issued by the ICAI.",
    ],
  },

  { type: 'h2', text: "6. Use of the Website and Prohibited Conduct" },
  { type: 'p', text: "You may access and use the Website, through any Device, only for lawful purposes and in accordance with these Terms. You agree not to:" },
  {
    type: 'ul',
    items: [
      "use the Website in any manner that violates applicable law or infringes the rights of the Firm or any third party;",
      "use any robot, spider, crawler, scraper, or other automated means to access the Website, or to extract, harvest, or bulk-download Content, without the Firm’s prior written consent;",
      "attempt to gain unauthorised access to the Website, its servers, or any system or network connected to it, or probe, scan, or test its security;",
      "introduce any virus, malware, or other harmful or disruptive code, or otherwise interfere with the operation of the Website;",
      "submit through the Website any information that is false, misleading, defamatory, obscene, or unlawful, or that relates to another person without that person’s authority;",
      "impersonate any person or misrepresent Your affiliation with any person or entity, including the Firm; or",
      "use the Website or its contact details to send unsolicited commercial communications to the Firm or its personnel.",
    ],
  },
  { type: 'p', text: "The Firm may take any technical, legal, or other action it considers appropriate in response to a breach of this Section, including suspending or terminating access under Section 12." },

  { type: 'h2', text: "7. Enquiries, Subscriptions, Careers, and Cookies" },
  { type: 'h3', text: "7.1 Enquiries and Contact Forms" },
  { type: 'p', text: "Information You submit through an enquiry, contact, or call-back form must be accurate and complete, and You must be authorised to submit it. By submitting such a form, You agree that the Firm and its personnel may contact You by telephone, email, SMS, or messaging platform (including WhatsApp) in response to Your enquiry." },
  { type: 'h3', text: "7.2 Newsletters and Publications" },
  { type: 'p', text: "If You subscribe to the Firm’s newsletters, regulatory flyers, white papers, or similar publications, You do so voluntarily and may unsubscribe at any time using the opt-out mechanism provided in each communication. These publications are general in nature and are subject to Section 4. The processing of Your information for this purpose is described in the Privacy Policy." },
  { type: 'h3', text: "7.3 Career Applications" },
  { type: 'p', text: "Where the Website allows You to apply for employment or an internship, submitting an application does not constitute an offer of employment or engagement, and does not oblige the Firm to respond. You must ensure that the information and documents You submit are genuine and accurate. The Firm does not charge any fee from applicants at any stage of recruitment; please report any request for payment made in the Firm’s name to the contact details in Section 22." },
  { type: 'h3', text: "7.4 Cookies" },
  { type: 'p', text: "The Website uses Cookies and similar technologies as described in the Cookie Policy section of the Privacy Policy. Non-essential Cookies are used in accordance with the choices available to You through any cookie preference tool made available on the Website, and You can also manage Cookies through Your browser settings." },

  { type: 'h2', text: "8. Intellectual Property" },
  { type: 'p', text: "The Firm is a limited liability partnership duly registered under the Limited Liability Partnership Act, 2008. The Website and its entire content, features, and functionality including but not limited to the text, articles, graphics, images, and the design and layout of the Website are and will remain the property of the Firm and its licensors, and are protected under applicable copyright and other intellectual property laws of India." },
  { type: 'p', text: "You may view and download Content for Your own personal, non-commercial reference. You may not reproduce, distribute, modify, publicly display, or create derivative works from any Content, or use the Firm’s name or logo in a manner likely to cause confusion or to suggest endorsement or affiliation, without the Firm’s prior written consent. All rights not expressly granted in these Terms are reserved." },

  { type: 'h2', text: "9. Confidentiality and Personal Information" },
  { type: 'p', text: "Any personal information, documents, or business information that You choose to share with the Firm through the Website (for example, through an enquiry or contact form) will be handled in accordance with the Firm’s Privacy Policy and applicable data protection law, including the Digital Personal Data Protection Act, 2023, where applicable." },
  { type: 'p', text: "You should not use the Website’s general enquiry channels to transmit sensitive financial documents, statutory filings, or confidential business information intended for a specific engagement; such information should only be shared through the secure channels agreed with the Firm under an Engagement Letter." },
  { type: 'p', text: "Information sent through the Website’s general enquiry channels, by unsecured email, or through social media is transmitted at Your own risk. The Privacy Policy describes the measures the Firm takes to protect Personal Data once received." },

  { type: 'h2', text: "10. Links to Other Websites and Social Media" },
  { type: 'p', text: "The Service may contain links to Third-Party Services that are not owned or controlled by the Firm." },
  { type: 'p', text: "The Firm has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any Third-Party Services. You further acknowledge and agree that the Firm shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of, or reliance on, any such content, goods, or services available on or through any Third-Party Services." },
  { type: 'p', text: "We strongly advise You to read the terms and conditions and privacy policies of any Third-Party Services that You visit." },
  { type: 'p', text: "The Firm maintains official pages on social media platforms such as LinkedIn, Instagram, X (formerly Twitter), Facebook, YouTube, and WhatsApp, as described in the Privacy Policy. Content posted on those channels is general in nature and is subject to Section 4. Your interaction with those channels is also governed by the terms and privacy policies of the relevant platform, over which the Firm has no control. Please do not post or send confidential or sensitive information to the Firm through social media." },

  { type: 'h2', text: "11. Independent Entities and Affiliates" },
  { type: 'p', text: "References on the Website to “JHS” entities in other jurisdictions, or to any Affiliate, associate, correspondent, or association or network of firms, are for information only. Unless an Engagement Letter expressly provides otherwise, each such entity is a separate and independent legal entity, the Firm is not liable for its acts or omissions, and no partnership, agency, or joint venture is created between the Firm and that entity by reason of such reference. Nothing on the Website is an offer by, or binds, any entity other than the Firm." },

  { type: 'h2', text: "12. Termination" },
  { type: 'p', text: "We may terminate or suspend Your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms." },
  { type: 'p', text: "Upon termination, Your right to use the Service will cease immediately. Provisions of these Terms which by their nature should survive termination including those on intellectual property, disclaimers, limitation of liability, indemnification, governing law, and dispute resolution will continue to apply." },

  { type: 'h2', text: "13. Limitation of Liability" },
  { type: 'p', text: "To the maximum extent permitted by applicable law, in no event shall the Firm, its partners, employees, or agents be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with Your access to or use of (or inability to access or use) the Website, whether based on warranty, contract, tort, or any other legal theory, and whether or not the Firm has been advised of the possibility of such damages." },
  { type: 'p', text: "The Firm shall also not be liable for any loss or damage arising from Your reliance on any Content, from any interruption or unavailability of the Website, from any virus or other harmful component transmitted through it, or from the content or conduct of any Third-Party Services." },
  { type: 'p', text: "Nothing in this Section 13 is intended to, or shall, limit or exclude the Firm’s liability arising under a duly executed Engagement Letter for Professional Services, which shall instead be governed by the limitation of liability provisions (if any) contained in that Engagement Letter." },
  { type: 'p', text: "Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under applicable law. In such cases, each party’s liability will be limited to the greatest extent permitted by law." },

  { type: 'h2', text: "14. “As Is” and “As Available” Disclaimer" },
  { type: 'p', text: "The Service is provided to You “AS IS” and “AS AVAILABLE” and with all faults and defects, without warranty of any kind. To the maximum extent permitted under applicable law, the Firm expressly disclaims all warranties, whether express, implied, statutory, or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement." },
  { type: 'p', text: "Without limiting the foregoing, the Firm does not represent or warrant that: (i) the Service will function uninterrupted, secure, or available at any particular time or location; (ii) any errors or defects will be corrected; (iii) the Service is free of viruses or other harmful components; (iv) the results of using the Service will meet Your requirements; or (v) any Content is accurate, complete, or current." },

  { type: 'h2', text: "15. Indemnification" },
  { type: 'p', text: "You agree to indemnify and hold harmless the Firm, its partners, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with Your access to or use of the Website, any information You submit through the Website, or Your violation of these Terms." },

  { type: 'h2', text: "16. Force Majeure" },
  { type: 'p', text: "The Firm shall not be liable for any failure or delay in making the Website available, or in performing any obligation under these Terms, caused by events beyond its reasonable control, including natural calamity, epidemic, war, riot, act of any government or regulatory authority, power, internet, hosting, or telecommunications failure, or cyber-attack." },

  { type: 'h2', text: "17. Governing Law and Jurisdiction" },
  { type: 'p', text: "These Terms and Your use of the Service shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Subject to Section 18 (Dispute Resolution), the competent courts at Mumbai, Maharashtra, India shall have exclusive jurisdiction over any dispute, claim, or controversy (whether contractual or otherwise) arising out of or in connection with these Terms or Your use of the Service, and You irrevocably submit to the jurisdiction of those courts and waive any objection to them as an inconvenient forum." },
  { type: 'p', text: "The Website is controlled and operated by the Firm from India. The Firm makes no representation that the Website or its Content is appropriate or available for use in other locations. Those who access the Website from outside India do so on their own initiative and are responsible for compliance with any local laws that apply to them." },
  { type: 'p', text: "This Section does not apply to Professional Services, which are governed by the governing law and jurisdiction provisions of the applicable Engagement Letter." },

  { type: 'h2', text: "18. Dispute Resolution" },
  { type: 'p', text: "If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Firm at the details set out in Section 22 below." },
  { type: 'p', text: "If the dispute is not resolved within thirty (30) days of such contact, it shall be referred to and finally resolved by arbitration under the Arbitration and Conciliation Act, 1996, as amended from time to time. The arbitration shall be conducted by a sole arbitrator appointed by mutual agreement of the parties or, failing such agreement, in accordance with that Act. The seat and venue of the arbitration shall be Mumbai, and the language of the arbitration shall be English. Nothing in this Section prevents either party from seeking urgent interim relief from the courts at Mumbai referred to in Section 17." },
  { type: 'p', text: "Disputes relating to Professional Services are governed by the dispute resolution provisions of the applicable Engagement Letter and not by this Section." },

  { type: 'h2', text: "19. Severability and Waiver" },
  { type: 'h3', text: "19.1 Severability" },
  { type: 'p', text: "If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect." },
  { type: 'h3', text: "19.2 Waiver" },
  { type: 'p', text: "Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party’s ability to exercise such right or require such performance at any time thereafter, nor shall the waiver of a breach constitute a waiver of any subsequent breach." },

  { type: 'h2', text: "20. General Provisions" },
  { type: 'h3', text: "20.1 Entire Agreement" },
  { type: 'p', text: "These Terms, together with the Privacy Policy, constitute the entire agreement between You and the Firm regarding Your use of the Website and supersede any prior understanding on that subject. They do not affect the terms of any Engagement Letter." },
  { type: 'h3', text: "20.2 Assignment" },
  { type: 'p', text: "The Firm may assign or transfer its rights and obligations under these Terms, including in connection with any restructuring, merger, or reconstitution of the Firm. You may not assign or transfer Your rights or obligations under these Terms without the Firm’s prior written consent." },
  { type: 'h3', text: "20.3 No Partnership or Agency" },
  { type: 'p', text: "Nothing in these Terms creates any partnership, joint venture, agency, or employment relationship between You and the Firm." },
  { type: 'h3', text: "20.4 Electronic Record" },
  { type: 'p', text: "These Terms are an electronic record for the purposes of the Information Technology Act, 2000 and the rules made thereunder, and are generated by a computer system. They do not require any physical or digital signature." },

  { type: 'h2', text: "21. Changes to These Terms and Conditions" },
  { type: 'p', text: "We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. Revised Terms will be posted on the Website with an updated “Last updated” date and will take effect on posting. If a revision is material, We will make reasonable efforts to bring it to Your attention through a notice on the Website." },
  { type: 'p', text: "By continuing to access or use the Service after those revisions become effective, You agree to be bound by the revised Terms. If You do not agree to the new terms, in whole or in part, please stop using the Website and the Service." },

  { type: 'h2', text: "22. Contact Us" },
  { type: 'p', text: "If you have any questions about these Terms and Conditions, You can reach us at:" },
  {
    type: 'ul',
    items: [
      "Email: connect@jhsassociates.in",
      "Phone: 1800 120 1022",
      "Address: JHS & Associates LLP, B Wing, 4th Floor, Navkar Chambers, Marol Naka Metro Station, Andheri (East), Mumbai – 400059, Maharashtra, India",
    ],
  },
  { type: 'p', text: "For any query or grievance relating to the processing of Your Personal Data, please contact the Grievance Officer / Data Protection Officer whose details are published in the Privacy Policy. Addresses of the Firm’s other offices are available on the Contact page of the Website." },
]

export default function TermsAndConditions() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and Conditions"
      lastUpdated="12 October 2026"
      intro="Please read these Terms and Conditions (“Terms”) carefully before using the website of JHS & Associates LLP. These Terms govern Your access to and use of the Website and set out the basis on which the Firm makes the Website available to You. These Terms should be read together with the Firm’s Privacy Policy."
      blocks={blocks}
    />
  )
}
