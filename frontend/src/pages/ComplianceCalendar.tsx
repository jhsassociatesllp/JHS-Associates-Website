import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Search, CalendarDays, X, Info } from 'lucide-react'
import { COMPLIANCE } from '../data/complianceCalendar2026'
import type { ComplianceItem, ComplianceMonth } from '../data/complianceCalendar2026'
import { bundledUrl } from '../utils/imageUrl'
import './ComplianceCalendar.css'

const PDF_URL = bundledUrl('Annual-Compliance-Calendar-2026.pdf')

const MONTHS: { key: ComplianceMonth; label: string; full: string }[] = [
  { key: 'Jan', label: 'Jan', full: 'January' }, { key: 'Feb', label: 'Feb', full: 'February' },
  { key: 'Mar', label: 'Mar', full: 'March' }, { key: 'Apr', label: 'Apr', full: 'April' },
  { key: 'May', label: 'May', full: 'May' }, { key: 'Jun', label: 'Jun', full: 'June' },
  { key: 'Jul', label: 'Jul', full: 'July' }, { key: 'Aug', label: 'Aug', full: 'August' },
  { key: 'Sep', label: 'Sep', full: 'September' }, { key: 'Oct', label: 'Oct', full: 'October' },
  { key: 'Nov', label: 'Nov', full: 'November' }, { key: 'Dec', label: 'Dec', full: 'December' },
  { key: 'Event-Based', label: 'Event-based', full: 'Event-based compliances' },
]

/** The acts covered, as listed in the calendar's index. */
const LAWS: Record<string, string> = {
  GST: 'Goods and Service Tax',
  IT: 'Income Tax',
  'Co. Act': 'Company Law (LLP, Nidhi, OPC, Startup) and NFRA',
  FEMA: 'Foreign Exchange Management Act, 1999',
  RBI: 'Reserve Bank of India',
  SEBI: 'Securities Exchange Board of India',
  Labour: 'Labour Codes, 2025',
  SEZ: 'Special Economic Zones Act, 2005',
  'M.RERA': 'MahaRERA',
  STPI: 'Software Technology Parks of India / MeitY',
  FTP: 'Foreign Trade Policy',
  PMLA: 'Prevention of Money Laundering Act, 2002',
  PT: 'Maharashtra Professional Tax Act, 1975',
  TECH: 'Information Technology Act, 2000',
  EP: 'Environment: Extended Producer Responsibility',
  AW: 'Environment: Hazardous Waste / Pollution Control',
  Startup: 'Startup compliances',
}

const lawClass = (law: string) => 'cc-law cc-law--' + law.toLowerCase().replace(/[^a-z]/g, '')

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function dayParts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return { day: String(d).padStart(2, '0'), mon: MONTH_NAMES[m - 1].slice(0, 3), weekday: WEEKDAYS[date.getUTCDay()] }
}

/** "Form – 27C: Declaration by buyer…" → bold title + the rest. */
function splitTitle(text: string): { title: string; rest: string } {
  const i = text.indexOf(': ')
  if (i > 0 && i <= 90) return { title: text.slice(0, i), rest: text.slice(i + 2) }
  return { title: '', rest: text }
}

const todayIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Group { key: string; heading: string; sub?: string; today?: boolean; past?: boolean; items: ComplianceItem[] }

function groupMonth(month: ComplianceMonth, items: ComplianceItem[], today: string): Group[] {
  if (month === 'Event-Based') {
    const byLaw = new Map<string, ComplianceItem[]>()
    items.forEach((it) => byLaw.set(it.law, [...(byLaw.get(it.law) ?? []), it]))
    return [...byLaw.entries()].map(([law, list]) => ({ key: law, heading: LAWS[law] ?? law, sub: `${list.length} item${list.length === 1 ? '' : 's'}`, items: list }))
  }
  const byDay = new Map<string, ComplianceItem[]>()
  const other: ComplianceItem[] = []
  items.forEach((it) => (it.due ? byDay.set(it.due, [...(byDay.get(it.due) ?? []), it]) : other.push(it)))
  const groups: Group[] = [...byDay.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([iso, list]) => {
      const p = dayParts(iso)
      return { key: iso, heading: `${p.day} ${p.mon} 2026`, sub: p.weekday, today: iso === today, past: iso < today, items: list }
    })
  if (other.length) groups.push({ key: 'other', heading: 'Other timelines', sub: 'Not tied to a single date', items: other })
  return groups
}

