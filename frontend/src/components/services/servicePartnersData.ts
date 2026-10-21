import { imageUrl } from '../../utils/imageUrl'

export interface PartnerProfile {
  name: string
  creds: string
  designation: string
  location: string
  image?: string
  email?: string
  linkedin?: string
}

export const PARTNERS_REGISTRY: Record<string, PartnerProfile> = {
  'Taher': {
    name: 'Taher Pepermintwala',
    creds: 'FCA, CISA, ACCA, Dip IFRS',
    designation: 'Assurance, Tech & SOC Audit',
    location: 'Mumbai',
    image: imageUrl('Taher-Pepermintwala-removebg-preview.webp'),
    email: 'taher.pepermintwala@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/taherpepermintwala/',
  },
  'Saurabh': {
    name: 'Saurabh Shah',
    creds: 'FCA, DISA',
    designation: 'Direct & Indirect Tax',
    location: 'Vadodara',
    image: imageUrl('Saurabh-Shah-removebg-preview.webp'),
    email: 'saurabh.shah@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/saurabh-shah-b822791a7/',
  },
  'Tripti': {
    name: 'Tripti Mohta',
    creds: 'FCA',
    designation: 'Taxation & Audit Specialist',
    location: 'Kolkata',
    image: imageUrl('Tripti mohta.webp'),
    email: 'tripti.mohta@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/ca-tripti-mohta-598a2544/',
  },
  'Viranch': {
    name: 'Viranch Modi',
    creds: 'FCA',
    designation: 'Income Tax & GST',
    location: 'Vadodara',
    image: imageUrl('Viranch-Modi-removebg-preview.webp'),
    email: 'viranch.modi@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/viranch-modi-aa4106227/',
  },
  'Samad': {
    name: 'Samad Dhanani',
    creds: 'M.Com, ACA, CS',
    designation: 'Statutory Audit & Accounts Outsourcing',
    location: 'Mumbai',
    image: imageUrl('Samad-Dhanani-removebg-preview.webp'),
    email: 'samad.dhanani@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/samad-dhanani-9b342562/',
  },
  'Tasnim': {
    name: 'Tasnim Tankiwala',
    creds: 'FCA, IP (IBBI), DIRM, DISA',
    designation: 'Statutory Audit & Assurance',
    location: 'Mumbai',
    image: imageUrl('Tasnim-Tankiwala-removebg-preview.webp'),
    email: 'tasnim.tankiwala@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/tasnim-tankiwala',
  },
  'Jamal': {
    name: 'Jamal Ashraf Chatriwala',
    creds: 'ACA, IPO Certified',
    designation: 'Internal Audit & Risk Advisory',
    location: 'Mumbai',
    image: imageUrl('Jamal-Chatriwala-removebg-preview.webp'),
    email: 'jamal.chatriwala@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/chatriwala',
  },
  'G. Chandrasekaran': {
    name: 'G Chandrasekaran',
    creds: 'DSM, FCA, DISA',
    designation: 'Statutory & Corporate Tax Audits',
    location: 'Chennai',
    image: imageUrl('Chandra Shekaran.webp'),
    email: 'chandrasekaran@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/ca-g-chandrasekaran-4a967b29',
  },

  'Pranal': {
    name: 'Pranal P',
    creds: 'FCA',
    designation: 'Specialising in GST',
    location: 'Chennai',
    image: imageUrl('Pranal p.webp'),
    email: 'parnal@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/parnal-p',
  },
  'Mehul': {
    name: 'Mehul Shah',
    creds: 'FCA',
    designation: 'Income Tax & GST',
    location: 'Surat',
    image: imageUrl('Mehul-Shah-removebg-preview.webp'),
    email: 'mehul.shah@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/mehul-shah-9aaaa130b',
  },
  'Milin': {
    name: 'Milin Parekh',
    creds: 'M.Com, FCA',
    designation: 'Internal Audit & Consulting',
    location: 'Vadodara',
    image: imageUrl('Milin-Parekh-removebg-preview.webp'),
    email: 'milin.parekh@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/milin-parekh-63692061',
  },
  'Dhanlaxmi': {
    name: 'Dhanlaxmi Nair',
    creds: 'M.Com, FCA, CMA, SET',
    designation: 'Risk Advisory & Consulting',
    location: 'Mumbai',
    image: imageUrl('Dhanlaxmi.webp'),
    email: 'dhanlaxmi.nair@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/dhanlaxmi-nair-311053206',
  },
  'Huzefa Mala': {
    name: 'Huzefa Mala',
    creds: 'FCA, UGC-NET Qualified',
    designation: 'Income Tax Advisory & Audits',
    location: 'Mumbai',
    image: imageUrl('Huzefa-mala.webp'),
    email: 'huzefa.mala@jhsconsulting.in',
    linkedin: 'https://www.linkedin.com/in/huzefamala/',
  },
  'Shreena': {
    name: 'Shreena Panara',
    creds: 'ACA',
    designation: 'Indirect Tax Specialist',
    location: 'Rajkot',
    image: imageUrl('Shreena Parana.webp'),
    email: 'shreena.panara@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/ca-shreena-panara-61b27820a',
  },
  'Disha': {
    name: 'Disha Shah',
    creds: 'FCA',
    designation: 'Risk Advisory, Internal Audit & IFC',
    location: 'Mumbai',
    image: imageUrl('Disha Shah-removebg-preview.webp'),
    email: 'disha.shah@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/disha-shah-4826b097/',
  },
  'Sahil': {
    name: 'Sahil Shah',
    creds: 'ACA, IPO Certified',
    designation: 'Risk Advisory, Internal Audit & IFC',
    location: 'Mumbai',
    image: imageUrl('Sahil-Shah-removebg-preview.webp'),
    email: 'sahil.shah@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/sahil-shah-664a5312a',
  },
  'Virendra': {
    name: 'Virendra Nayyar',
    creds: 'B.Com (Hons), FCA',
    designation: 'Internal Audit & Assurance',
    location: 'Vadodara',
    image: imageUrl('Virendra-Nayyar-removebg-preview.webp'),
    email: 'virendra.nayyar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/virendra-nayyar-3114a9227',
  },
  'Nikhel': {
    name: 'Nikhel Kochhar',
    creds: 'FCA, CIA',
    designation: 'Governance, Risk & Internal Audit',
    location: 'Delhi',
    image: imageUrl('Nikhel-Kochhar-removebg-preview.webp'),
    email: 'nikhil.kochhar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/nikhelkochhar',
  },
  'Raj Shah': {
    name: 'Raj Shah',
    creds: 'ACA',
    designation: 'Tax Litigation & Advisory',
    location: 'Surat',
    image: imageUrl('Raj-Shah-removebg-preview.webp'),
    email: 'raj.shah@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/ca-raj-a-shah',
  },
  'Dhaval': {
    name: 'Dhaval Thakkar',
    creds: 'ACA',
    designation: 'Internal Audit, Risk Advisory & Insurance',
    location: 'Ahmedabad',
    image: imageUrl('Dhaval-Thakkar-removebg-preview.webp'),
    email: 'dhaval.thakkar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/dhaval-thakkar-dt-25406144/',
  },
  'Kalpesh': {
    name: 'Kalpesh Parmar',
    creds: 'B.Com (Hons), FCA',
    designation: 'Statutory Audit & Assurance',
    location: 'Vadodara',
    image: imageUrl('Kalpesh-Parmar-removebg-preview.webp'),
    email: 'kalpesh.parmar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/kalpesh-parmar-016a502b',
  },
  'Dipika': {
    name: 'Dipika Bisawa',
    creds: 'ACS',
    designation: 'Corporate Governance, Compliance & Risk Management',
    location: 'Mumbai',
    image: imageUrl('Dipika-Bisawa.webp'),
    email: 'dipika.bisawa@jhsconsulting.in',
    linkedin: 'https://www.linkedin.com/in/dipika-bisawa-0a9a211a/',
  },
  'Sharad': {
    name: 'Sharad Mohata',
    creds: 'B.Com (Hons), FCA, ICWAI',
    designation: 'Tax & Corporate Advisory',
    location: 'Kolkata',
    image: imageUrl('Sharad-Mohata-removebg-preview.webp'),
    email: 'sharad.mohata@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/sharad-mohata-18318082',
  },
  'Huzeifa Unwala': {
    name: 'Huzeifa Unwala',
    creds: 'FCA, CISA, ISO 27001, NISM(DP), NISM(Social Auditor)',
    designation: 'IFC, Governance, Risk & Cyber Security',
    location: 'Mumbai',
    image: imageUrl('Huzefa-Unwala-removebg-preview.webp'),
    email: 'huzeifa.unwala@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/ca-huzeifa-unwala/',
  }
}

