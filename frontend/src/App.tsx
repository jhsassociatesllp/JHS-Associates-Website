import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { patchDomForGoogleTranslate, initPersistedLanguage } from './i18n/googleTranslate'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SEOHead from './components/common/SEOHead'
import Hero from './sections/Hero'
import Spotlight from './sections/Spotlight'
import Stats from './sections/Stats'
import Services from './sections/Services'
import Cities from './sections/Cities'
import VisionMission from './sections/VisionMission'
import Insights from './sections/Insights'
import FAQ from './sections/FAQ'
import Disclaimer from './components/Disclaimer'

// Legal pages
const PrivacyPolicy = lazy(() => import('./components/legal/PrivacyPolicy'))
const TermsAndConditions = lazy(() => import('./components/legal/TermsAndConditions'))
const TermsOfBusiness = lazy(() => import('./components/legal/TermsOfBusiness'))

// Services pages
const Outsourcing = lazy(() => import('./components/services/Outsourcing'))
const Consulting = lazy(() => import('./components/services/Consulting'))
const Taxation = lazy(() => import('./components/services/Taxation'))
const Assurance = lazy(() => import('./components/services/Assurance'))
const ITAssurance = lazy(() => import('./components/services/ITAssurance'))
const SingleWindowAssistance = lazy(() => import('./components/services/SingleWindowAssistance'))
const SOCAttestation = lazy(() => import('./components/services/SOCAttestation'))
const CorporateFinance = lazy(() => import('./components/services/CorporateFinance'))
const ComplianceLearning = lazy(() => import('./components/services/ComplianceLearning'))
const LearningDevelopment = lazy(() => import('./components/services/LearningDevelopment'))

// Financial Services components
const Banking = lazy(() => import('./components/sectors/Financial Services/Banking'))
const MutualFunds = lazy(() => import('./components/sectors/Financial Services/MutualFunds'))
const Broking = lazy(() => import('./components/sectors/Financial Services/Broking'))
const FamilyOrientedBusinesses = lazy(() => import('./components/sectors/Financial Services/FamilyOrientedBusinesses'))
const Insurance = lazy(() => import('./components/sectors/Financial Services/Insurance'))
const DigitalCurrency = lazy(() => import('./components/sectors/Financial Services/digitalCurrency'))
const NBFC = lazy(() => import('./components/sectors/Financial Services/NBFC'))
const PortfolioManagement = lazy(() => import('./components/sectors/Financial Services/PortfolioManagement'))
const VentureCapital = lazy(() => import('./components/sectors/Financial Services/VentureCapital'))

// Consumer components
const Housing = lazy(() => import('./components/sectors/consumer/Housing'))
const GemsAndJewellery = lazy(() => import('./components/sectors/consumer/GemsAndJewellery'))
const RealEstate = lazy(() => import('./components/sectors/consumer/RealEstate'))
const Retail = lazy(() => import('./components/sectors/consumer/Retail'))
const OilAndGasIndustry = lazy(() => import('./components/sectors/consumer/OilAndGasIndustry'))
const FMCG = lazy(() => import('./components/sectors/consumer/FMCG'))
const Commodity = lazy(() => import('./components/sectors/consumer/Commodity'))

// Media & Technology components
const Media = lazy(() => import('./components/sectors/Media & technology/Media'))
const ITSystemAudit = lazy(() => import('./components/sectors/Media & technology/ITSystemAudit'))
const ITTeS = lazy(() => import('./components/sectors/Media & technology/ITTeS'))

// Other components
const HealthCare = lazy(() => import('./components/sectors/Other/HealthCare'))
const Construction = lazy(() => import('./components/sectors/Other/Construction'))
const NGO = lazy(() => import('./components/sectors/Other/NGO'))
const Manufacturing = lazy(() => import('./components/sectors/Other/Manufacturing'))
const Logistics = lazy(() => import('./components/sectors/Other/Logistics'))

// Insights components
const Resources = lazy(() => import('./components/Insights/Resources'))
const Articles = lazy(() => import('./components/Insights/Articles'))
const CaseStudies = lazy(() => import('./components/Insights/CaseStudies'))
const CaseStudyDetail = lazy(() => import('./components/Insights/CaseStudyDetail'))
const ThoughtLeadership = lazy(() => import('./components/Insights/ThoughtLeadership'))
const Newsletters = lazy(() => import('./components/Insights/Newsletters'))
const Blog = lazy(() => import('./components/Insights/Blog'))
const Podcasts = lazy(() => import('./components/Insights/Podcasts'))
const Excellencia = lazy(() => import('./components/Insights/Excellencia'))
const WhitePapers = lazy(() => import('./components/Insights/WhitePapers'))
const Regulatory = lazy(() => import('./components/Insights/Regulatory'))

