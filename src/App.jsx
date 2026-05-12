import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { annotate } from 'rough-notation'
import shymenLogo from './assets/shymen-logo.jpeg'

gsap.registerPlugin(ScrollTrigger)

/* ─── CONSTANTS ─────────────────────────────────────────────────────────────── */
const C = {
  blue:      '#3552FC',
  blueDim:   'rgba(53,82,252,0.22)',
  blueGlow:  'rgba(53,82,252,0.45)',
  purple:    '#8b5cf6',
  purpleDim: 'rgba(139,92,246,0.28)',
  muted:     '#505568',
  text:      'rgba(255,255,255,0.65)',
  // Section backgrounds — clearly distinct
  bg0: '#04050a',   // hero / contact
  bg1: '#070914',   // events
  bg2: '#0c0e1e',   // releases  (blue tint)
  bg3: '#090b16',   // members
  bg4: '#0f0c1e',   // gallery preview (purple tint)
  bg5: '#080a12',   // footer
}

/* ─── TRANSLATIONS ──────────────────────────────────────────────────────────── */
const STRINGS = {
  FR: {
    hero_cta1:      "Prochaines soirées",
    hero_cta2:      "Dernières sorties",
    scroll:         "Défiler",
    ev_label:       "À venir",
    ev_title:       "Prochaines soirées",
    ev_tickets:     "Billets ↗",
    ev_info:        "Info",
    rel_label:      "Discographie",
    rel_title:      "Dernières sorties",
    rel_listen:     "▶ Écouter sur SoundCloud",
    mem_label:      "L'équipe",
    mem_title:      "Shymen Records",
    mem_about:      "Shymen Records est un collectif parisien passionné de musique. Avant tout une bande de potes animés par une seule envie : faire vibrer la salle et passer des nuits qui comptent.",
    mem_soundcloud: "SoundCloud",
    mem_contact:    "Contact",
    gal_label:      "Archives",
    gal_title:      "Souvenirs.",
    gal_cta:        "Voir toutes les photos →",
    gal_back:       "← Retour",
    bk_label:       "Booking",
    bk_title:       "Nous booker",
    bk_body:        "Vous souhaitez amener l'expérience Shymen Records dans votre club, festival ou rave ? On est basés à Paris et on tourne partout dans le monde.",
    bk_cta1:        "Nous booker",
    bk_cta2:        "Dossier de presse",
    footer:         "© 2026 Shymen Records",
  },
  EN: {
    hero_cta1:      "Next shows",
    hero_cta2:      "Latest releases",
    scroll:         "Scroll",
    ev_label:       "Upcoming",
    ev_title:       "Upcoming shows",
    ev_tickets:     "Tickets ↗",
    ev_info:        "Info",
    rel_label:      "Discography",
    rel_title:      "Latest Releases",
    rel_listen:     "▶ Listen on SoundCloud",
    mem_label:      "The Crew",
    mem_title:      "Shymen Records",
    mem_about:      "Shymen Records is a Parisian music collective. First and foremost a crew of friends driven by one thing: making rooms move and creating nights worth remembering.",
    mem_soundcloud: "SoundCloud",
    mem_contact:    "Contact",
    gal_label:      "Archive",
    gal_title:      "Souvenirs.",
    gal_cta:        "View all photos →",
    gal_back:       "← Back",
    bk_label:       "Booking",
    bk_title:       "Book Us",
    bk_body:        "Looking to bring the Shymen Records experience to your club, festival, or rave? We're based in Paris and touring worldwide.",
    bk_cta1:        "Book Us",
    bk_cta2:        "Download Press Kit",
    footer:         "© 2026 Shymen Records",
  },
}

/* ─── LANGUAGE CONTEXT ──────────────────────────────────────────────────────── */
const LangCtx = createContext({ t: k => k, lang: 'FR', toggle: () => {} })