export default function ComplianceCalendar() {
  const today = useMemo(todayIso, [])
  const [month, setMonth] = useState<ComplianceMonth>(() => {
    const now = new Date()
    return now.getFullYear() === 2026 ? MONTHS[now.getMonth()].key : 'Jan'
  })
  const [law, setLaw] = useState('all')
  const [query, setQuery] = useState('')
  const [showActs, setShowActs] = useState(false)

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  const searching = query.trim().length >= 2
  const q = query.trim().toLowerCase()

  const matches = (it: ComplianceItem) =>
    (law === 'all' || it.law === law) &&
    (!searching || `${it.law} ${LAWS[it.law] ?? ''} ${it.text} ${it.when} ${it.note ?? ''}`.toLowerCase().includes(q))

  /** Sections to show: the chosen month, or every month that has a match while searching. */
  const sections = useMemo(() => {
    const keys = searching ? MONTHS.map((m) => m.key) : [month]
    return keys
      .map((k) => ({ month: k, groups: groupMonth(k, COMPLIANCE[k].filter(matches), today) }))
      .filter((s) => s.groups.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, law, query, today])

  const total = sections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.items.length, 0), 0)
  const monthCount = (k: ComplianceMonth) => COMPLIANCE[k].filter((it) => law === 'all' || it.law === law).length
  const lawsInUse = useMemo(() => {
    const set = new Set<string>()
    Object.values(COMPLIANCE).forEach((list) => list.forEach((it) => set.add(it.law)))
    return [...set].sort((a, b) => Object.keys(LAWS).indexOf(a) - Object.keys(LAWS).indexOf(b))
  }, [])
  const current = MONTHS.find((m) => m.key === month)!

  return (
    <div className="cc-page">
      {/* ════ HERO ════ */}
      <section className="cc-hero">
        <div className="cc-hero__bg" style={{ backgroundImage: `url(${bundledUrl('Compliance-Hero-Bg.webp')})` }} aria-hidden="true" />
        <div className="cc-hero__shade" aria-hidden="true" />
        <div className="cc-hero__inner">
          <span className="cc-hero__eyebrow"><CalendarDays size={15} /> Regulatory Radar</span>
          <h1 className="cc-hero__title">Annual Compliance Calendar 2026</h1>
          <p className="cc-hero__sub">
            Every key statutory deadline from January to December 2026 across GST, Income Tax, Company Law, FEMA, RBI, SEBI, Labour Codes, SEZ and more, in one place.
          </p>
          <div className="cc-hero__actions">
            <a className="cc-btn cc-btn--primary" href={PDF_URL} download>
              <Download size={17} /> Download PDF
            </a>
            <a className="cc-btn cc-btn--ghost" href={PDF_URL} target="_blank" rel="noopener noreferrer">View the original PDF</a>
          </div>
          <div className="cc-hero__stats">
            <div><strong>{Object.values(COMPLIANCE).reduce((n, l) => n + l.length, 0)}</strong><span>compliances</span></div>
            <div><strong>{lawsInUse.length}</strong><span>laws &amp; regulators</span></div>
            <div><strong>12</strong><span>months + event-based</span></div>
          </div>
        </div>
      </section>

      {/* ════ TOOLBAR ════ */}
      <section className="cc-bar">
        <div className="cc-container">
          <div className="cc-search">
            <Search size={17} />
            <input
              type="search" value={query} maxLength={80}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a form or return, e.g. GSTR-3B, TDS, MGT-7…"
              aria-label="Search the compliance calendar"
            />
            {query && (
              <button type="button" className="cc-search__clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>
            )}
          </div>

          <div className="cc-months" role="tablist" aria-label="Month">
            {MONTHS.map((m) => (
              <button
                key={m.key} type="button" role="tab" aria-selected={!searching && month === m.key}
                className={`cc-month${!searching && month === m.key ? ' is-on' : ''}`}
                onClick={() => { setQuery(''); setMonth(m.key) }}
              >
                {m.label}<span>{monthCount(m.key)}</span>
              </button>
            ))}
          </div>

          <div className="cc-laws" aria-label="Filter by law">
            <button type="button" className={`cc-chip${law === 'all' ? ' is-on' : ''}`} onClick={() => setLaw('all')}>All laws</button>
            {lawsInUse.map((l) => (
              <button key={l} type="button" title={LAWS[l] ?? l} className={`cc-chip${law === l ? ' is-on' : ''}`} onClick={() => setLaw(law === l ? 'all' : l)}>{l}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CALENDAR ════ */}
      <section className="cc-content">
        <div className="cc-container">
          <div className="cc-summary">
            <h2>
              {searching ? <>Results for “{query.trim()}”</> : <>{current.full}{month !== 'Event-Based' ? ' 2026' : ''}</>}
            </h2>
            <p>
              <strong>{total}</strong> compliance{total === 1 ? '' : 's'}
              {law !== 'all' && <> under <strong>{law}</strong></>}
            </p>
          </div>

          {total === 0 && (
            <div className="cc-empty">
              <p>No compliances match your search{law !== 'all' ? ` under ${law}` : ''}.</p>
              <button type="button" className="cc-btn cc-btn--primary" onClick={() => { setQuery(''); setLaw('all') }}>Clear filters</button>
            </div>
          )}

          {sections.map((s) => (
            <div key={s.month} className="cc-section">
              {searching && <h3 className="cc-section__title">{MONTHS.find((m) => m.key === s.month)!.full}</h3>}
              {s.groups.map((g) => (
                <div key={g.key} className={`cc-group${g.today ? ' is-today' : ''}${g.past ? ' is-past' : ''}`}>
                  <div className="cc-group__head">
                    {g.key !== 'other' && s.month !== 'Event-Based' ? (
                      <div className="cc-date">
                        <b>{g.heading.split(' ')[0]}</b>
                        <span>{g.heading.split(' ')[1]}</span>
                      </div>
                    ) : null}
                    <div className="cc-group__titles">
                      <h4>{g.key !== 'other' && s.month !== 'Event-Based' ? g.sub : g.heading}</h4>
                      {(g.key === 'other' || s.month === 'Event-Based') && g.sub && <small>{g.sub}</small>}
                    </div>
                    {g.today && <em className="cc-today">Today</em>}
                  </div>
                  <ul className="cc-items">
                    {g.items.map((it, i) => {
                      const { title, rest } = splitTitle(it.text)
                      const showWhen = !it.due && it.when
                      return (
                        <li key={i} className="cc-item">
                          <span className={lawClass(it.law)} title={LAWS[it.law] ?? it.law}>{it.law}</span>
                          <div className="cc-item__body">
                            <p>{title && <strong>{title}</strong>}{title ? ': ' : ''}{rest}</p>
                            {showWhen && <span className="cc-when">{it.when}</span>}
                            {it.note && <span className="cc-note"><Info size={13} /> {it.note}</span>}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          {/* Acts included + disclaimer */}
          <div className="cc-acts">
            <button type="button" className="cc-acts__toggle" onClick={() => setShowActs((v) => !v)} aria-expanded={showActs}>
              Acts included in this calendar <span>{showActs ? '−' : '+'}</span>
            </button>
            {showActs && (
              <dl className="cc-acts__list">
                {lawsInUse.map((l) => (
                  <div key={l}><dt><span className={lawClass(l)}>{l}</span></dt><dd>{LAWS[l] ?? l}</dd></div>
                ))}
              </dl>
            )}
          </div>

          <div className="cc-disclaimer">
            <h3>Disclaimer</h3>
            <p>
              This compliance calendar has been prepared to apprise you of the key statutory deadlines under income tax, indirect tax and other applicable corporate laws. It is prepared with due care and research from publicly available sources. It is not advice or a substitute for advice: each client's circumstances, facts and case are unique and may require study of law and detailed examination of facts. Due dates are often extended, so please check the latest notifications before acting.
            </p>
            <p>
              For help with any of these compliances, <Link to="/contact">contact JHS</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
