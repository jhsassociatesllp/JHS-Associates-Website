import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Spotlight from './sections/Spotlight'
import Stats from './sections/Stats'
import Services from './sections/Services'
import Cities from './sections/Cities'
import VisionMission from './sections/VisionMission'
import Insights from './sections/Insights'
// Services pages
import Outsourcing from './components/services/Outsourcing'
import Consulting from './components/services/Consulting'
import Taxation from './components/services/Taxation'
import Assurance from './components/services/Assurance'
import SingleWindowAssistance from './components/services/SingleWindowAssistance'
import SOCAttestation from './components/services/SOCAttestation'

// Financial Services components
import Banking from './components/sectors/Financial Services/Banking'
import MutualFunds from './components/sectors/Financial Services/MutualFunds'
import Broking from './components/sectors/Financial Services/Broking'
import FamilyOrientedBusinesses from './components/sectors/Financial Services/FamilyOrientedBusinesses'
import Insurance from './components/sectors/Financial Services/Insurance'
import DigitalCurrency from './components/sectors/Financial Services/digitalCurrency'
import NBFC from './components/sectors/Financial Services/NBFC'
import PortfolioManagement from './components/sectors/Financial Services/PortfolioManagement'
import VentureCapital from './components/sectors/Financial Services/VentureCapital'

// Consumer components
import Housing from './components/sectors/consumer/Housing'
import GemsAndJewellery from './components/sectors/consumer/GemsAndJewellery'
import RealEstate from './components/sectors/consumer/RealEstate'
import Retail from './components/sectors/consumer/Retail'
import OilAndGasIndustry from './components/sectors/consumer/OilAndGasIndustry'
import FMCG from './components/sectors/consumer/FMCG'
import Commodity from './components/sectors/consumer/Commodity'

// Media & Technology components
import Media from './components/sectors/Media & technology/Media'
import ITSystemAudit from './components/sectors/Media & technology/ITSystemAudit'
import ITTeS from './components/sectors/Media & technology/ITTeS'

// Other components
import HealthCare from './components/sectors/Other/HealthCare'
import Construction from './components/sectors/Other/Construction'
import NGO from './components/sectors/Other/NGO'
import Manufacturing from './components/sectors/Other/Manufacturing'

// Insights components
import Resources from './components/Insights/Resources'
import Articles from './components/Insights/Articles'
import CaseStudies from './components/Insights/CaseStudies'
import ThoughtLeadership from './components/Insights/ThoughtLeadership'
import Blog from './components/Insights/Blog'
import Podcasts from './components/Insights/Podcasts'
import Excellencia from './components/Insights/Excellencia'

// Spotlight pages
import AIAutomation from './components/Spotlight/AIAutomation'
import Alumni from './components/Spotlight/Alumni'
import Solutions from './components/Spotlight/Solutions'

// City pages
import Mumbai from './components/Cities/Mumbai'
import Delhi from './components/Cities/Delhi'
import Bengaluru from './components/Cities/Bengaluru'
import Vadodara from './components/Cities/Vadodara'
import Ahmedabad from './components/Cities/Ahmedabad'
import Hyderabad from './components/Cities/Hyderabad'
import Kolkata from './components/Cities/Kolkata'
import Chennai from './components/Cities/Chennai'

// About pages
import OurStory from './components/About Us/OurStory'
import Leadership from './components/About Us/Partners'
import Awards from './components/About Us/Awards'
import CSR from './components/About Us/CSR'
import Careers from './components/About Us/Careers'
import OurOffices from './components/About Us/OurOffices'
import CompanyOverview from './components/About Us/CompanyOverview'
import GlobalPresence from './components/About Us/GlobalPresence'

// Know Us pages
import MissionVision from './components/About Us/MissionVision'
import Culture from './components/About Us/Culture'
import Partnerships from './components/About Us/Partnerships'

// Contact page
import Contact from './components/Contact'

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
      {/* <Posts />
      <CareerCaseStudy /> */}

    </main>
  )
}

export default function App() {
  useSmoothScroll()
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <Navbar />
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
        <Route path="/city/vadodara" element={<Vadodara />} />
        <Route path="/city/ahmedabad" element={<Ahmedabad />} />
        <Route path="/city/hyderabad" element={<Hyderabad />} />
        <Route path="/city/kolkata" element={<Kolkata />} />
        <Route path="/city/chennai" element={<Chennai />} />

        {/* Services */}
        <Route path="/services/outsourcing" element={<Outsourcing />} />
        <Route path="/services/consulting" element={<Consulting />} />
        <Route path="/services/taxation" element={<Taxation />} />
        <Route path="/services/assurance" element={<Assurance />} />
        <Route path="/services/single-window-assistance" element={<SingleWindowAssistance />} />
        <Route path="/services/soc-attestation" element={<SOCAttestation />} />

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

        {/* Insights — paths must match navbar hrefs exactly */}
        <Route path="/resources" element={<Resources />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/thought-leadership" element={<ThoughtLeadership />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/excellencia" element={<Excellencia />} />

        {/* Know Us */}
        <Route path="/know-us/our-story" element={<OurStory />} />
        <Route path="/know-us/mission-vision" element={<MissionVision />} />
        <Route path="/know-us/leadership" element={<Leadership />} />
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
      </Routes>
      <Footer />
    </>
  )
}