function LangProvider({ children }) {
  const [lang, setLang] = useState('FR')
  const t = key => STRINGS[lang][key] ?? key
  return (
    <LangCtx.Provider value={{ t, lang, toggle: () => setLang(l => l === 'FR' ? 'EN' : 'FR') }}>
      {children}
    </LangCtx.Provider>
  )
}

const useLang = () => useContext(LangCtx)

/* ─── FIXED UI CHROME ───────────────────────────────────────────────────────── */
function LangToggle() {
  const { lang, toggle } = useLang()
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08, boxShadow: `0 0 20px ${C.blueGlow}` }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed', top: 22, right: 22, zIndex: 200,
        borderRadius: 999, padding: '8px 18px',
        border: `1.5px solid ${C.blue}`,
        background: 'rgba(4,5,10,0.88)',
        backdropFilter: 'blur(12px)',
        color: '#fff', cursor: 'pointer', outline: 'none',
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6,
      }}
    >
      <span style={{ color: C.blue }}>{lang}</span>
      <span style={{ color: C.muted, fontSize: '0.6rem' }}>›</span>
      <span style={{ color: C.muted }}>{lang === 'FR' ? 'EN' : 'FR'}</span>
    </motion.button>
  )
}

/* ─── DATA ──────────────────────────────────────────────────────────────────── */
const MEMBERS = [
  { name: "Flèche",     role: "DJ",             sc: true  },
  { name: "K'gnard",    role: "DJ & Producer",  sc: true  },
  { name: "Jeff Pesos", role: "DJ",             sc: true  },
  { name: "Youpi",      role: "DJ",             sc: true  },
  { name: "K'rcher",   role: "DJ",             sc: true  },
  { name: "Haled",      role: "DJ",             sc: true  },
  { name: "Padrino",    role: "DJ",             sc: true  },
  { name: "Jee",        role: "DJ",             sc: true  },
  { name: "Choco",      role: "DJ",             sc: true  },
  { name: "BouBou",     role: "Producer",       sc: true  },
  { name: "Capu",       role: "Comms",          sc: false },
]

const EVENTS = [
  { id: 1, date: "SAT · 24 MAY 2026", name: "INFINITE VOLTAGE",     venue: "Warehouse 23",     city: "Paris", lineup: ["Flèche b2b K'gnard", "Jeff Pesos", "BouBou"],           tags: ["All night", "Indoor"]    },
  { id: 2, date: "FRI · 13 JUN 2026", name: "ACID FREQUENCIES",     venue: "Le Bataclan",       city: "Paris", lineup: ["Youpi", "K'rcher b2b Haled", "Padrino"],                 tags: ["All night", "Techno"]    },
  { id: 3, date: "SAT · 5 JUL 2026",  name: "SUMMER RAVE OPEN AIR", venue: "Bois de Vincennes", city: "Paris", lineup: ["Flèche", "Jee · Choco", "K'gnard b2b BouBou"],           tags: ["Open air", "Hard House"] },
]

const RELEASES = [
  { id: 1, title: "Flux Absolu",      artist: "K'gnard",          year: "2026", bpm: "148 BPM" },
  { id: 2, title: "Pressure Drop",    artist: "BouBou",           year: "2025", bpm: "145 BPM" },
  { id: 3, title: "Maldito Groove",   artist: "Flèche",           year: "2025", bpm: "152 BPM" },
  { id: 4, title: "Overdrive EP",     artist: "K'gnard & BouBou", year: "2025", bpm: "150 BPM" },
  { id: 5, title: "Acid Rain Vol. 2", artist: "Jeff Pesos",       year: "2024", bpm: "147 BPM" },
  { id: 6, title: "Circuit Breaker",  artist: "Padrino",          year: "2024", bpm: "144 BPM" },
]