// Spotlight pages
const AIAutomation = lazy(() => import('./components/Spotlight/AIAutomation'))
const Alumni = lazy(() => import('./components/Spotlight/Alumni'))
const Solutions = lazy(() => import('./components/Spotlight/Solutions'))

// City pages
const Mumbai = lazy(() => import('./components/Cities/Mumbai'))
const Delhi = lazy(() => import('./components/Cities/Delhi'))
const Bengaluru = lazy(() => import('./components/Cities/Bengaluru'))
const Global = lazy(() => import('./components/Cities/Global'))
const Gujarat = lazy(() => import('./components/Cities/Gujarat'))
const Hyderabad = lazy(() => import('./components/Cities/Hyderabad'))
const Kolkata = lazy(() => import('./components/Cities/Kolkata'))
const Chennai = lazy(() => import('./components/Cities/Chennai'))

// About pages
const OurStory = lazy(() => import('./components/About Us/OurStory'))
const Leadership = lazy(() => import('./components/About Us/Partners'))
const Awards = lazy(() => import('./components/About Us/Awards'))
const CSR = lazy(() => import('./components/About Us/CSR'))
const Careers = lazy(() => import('./components/About Us/Careers'))
const OurOffices = lazy(() => import('./components/About Us/OurOffices'))
const CompanyOverview = lazy(() => import('./components/About Us/CompanyOverview'))
const GlobalPresence = lazy(() => import('./components/About Us/GlobalPresence'))

// Know Us pages
const MissionVision = lazy(() => import('./components/About Us/MissionVision'))
const Culture = lazy(() => import('./components/About Us/Culture'))
const Partnerships = lazy(() => import('./components/About Us/Partnerships'))

// Contact page
const Contact = lazy(() => import('./components/Contact'))

// Feedback page
const Feedback = lazy(() => import('./pages/Feedback'))

// Request for Proposal page
const RequestForProposal = lazy(() => import('./pages/RequestForProposal'))

// Hero Card Detail Pages
const BoardroomsInTransition = lazy(() => import('./pages/BoardroomsInTransition'))
const DataGovernanceRule6 = lazy(() => import('./pages/DataGovernanceRule6'))
const InvestmentOpportunitiesIndia = lazy(() => import('./pages/InvestmentOpportunitiesIndia'))
const GreenTransition = lazy(() => import('./pages/GreenTransition'))
const DigitalTwins = lazy(() => import('./pages/DigitalTwins'))
const SEBIDraftCircular = lazy(() => import('./pages/SEBIDraftCircular'))
const RBICoolingOffPeriod = lazy(() => import('./pages/RBICoolingOffPeriod'))

gsap.registerPlugin(ScrollTrigger)

function HomePage() {
  return (
    <main>
      <Hero />
      <Spotlight />
      <Stats />
      <Services />
      <Cities />
      <VisionMission />
      <Insights />
      <FAQ />
      {/* <Posts />
      <CareerCaseStudy /> */}

    </main>
  )
}

function RouteLoadingFallback() {
  return <div style={{ minHeight: '60vh' }} aria-hidden="true" />
}

