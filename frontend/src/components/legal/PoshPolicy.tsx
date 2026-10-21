import LegalPage from './LegalPage'
import type { LegalBlock } from './LegalPage'
import { bundledUrl } from '../../utils/imageUrl'

const blocks: LegalBlock[] = [

  { type: 'h2', text: "1. Objective" },
  { type: 'p', text: "JHS is committed to providing a safe, respectful, and inclusive work environment, free from any form of sexual harassment. This policy aims to:" },
  {
    type: 'ul',
    items: [
      "Prevent incidents of sexual harassment at the workplace",
      "Promote gender equality and dignity at work",
      "Establish procedures for the redressal of complaints",
      "Comply with the POSH Act, the Rules made under it and the binding directions of the Supreme Court of India on the subject, including the Vishaka Guidelines",
      "Place clear responsibility on JHS, its Partners, managers and every individual for maintaining a workplace free from sexual harassment The Policy has been formulated in accordance with the provisions of the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (“the Act”) and rules made thereunder. This Policy is gender neutral and intends to promote a safe working environment for all where there is zero tolerance for any form of sexual harassment.",
    ],
  },
  { type: 'p', text: "This Policy is intended to comply with and give effect to the provisions of the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (‘POSH Act’). While the statutory protections and procedures under the POSH Act apply in accordance with the scope of the Act, the Organisation adopts a broader, gender-neutral standard of conduct and prohibits sexual harassment and sexually inappropriate behaviour against any individual at the workplace." },
  { type: 'p', text: "In this Policy, “JHS”, the “Organisation” and the “Company” each mean JHS Associates LLP." },

  { type: 'h2', text: "2. Legal Framework" },
  { type: 'p', text: "This Policy rests on the constitutional guarantees, judicial directions and statutes summarised below. A reference to any law includes its amendments, re-enactments and the rules, regulations and notifications made under it from time to time." },
  { type: 'h3', text: "2.1 Constitutional Guarantees" },
  {
    type: 'ul',
    items: [
      "Article 14 – equality before the law and equal protection of the laws",
      "Article 15 – prohibition of discrimination on grounds including sex",
      "Article 19(1)(g) – the right to practise any profession or to carry on any occupation, trade or business, which requires a safe working environment free from sexual harassment",
      "Article 21 – the right to life and personal liberty, which includes the right to live with dignity",
    ],
  },
  { type: 'h3', text: "2.2 The Vishaka Guidelines" },
  { type: 'p', text: "In Vishaka & Others v. State of Rajasthan & Others (1997), the Supreme Court of India laid down binding guidelines on sexual harassment at the workplace (the “Vishaka Guidelines”), which the POSH Act later gave statutory form. JHS treats the Vishaka Guidelines as the minimum standard of employer responsibility. The table below shows where each operative direction is addressed in this Policy." },
  {
    type: 'table',
    headers: ["Vishaka direction", "Requirement", "Where addressed"],
    rows: [
      ["1. Duty of the employer", "Prevent sexual harassment and provide procedures for the resolution, settlement or prosecution of acts of sexual harassment", "Clauses 1, 13 and 14"],
      ["2. Definition", "Unwelcome sexually determined behaviour, directly or by implication: physical contact and advances; demand or request for sexual favours; sexually coloured remarks; showing pornography; any other unwelcome physical, verbal or non-verbal conduct of a sexual nature", "Clause 5"],
      ["3. Preventive steps", "Express prohibition of sexual harassment, wide notification of the prohibition, disciplinary provisions, and appropriate work conditions in respect of work, leisure, health and hygiene", "Clauses 5, 13 and 15"],
      ["4. Criminal proceedings", "Where the conduct amounts to an offence under the penal law, the employer must initiate appropriate action by complaint to the appropriate authority", "Clause 9 (Criminal Proceedings)"],
      ["5. Disciplinary action", "Appropriate disciplinary action in accordance with the service rules", "Clause 15"],
      ["6. Complaint mechanism", "An appropriate complaint mechanism, whether or not the conduct amounts to an offence", "Clauses 7 and 8"],
      ["7. Complaints Committee", "Headed by a woman, at least half of the members women, involvement of a third party familiar with the issue, and an annual report", "Clauses 6 and 16"],
      ["8. Workers’ initiative", "Raising the issue of sexual harassment in employee meetings and other appropriate forums", "Clause 13"],
      ["9. Awareness", "Creating awareness of rights and of the guidelines by appropriate means", "Clause 13"],
      ["10. Third-party harassment", "The employer must take all steps necessary to support the affected person where harassment is by a third party", "Clauses 3, 9 and 14"],
    ],
  },
  { type: 'h3', text: "2.3 Interpretation and Precedence" },
  { type: 'p', text: "If any provision of this Policy is inconsistent with the POSH Act, the Rules or a binding direction of the Supreme Court, the statute or direction prevails to the extent of the inconsistency. The gender-neutral extension in this Policy is an internal standard adopted by JHS; it does not alter, dilute or replace the statutory rights of women under the POSH Act." },
  { type: 'p', text: "Under Section 28 of the POSH Act, the Act is in addition to, and not in derogation of, any other law in force, and nothing in this Policy prevents any person from pursuing any other remedy available in law." },

  { type: 'h2', text: "3. Scope" },
  { type: 'p', text: "This policy applies to:" },
  {
    type: 'ul',
    items: [
      "All employees of JHS (full-time, part-time, interns, and temporary staff)",
      "Any person working at or for JHS in any capacity – on a regular, temporary, ad hoc or daily-wage basis, directly or through an agent or contractor, with or without the knowledge of the principal employer, whether for remuneration or not, or on a voluntary basis – including co-workers, contract workers, probationers, trainees, apprentices and interns",
      "Clients, vendors, consultants, or any third parties associated with JHS",
      "Visitors and any other person who comes to a JHS workplace, whether as aggrieved person or respondent",
      "All workplaces including offices, client locations, off-site assignments, virtual workspaces, and JHS sponsored events",
      "Any place visited by an employee arising out of or during the course of employment, including transportation provided by JHS for such a journey, and any dwelling place or house where work is performed",
    ],
  },
  { type: 'h3', text: "Gender-Neutral Coverage" },
  { type: 'p', text: "Consistent with clause 1, while the statutory procedure and remedies under the POSH Act apply to complaints by women, any individual of any gender may approach the Internal Committee." },
  { type: 'p', text: "The Internal Committee shall receive, inquire into and address every such complaint with the same rigour, confidentiality and procedure prescribed in this Policy, to the fullest extent permitted by law. The respondent may also be of any gender, and complaints between persons of the same gender are covered." },

  { type: 'h2', text: "4. Key Definitions" },
  { type: 'p', text: "In this Policy, unless the context requires otherwise:" },
  {
    type: 'ul',
    items: [
      "**Aggrieved Person** means any person, of any age and of any gender, whether employed or not, who alleges to have been subjected to any act of sexual harassment by the respondent, and includes contractual and temporary staff, trainees, interns and visitors. For the purposes of the POSH Act itself, “aggrieved woman” has the meaning given in Section 2(a) of the Act.",
      "**Respondent** means a person against whom a complaint of sexual harassment has been made by the aggrieved person.",
      "**Employee** means a person employed at the workplace (including virtually) for any work on a regular, temporary, ad hoc or daily-wage basis, either directly or through an agent, including a contractor, with or without the knowledge of the principal employer, whether for remuneration or not, or working on a voluntary basis or otherwise, whether the terms of employment are express or implied, and includes a co-worker, contract worker, probationer, trainee, apprentice or a person of any other such description (Section 2(f) of the POSH Act).",
      "**Employer** means the person responsible for the management, supervision and control of the workplace (Section 2(g) of the POSH Act) and, for JHS, includes its Partners and any person to whom that responsibility is delegated.",
      "Workplace includes any department, office, branch or unit of JHS, client locations and off-site assignments, virtual and online workspaces, JHS-sponsored events, any place visited by the aggrieved person or the respondent arising out of or during the course of employment, and transportation provided by JHS for undertaking such a journey (Section 2(o) of the POSH Act).",
      "**Third Party** means any person who is not an employee of JHS, such as a client, vendor, consultant, service provider or visitor.",
      "**Internal Committee (IC)** means the Internal Committee constituted by JHS under Section 4 of the POSH Act, and Local Committee (LC) means the committee constituted by the District Officer under Section 6 of the POSH Act.",
      "**POSH Act** means the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013; Rules means the rules made under it; and Vishaka Guidelines means the guidelines laid down by the Supreme Court in Vishaka & Others v. State of Rajasthan & Others (1997).",
    ],
  },

  { type: 'h2', text: "5. Definition of Sexual Harassment" },
  { type: 'p', text: "Sexual harassment includes unwelcome acts or behaviour (whether directly or by implication), such as:" },
  {
    type: 'ul',
    items: [
      "Physical contact and advances",
      "Demand or request for sexual favours",
      "Making sexually coloured remarks, including remarks of a sexual nature about a person’s clothing or body",
      "Showing pornography",
      "Making or posting sexual pranks, sexual jokes or sexually suggestive, demeaning or offensive pictures, cartoons, messages or other material, whether in person or by email, SMS, MMS, instant messaging, social media or any other electronic means",
      "Repeatedly asking a person to socialise during off-duty hours, or continued expressions of sexual interest against the person’s wishes",
      "Giving gifts or leaving objects that are sexually suggestive",
      "Innuendos or taunts of a sexual nature, or physical confinement against one’s will",
      "Persistent watching, following or contacting a person",
      "Any other unwelcome physical, verbal, or non-verbal conduct of a sexual nature It also includes the following, where it occurs or is present in relation to or connected with any act or behaviour of sexual harassment (Section 3(2) of the POSH Act):",
      "Implied or explicit promise of preferential treatment",
      "Implied or explicit threat of detrimental treatment",
      "Implied or explicit threat about the present or future employment status",
      "Interference with work",
      "Creating an intimidating, hostile, or offensive work environment",
      "Humiliating treatment likely to affect health or safety",
    ],
  },
  { type: 'h3', text: "How Conduct Is Assessed" },
  {
    type: 'ul',
    items: [
      "Conduct is assessed by the standard of a reasonable person in the position of the aggrieved person.",
      "Whether harassment has occurred depends on the impact on and experience of the aggrieved person, not on the intention of the respondent.",
      "Physical contact is not required, and a single incident can amount to sexual harassment.",
      "Silence or the absence of protest at the time does not mean that the conduct was welcome.",
      "The definition applies irrespective of the gender or seniority of the persons involved, and whether the conduct occurs in person, in writing, by telephone, video call, messaging or social media, or during work travel, client events and JHS-sponsored functions.",
    ],
  },

  { type: 'h2', text: "6. Internal Committee (IC)" },
  { type: 'p', text: "As mandated by law, JHS has constituted an Internal Committee (IC) comprising:" },
  {
    type: 'table',
    headers: ["Sr. No", "Name", "Designation of IC member", "Email ID", "Contact number"],
    rows: [
      ["1", "Ms. Tasnim Tankiwala", "Presiding Officer", "tasnim.tankiwala@jhsassociates.in", "+91 98193 81152"],
      ["2", "Mr. Sameer Sayyed", "Member", "sameer.sayyed@jhsassociates.in", "+91 92727 22202"],
      ["3", "Ms. Dipika Bisawa", "External Member", "dipika.bisawa@jhsconsulting.in", "+91 89287 95275"],
      ["4", "Ms. Roussel Swaries", "Member", "roussel.swaries@jhsassociatesllp.in", "+91 86898 73784"],
    ],
  },
  { type: 'image', src: bundledUrl("POSH-IC-Poster.webp"), alt: "JHS Internal Committee: Together, let’s create a safe workplace free of harassment - IC member details", caption: "Our Internal Committee (IC) — the same details are displayed at every JHS workplace." },
  { type: 'h3', text: "Composition and Tenure" },
  {
    type: 'ul',
    items: [
      "The Presiding Officer is a woman employed at a senior level at the workplace. Where a suitably senior woman employee is not available, the Presiding Officer is nominated from other offices or units of JHS or from another workplace or organisation.",
      "The IC has not fewer than two members from amongst the employees, preferably committed to the cause of women or having experience in social work or legal knowledge.",
      "One member is an external member from a non-governmental organisation or association committed to the cause of women, or a person familiar with issues relating to sexual harassment.",
      "At least one-half of the total members of the IC are women.",
      "The Presiding Officer and every member hold office for a period not exceeding three years from the date of nomination.",
      "At least three members, including the Presiding Officer, must be present at every inquiry hearing. A member who has a personal interest in, or a relationship with a party to, a complaint recuses himself or herself from that complaint.",
    ],
  },
  { type: 'h3', text: "Functions of the IC" },
  {
    type: 'ul',
    items: [
      "Receive complaints of sexual harassment and assist complainants in reducing them to writing where required",
      "Conduct conciliation, where requested by the aggrieved person, and inquiry in accordance with this Policy and the POSH Act",
      "Recommend interim relief during the pendency of an inquiry",
      "Submit findings and recommendations to the employer within the prescribed time and follow up on their implementation",
      "Maintain strict confidentiality and secure records of every complaint and proceeding",
      "Prepare and submit the annual report, and support awareness and sensitisation initiatives",
    ],
  },
  { type: 'h3', text: "Complaints Against the Employer" },
  { type: 'p', text: "Where the respondent is the employer, the IC shall inform the complainant of the option of approaching the Local Committee constituted by the District Officer under Section 6 of the POSH Act, provide its contact details and, where the complainant so wishes, forward the complaint to the Local Committee in accordance with law." },
  { type: 'p', text: "The composition of the IC and the contact details above shall be displayed at a conspicuous place at each workplace and on the internal communication platform, and this Policy shall be updated whenever the composition changes." },

  { type: 'h2', text: "7. Filing a Complaint" },
  { type: 'h3', text: "Who Can File:" },
  {
    type: 'ul',
    items: [
      "Any aggrieved person, of any gender, who alleges to have been subjected to sexual harassment at the workplace",
      "A representative, where the aggrieved person is unable to complain owing to physical or mental incapacity or death – a relative or friend, a co-worker, or any person having knowledge of the incident – with the written consent of the aggrieved person or, where applicable, the legal heir",
    ],
  },
  { type: 'h3', text: "How to File:" },
  {
    type: 'ul',
    items: [
      "Submit a written complaint (physical or email) to the IC within 3 months of the incident, extendable by a further 3 months where the Committee is satisfied that circumstances prevented the complainant from filing within that period",
      "Include details of the incident, date, time, and any witnesses, together with any supporting documents",
      "Where there is a series of incidents, the period for filing runs from the date of the last incident.",
      "A complaint may be made to any member of the IC. Where it cannot be made in writing, the Presiding Officer or any IC member shall render all reasonable assistance to reduce it to writing and obtain the complainant’s signature.",
      "A complaint received by any other person, such as a Partner, manager or HR, must be forwarded to the IC immediately, and that person must keep it confidential.",
    ],
  },
  { type: 'h3', text: "Receiving a Complaint – Guidelines" },
  {
    type: 'ul',
    items: [
      "Listen without pre-judging, and inform the complainant that JHS takes the concern seriously and that it will be taken up by the IC speedily.",
      "Take written notes, using the complainant’s own words where possible, and confirm the details with the complainant. The complainant may bring a support person to the meeting.",
      "Explain that the process is confidential, but that the respondent, and any witnesses and persons directly involved in the inquiry, will necessarily learn the complainant’s identity.",
      "Keep all notes in a secure place, and take care that neither the complainant nor the respondent is disadvantaged or victimised.",
    ],
  },

  { type: 'h2', text: "8. Complaint Redressal Process" },
  { type: 'p', text: "**a) Acknowledgment:** Complaint acknowledged within 7 working days." },
  { type: 'p', text: "**b) Preliminary Inquiry:** IC reviews the complaint and checks for validity." },
  { type: 'p', text: "**c) Conciliation (Optional):** If the aggrieved person desires. No monetary settlement shall be made the basis of such conciliation, in accordance with Section 10(2) of the Act." },
  {
    type: 'ul',
    items: [
      "Conciliation takes place only on the written request of the aggrieved person, and the response of the aggrieved person is recorded whether or not conciliation is chosen.",
      "A settlement is recorded and forwarded to the employer for action, and copies are given to both parties. Once the settlement is implemented, no further inquiry is conducted; if the respondent fails to comply, the aggrieved person may inform the IC, which then proceeds with the inquiry (Section 10 of the Act).",
    ],
  },
  { type: 'p', text: "**d) Formal Inquiry:**" },
  {
    type: 'ul',
    items: [
      "Completed within 90 days of receiving the complaint",
      "Both parties are given an equal opportunity to be heard",
      "Confidentiality maintained throughout the process",
      "A copy of the complaint and supporting documents is sent to the respondent within 7 working days of receipt; the respondent files a reply, with supporting documents and a list of witnesses, within 10 working days, and the reply is shared with the complainant",
      "The inquiry follows the principles of natural justice. Questions for the other party or for witnesses are put through the IC, and no legal practitioner may represent either party at any stage",
      "At least three IC members, including the Presiding Officer, are present at each hearing",
      "The IC has the powers of a civil court for summoning and examining persons on oath and requiring production of documents (Section 11(3) of the Act)",
      "If either party is absent without sufficient cause for three consecutive hearings, the IC may terminate the inquiry or decide it ex parte after giving 15 days’ written notice",
      "Inquiry report to be provided to the employer and both parties within 10 days of completion of the inquiry (Section 13(1) of the Act)",
      "In preparing its report the IC considers the nature of the language, material or behaviour, whether the allegations follow logically from the evidence, the credibility of the parties and witnesses, and any similar previous conduct by the respondent",
    ],
  },
  { type: 'p', text: "**e) Action Taken:**" },
  {
    type: 'ul',
    items: [
      "Based on IC's recommendations",
      "Employer must act within 60 days of receiving the inquiry report",
      "Where the allegation is proved, the IC recommends action for sexual harassment as misconduct (see clause 15) and may recommend that compensation be deducted from the respondent’s salary and paid to the aggrieved person (Section 15 of the Act)",
      "Where the allegation is not proved, the IC recommends that no action be taken, and both parties are told that the matter is concluded and that neither will be disadvantaged",
      "The employer confirms implementation to the IC, and the IC follows up with the complainant to check that the behaviour has stopped and that no victimisation is occurring",
    ],
  },
  { type: 'p', text: "**f) Appeal:** Either party can appeal within 90 days of the recommendation, in accordance with Section 18 of the Act." },
  { type: 'p', text: "**g) Interim relief** During pendency of the inquiry, on a written request made by the complainant, the committee may recommend to the employer to:" },
  {
    type: 'ul',
    items: [
      "(a) Transfer the aggrieved individual or the respondent to any other workplace; or",
      "(b) Grant leave to the aggrieved individual of maximum 3 months, in addition to the leave he/she would be otherwise entitled; or",
      "(c) Grant such other relief to the aggrieved individual as may be found appropriate; or",
      "(d) Restrain the respondent from reporting on the work performance of the complainant, or reassign that responsibility to another officer.",
    ],
  },
  { type: 'p', text: "Once the recommendations of interim relief are implemented, CPO shall inform the committee regarding the same." },
  { type: 'p', text: "**h) Prohibition on disclosure of information :** This policy and the law prohibit any person including IC Members from publishing, communicating or making known to the public, press and media in any manner, contents of the complaint, the identity and addresses of the aggrieved person, respondent and witnesses, any information relating to conciliation and inquiry proceedings, or recommendations of the IC during the proceedings under the provisions of the Act. Any violation thereto shall also be subject to applicable disciplinary action as outlined in Employee Handbook. Further CPO shall impose monetary sanctions as per provisions of the Act and Rules." },
  { type: 'p', text: "**i) Harassment by individuals outside this policy:** If an aggrieved individual brings to the notice of the IC any instances of sexual harassment where the respon dent is not an employee or other individuals covered under this policy, the Management or any person delegated by the Management shall provide assistance to the aggrieved individual, if such aggrieved individual so chooses, to file a complaint with the IC of the respondent's employer or under the Bharatiya Nyaya Sanhita, 2023 (which replaced the Indian Penal Code, 1860) or any other law for the time being in force, as may be appropriate." },
  { type: 'p', text: "**j) Protection to Complainant:** The Company is committed to ensuring that no employee who brings forward a harassment concern is subject to any form of reprisal. Any reprisal will be subject to disciplinary action. The Company will ensure that the victim or witnesses are not victimised or discriminated against while dealing with complaints of sexual harassment. However, anyone who abuses the procedure (for example, by maliciously putting an allegation knowing it to be untrue and/or produces any forged or misleading document) will be subject to applicable disciplinary action." },

  { type: 'h2', text: "9. Criminal Proceedings" },
  { type: 'p', text: "Where the conduct also amounts to an offence under the Bharatiya Nyaya Sanhita, 2023 or any other law, JHS shall, if the aggrieved person so desires, assist in making a complaint to the appropriate authority and, where the respondent is not an employee, initiate action at the workplace where the incident occurred as well as at the respondent’s workplace (Section 19(g) of the POSH Act). Proceedings before the IC are independent of criminal proceedings and are not held in abeyance merely because criminal proceedings are pending or contemplated." },

  { type: 'h2', text: "10. Confidentiality" },
  { type: 'p', text: "All proceedings, identities, and related information will be kept strictly confidential to protect the dignity and privacy of all individuals involved." },
  { type: 'p', text: "In accordance with Section 16 of the POSH Act, the following shall not be published, communicated or made known to the public, press or media in any manner:" },
  {
    type: 'ul',
    items: [
      "The contents of the complaint and the identity and addresses of the aggrieved person, the respondent and witnesses",
      "Any information relating to conciliation and inquiry proceedings",
      "The recommendations of the IC and the action taken by the employer Information about the justice secured to any victim may be disseminated without disclosing the name, address, identity or any other particulars that could lead to identification. Records of every complaint are kept securely and are accessible only to IC members and persons authorised by the IC. Any person who contravenes this clause is liable to a penalty and disciplinary action in accordance with the service rules or, where none exist, the Rules (Section 17 of the Act).",
    ],
  },

  { type: 'h2', text: "11. Protection Against Retaliation" },
  { type: 'p', text: "JHS will not tolerate any retaliation or victimisation against the complainant or witnesses." },
  { type: 'p', text: "Any such act will be subject to disciplinary action." },
  {
    type: 'ul',
    items: [
      "No adverse action – including termination, demotion, transfer, denial of work, promotion or benefits, or hostile treatment – shall be taken against a complainant, a witness or any person who assists in a complaint or inquiry.",
      "The respondent is presumed not to have committed the alleged conduct until the inquiry concludes, and shall not be victimised before then.",
      "Any person who believes that they are being retaliated against may report it to the IC or HR, and retaliation is itself misconduct liable to action under clause 15.",
    ],
  },

  { type: 'h2', text: "12. False Complaints" },
  { type: 'p', text: "While the policy encourages reporting, knowingly filing false complaints is a serious offence and may lead to disciplinary action. Mere inability to prove a complaint, or lack of adequate evidence, shall not by itself be treated as a false or malicious complaint under this clause (Section 14 of the Act)." },
  {
    type: 'ul',
    items: [
      "Action may be recommended only where, after an inquiry, the IC concludes that the complaint was made maliciously, knowing it to be false, or with a forged or misleading document. The same applies to a witness who gives false evidence or produces a forged or misleading document (Section 14 of the Act).",
      "Malicious intent must be clearly established, and the action recommended is similar to that available in the case of a proved complaint (see clause 15).",
    ],
  },

  { type: 'h2', text: "13. Awareness and Training" },
  {
    type: 'ul',
    items: [
      "POSH awareness sessions will be conducted annually.",
      "All employees must attend mandatory POSH training during onboarding and refresher sessions.",
      "IC members will receive specialized training.",
      "This Policy, the penal consequences of sexual harassment and the order constituting the IC shall be displayed at a conspicuous place at each workplace and on the internal communication platform, and shall be included in the onboarding kit (Section 19(b) of the POSH Act).",
      "Orientation programmes and workshops shall be held at regular intervals to sensitise employees to the Act, the Vishaka Guidelines and this Policy.",
      "The raising of sexual harassment as an issue at team and employee meetings is encouraged.",
      "JHS shall provide the IC with the facilities it needs to deal with complaints and conduct inquiries, assist in securing the attendance of the respondent and witnesses, and make available the information the IC requires (Section 19 of the Act).",
    ],
  },

  { type: 'h2', text: "14. Roles and Responsibilities" },
  { type: 'h3', text: "The Organisation" },
  {
    type: 'ul',
    items: [
      "Provide a safe working environment, including protection from persons who come into contact with the workplace, and take all steps necessary to support an affected person where the harassment is by a Third Party",
      "Treat sexual harassment as misconduct under the service rules and act on IC recommendations within 60 days",
      "Provide assistance to an aggrieved person who chooses to make a criminal complaint (see clause 9)",
    ],
  },
  { type: 'h3', text: "Partners and Managers" },
  {
    type: 'ul',
    items: [
      "Ensure that this Policy is applied within their teams and that everyone understands that harassment will not be tolerated",
      "Report any incident that comes to their notice to the IC immediately, and never discourage or ignore a concern",
    ],
  },
  { type: 'h3', text: "Employees" },
  {
    type: 'ul',
    items: [
      "Respect the rights of others, refuse to participate in any activity that constitutes harassment, and support a person in rejecting unwelcome behaviour",
      "Cooperate with the IC, act as a witness where required, and keep all proceedings confidential",
      "Speak up early: behaviour is sometimes unintentional, and telling a person that it is unwelcome gives them the chance to stop",
    ],
  },
  { type: 'h3', text: "HR Department" },
  {
    type: 'ul',
    items: [
      "Own this Policy, maintain and update it, and answer queries on its application or interpretation",
      "Coordinate onboarding declarations, awareness sessions and IC training, and direct any person who wishes to report misconduct to a member of the IC",
    ],
  },

  { type: 'h2', text: "15. Disciplinary Action" },
  { type: 'p', text: "Based on IC's recommendations, disciplinary actions may include:" },
  {
    type: 'ul',
    items: [
      "Written apology",
      "Warning or reprimand",
      "Suspension",
      "Termination",
      "Deduction of salary or benefits",
      "Counselling",
      "Withholding of promotion and/or increments",
      "Community service",
      "Any other action that JHS considers appropriate under the service rules, proportionate to the gravity of the conduct Sexual harassment is treated as misconduct, and the same range of action is available against any person who retaliates, breaches confidentiality, or is found under clause 12 to have made a malicious complaint or given false evidence. Where the IC recommends compensation, it shall have regard to the mental trauma, pain, suffering and emotional distress caused, the loss in career opportunity, the medical expenses incurred, the income and financial status of the respondent, and the feasibility of payment in a lump sum or instalments (Section 15 of the Act).",
    ],
  },

  { type: 'h2', text: "16. Reporting and Statutory Compliance" },
  {
    type: 'ul',
    items: [
      "The IC shall prepare an annual report and submit it to JHS and to the District Officer (Section 21 of the POSH Act). The report records the number of complaints received and disposed of, the number pending for more than 90 days, the awareness programmes held, and the action taken by the employer.",
      "JHS shall include the number of cases filed and their disposal in its annual report or, where no such report is required, inform the District Officer (Section 22 of the POSH Act).",
      "JHS shall comply with any state or district level registration, disclosure or reporting requirement that applies to it in relation to the IC.",
      "Non-compliance with the POSH Act exposes the employer to penalty under Section 26 of the Act, as set out in the POSH Act.",
    ],
  },

  { type: 'h2', text: "17. Review of Policy" },
  { type: 'p', text: "This policy shall be reviewed annually by HR and the IC to ensure compliance and effectiveness." },
  { type: 'p', text: "This Policy shall also be reviewed and updated whenever the POSH Act, the Rules or any binding judicial direction is amended or issued, whenever the composition of the IC changes, and whenever the IC’s annual report identifies a need. Queries on this Policy may be directed to the HR Department or to any member of the IC." },
  { type: 'p', text: "This POSH policy is issued in the interest of employee safety and equality. Any queries or feedback regarding the policy can be directed to the HR Department." },
]

export default function PoshPolicy() {
  return (
    <LegalPage
      eyebrow="Policy"
      title="Prevention of Sexual Harassment (POSH) Policy"
      intro="Framed in accordance with the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 and the Rules made thereunder. JHS & Associates LLP has zero tolerance for any form of sexual harassment."
      blocks={blocks}
    />
  )
}