export const PAST_EVENTS = [
  { id: 1, name: "MIDNIGHT SURGE",    date: "Dec 2024" },
  { id: 2, name: "HARD BOUNCE VOL.3", date: "Oct 2024" },
  { id: 3, name: "TRANCE ODYSSEY",    date: "Aug 2024" },
  { id: 4, name: "UNDERGROUND RAVE",  date: "Jun 2024" },
  { id: 5, name: "ACID NIGHTS",       date: "Apr 2024" },
  { id: 6, name: "ELECTRIC CHURCH",   date: "Feb 2024" },
  { id: 7, name: "BOUNCE FACTORY",    date: "Jan 2024" },
  { id: 8, name: "HYPERDRIVE",        date: "Nov 2023" },
  { id: 9, name: "NEON CATHEDRAL",    date: "Sep 2023" },
]

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────────── */
function RoundedBtn({ children, filled = false, onClick, href, style = {} }) {
  const base = {
    borderRadius: 999, padding: '12px 28px',
    border: `1.5px solid ${C.blue}`,
    background: filled ? C.blue : 'transparent',
    color: '#fff', cursor: 'pointer',
    fontFamily: '"Space Grotesk", sans-serif',
    fontSize: '0.78rem', letterSpacing: '0.12em',
    textTransform: 'uppercase', fontWeight: 700,
    outline: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
    textDecoration: 'none', transition: 'box-shadow 0.3s',
    ...style,
  }
  if (href) {
    return (
      <motion.a href={href} whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${C.blueGlow}` }} whileTap={{ scale: 0.97 }} style={base}>
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button onClick={onClick || (() => {})} whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${C.blueGlow}` }} whileTap={{ scale: 0.97 }} style={base}>
      {children}
    </motion.button>
  )
}

function Pill({ children, color = C.blue }) {
  const isPurple = color === C.purple
  return (
    <span style={{
      borderRadius: 999, padding: '4px 12px',
      background: isPurple ? 'rgba(139,92,246,0.1)' : 'rgba(53,82,252,0.1)',
      border: `1px solid ${isPurple ? 'rgba(139,92,246,0.28)' : 'rgba(53,82,252,0.28)'}`,
      color, fontSize: '0.68rem', letterSpacing: '0.1em',
      textTransform: 'uppercase', fontWeight: 700,
      fontFamily: '"Space Grotesk", sans-serif', whiteSpace: 'nowrap',
    }}>{children}</span>
  )
}

function FadeUp({ children, delay = 0, y = 36, style = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ tKey }) {
  const { t } = useLang()
  return (
    <p style={{ color: C.blue, fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, marginBottom: '0.9rem' }}>
      — {t(tKey)}
    </p>
  )
}

function SectionHeading({ tKey, children }) {
  const { t } = useLang()
  return (
    <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 800, color: '#fff', margin: '0 0 1.1rem 0', letterSpacing: '-0.025em', lineHeight: 1.05 }}>
      {tKey ? t(tKey) : children}
    </h2>
  )
}

function ScrollLine({ color = C.blue, width = 130, glow, center = false }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    gsap.set(ref.current, { scaleX: 0, transformOrigin: center ? 'center center' : 'left center' })
    const trig = ScrollTrigger.create({
      trigger: ref.current, start: 'top 78%',
      onEnter: () => gsap.to(ref.current, { scaleX: 1, duration: 1.1, ease: 'power3.out' }),
    })
    return () => trig.kill()
  }, [])
  return (
    <div ref={ref} style={{ height: 2, width, background: color, borderRadius: 2, boxShadow: glow ? `0 0 12px ${glow}` : `0 0 10px ${C.blueGlow}`, marginBottom: '2.8rem', ...(center ? { margin: '0 auto 2.8rem auto' } : {}) }} />
  )
}

