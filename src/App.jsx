import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { annotate } from 'rough-notation'

gsap.registerPlugin(ScrollTrigger)

/* ─── CONSTANTS ─────────────────────────────────────────────────────────────── */
const C = {
  blue: '#3552FC',
  blueDim: 'rgba(53,82,252,0.25)',
  blueGlow: 'rgba(53,82,252,0.45)',
  purple: '#8b5cf6',
  purpleDim: 'rgba(139,92,246,0.3)',
  bg: '#04050a',
  surface: '#080a12',
  muted: '#505568',
  text: 'rgba(255,255,255,0.68)',
}

/* ─── TRANSLATIONS ──────────────────────────────────────────────────────────── */
const STRINGS = {
  FR: {
    hero_tagline:   "Haute intensité, inhibitions en berne, toute la nuit.",
    hero_cta1:      "Prochains shows",
    hero_cta2:      "Dernières sorties",
    scroll:         "Défiler",
    ev_label:       "À venir",
    ev_title:       "Prochains raves",
    ev_tickets:     "Billets ↗",
    ev_info:        "Info",
    rel_label:      "Discographie",
    rel_title:      "Dernières sorties",
    rel_listen:     "▶ Écouter sur SoundCloud",
    mem_label:      "L'équipe",
    mem_title:      "Shymen Records",
    mem_p1a:        "Né dans l'underground, Shymen Records est un ",
    mem_collective: "collectif",
    mem_p1b:        " parisien animé par l'amour de la ",
    mem_sep1:       ", de la ",
    mem_sep2:       ", et du ",
    mem_p1c:        ".",
    mem_p2a:        "Des caves moites aux raves en plein air, on pousse l'énergie à son max sans compromis. ",
    mem_underground:"Underground",
    mem_p2b:        " dans l'âme, implacable sur la piste.",
    mem_soundcloud: "SoundCloud",
    mem_contact:    "Contact",
    gal_label:      "Archives",
    gal_title:      "Souvenirs de rave",
    bk_label:       "Booking",
    bk_title:       "Nous booker",
    bk_body:        "Vous souhaitez amener l'expérience Shymen Records dans votre club, festival ou rave ? On est basés à Paris et on tourne partout dans le monde.",
    bk_cta1:        "Nous booker",
    bk_cta2:        "Dossier de presse",
    footer:         "© 2026 Shymen Records",
  },
  EN: {
    hero_tagline:   "High BPM, low inhibitions, all night long.",
    hero_cta1:      "Next shows",
    hero_cta2:      "Latest releases",
    scroll:         "Scroll",
    ev_label:       "Upcoming",
    ev_title:       "Upcoming Raves",
    ev_tickets:     "Tickets ↗",
    ev_info:        "Info",
    rel_label:      "Discography",
    rel_title:      "Latest Releases",
    rel_listen:     "▶ Listen on SoundCloud",
    mem_label:      "The Crew",
    mem_title:      "Shymen Records",
    mem_p1a:        "Born in the underground, Shymen Records is a Parisian ",
    mem_collective: "collective",
    mem_p1b:        " driven by a love for ",
    mem_sep1:       ", ",
    mem_sep2:       ", and ",
    mem_p1c:        ".",
    mem_p2a:        "From sweaty basements to open-air raves, we push peak-time energy with zero compromise. ",
    mem_underground:"Underground",
    mem_p2b:        " at heart, relentless on the floor.",
    mem_soundcloud: "SoundCloud",
    mem_contact:    "Contact",
    gal_label:      "Archive",
    gal_title:      "Rave Memories",
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

/* ─── FIXED LANG TOGGLE ─────────────────────────────────────────────────────── */
function LangToggle() {
  const { lang, toggle } = useLang()
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08, boxShadow: `0 0 20px ${C.blueGlow}` }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed', top: 24, right: 24, zIndex: 100,
        borderRadius: 999, padding: '8px 18px',
        border: `1.5px solid ${C.blue}`,
        background: 'rgba(4,5,10,0.85)',
        backdropFilter: 'blur(12px)',
        color: '#fff',
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '0.72rem', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        cursor: 'pointer', outline: 'none',
        display: 'flex', alignItems: 'center', gap: 6,
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
  { id: 1, date: "SAT · 24 MAY 2026", name: "INFINITE VOLTAGE",    venue: "Warehouse 23",       city: "Paris", lineup: ["Flèche b2b K'gnard", "Jeff Pesos", "BouBou"],           tags: ["All night", "Indoor"] },
  { id: 2, date: "FRI · 13 JUN 2026", name: "ACID FREQUENCIES",    venue: "Le Bataclan",         city: "Paris", lineup: ["Youpi", "K'rcher b2b Haled", "Padrino"],                 tags: ["All night", "Techno"] },
  { id: 3, date: "SAT · 5 JUL 2026",  name: "SUMMER RAVE OPEN AIR",venue: "Bois de Vincennes",   city: "Paris", lineup: ["Flèche", "Jee · Choco", "K'gnard b2b BouBou"],           tags: ["Open air", "Hard House"] },
]

const RELEASES = [
  { id: 1, title: "Flux Absolu",      artist: "K'gnard",          year: "2026", bpm: "148 BPM" },
  { id: 2, title: "Pressure Drop",    artist: "BouBou",           year: "2025", bpm: "145 BPM" },
  { id: 3, title: "Maldito Groove",   artist: "Flèche",           year: "2025", bpm: "152 BPM" },
  { id: 4, title: "Overdrive EP",     artist: "K'gnard & BouBou", year: "2025", bpm: "150 BPM" },
  { id: 5, title: "Acid Rain Vol. 2", artist: "Jeff Pesos",       year: "2024", bpm: "147 BPM" },
  { id: 6, title: "Circuit Breaker",  artist: "Padrino",          year: "2024", bpm: "144 BPM" },
]

const PAST_EVENTS = [
  { id: 1, name: "MIDNIGHT SURGE",    date: "Dec 2024", hue: 230 },
  { id: 2, name: "HARD BOUNCE VOL.3", date: "Oct 2024", hue: 260 },
  { id: 3, name: "TRANCE ODYSSEY",    date: "Aug 2024", hue: 240 },
  { id: 4, name: "UNDERGROUND RAVE",  date: "Jun 2024", hue: 220 },
  { id: 5, name: "ACID NIGHTS",       date: "Apr 2024", hue: 270 },
  { id: 6, name: "ELECTRIC CHURCH",   date: "Feb 2024", hue: 250 },
]

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────────── */
function RoundedBtn({ children, filled = false, onClick = () => {}, style = {} }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${C.blueGlow}` }}
      whileTap={{ scale: 0.97 }}
      style={{
        borderRadius: 999, padding: '12px 28px',
        border: `1.5px solid ${C.blue}`,
        background: filled ? C.blue : 'transparent',
        color: '#fff', cursor: 'pointer',
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '0.78rem', letterSpacing: '0.12em',
        textTransform: 'uppercase', fontWeight: 700,
        outline: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'box-shadow 0.3s',
        ...style,
      }}
    >
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
    <p style={{
      color: C.blue, fontSize: '0.7rem', letterSpacing: '0.22em',
      textTransform: 'uppercase', fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700, marginBottom: '0.9rem',
    }}>
      — {t(tKey)}
    </p>
  )
}

function SectionHeading({ tKey }) {
  const { t } = useLang()
  return (
    <h2 style={{
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: 'clamp(2rem, 5vw, 3.8rem)',
      fontWeight: 800, color: '#fff',
      margin: '0 0 1.1rem 0',
      letterSpacing: '-0.025em', lineHeight: 1.05,
    }}>
      {t(tKey)}
    </h2>
  )
}

function ScrollLine({ color = C.blue, width = 130, glow }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    gsap.set(ref.current, { scaleX: 0, transformOrigin: 'left center' })
    const trig = ScrollTrigger.create({
      trigger: ref.current, start: 'top 78%',
      onEnter: () => gsap.to(ref.current, { scaleX: 1, duration: 1.1, ease: 'power3.out' }),
    })
    return () => trig.kill()
  }, [])
  return (
    <div ref={ref} style={{
      height: 2, width,
      background: color,
      borderRadius: 2,
      boxShadow: glow ? `0 0 12px ${glow}` : `0 0 10px ${C.blueGlow}`,
      marginBottom: '2.8rem',
    }} />
  )
}

function Mark({ children, type = 'underline', color = C.blue, elRef }) {
  const ref = elRef || useRef(null)
  const annRef = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    annRef.current = annotate(ref.current, { type, color, animationDuration: 900, strokeWidth: 2, padding: 3 })
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { annRef.current?.show(); obs.disconnect() }
    }, { threshold: 0.6 })
    obs.observe(ref.current)
    return () => { annRef.current?.remove(); obs.disconnect() }
  }, [])
  return <span ref={ref} style={{ display: 'inline' }}>{children}</span>
}

/* ─── LOGO LINES LAYER — dramatic full-width zigzag ────────────────────────── */
function LogoLinesLayer({ pageH }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current || pageH === 0) return
    const paths  = Array.from(svgRef.current.querySelectorAll('.lp'))
    const triggers = []

    paths.forEach((path, i) => {
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })

      /* stagger start so lines don't all begin simultaneously */
      const startPct = 2 + i * 4
      const endPct   = 85

      triggers.push(
        ScrollTrigger.create({
          trigger: 'body',
          start: `${startPct}% top`,
          end:   `${endPct}% top`,
          scrub: 2,
          onUpdate: self => {
            gsap.set(path, { strokeDashoffset: len * (1 - self.progress) })
          },
        })
      )
    })

    return () => triggers.forEach(t => t.kill())
  }, [pageH])

  if (pageH === 0) return null

  const W = 1440
  const H = pageH
  /* zig-zag anchor Y positions — one zag every ~13% of page */
  const L = 30           /* left margin  */
  const R = W - 30       /* right margin */
  const y = (pct) => H * pct

  /*
   * PATH DESIGN:  starts at logo centre → zigzags WIDE left↔right,
   * each leg spans the full viewport width so it's unmissable.
   * Smooth cubic beziers give an organic feel.
   */

  /* Main line — blue, thick */
  const mainD = [
    `M 720 360`,
    /* → right */
    `C 1100 ${y(0.07)}, ${R} ${y(0.10)}, ${R} ${y(0.13)}`,
    /* → left  */
    `C ${R} ${y(0.16)}, ${L} ${y(0.23)}, ${L} ${y(0.26)}`,
    /* → right */
    `C ${L} ${y(0.29)}, ${R} ${y(0.36)}, ${R} ${y(0.39)}`,
    /* → left  */
    `C ${R} ${y(0.42)}, ${L} ${y(0.49)}, ${L} ${y(0.52)}`,
    /* → right */
    `C ${L} ${y(0.55)}, ${R} ${y(0.62)}, ${R} ${y(0.65)}`,
    /* → left  */
    `C ${R} ${y(0.68)}, ${L} ${y(0.75)}, ${L} ${y(0.78)}`,
    /* → centre finish */
    `C ${L} ${y(0.81)}, 720 ${y(0.90)}, 720 ${y(0.93)}`,
  ].join(' ')

  /* Counter line — purple, medium, starts going left */
  const crossD = [
    `M 720 390`,
    /* → left  */
    `C 340 ${y(0.07)}, ${L} ${y(0.10)}, ${L} ${y(0.13)}`,
    /* → right */
    `C ${L} ${y(0.16)}, ${R} ${y(0.23)}, ${R} ${y(0.26)}`,
    /* → left  */
    `C ${R} ${y(0.29)}, ${L} ${y(0.36)}, ${L} ${y(0.39)}`,
    /* → right */
    `C ${L} ${y(0.42)}, ${R} ${y(0.49)}, ${R} ${y(0.52)}`,
    /* → left  */
    `C ${R} ${y(0.55)}, ${L} ${y(0.62)}, ${L} ${y(0.65)}`,
    /* → right */
    `C ${L} ${y(0.68)}, ${R} ${y(0.75)}, ${R} ${y(0.78)}`,
    /* → centre finish */
    `C ${R} ${y(0.81)}, 720 ${y(0.90)}, 720 ${y(0.93)}`,
  ].join(' ')

  /* Ghost echo of main — thinner, more transparent, slight offset */
  const echoD = [
    `M 720 410`,
    `C 1080 ${y(0.075)}, ${R - 40} ${y(0.105)}, ${R - 40} ${y(0.135)}`,
    `C ${R - 40} ${y(0.165)}, ${L + 40} ${y(0.235)}, ${L + 40} ${y(0.265)}`,
    `C ${L + 40} ${y(0.295)}, ${R - 40} ${y(0.365)}, ${R - 40} ${y(0.395)}`,
    `C ${R - 40} ${y(0.425)}, ${L + 40} ${y(0.495)}, ${L + 40} ${y(0.525)}`,
    `C ${L + 40} ${y(0.555)}, ${R - 40} ${y(0.625)}, ${R - 40} ${y(0.655)}`,
    `C ${R - 40} ${y(0.685)}, ${L + 40} ${y(0.755)}, ${L + 40} ${y(0.785)}`,
    `C ${L + 40} ${y(0.815)}, 720 ${y(0.905)}, 720 ${y(0.935)}`,
  ].join(' ')

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 1, overflow: 'visible',
      }}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="glow-strong" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Echo (drawn first, behind) */}
      <path className="lp" d={echoD}  fill="none" stroke={C.blue}   strokeWidth={1}   strokeLinecap="round" opacity={0.25} filter="url(#glow-soft)" />
      {/* Counter zigzag */}
      <path className="lp" d={crossD} fill="none" stroke={C.purple} strokeWidth={2}   strokeLinecap="round" opacity={0.55} filter="url(#glow-strong)" />
      {/* Main zigzag — drawn last, on top */}
      <path className="lp" d={mainD}  fill="none" stroke={C.blue}   strokeWidth={2.5} strokeLinecap="round" opacity={0.85} filter="url(#glow-strong)" />
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
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 2rem', overflow: 'hidden' }}>
      <div ref={glowRef} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${C.blueGlow} 0%, transparent 68%)`, opacity: 0.35, pointerEvents: 'none' }} />

      <motion.div style={{ y: wrapY, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 2 }} variants={stagger} initial="hidden" animate="visible">
        <motion.div style={{ scale: logoScale, opacity: logoOpacity }} variants={item}>
          <motion.img
            src="/assets/shymen-logo.png" alt="Shymen Records"
            animate={{ rotate: [0, 1.2, -1.2, 0], y: [0, -10, 0] }}
            transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
            style={{ width: 'clamp(200px, 34vw, 400px)', height: 'auto', filter: `drop-shadow(0 0 50px ${C.blueGlow}) drop-shadow(0 0 100px rgba(53,82,252,0.18))` }}
          />
        </motion.div>

        <motion.div variants={item} style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(1.5rem, 4.5vw, 3.6rem)', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
            Hard House · Trance · Techno
          </h1>
          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(0.9rem, 1.8vw, 1.15rem)', color: C.muted, letterSpacing: '0.06em', margin: 0 }}>
            {t('hero_tagline')}
          </p>
        </motion.div>

        <motion.div variants={item} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Hard House', 'Trance', 'Hard Bounce', 'Techno'].map(g => <Pill key={g}>{g}</Pill>)}
        </motion.div>

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

