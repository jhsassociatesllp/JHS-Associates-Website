// ─── Sector → Partner Mapping ──────────────────────────────────────────────
// Maps each sector page to the JHS partner(s) whose expertise covers it.
// Each sector key holds an ARRAY of experts (some sectors have several).
// Partner details are kept in sync with components/About Us/Partners.tsx —
// update PARTNERS below if a partner's bio/photo/creds change there.

import { imageUrl } from '../utils/imageUrl';

// Canonical partner directory used to build sector expert lists below.
const PARTNERS = {
  'Huzeifa Unwala': {
    image: imageUrl('Huzefa-Unwala-removebg-preview.png'),
    creds: 'FCA, CISA, ISO 27001, NISM(DP), NISM(Social Auditor)',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/ca-huzeifa-unwala/',
    email: 'huzeifa.unwala@jhsassociates.in',
  },
  'Tasnim Tankiwala': {
    image: imageUrl('Tasnim-Tankiwala-removebg-preview.png'),
    creds: 'FCA, IP (IBBI), DIRM, DISA',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/tasnim-tankiwala',
    email: 'tasnim.tankiwala@jhsassociates.in',
  },
  'Disha Shah': {
    image: imageUrl('Disha Shah-removebg-preview.png'),
    creds: 'FCA',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/disha-shah-4826b097/',
    email: 'disha.shah@jhsassociates.in',
  },
  'Dhanlaxmi Nair': {
    image: imageUrl('Dhanlaxmi.png'),
    creds: 'M.Com, FCA, CMA, SET',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/dhanlaxmi-nair-311053206',
    email: 'dhanlaxmi.nair@jhsassociates.in',
  },
  'Jamal Ashraf Chatriwala': {
    image: imageUrl('Jamal-Chatriwala-removebg-preview.png'),
    creds: 'ACA, IPO Certified',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/chatriwala',
    email: 'jamal.chatriwala@jhsassociates.in',
  },
  'Taher Pepermintwala': {
    image: imageUrl('Taher-Pepermintwala-removebg-preview.png'),
    creds: 'FCA, CISA, ACCA, Dip IFRS',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/taherpepermintwala/',
    email: 'taher.pepermintwala@jhsassociates.in',
  },
  'Sahil Shah': {
    image: imageUrl('Sahil-Shah-removebg-preview.png'),
    creds: 'ACA, IPO Certified',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/sahil-shah-664a5312a',
    email: 'sahil.shah@jhsassociates.in',
  },
  'Tausif Shaikh': {
    image: imageUrl('Tausif-Shaikh-removebg-preview.png'),
    creds: 'ACA, AICA-L1',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/ca-tausif-shaikh',
    email: 'tausif.shaikh@jhsassociates.in',
  },
  'Samad Dhanani': {
    image: imageUrl('Samad-Dhanani-removebg-preview.png'),
    creds: 'M.Com, ACA, CS',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/samad-dhanani-9b342562/',
    email: 'samad.dhanani@jhsassociates.in',
  },
  'Huzefa Kaka': {
    image: '',
    creds: '',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/huzefakaka/',
    email: 'huzefa.kaka@jhsassociates.in',
  },
  'Huzefa Mala': {
    image: '',
    creds: '',
    location: 'Mumbai',
    linkedin: 'https://www.linkedin.com/in/huzefamala/',
    email: 'huzefa.mala@jhsassociates.in',
  },
  'Tripti Mohta': {
    image: imageUrl('Tripti-mohta.png'),
    creds: 'FCA',
    location: 'Kolkata',
    linkedin: 'https://www.linkedin.com/in/ca-tripti-mohta-598a2544/',
    email: 'tripti.mohta@jhsassociates.in',
  },
  'Pranal P': {
    image: imageUrl('Pranal p.png'),
    creds: 'FCA',
    location: 'Chennai',
    linkedin: 'https://linkedin.com/',
    email: 'parnal@jhsassociates.in',
  },
  'G Chandrasekaran': {
    image: imageUrl('Chandra Shekaran.png'),
    creds: 'DSM, FCA, DISA',
    location: 'Chennai',
    linkedin: 'https://www.linkedin.com/in/ca-g-chandrasekaran-4a967b29',
    email: 'chandrasekaran@jhsassociates.in',
  },
  'Jagdish Solanki': {
    image: imageUrl('Jagdish-Solanki-removebg-preview.png'),
    creds: 'B.Com (Hons), FCA',
    location: 'Bengaluru',
    linkedin: 'https://www.linkedin.com/in/jagdish-solanki-92324b1b',
    email: 'jagdish.solanki@jhsassociates.in',
  },
  'Narayana Rao Malla': {
    image: imageUrl('Narayana-Rao-Malla-removebg-preview.png'),
    creds: 'FCA',
    location: 'Bengaluru',
    linkedin: 'https://www.linkedin.com/in/narayana-rao-malla',
    email: 'narayana.malla@jhsassociates.in',
  },
  'Saurabh Shah': {
    image: imageUrl('Saurabh-Shah-removebg-preview.png'),
    creds: 'FCA, DISA',
    location: 'Vadodara',
    linkedin: 'https://www.linkedin.com/in/saurabh-shah-b822791a7',
    email: 'saurabh.shah@jhsassociates.in',
  },
  'Virendra Nayyar': {
    image: imageUrl('Virendra-Nayyar-removebg-preview.png'),
    creds: 'B.Com (Hons), FCA',
    location: 'Vadodara',
    linkedin: 'https://www.linkedin.com/in/virendra-nayyar-3114a9227',
    email: 'virendra.nayyar@jhsassociates.in',
  },
  'Viranch Modi': {
    image: imageUrl('Viranch-Modi-removebg-preview.png'),
    creds: 'FCA',
    location: 'Vadodara',
    linkedin: 'https://www.linkedin.com/in/viranch-modi-aa4106227/',
    email: 'viranch.modi@jhsassociates.in',
  },
  'Vinod Joshi': {
    image: imageUrl('vinod joshi.png'),
    creds: 'FCA, MBA (Finance)',
    location: 'Mumbai',
    linkedin: 'https://linkedin.com/in/vinod-joshi-fca',
    email: 'vinod.joshi@jhsassociates.in',
  },
  'Jhankhna Patel': {
    image: imageUrl('Jhankana Patel.jpeg'),
    creds: 'ACA, CBAP, DISA, CPA Australia',
    location: 'Ahmedabad',
    linkedin: 'https://www.linkedin.com/in/jhankhnapatel09',
    email: 'jhankhna.patel@jhsassociates.in',
  },
};

