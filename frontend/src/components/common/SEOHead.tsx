import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { SEO_META, DEFAULT_META, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '../../data/seoMeta'

export default function SEOHead() {
  const { pathname } = useLocation()

  const meta =
    SEO_META[pathname] ??
    (pathname.startsWith('/case-studies/')
      ? { title: `Case Study | ${SITE_NAME}`, description: 'A client case study showcasing the impact of JHS & Associates advisory work.' }
      : DEFAULT_META)

  const canonicalUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </Helmet>
  )
}