/* ─── UPCOMING EVENTS ───────────────────────────────────────────────────────── */
function UpcomingEventsSection() {
  const { t } = useLang()
  return (
    <section id="events" style={{ padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 7vw, 7rem)', position: 'relative' }}>
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
    <motion.div
      whileHover={{ borderColor: C.blue, backgroundColor: 'rgba(53,82,252,0.04)', boxShadow: `0 0 40px rgba(53,82,252,0.08)` }}
      style={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.07)', padding: 'clamp(1.2rem, 2.5vw, 1.8rem)', background: C.surface, display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.2rem', alignItems: 'center', transition: 'border-color 0.35s, background-color 0.35s, box-shadow 0.35s' }}
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
    <section id="releases" style={{ padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 7vw, 7rem)', position: 'relative', background: C.surface }}>
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
      style={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.055)', background: C.bg, overflow: 'hidden', cursor: 'default' }}>
      <div style={{ height: 170, background: `linear-gradient(135deg, rgba(53,82,252,0.18) 0%, rgba(139,92,246,0.08) 60%, ${C.bg} 100%)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
  const hardHouseRef   = useRef(null)
  const tranceRef      = useRef(null)
  const technoRef      = useRef(null)
  const collectiveRef  = useRef(null)
  const undergroundRef = useRef(null)
  const anchorRef      = useRef(null)

  useEffect(() => {
    const pairs = [
      [hardHouseRef,   'highlight', C.blue],
      [tranceRef,      'underline', C.purple],
      [technoRef,      'highlight', C.blue],
      [collectiveRef,  'circle',    C.purple],
      [undergroundRef, 'underline', C.blue],
    ]
    const anns = pairs.map(([ref, type, color]) => ref.current ? annotate(ref.current, { type, color, animationDuration: 800, strokeWidth: 2, padding: 4 }) : null)
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      anns.forEach((a, i) => a && setTimeout(() => a.show(), i * 180))
      obs.disconnect()
    }, { threshold: 0.25 })
    if (anchorRef.current) obs.observe(anchorRef.current)
    return () => { anns.forEach(a => a?.remove()); obs.disconnect() }
  }, [])

  return (
    <section id="members" style={{ padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 7vw, 7rem)', position: 'relative' }}>
      <FadeUp>
        <SectionLabel tKey="mem_label" />
        <SectionHeading tKey="mem_title" />
        <ScrollLine />
      </FadeUp>

      <FadeUp delay={0.1} style={{ maxWidth: 680, marginBottom: '3.5rem' }}>
        <div ref={anchorRef} style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)', lineHeight: 1.82, color: C.text }}>
          <p style={{ marginBottom: '1em' }}>
            {t('mem_p1a')}
            <span ref={collectiveRef} style={{ color: '#fff' }}>{t('mem_collective')}</span>
            {t('mem_p1b')}
            <span ref={hardHouseRef} style={{ color: '#fff' }}>Hard House</span>
            {t('mem_sep1')}
            <span ref={tranceRef} style={{ color: '#fff' }}>Trance</span>
            {t('mem_sep2')}
            <span ref={technoRef} style={{ color: '#fff' }}>Techno</span>
            {t('mem_p1c')}
          </p>
          <p>
            {t('mem_p2a')}
            <span ref={undergroundRef} style={{ color: '#fff' }}>{t('mem_underground')}</span>
            {t('mem_p2b')}
          </p>
        </div>
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
    <motion.div
      whileHover={{ y: -7, borderColor: C.blue, boxShadow: `0 18px 44px rgba(53,82,252,0.18)` }}
      style={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.06)', background: C.surface, padding: '1.4rem 1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center', transition: 'border-color 0.3s, box-shadow 0.3s' }}
    >
      <div className={`member-avatar member-${member.name.toLowerCase().replace(/[^a-z]/g, '-')}`}
        style={{ width: 76, height: 76, borderRadius: '50%', background: `linear-gradient(135deg, rgba(53,82,252,0.28), rgba(139,92,246,0.16))`, border: `2px solid rgba(53,82,252,0.28)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.25rem', fontWeight: 800, color: C.blue, letterSpacing: '-0.02em' }}>
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

/* ─── PAST EVENTS GALLERY ───────────────────────────────────────────────────── */
function PastEventsGallery() {
  const gridRef = useRef(null)
  useEffect(() => {
    if (!gridRef.current) return
    const items    = gridRef.current.querySelectorAll('.gitem')
    const triggers = []
    items.forEach((el, i) => {
      const dir = i % 2 === 0 ? -28 : 28
      gsap.set(el, { y: dir })
      triggers.push(ScrollTrigger.create({
        trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.8,
        onUpdate: s => gsap.set(el, { y: dir - dir * 2 * s.progress }),
      }))
    })
    return () => triggers.forEach(t => t.kill())
  }, [])

  return (
    <section id="gallery" style={{ padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 7vw, 7rem)', position: 'relative', background: C.surface }}>
      <FadeUp>
        <SectionLabel tKey="gal_label" />
        <SectionHeading tKey="gal_title" />
        <ScrollLine color={`linear-gradient(to right, ${C.purple}, transparent)`} glow={C.purpleDim} />
      </FadeUp>
      <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.9rem' }}>
        {PAST_EVENTS.map((ev, i) => <FadeUp key={ev.id} delay={i * 0.07}><GalleryItem event={ev} large={i === 0 || i === 3} /></FadeUp>)}
      </div>
    </section>
  )
}

function GalleryItem({ event, large }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div className="gitem"
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      style={{ gridColumn: large ? 'span 2' : 'span 1', borderRadius: 22, overflow: 'hidden', position: 'relative', aspectRatio: large ? '16/7' : '1/1', background: `radial-gradient(ellipse at 30% 40%, rgba(53,82,252,0.18) 0%, ${C.bg} 70%)`, border: '1px solid rgba(255,255,255,0.05)', cursor: 'default' }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: 'cover' }} />
      <div className={`gallery-photo gallery-photo-${event.id}`} style={{ position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <motion.div animate={{ opacity: hovered ? 0 : 1 }} transition={{ duration: 0.25 }} style={{ position: 'absolute', bottom: 12, left: 14 }}>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)', margin: 0 }}>{event.name} · {event.date}</p>
      </motion.div>
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.28 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(4,5,10,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(0.95rem, 2vw, 1.35rem)', fontWeight: 800, color: '#fff', margin: 0 }}>{event.name}</p>
        <Pill>{event.date}</Pill>
      </motion.div>
    </motion.div>
  )
}

/* ─── CONTACT ───────────────────────────────────────────────────────────────── */
function ContactSection() {
  const { t } = useLang()
  const emailRef = useRef(null)
  useEffect(() => {
    if (!emailRef.current) return
    const ann = annotate(emailRef.current, { type: 'box', color: C.blue, animationDuration: 900, strokeWidth: 2, padding: 8 })
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { ann.show(); obs.disconnect() } }, { threshold: 0.6 })
    obs.observe(emailRef.current)
    return () => { ann.remove(); obs.disconnect() }
  }, [])

  return (
    <section id="contact" style={{ padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 7vw, 7rem)', position: 'relative', textAlign: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 60%, rgba(53,82,252,0.055) 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <FadeUp>
        <SectionLabel tKey="bk_label" />
        <SectionHeading tKey="bk_title" />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ScrollLine width={80} color={`linear-gradient(to right, transparent, ${C.blue}, transparent)`} />
        </div>
      </FadeUp>
      <FadeUp delay={0.15} style={{ maxWidth: 520, margin: '0 auto 2.4rem auto' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)', color: C.text, lineHeight: 1.75 }}>{t('bk_body')}</p>
      </FadeUp>
      <FadeUp delay={0.25} style={{ marginBottom: '2.8rem' }}>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 700, color: '#fff' }}>
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
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.055)', padding: '2.2rem clamp(1.5rem, 7vw, 7rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: C.surface }}>
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

/* ─── APP ROOT ──────────────────────────────────────────────────────────────── */
function Inner() {
  const pageRef = useRef(null)
  const [pageH, setPageH] = useState(0)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel  = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap'
    document.head.appendChild(link)

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
    <div ref={pageRef} style={{ background: C.bg, minHeight: '100vh', position: 'relative' }}>
      <LogoLinesLayer pageH={pageH} />
      <LangToggle />
      <HeroSection />
      <UpcomingEventsSection />
      <ReleasesSection />
      <MembersSection />
      <PastEventsGallery />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Inner />
    </LangProvider>
  )
}