/* ─── LOGO LINES LAYER — 8 interweaving zigzags ─────────────────────────────── */
function LogoLinesLayer({ pageH }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current || pageH === 0) return
    const paths = Array.from(svgRef.current.querySelectorAll('.lp'))
    const triggers = []
    paths.forEach((path, i) => {
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      triggers.push(ScrollTrigger.create({
        trigger: 'body', start: `${1.5 + i * 0.6}% top`, end: '88% top', scrub: 2 + i * 0.15,
        onUpdate: self => gsap.set(path, { strokeDashoffset: len * (1 - self.progress) }),
      }))
    })
    return () => triggers.forEach(t => t.kill())
  }, [pageH])

  if (pageH === 0) return null
  const W = 1440, H = pageH

  const mkZig = (goRight, margin, sy, dy = 0) => {
    const L = margin, R = W - margin
    const anchors = [0.130, 0.260, 0.390, 0.520, 0.650, 0.780, 0.920].map(p => H * (p + dy))
    const xs = goRight ? [R, L, R, L, R, L, R] : [L, R, L, R, L, R, L]
    let d = `M 720 ${sy}`
    anchors.forEach((y, i) => {
      const px = i === 0 ? 720 : xs[i - 1]
      const py = i === 0 ? sy  : anchors[i - 1]
      const x  = xs[i], mid = (py + y) / 2
      d += ` C ${px} ${mid} ${x} ${mid} ${x} ${y}`
    })
    return d
  }

  const LINES = [
    [3.5, 0.90, C.blue,   true,  22,  355,  0.000],
    [2.5, 0.65, C.blue,   true,  55,  372,  0.010],
    [1.8, 0.38, C.blue,   true,  88,  389,  0.020],
    [1.0, 0.20, C.blue,   true,  14,  406, -0.008],
    [3.0, 0.70, C.purple, false, 28,  363,  0.005],
    [2.0, 0.45, C.purple, false, 62,  380,  0.015],
    [1.4, 0.25, C.purple, false, 96,  397,  0.025],
    [0.8, 0.14, C.purple, false, 18,  414, -0.004],
  ]

  return (
    <svg ref={svgRef} aria-hidden="true"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}
      viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
    >
      <defs>
        <filter id="glow-strong" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {LINES.map(([sw, op, color, goRight, margin, sy, dy], i) => (
        <path key={i} className="lp" d={mkZig(goRight, margin, sy, dy)}
          fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          opacity={op} filter={sw >= 2 ? 'url(#glow-strong)' : 'url(#glow-soft)'} />
      ))}
    </svg>
  )
}

/* ─── HERO ──────────────────────────────────────────────────────────────────── */
function HeroSection() {
  const { t } = useLang()
  const { scrollY } = useScroll()
  const logoScale   = useTransform(scrollY, [0, 500], [1, 0.65])
  const logoOpacity = useTransform(scrollY, [0, 450], [1, 0])
  const wrapY       = useTransform(scrollY, [0, 500], [0, -70])
  const glowRef     = useRef(null)

  useEffect(() => {
    if (!glowRef.current) return
    gsap.to(glowRef.current, { scale: 1.2, opacity: 0.75, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  }, [])

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }
  const item    = { hidden: { opacity: 0, y: 44 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 2rem', overflow: 'hidden', background: C.bg0 }}>
      <div ref={glowRef} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${C.blueGlow} 0%, transparent 68%)`, opacity: 0.35, pointerEvents: 'none' }} />

      <motion.div style={{ y: wrapY, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.8rem', position: 'relative', zIndex: 2 }}
        variants={stagger} initial="hidden" animate="visible"
      >
        {/* Logo */}
        <motion.div style={{ scale: logoScale, opacity: logoOpacity }} variants={item}>
          <motion.img src={shymenLogo} alt="Shymen Records"
            animate={{ rotate: [0, 1.2, -1.2, 0], y: [0, -10, 0] }}
            transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
            style={{ width: 'clamp(180px, 30vw, 360px)', height: 'auto', borderRadius: 20, filter: `drop-shadow(0 0 50px ${C.blueGlow}) drop-shadow(0 0 100px rgba(53,82,252,0.18))` }}
          />
        </motion.div>

        {/* Big name */}
        <motion.div variants={item} style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(2.4rem, 7vw, 6rem)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.03em', lineHeight: 1, textTransform: 'uppercase' }}>
            Shymen Records
          </h1>
        </motion.div>

        {/* Genre pills */}
        <motion.div variants={item} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Hard House', 'Trance', 'Hard Bounce', 'Techno'].map(g => <Pill key={g}>{g}</Pill>)}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <RoundedBtn filled onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}>
            {t('hero_cta1')}
          </RoundedBtn>
          <RoundedBtn onClick={() => document.getElementById('releases')?.scrollIntoView({ behavior: 'smooth' })}>
            {t('hero_cta2')}
          </RoundedBtn>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ color: C.muted, fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: '"Space Grotesk", sans-serif' }}>{t('scroll')}</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${C.blue}, transparent)` }} />
      </motion.div>
    </section>
  )
}