export interface ServiceSubPoint {
  id: string
  title: string
  desc: string
  partners?: string[]
}

export const EXCLUDED_PARTNERS = new Set([
  'Hiren',
  'Sweta',
  'Urmish',
  'Farhad',
  'Sanjay Saraswat',
  'Tanuj',
])

export const SERVICES_PARTNERS_MAP: Record<string, Record<string, string[]>> = {
  assurance: {
    '01': ['Taher', 'Saurabh', 'Tripti', 'Viranch', 'Samad', 'Tasnim', 'Jamal', 'G. Chandrasekaran', 'Pranal', 'Mehul', 'Milin', 'Hitesh', 'Dhanlaxmi'],
    '02': ['Taher', 'Saurabh', 'Tripti', 'Viranch', 'Samad', 'Mehul', 'Milin', 'Huzefa Mala', 'Hitesh', 'Shreena'],
    '03': ['Jamal', 'Tasnim', 'Disha', 'Sahil', 'Virendra', 'Chandra', 'Nikhel', 'Samad', 'Mehul', 'Milin', 'Hitesh', 'Dhanlaxmi'],
    '04': ['Jamal', 'Sahil', 'Dhanlaxmi', 'Taher', 'Shreena', 'Mehul'],
    '05': ['Dhanlaxmi', 'Shreena', 'Hitesh', 'Mehul'],
    '06': ['Taher', 'Tasnim', 'Samad', 'Sahil'],
    '07': ['Dhanlaxmi', 'Sahil', 'Taher', 'Jamal', 'Virendra', 'Shreena', 'Mehul'],
    '08': ['Taher', 'Tasnim', 'Samad', 'Sahil', 'Milin'],
    '09': ['Tasnim', 'Samad'],
    '10': ['Tasnim', 'Samad', 'Raj A. Shah'],
    '11': ['Taher', 'Saurabh', 'Tripti', 'Viranch'],
    '12': ['Taher', 'Samad', 'Tasnim'],
  },

  consulting: {
    '01': ['Taher', 'Saurabh', 'Tasnim', 'Hitesh', 'Raj A. Shah'],
    '02': ['Taher', 'Sahil', 'Samad', 'Tasnim', 'Jamal', 'Dhaval'],
    '03': ['Taher', 'Jamal', 'Sahil', 'Nikhel', 'Pramod'],
    '04': ['Taher', 'Dhaval', 'Milin'],
    '05': ['Taher', 'Dhaval', 'Jamal'],
    '06': ['Sahil', 'Kalpesh'],
    '07': ['Dipika', 'Hitesh', 'Raj A. Shah'],
    '08': ['Taher', 'Jamal'],
    '09': ['Dipika', 'Hitesh', 'Raj A. Shah'],
    '10': ['Taher', 'Milin', 'Dhaval'],
    '11': ['Taher', 'Dhaval'],
    '12': ['Taher', 'Tasnim'],
  },

  taxation: {
    '01': ['Tripti', 'Taher', 'Samad', 'Huzefa Mala', 'Shreena', 'Raj A. Shah'],
    '02': ['Taher', 'Dhaval'],
    '03': ['Taher', 'Huzefa Mala'],
    '04': ['Taher', 'Huzefa Mala', 'Shreena'],
    '05': ['Mehul', 'Raj A. Shah', 'Shreena', 'Huzefa Mala'],
    '06': ['Huzefa Mala', 'Mehul', 'Raj A. Shah'],
    '07': ['Sharad', 'Kalpesh', 'Taher', 'Huzefa Mala'],
    '08': ['Huzefa Mala', 'Raj A. Shah', 'Shreena'],
    '09': ['Huzefa Mala', 'Raj A. Shah', 'Shreena'],
    '10': [], // Transfer Pricing (Domestic & International)
    '11': [], // International Tax & Inbound/Outbound Structuring
    '12': ['Taher', 'Huzefa Mala', 'Hitesh', 'Mehul'],
  },

  outsourcing: {
    '01': ['Dhaval', 'Samad', 'Milin'],
    '02': ['Dhaval', 'Samad'],
    '03': ['Dhaval', 'Samad'],
    '04': ['Dipika', 'Jamal', 'Huzefa Mala', 'Tasnim'],
    '05': ['Huzefa Mala'],
    '06': ['Dhaval', 'Samad'],
    '07': ['Samad', 'Dhanlaxmi'],
    '08': ['Dhaval', 'Samad'],
    '09': ['Dhaval', 'Samad'],
    '10': ['Dhaval'],
    '11': ['Dipika'],
    '12': ['Jamal', 'Nikhel'],
  },

  corporateFinance: {
    '01': ['Taher'],
    '02': ['Jamal'],
    '03': ['Dhaval'],
    '04': ['Taher', 'Dhaval'],
    '05': ['Dhaval', 'Taher', 'Milin'],
    '06': ['Samad'],
    '07': ['Samad', 'Dhaval'],
    '08': ['Taher', 'G. Chandrasekaran'],
    '11': ['Taher', 'G. Chandrasekaran'],
  },

  learningDevelopment: {
    '01': ['Huzefa Mala', 'Mehul', 'Pranal'],
    '02': ['Huzefa Mala', 'Shreena', 'Taher'],
    '03': ['Samad', 'Tasnim'],
    '04': ['Dipika', 'Hitesh', 'Raj A. Shah'],
    '05': ['Jamal', 'Sahil', 'Nikhel'],
    '06': ['Huzeifa Unwala', 'Nikhel', 'Jamal'],
    '07': ['Taher', 'Samad', 'Tasnim', 'G. Chandrasekaran'],
    '08': ['Dipika'],
    '09': ['Dhaval', 'Milin', 'Samad'],
    '10': ['Huzeifa Unwala', 'Dipika', 'Nikhel'],
    '11': ['Jamal', 'Dhanlaxmi', 'Tasnim', 'Sahil'],
    '12': ['Dipika', 'Jamal', 'Huzefa Mala'],
  },

  complianceLearning: {
    '01': ['Dipika', 'Tasnim', 'Nikhel', 'Suman', 'Hitesh'],
    '02': ['Dipika', 'Tasnim', 'Huzefa Mala'],
    '03': ['Huzeifa Unwala', 'Nikhel', 'Jamal'],
    '04': ['Huzeifa Unwala', 'Nikhel', 'Jamal'],
    '05': ['Sahil', 'Tasnim', 'Samad'],
    '06': ['Dipika', 'Hitesh', 'Raj A. Shah'],
    '07': ['Dipika', 'Hitesh'],
    '08': ['Dipika', 'Hitesh'],
    '09': ['Dipika', 'Hitesh'],
    '10': ['Dipika', 'Huzefa Mala', 'Raj A. Shah'],
    '11': ['Nikhel', 'Huzeifa Unwala', 'Tasnim', 'Suman'],
    '12': ['Taher', 'Samad', 'Tasnim', 'Sahil'],
  },
}

export function getPartnersForSubPoint(serviceKey: string, pointId: string): PartnerProfile[] {
  const serviceMap = SERVICES_PARTNERS_MAP[serviceKey]
  if (!serviceMap) return []
  const normalizedId = pointId.padStart(2, '0')
  const partnerKeys = serviceMap[pointId] || serviceMap[normalizedId] || []
  return partnerKeys
    .filter((key) => !EXCLUDED_PARTNERS.has(key))
    .map((key) => {
      const partner = PARTNERS_REGISTRY[key]
      if (partner) return partner
      return null
    })
    .filter((p): p is PartnerProfile => Boolean(p))
}
