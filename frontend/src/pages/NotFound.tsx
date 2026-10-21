import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import './NotFound.css'

export default function NotFound() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <main className="nf">
      <Helmet>
        <title>Page not found | JHS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="nf__card">
        <span className="nf__code">404</span>
        <h1 className="nf__title">We couldn&apos;t find that page</h1>
        <p className="nf__text">The link may be old or mistyped. Let&apos;s get you back to something useful.</p>
        <div className="nf__actions">
          <Link to="/" className="nf__btn nf__btn--solid">Go to the home page</Link>
          <Link to="/contact" className="nf__btn">Contact us</Link>
        </div>
      </div>
    </main>
  )
}