/* ─── UPCOMING SHOWS ─────────────────────────────────────────────────────────── */
function UpcomingEventsSection() {
  return (
    <section id="events" style={{ padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 7vw, 7rem)', position: 'relative', background: C.bg1 }}>
      <FadeUp>
        <SectionLabel tKey="ev_label" />
        <SectionHeading tKey="ev_title" />
        <ScrollLine />
      </FadeUp>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {EVENTS.map((ev, i) => <FadeUp key={ev.id} delay={i * 0.09}><EventCard event={ev} /></FadeUp>)}
      </div>
    </section>
  )
}

function EventCard({ event }) {
  const { t } = useLang()
  return (
    <motion.div whileHover={{ borderColor: C.blue, backgroundColor: 'rgba(53,82,252,0.04)', boxShadow: `0 0 40px rgba(53,82,252,0.08)` }}
      style={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.07)', padding: 'clamp(1.2rem, 2.5vw, 1.8rem)', background: 'rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.2rem', alignItems: 'center', transition: 'border-color 0.35s, background-color 0.35s, box-shadow 0.35s' }}
    >
      <div>
        <p style={{ color: C.blue, fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, marginBottom: '0.35rem' }}>{event.date}</p>
        <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(1.15rem, 2.8vw, 1.9rem)', fontWeight: 800, color: '#fff', margin: '0 0 0.35rem 0', letterSpacing: '-0.015em' }}>{event.name}</h3>
        <p style={{ color: C.muted, fontSize: '0.83rem', margin: '0 0 0.7rem 0', fontFamily: 'Inter, sans-serif' }}>{event.venue} · {event.city}</p>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.7rem' }}>{event.tags.map(tag => <Pill key={tag}>{tag}</Pill>)}</div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: 0, fontFamily: 'Inter, sans-serif' }}>{event.lineup.join(' · ')}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', alignItems: 'flex-end' }}>
        <RoundedBtn filled style={{ fontSize: '0.7rem', padding: '9px 18px' }}>{t('ev_tickets')}</RoundedBtn>
        <RoundedBtn style={{ fontSize: '0.7rem', padding: '9px 18px' }}>{t('ev_info')}</RoundedBtn>
      </div>
    </motion.div>
  )
}

