// ─── Sector → Case Study `sector` field(s) ─────────────────────────────────
// Maps each sector page to the matching `sector` value(s) used in
// data/CaseStudies.js. Sectors with an empty array have no direct case
// study match yet and fall back to a generic "view all" CTA.

export const SECTOR_CASE_STUDY_MAP = {
  // ── Consumer ──
  Commodity: [],
  FMCG: [],
  GemsAndJewellery: [],
  Housing: ['Housing Finance'],
  OilAndGasIndustry: [],
  RealEstate: ['Real Estate', 'Infrastructure'],
  Retail: [],

  // ── Financial Services ──
  Banking: ['Banking'],
  Broking: ['Broking'],
  DigitalCurrency: ['Payment System'],
  FamilyOrientedBusinesses: [],
  Insurance: ['Life Insurance'],
  MutualFunds: [],
  NBFC: ['NBFC'],
  PortfolioManagement: [],
  VentureCapital: ['Private Equity'],

  // ── Media & Technology ──
  ITSystemAudit: ['Information Technology'],
  ITTeS: ['ITES', 'Information Technology'],
  Media: ['Media & Technology'],

  // ── Other ──
  Construction: ['Infrastructure'],
  HealthCare: ['Healthcare'],
  Logistics: ['Logistics'],
  Manufacturing: ['Manufacturing'],
  NGO: [],
};