const expert = (name) => ({ name, ...PARTNERS[name] });

export const SECTOR_EXPERTS = {
  // ── Media & Technology ──
  ITSystemAudit: [expert('Taher Pepermintwala'), expert('Saurabh Shah')],
  ITTeS: [expert('Taher Pepermintwala')],
  Media: [expert('Jamal Ashraf Chatriwala'), expert('Disha Shah'), expert('Tausif Shaikh')],

  // ── Consumer ──
  FMCG: [expert('Narayana Rao Malla'), expert('Jagdish Solanki')],
  Retail: [expert('Narayana Rao Malla'), expert('Jagdish Solanki')],
  Housing: [expert('Sahil Shah')],
  GemsAndJewellery: [expert('Dhanlaxmi Nair'), expert('Virendra Nayyar')],
  Commodity: [expert('Dhanlaxmi Nair'), expert('Virendra Nayyar')],
  OilAndGasIndustry: [expert('Huzefa Mala')],
  RealEstate: [expert('Viranch Modi')],

  // ── Financial Services ──
  Banking: [
    expert('Huzeifa Unwala'), expert('Tasnim Tankiwala'), expert('Disha Shah'),
    expert('Dhanlaxmi Nair'), expert('Jamal Ashraf Chatriwala'), expert('Taher Pepermintwala'),
    expert('Sahil Shah'), expert('Tausif Shaikh'), expert('Samad Dhanani'),
    expert('Huzefa Kaka'), expert('Tripti Mohta'), expert('Pranal P'), expert('G Chandrasekaran'),
  ],
  Broking: [expert('Dhanlaxmi Nair'), expert('Huzefa Kaka'), expert('Disha Shah')],
  Insurance: [expert('Jamal Ashraf Chatriwala')],
  FamilyOrientedBusinesses: [expert('Sahil Shah')],
  DigitalCurrency: [expert('Taher Pepermintwala')],
  NBFC: [expert('Taher Pepermintwala'), expert('Sahil Shah'), expert('Dhanlaxmi Nair')],
  VentureCapital: [expert('Taher Pepermintwala')],
  PortfolioManagement: [expert('Dhanlaxmi Nair')],
  MutualFunds: [expert('Vinod Joshi')],

  // ── Other ──
  HealthCare: [expert('Jamal Ashraf Chatriwala'), expert('Disha Shah'), expert('Taher Pepermintwala')],
  Construction: [expert('Sahil Shah')],
  Manufacturing: [expert('Disha Shah'), expert('Taher Pepermintwala'), expert('Tausif Shaikh')],
  Logistics: [expert('Disha Shah'), expert('Taher Pepermintwala'), expert('Tausif Shaikh')],
  NGO: [expert('Jhankhna Patel')],
};