/* ─── RELEASES ──────────────────────────────────────────────────────────────── */
function ReleasesSection() {
  return (
    <section id="releases" style={{ padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 7vw, 7rem)', position: 'relative', background: C.bg2 }}>
      <FadeUp>
        <SectionLabel tKey="rel_label" />
        <SectionHeading tKey="rel_title" />
        <ScrollLine color={`linear-gradient(to right, ${C.purple}, ${C.blue})`} glow={C.purpleDim} />
      </FadeUp>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {RELEASES.map((r, i) => <FadeUp key={r.id} delay={i * 0.07}><ReleaseCard release={r} /></FadeUp>)}
      </div>
    </section>
  )
}

function ReleaseCard({ release }) {
  const { t } = useLang()
  return (
    <motion.div whileHover={{ scale: 1.02, boxShadow: `0 20px 60px rgba(53,82,252,0.18)` }}
      style={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.055)', background: 'rgba(0,0,0,0.3)', overflow: 'hidden', cursor: 'default' }}>
      <div style={{ height: 170, background: `linear-gradient(135deg, rgba(53,82,252,0.18) 0%, rgba(139,92,246,0.08) 60%, transparent 100%)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{ width: 64, height: 64, borderRadius: '50%', border: `1px solid rgba(53,82,252,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.blue, boxShadow: `0 0 16px ${C.blueGlow}` }} />
        </motion.div>
        <span style={{ position: 'absolute', top: 10, right: 12, background: 'rgba(0,0,0,0.55)', borderRadius: 999, padding: '3px 10px', fontSize: '0.62rem', color: C.muted, fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '0.08em' }}>{release.bpm}</span>
      </div>
      <div style={{ padding: '1.15rem 1.35rem' }}>
        <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 0.22rem 0', letterSpacing: '-0.01em' }}>{release.title}</h3>
        <p style={{ color: C.muted, fontSize: '0.8rem', margin: '0 0 1rem 0', fontFamily: 'Inter, sans-serif' }}>{release.artist} · Shymen Records · {release.year}</p>
        <RoundedBtn style={{ width: '100%', justifyContent: 'center', fontSize: '0.7rem', padding: '9px 14px' }}>{t('rel_listen')}</RoundedBtn>
      </div>
    </motion.div>
  )
}

/* ─── MEMBERS ───────────────────────────────────────────────────────────────── */
function MembersSection() {
  const { t } = useLang()

  return (
    <section id="members" style={{ padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 7vw, 7rem)', position: 'relative', background: C.bg3 }}>
      <FadeUp>
        <SectionLabel tKey="mem_label" />
        <SectionHeading tKey="mem_title" />
        <ScrollLine />
      </FadeUp>

      <FadeUp delay={0.1} style={{ maxWidth: 640, marginBottom: '3.5rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)', lineHeight: 1.82, color: C.text }}>
          {t('mem_about')}
        </p>
      </FadeUp>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(188px, 1fr))', gap: '0.9rem' }}>
        {MEMBERS.map((m, i) => <FadeUp key={m.name} delay={i * 0.055}><MemberCard member={m} /></FadeUp>)}
      </div>
    </section>
  )
}

function MemberCard({ member }) {
  const { t } = useLang()
  const initials = member.name.replace(/'/g, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <motion.div whileHover={{ y: -7, borderColor: C.blue, boxShadow: `0 18px 44px rgba(53,82,252,0.18)` }}
      style={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '1.4rem 1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center', transition: 'border-color 0.3s, box-shadow 0.3s' }}>
      <div className={`member-avatar member-${member.name.toLowerCase().replace(/[^a-z]/g, '-')}`}
        style={{ width: 76, height: 76, borderRadius: '50%', background: `linear-gradient(135deg, rgba(53,82,252,0.28), rgba(139,92,246,0.16))`, border: `2px solid rgba(53,82,252,0.28)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.25rem', fontWeight: 800, color: C.blue }}>
        {initials}
      </div>
      <div>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.98rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem 0' }}>{member.name}</p>
        <Pill color={member.sc ? C.blue : C.purple}>{member.role}</Pill>
      </div>
      <RoundedBtn style={{ fontSize: '0.63rem', padding: '7px 14px', width: '100%', justifyContent: 'center', ...(member.sc ? {} : { borderColor: C.purple, color: C.purple }) }}>
        {member.sc ? t('mem_soundcloud') : t('mem_contact')}
      </RoundedBtn>
    </motion.div>
  )
}

/* ─── GALLERY PREVIEW (home page section) ───────────────────────────────────── */
function GalleryPreviewSection() {
  const { t } = useLang()
  const gridRef = useRef(null)

  useEffect(() => {
    if (!gridRef.current) return
    const items = gridRef.current.querySelectorAll('.gitem')
    const triggers = []
    items.forEach((el, i) => {
      const dir = i % 2 === 0 ? -24 : 24
      gsap.set(el, { y: dir })
      triggers.push(ScrollTrigger.create({
        trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.8,
        onUpdate: s => gsap.set(el, { y: dir - dir * 2 * s.progress }),
      }))
    })
    return () => triggers.forEach(t => t.kill())
  }, [])

  // show only first 6 as preview
  const preview = PAST_EVENTS.slice(0, 6)

  return (
    <section id="gallery" style={{ padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 7vw, 7rem)', position: 'relative', background: C.bg4 }}>
      <FadeUp>
        <SectionLabel tKey="gal_label" />
        <SectionHeading tKey="gal_title" />
        <ScrollLine color={`linear-gradient(to right, ${C.purple}, transparent)`} glow={C.purpleDim} />
      </FadeUp>

      <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.9rem', marginBottom: '2.5rem' }}>
        {preview.map((ev, i) => (
          <FadeUp key={ev.id} delay={i * 0.07}>
            <GalleryThumb event={ev} large={i === 0 || i === 3} />
          </FadeUp>
        ))}
      </div>

      <FadeUp style={{ display: 'flex', justifyContent: 'center' }}>
        <Link to="/gallery" style={{ textDecoration: 'none' }}>
          <RoundedBtn filled>{t('gal_cta')}</RoundedBtn>
        </Link>
      </FadeUp>
    </section>
  )
}

function GalleryThumb({ event, large }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div className="gitem"
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      style={{ gridColumn: large ? 'span 2' : 'span 1', borderRadius: 22, overflow: 'hidden', position: 'relative', aspectRatio: large ? '16/7' : '1/1', background: `linear-gradient(135deg, rgba(53,82,252,0.12) 0%, rgba(139,92,246,0.08) 100%)`, border: '1px solid rgba(255,255,255,0.05)', cursor: 'default' }}>
      <div className={`gallery-photo gallery-photo-${event.id}`} style={{ position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <motion.div animate={{ opacity: hovered ? 0 : 1 }} style={{ position: 'absolute', bottom: 12, left: 14 }}>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)', margin: 0 }}>{event.name} · {event.date}</p>
      </motion.div>
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.25 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(4,5,10,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(0.95rem, 2vw, 1.35rem)', fontWeight: 800, color: '#fff', margin: 0 }}>{event.name}</p>
        <Pill>{event.date}</Pill>
      </motion.div>
    </motion.div>
  )
}

/* ─── GALLERY FULL PAGE (sub-page) ──────────────────────────────────────────── */
function GalleryPage() {
  const { t } = useLang()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ minHeight: '100vh', background: C.bg0, padding: 'clamp(5rem, 8vw, 7rem) clamp(1.5rem, 6vw, 6rem)' }}>
      {/* Back link */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        style={{ marginBottom: '3rem' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <RoundedBtn style={{ fontSize: '0.75rem', padding: '9px 20px' }}>{t('gal_back')}</RoundedBtn>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <p style={{ color: C.blue, fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, marginBottom: '0.9rem' }}>
          — {t('gal_label')}
        </p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>
          {t('gal_title')}
        </h1>
        <div style={{ height: 2, width: 100, background: `linear-gradient(to right, ${C.purple}, ${C.blue})`, borderRadius: 2, boxShadow: `0 0 12px ${C.blueGlow}`, marginBottom: '3rem' }} />
      </motion.div>

      {/* Full photo grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {PAST_EVENTS.map((ev, i) => (
          <motion.div key={ev.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <FullGalleryCard event={ev} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function FullGalleryCard({ event }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02, boxShadow: `0 20px 50px rgba(53,82,252,0.2)` }}
      style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', aspectRatio: '4/3', background: `linear-gradient(135deg, rgba(53,82,252,0.15) 0%, rgba(139,92,246,0.08) 100%)`, border: '1px solid rgba(255,255,255,0.06)', cursor: 'default' }}
    >
      {/* Drop your photo here — class: gallery-photo-{id} */}
      <div
        className={`gallery-photo gallery-photo-${event.id}`}
        style={{ position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {/* Placeholder icon */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.15 }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.25 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(4,5,10,0.78)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, textAlign: 'center', padding: '0 1rem' }}>{event.name}</p>
        <Pill>{event.date}</Pill>
      </motion.div>
      {/* Always-visible label */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1rem 0.8rem', background: 'linear-gradient(to top, rgba(4,5,10,0.9), transparent)' }}>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#fff', margin: 0 }}>{event.name}</p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: C.muted, margin: '2px 0 0 0' }}>{event.date}</p>
      </div>
    </motion.div>
  )
}

/* ─── CONTACT ───────────────────────────────────────────────────────────────── */
function ContactSection() {
  const { t } = useLang()
  const emailRef = useRef(null)

  useEffect(() => {
    if (!emailRef.current) return
    // delay so layout is stable
    const timer = setTimeout(() => {
      const ann = annotate(emailRef.current, { type: 'box', color: C.blue, animationDuration: 900, strokeWidth: 2, padding: 6 })
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { ann.show(); obs.disconnect() }
      }, { threshold: 0.8 })
      obs.observe(emailRef.current)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="contact" style={{ padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 7vw, 7rem)', position: 'relative', textAlign: 'center', background: C.bg0 }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 60%, rgba(53,82,252,0.055) 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <FadeUp>
        <SectionLabel tKey="bk_label" />
        <SectionHeading tKey="bk_title" />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ScrollLine width={80} color={`linear-gradient(to right, transparent, ${C.blue}, transparent)`} center />
        </div>
      </FadeUp>
      <FadeUp delay={0.15} style={{ maxWidth: 520, margin: '0 auto 2.4rem auto' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)', color: C.text, lineHeight: 1.75 }}>{t('bk_body')}</p>
      </FadeUp>
      <FadeUp delay={0.25} style={{ marginBottom: '2.8rem' }}>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 700, color: '#fff' }}>
          <span ref={emailRef}>booking@shymenrecords.com</span>
        </p>
      </FadeUp>
      <FadeUp delay={0.35}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <RoundedBtn filled>{t('bk_cta1')}</RoundedBtn>
          <RoundedBtn>{t('bk_cta2')}</RoundedBtn>
        </div>
      </FadeUp>
    </section>
  )
}

/* ─── FOOTER ────────────────────────────────────────────────────────────────── */
function Footer() {
  const { t } = useLang()
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.055)', padding: '2.2rem clamp(1.5rem, 7vw, 7rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: C.bg5 }}>
      <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.82rem', color: C.muted, margin: 0 }}>{t('footer')}</p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['Instagram', 'SoundCloud', 'Resident Advisor', 'Boiler Room'].map(s => (
          <motion.a key={s} href="#" onClick={e => e.preventDefault()} whileHover={{ borderColor: C.blue, color: '#fff' }}
            style={{ borderRadius: 999, padding: '6px 13px', border: '1px solid rgba(255,255,255,0.12)', color: C.muted, fontSize: '0.68rem', letterSpacing: '0.09em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, transition: 'border-color 0.3s, color 0.3s' }}>
            {s}
          </motion.a>
        ))}
      </div>
    </footer>
  )
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────────── */
function MainPage() {
  const pageRef = useRef(null)
  const [pageH, setPageH] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = t => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const measure = () => { if (pageRef.current) setPageH(pageRef.current.scrollHeight) }
    measure()
    const ro = new ResizeObserver(measure)
    if (pageRef.current) ro.observe(pageRef.current)
    setTimeout(measure, 600)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      ro.disconnect()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div ref={pageRef} style={{ background: C.bg0, minHeight: '100vh', position: 'relative' }}>
      <LogoLinesLayer pageH={pageH} />
      <HeroSection />
      <UpcomingEventsSection />
      <ReleasesSection />
      <MembersSection />
      <GalleryPreviewSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

/* ─── APP ROOT ──────────────────────────────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap'
    document.head.appendChild(link)
  }, [])

  return (
    <LangProvider>
      <HashRouter>
        <LangToggle />
        <Routes>
          <Route path="/"        element={<MainPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </HashRouter>
    </LangProvider>
  )
}