export default function App() {
  useSmoothScroll()
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  useEffect(() => {
    patchDomForGoogleTranslate()
    initPersistedLanguage()
  }, [])

  return (
    <>
      <SEOHead />
      <Disclaimer />
      <Navbar />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Spotlight Pages */}
          <Route path="/ai-automation" element={<AIAutomation />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/solutions" element={<Solutions />} />

          {/* City Pages */}
          <Route path="/city/mumbai" element={<Mumbai />} />
          <Route path="/city/delhi" element={<Delhi />} />
          <Route path="/city/bengaluru" element={<Bengaluru />} />
          <Route path="/city/global" element={<Global />} />
          <Route path="/city/gujarat" element={<Gujarat />} />
          <Route path="/city/ahmedabad" element={<Navigate to="/city/gujarat" replace />} />
          <Route path="/city/hyderabad" element={<Hyderabad />} />
          <Route path="/city/kolkata" element={<Kolkata />} />
          <Route path="/city/chennai" element={<Chennai />} />

          {/* Services */}
          <Route path="/services/outsourcing" element={<Outsourcing />} />
          <Route path="/services/consulting" element={<Consulting />} />
          <Route path="/services/taxation" element={<Taxation />} />
          <Route path="/services/assurance" element={<Assurance />} />
          <Route path="/services/it-assurance" element={<ITAssurance />} />
          <Route path="/services/audit-assurance" element={<Navigate to="/services/assurance" replace />} />
          <Route path="/services/single-window-assistance" element={<SingleWindowAssistance />} />
          <Route path="/services/soc-attestation" element={<SOCAttestation />} />
          <Route path="/services/corporate-finance" element={<CorporateFinance />} />
          <Route path="/services/compliance-learning" element={<ComplianceLearning />} />
          <Route path="/services/learning-development" element={<LearningDevelopment />} />

          {/* Financial Services */}
          <Route path="/sectors/financial-services/banking" element={<Banking />} />
          <Route path="/sectors/financial-services/mutual-funds" element={<MutualFunds />} />
          <Route path="/sectors/financial-services/broking" element={<Broking />} />
          <Route path="/sectors/financial-services/family-oriented-businesses" element={<FamilyOrientedBusinesses />} />
          <Route path="/sectors/financial-services/insurance" element={<Insurance />} />
          <Route path="/sectors/financial-services/digital-currency" element={<DigitalCurrency />} />
          <Route path="/sectors/financial-services/nbfc" element={<NBFC />} />
          <Route path="/sectors/financial-services/portfolio-management" element={<PortfolioManagement />} />
          <Route path="/sectors/financial-services/venture-capital" element={<VentureCapital />} />

          {/* Consumer */}
          <Route path="/sectors/consumer/housing" element={<Housing />} />
          <Route path="/sectors/consumer/gems-jewellery" element={<GemsAndJewellery />} />
          <Route path="/sectors/consumer/real-estate" element={<RealEstate />} />
          <Route path="/sectors/consumer/retail" element={<Retail />} />
          <Route path="/sectors/consumer/oil-gas-industry" element={<OilAndGasIndustry />} />
          <Route path="/sectors/consumer/fmcg" element={<FMCG />} />
          <Route path="/sectors/consumer/commodity" element={<Commodity />} />

          {/* Media & Technology */}
          <Route path="/sectors/media-technology/media" element={<Media />} />
          <Route path="/sectors/media-technology/it-system-audit" element={<ITSystemAudit />} />
          <Route path="/sectors/media-technology/it-tes" element={<ITTeS />} />

          {/* Other */}
          <Route path="/sectors/other/healthcare" element={<HealthCare />} />
          <Route path="/sectors/other/construction" element={<Construction />} />
          <Route path="/sectors/other/ngo" element={<NGO />} />
          <Route path="/sectors/other/manufacturing" element={<Manufacturing />} />
          <Route path="/sectors/other/logistics" element={<Logistics />} />

          {/* Insights — paths must match navbar hrefs exactly */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/white-papers" element={<WhitePapers />} />
          <Route path="/regulatory" element={<Regulatory />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
          <Route path="/thought-leadership" element={<ThoughtLeadership />} />
          <Route path="/newsletters" element={<Newsletters />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/excellencia" element={<Excellencia />} />

          {/* Know Us */}
          <Route path="/know-us/our-story" element={<OurStory />} />
          <Route path="/know-us/mission-vision" element={<MissionVision />} />
          <Route path="/know-us/leadership" element={<Navigate to="/about/leadership" replace />} />
          <Route path="/know-us/culture" element={<Culture />} />
          <Route path="/know-us/partnerships" element={<Partnerships />} />
          <Route path="/know-us/awards" element={<Awards />} />

          {/* About Us */}
          <Route path="/about/leadership" element={<Leadership />} />
          <Route path="/about/csr" element={<CSR />} />
          <Route path="/about/careers" element={<Careers />} />
          <Route path="/about/our-offices" element={<OurOffices />} />
          <Route path="/about/company-overview" element={<CompanyOverview />} />
          <Route path="/about/global-presence" element={<GlobalPresence />} />

          {/* Contact */}
          <Route path="/contact" element={<Contact />} />

          {/* Feedback */}
          <Route path="/feedback" element={<Feedback />} />

          {/* Legal */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/terms-of-business" element={<TermsOfBusiness />} />

          {/* Request for Proposal */}
          <Route path="/approval-for-proposal" element={<RequestForProposal />} />

          {/* Hero Card Detail Pages */}
          <Route path="/articles/boardrooms-in-transition" element={<BoardroomsInTransition />} />
          <Route path="/resources/data-governance-rule-6" element={<DataGovernanceRule6 />} />
          <Route path="/technology/investment-opportunities-india" element={<InvestmentOpportunitiesIndia />} />
          <Route path="/sustainability/green-transition" element={<GreenTransition />} />
          <Route path="/digital/digital-twins" element={<DigitalTwins />} />
          <Route path="/regulatory/sebi-draft-circular" element={<SEBIDraftCircular />} />
          <Route path="/regulatory/rbi-cooling-off-period" element={<RBICoolingOffPeriod />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}
