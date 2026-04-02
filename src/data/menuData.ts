export interface MenuItem {
  name: string
  href?: string
  children?: MenuItem[]
}

export interface MenuSection {
  title: string
  items: string[]
}

export const menuData: MenuItem[] = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'Insights',
    href: '/insights',
    children: [
      { name: 'Resources', href: '/insights/resources' },
      { name: 'Articles', href: '/insights/articles' },
      { name: 'Case Studies', href: '/insights/case-studies' },
      { name: 'Thought Leadership', href: '/insights/thought-leadership' }
    ]
  },
  {
    name: 'Services',
    href: '/services',
    children: [
      {
        name: 'India',
        href: '/services/india',
        children: [
          { name: 'Outsourcing', href: '/services/india/outsourcing' },
          { name: 'Consulting', href: '/services/india/consulting' },
          { name: 'Taxation', href: '/services/india/taxation' },
          { name: 'Assurance', href: '/services/india/assurance' }
        ]
      },
      {
        name: 'Global',
        href: '/services/global',
        children: [
          { name: 'Assurance', href: '/services/global/assurance' },
          { name: 'Taxation', href: '/services/global/taxation' },
          { name: 'Single Window Assistance', href: '/services/global/single-window-assistance' },
          { name: 'Consulting', href: '/services/global/consulting' },
          { name: 'SOC Attestation', href: '/services/global/soc-attestation' },
          { name: 'Outsourcing', href: '/services/global/outsourcing' }
        ]
      }
    ]
  },
  {
    name: 'Sectors',
    href: '/sectors',
    children: [
      {
        name: 'Financial Services',
        href: '/sectors/financial-services',
        children: [
          { name: 'Banking', href: '/sectors/financial-services/banking' },
          { name: 'Broking', href: '/sectors/financial-services/broking' },
          { name: 'Mutual Funds', href: '/sectors/financial-services/mutual-funds' },
          { name: 'Family-Oriented Businesses', href: '/sectors/financial-services/family-oriented-businesses' },
          { name: 'Insurance', href: '/sectors/financial-services/insurance' },
          { name: 'Digital Currency', href: '/sectors/financial-services/digital-currency' },
          { name: 'NBFC', href: '/sectors/financial-services/nbfc' },
          { name: 'Portfolio Management', href: '/sectors/financial-services/portfolio-management' },
          { name: 'Venture Capital', href: '/sectors/financial-services/venture-capital' }
        ]
      },
      {
        name: 'Consumer',
        href: '/sectors/consumer',
        children: [
          { name: 'Housing', href: '/sectors/consumer/housing' },
          { name: 'Gems & Jewellery', href: '/sectors/consumer/gems-jewellery' },
          { name: 'Real Estate', href: '/sectors/consumer/real-estate' },
          { name: 'Retail', href: '/sectors/consumer/retail' },
          { name: 'Oil & Gas Industry', href: '/sectors/consumer/oil-gas-industry' },
          { name: 'FMCG', href: '/sectors/consumer/fmcg' },
          { name: 'Commodity', href: '/sectors/consumer/commodity' }
        ]
      },
      {
        name: 'Media & Technology',
        href: '/sectors/media-technology',
        children: [
          { name: 'Media', href: '/sectors/media-technology/media' },
          { name: 'IT System Audit', href: '/sectors/media-technology/it-system-audit' },
          { name: 'IT / ITeS', href: '/sectors/media-technology/it-ites' }
        ]
      },
      {
        name: 'Other',
        href: '/sectors/other',
        children: [
          { name: 'Healthcare', href: '/sectors/other/healthcare' },
          { name: 'Construction', href: '/sectors/other/construction' },
          { name: 'NGO', href: '/sectors/other/ngo' },
          { name: 'Manufacturing', href: '/sectors/other/manufacturing' }
        ]
      }
    ]
  },
  {
    name: 'About Us',
    href: '/about',
    children: [
      { name: 'Our Story', href: '/about/our-story' },
      { name: 'Leadership', href: '/about/leadership' },
      { name: 'Awards', href: '/about/awards' },
      { name: 'CSR', href: '/about/csr' },
      { name: 'Careers', href: '/about/careers' }
    ]
  }
]

export const flattenMenuItems = (items: MenuItem[]): MenuItem[] => {
  const result: MenuItem[] = []
  
  const traverse = (items: MenuItem[], parentPath: string[] = []) => {
    items.forEach(item => {
      if (item.href) {
        result.push({
          ...item,
          name: item.name,
          href: item.href,
          parentPath
        })
      }
      
      if (item.children) {
        traverse(item.children, [...parentPath, item.name])
      }
    })
  }
  
  traverse(items)
  return result
}
