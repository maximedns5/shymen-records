import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { annotate } from 'rough-notation'
import shymenLogo from './assets/shymen-logo.jpeg'

// ← Tout le contenu éditable est dans src/data.js
import { CONTACT, MEMBERS, EVENTS, RELEASES, PAST_EVENTS, SOCIALS } from './data.js'

gsap.registerPlugin(ScrollTrigger)

/* ─── HELPERS ───────────────────────────────────────────────────────────────── */
// Construit une URL d'asset public (fonctionne en dev ET sur GitHub Pages)
const asset = (path) => path ? `${import.meta.env.BASE_URL}${path}` : ''

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────────── */
const C = {
  blue:      '#3552FC',
  blueDim:   'rgba(53,82,252,0.22)',
  blueGlow:  'rgba(53,82,252,0.45)',
  purple:    '#8b5cf6',
  purpleDim: 'rgba(139,92,246,0.28)',
  muted:     '#505568',
  text:      'rgba(255,255,255,0.65)',
  bg0: '#04050a',   // hero / contact
  bg1: '#070914',   // upcoming
  bg2: '#0f0c1e',   // archive (purple-tinted)
  bg3: '#0c0e1e',   // releases (blue-tinted)
  bg4: '#090b16',   // members
  bg5: '#080a12',   // footer
}

/* ─── TRANSLATIONS ──────────────────────────────────────────────────────────── */
const STRINGS = {
  FR: {
    nav_book:   "Nous booker",
    hero_cta1:  "Upcoming",
    hero_cta2:  "Releases",
    scroll:     "Défiler",
    ev_label:   "Upcoming",
    ev_title:   "Upcoming",
    ev_tickets: "Billets ↗",
    ev_info:    "Info",
    rel_label:  "Releases",
    rel_title:  "Releases",
    rel_listen: "▶ SoundCloud",
    mem_label:  "L'équipe",
    mem_title:  "Shymen Records",
    mem_about:  "Shymen Records est un collectif parisien passionné de musique. Avant tout une bande de potes animés par une seule envie : faire vibrer la salle et passer des nuits qui comptent.",
    mem_sc:     "SoundCloud",
    mem_insta:  "Instagram",
    mem_contact:"Contact",
    arc_label:  "Archive",
    arc_title:  "Souvenirs.",
    arc_cta:    "Voir toutes les photos →",
    arc_back:   "← Retour",
    bk_label:   "Booking",
    bk_title:   "Nous booker",
    bk_body:    "Vous souhaitez amener l'expérience Shymen Records dans votre club, festival ou rave ? On est basés à Paris et on tourne partout dans le monde.",
    bk_cta1:    "Envoyer un mail",
    bk_cta2:    "Dossier de presse",
    footer:     "© 2026 Shymen Records",
  },
  EN: {
    nav_book:   "Book us",
    hero_cta1:  "Upcoming",
    hero_cta2:  "Releases",
    scroll:     "Scroll",
    ev_label:   "Upcoming",
    ev_title:   "Upcoming",
    ev_tickets: "Tickets ↗",
    ev_info:    "Info",
    rel_label:  "Releases",
    rel_title:  "Releases",
    rel_listen: "▶ SoundCloud",
    mem_label:  "The Crew",
    mem_title:  "Shymen Records",
    mem_about:  "Shymen Records is a Parisian music collective. First and foremost a crew of friends driven by one thing: making rooms move and creating nights worth remembering.",
    mem_sc:     "SoundCloud",
    mem_insta:  "Instagram",
    mem_contact:"Contact",
    arc_label:  "Archive",
    arc_title:  "Souvenirs.",
    arc_cta:    "View all photos →",
    arc_back:   "← Back",
    bk_label:   "Booking",
    bk_title:   "Book Us",
    bk_body:    "Looking to bring the Shymen Records experience to your club, festival, or rave? We're based in Paris and touring worldwide.",
    bk_cta1:    "Send an email",
    bk_cta2:    "Press kit",
    footer:     "© 2026 Shymen Records",
  },
}

/* ─── LANGUAGE CONTEXT ──────────────────────────────────────────────────────── */
const LangCtx = createContext({ t: k => k, lang: 'FR', toggle: () => {} })
function LangProvider({ children }) {
  const [lang, setLang] = useState('FR')
  const t = key => STRINGS[lang][key] ?? key
  return <LangCtx.Provider value={{ t, lang, toggle: () => setLang(l => l === 'FR' ? 'EN' : 'FR') }}>{children}</LangCtx.Provider>
}
const useLang = () => useContext(LangCtx)

/* ─── TOP NAV ───────────────────────────────────────────────────────────────── */
function TopNav() {
  const { t, lang, toggle } = useLang()
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', pointerEvents: 'none' }}>
      {/* Nous booker — top left */}
      <motion.a
        href={`mailto:${CONTACT.email}`}
        whileHover={{ scale: 1.06, boxShadow: `0 0 24px ${C.blueGlow}` }}
        whileTap={{ scale: 0.97 }}
        style={{
          pointerEvents: 'all',
          borderRadius: 999, padding: '9px 20px',
          border: `1.5px solid ${C.blue}`,
          background: C.blue,
          color: '#fff', textDecoration: 'none',
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase',
          backdropFilter: 'blur(12px)',
        }}
      >
        {t('nav_book')}
      </motion.a>

      {/* FR › EN — top right */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.08, boxShadow: `0 0 20px ${C.blueGlow}` }}
        whileTap={{ scale: 0.95 }}
        style={{
          pointerEvents: 'all',
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
    </div>
  )
}

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────────── */
function Btn({ children, filled = false, href, onClick, style = {} }) {
  const base = {
    borderRadius: 999, padding: '11px 26px',
    border: `1.5px solid ${C.blue}`,
    background: filled ? C.blue : 'transparent',
    color: '#fff', cursor: 'pointer',
    fontFamily: '"Space Grotesk", sans-serif',
    fontSize: '0.76rem', letterSpacing: '0.11em',
    textTransform: 'uppercase', fontWeight: 700,
    outline: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
    textDecoration: 'none', transition: 'box-shadow 0.3s', ...style,
  }
  if (href) return <motion.a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${C.blueGlow}` }} whileTap={{ scale: 0.97 }} style={base}>{children}</motion.a>
  return <motion.button onClick={onClick || (() => {})} whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${C.blueGlow}` }} whileTap={{ scale: 0.97 }} style={base}>{children}</motion.button>
}

function Pill({ children, color = C.blue }) {
  const isP = color === C.purple
  return <span style={{ borderRadius: 999, padding: '4px 11px', background: isP ? 'rgba(139,92,246,0.1)' : 'rgba(53,82,252,0.1)', border: `1px solid ${isP ? 'rgba(139,92,246,0.28)' : 'rgba(53,82,252,0.28)'}`, color, fontSize: '0.67rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', whiteSpace: 'nowrap' }}>{children}</span>
}

function FadeUp({ children, delay = 0, y = 36, style = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  return <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }} style={style}>{children}</motion.div>
}

function SecLabel({ tKey }) {
  const { t } = useLang()
  return <p style={{ color: C.blue, fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, marginBottom: '0.9rem' }}>— {t(tKey)}</p>
}

function SecTitle({ tKey }) {
  const { t } = useLang()
  return <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 800, color: '#fff', margin: '0 0 1.1rem 0', letterSpacing: '-0.025em', lineHeight: 1.05 }}>{t(tKey)}</h2>
}

function DrawLine({ color = C.blue, width = 130, glow, center = false }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    gsap.set(ref.current, { scaleX: 0, transformOrigin: center ? 'center center' : 'left center' })
    const trig = ScrollTrigger.create({ trigger: ref.current, start: 'top 78%', onEnter: () => gsap.to(ref.current, { scaleX: 1, duration: 1.1, ease: 'power3.out' }) })
    return () => trig.kill()
  }, [])
  return <div ref={ref} style={{ height: 2, width, background: color, borderRadius: 2, boxShadow: glow ? `0 0 12px ${glow}` : `0 0 10px ${C.blueGlow}`, marginBottom: '2.8rem', ...(center ? { margin: '0 auto 2.8rem auto' } : {}) }} />
}

/* ─── LOGO LINES (8 zigzags) ────────────────────────────────────────────────── */
function LogoLines({ pageH }) {
  const svgRef = useRef(null)
  useEffect(() => {
    if (!svgRef.current || pageH === 0) return
    const paths = Array.from(svgRef.current.querySelectorAll('.lp'))
    const ts = []
    paths.forEach((p, i) => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      ts.push(ScrollTrigger.create({ trigger: 'body', start: `${1.5 + i * 0.6}% top`, end: '88% top', scrub: 2 + i * 0.15, onUpdate: s => gsap.set(p, { strokeDashoffset: len * (1 - s.progress) }) }))
    })
    return () => ts.forEach(t => t.kill())
  }, [pageH])

  if (pageH === 0) return null
  const W = 1440, H = pageH
  const mkZ = (right, margin, sy, dy = 0) => {
    const L = margin, R = W - margin
    const anc = [0.13, 0.26, 0.39, 0.52, 0.65, 0.78, 0.92].map(p => H * (p + dy))
    const xs = right ? [R,L,R,L,R,L,R] : [L,R,L,R,L,R,L]
    let d = `M 720 ${sy}`
    anc.forEach((y, i) => {
      const px = i===0?720:xs[i-1], py = i===0?sy:anc[i-1], x=xs[i], mid=(py+y)/2
      d += ` C ${px} ${mid} ${x} ${mid} ${x} ${y}`
    })
    return d
  }
  const LN = [
    [3.5,0.90,C.blue,  true, 22,355, 0.000],[2.5,0.65,C.blue,  true, 55,372, 0.010],
    [1.8,0.38,C.blue,  true, 88,389, 0.020],[1.0,0.20,C.blue,  true, 14,406,-0.008],
    [3.0,0.70,C.purple,false,28,363, 0.005],[2.0,0.45,C.purple,false,62,380, 0.015],
    [1.4,0.25,C.purple,false,96,397, 0.025],[0.8,0.14,C.purple,false,18,414,-0.004],
  ]
  return (
    <svg ref={svgRef} aria-hidden="true" style={{ position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,overflow:'visible' }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <filter id="gs" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="gw" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {LN.map(([sw,op,color,right,margin,sy,dy],i) => <path key={i} className="lp" d={mkZ(right,margin,sy,dy)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity={op} filter={sw>=2?'url(#gs)':'url(#gw)'}/>)}
    </svg>
  )
}

/* ─── HERO ──────────────────────────────────────────────────────────────────── */
function Hero() {
  const { t } = useLang()
  const { scrollY } = useScroll()
  const logoScale   = useTransform(scrollY, [0,500], [1,0.65])
  const logoOpacity = useTransform(scrollY, [0,450], [1,0])
  const wrapY       = useTransform(scrollY, [0,500], [0,-70])
  const glowRef     = useRef(null)
  useEffect(() => { if (glowRef.current) gsap.to(glowRef.current, { scale:1.2, opacity:0.75, duration:3, ease:'sine.inOut', yoyo:true, repeat:-1 }) }, [])

  const stagger = { hidden:{}, visible:{ transition:{ staggerChildren:0.13 } } }
  const item    = { hidden:{ opacity:0, y:44 }, visible:{ opacity:1, y:0, transition:{ duration:0.9, ease:[0.16,1,0.3,1] } } }

  return (
    <section id="hero" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', padding:'0 2rem', overflow:'hidden', background:C.bg0 }}>
      <div ref={glowRef} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:700, borderRadius:'50%', background:`radial-gradient(circle, ${C.blueGlow} 0%, transparent 68%)`, opacity:0.35, pointerEvents:'none' }} />
      <motion.div style={{ y:wrapY, display:'flex', flexDirection:'column', alignItems:'center', gap:'1.8rem', position:'relative', zIndex:2 }} variants={stagger} initial="hidden" animate="visible">
        <motion.div style={{ scale:logoScale, opacity:logoOpacity }} variants={item}>
          <motion.img src={shymenLogo} alt="Shymen Records"
            animate={{ rotate:[0,1.2,-1.2,0], y:[0,-10,0] }} transition={{ duration:7, ease:'easeInOut', repeat:Infinity }}
            style={{ width:'clamp(180px,30vw,360px)', height:'auto', borderRadius:20, filter:`drop-shadow(0 0 50px ${C.blueGlow}) drop-shadow(0 0 100px rgba(53,82,252,0.18))` }} />
        </motion.div>
        <motion.div variants={item} style={{ textAlign:'center' }}>
          <h1 style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'clamp(2.4rem,7vw,6rem)', fontWeight:800, color:'#fff', margin:0, letterSpacing:'-0.03em', lineHeight:1, textTransform:'uppercase' }}>Shymen Records</h1>
        </motion.div>
        <motion.div variants={item} style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', justifyContent:'center' }}>
          {['Hard House','Trance','Hard Bounce','Techno'].map(g => <Pill key={g}>{g}</Pill>)}
        </motion.div>
        <motion.div variants={item} style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
          <Btn filled onClick={() => document.getElementById('events')?.scrollIntoView({ behavior:'smooth' })}>{t('hero_cta1')}</Btn>
          <Btn onClick={() => document.getElementById('releases')?.scrollIntoView({ behavior:'smooth' })}>{t('hero_cta2')}</Btn>
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}
        style={{ position:'absolute', bottom:'2.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <span style={{ color:C.muted, fontSize:'0.62rem', letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:'"Space Grotesk", sans-serif' }}>{t('scroll')}</span>
        <motion.div animate={{ y:[0,10,0] }} transition={{ duration:1.5, repeat:Infinity, ease:'easeInOut' }} style={{ width:1, height:36, background:`linear-gradient(to bottom, ${C.blue}, transparent)` }} />
      </motion.div>
    </section>
  )
}

/* ─── UPCOMING ──────────────────────────────────────────────────────────────── */
function UpcomingSection() {
  return (
    <section id="events" style={{ padding:'clamp(5rem,9vw,8rem) clamp(1.5rem,7vw,7rem)', position:'relative', background:C.bg1 }}>
      <FadeUp><SecLabel tKey="ev_label"/><SecTitle tKey="ev_title"/><DrawLine /></FadeUp>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {EVENTS.map((ev,i) => <FadeUp key={ev.id} delay={i*0.09}><EventCard event={ev}/></FadeUp>)}
      </div>
    </section>
  )
}

function EventCard({ event }) {
  const { t } = useLang()
  return (
    <motion.div whileHover={{ borderColor:C.blue, backgroundColor:'rgba(53,82,252,0.04)', boxShadow:`0 0 40px rgba(53,82,252,0.08)` }}
      style={{ borderRadius:22, border:'1px solid rgba(255,255,255,0.07)', padding:'clamp(1.2rem,2.5vw,1.8rem)', background:'rgba(255,255,255,0.02)', display:'grid', gridTemplateColumns:'1fr auto', gap:'1.2rem', alignItems:'center', transition:'all 0.35s' }}>
      {/* Flyer thumbnail si disponible */}
      {event.flyer && <div style={{ position:'relative', gridColumn:'1 / -1', height:120, borderRadius:14, overflow:'hidden', marginBottom:'0.5rem' }}>
        <img src={asset(event.flyer)} alt={event.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
      </div>}
      <div>
        <p style={{ color:C.blue, fontSize:'0.7rem', letterSpacing:'0.16em', textTransform:'uppercase', fontFamily:'"Space Grotesk", sans-serif', fontWeight:700, marginBottom:'0.35rem' }}>{event.date}</p>
        <h3 style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'clamp(1.15rem,2.8vw,1.9rem)', fontWeight:800, color:'#fff', margin:'0 0 0.35rem 0', letterSpacing:'-0.015em' }}>{event.name}</h3>
        <p style={{ color:C.muted, fontSize:'0.83rem', margin:'0 0 0.7rem 0', fontFamily:'Inter, sans-serif' }}>{event.venue} · {event.city}</p>
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'0.7rem' }}>{event.tags.map(tag => <Pill key={tag}>{tag}</Pill>)}</div>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', margin:0, fontFamily:'Inter, sans-serif' }}>{event.lineup.join(' · ')}</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem', alignItems:'flex-end' }}>
        {/* ticketUrl dans src/data.js */}
        <Btn filled href={event.ticketUrl || undefined} onClick={!event.ticketUrl ? () => {} : undefined} style={{ fontSize:'0.7rem', padding:'9px 18px' }}>{t('ev_tickets')}</Btn>
        <Btn href={event.infoUrl || undefined} onClick={!event.infoUrl ? () => {} : undefined} style={{ fontSize:'0.7rem', padding:'9px 18px' }}>{t('ev_info')}</Btn>
      </div>
    </motion.div>
  )
}

/* ─── ARCHIVE PREVIEW ────────────────────────────────────────────────────────── */
function ArchivePreview() {
  const { t } = useLang()
  const gridRef = useRef(null)
  useEffect(() => {
    if (!gridRef.current) return
    const items = gridRef.current.querySelectorAll('.gi')
    const ts = []
    items.forEach((el,i) => {
      const d = i%2===0?-22:22; gsap.set(el,{y:d})
      ts.push(ScrollTrigger.create({ trigger:el, start:'top bottom', end:'bottom top', scrub:1.8, onUpdate:s => gsap.set(el,{y:d-d*2*s.progress}) }))
    })
    return () => ts.forEach(t => t.kill())
  },[])

  return (
    <section id="archive" style={{ padding:'clamp(5rem,9vw,8rem) clamp(1.5rem,7vw,7rem)', position:'relative', background:C.bg2 }}>
      <FadeUp>
        <SecLabel tKey="arc_label"/>
        <SecTitle tKey="arc_title"/>
        <DrawLine color={`linear-gradient(to right, ${C.purple}, ${C.blue})`} glow={C.purpleDim}/>
      </FadeUp>
      <div ref={gridRef} style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'0.9rem', marginBottom:'2.5rem' }}>
        {PAST_EVENTS.slice(0,6).map((ev,i) => <FadeUp key={ev.id} delay={i*0.07}><ArchiveThumb event={ev} large={i===0||i===3}/></FadeUp>)}
      </div>
      <FadeUp style={{ display:'flex', justifyContent:'center' }}>
        <Link to="/archive" style={{ textDecoration:'none' }}>
          <Btn filled>{t('arc_cta')}</Btn>
        </Link>
      </FadeUp>
    </section>
  )
}

function ArchiveThumb({ event, large }) {
  const [hov, setHov] = useState(false)
  const bg = event.photoUrl ? `url(${asset(event.photoUrl)}) center/cover` : `linear-gradient(135deg, rgba(53,82,252,0.12), rgba(139,92,246,0.08))`
  return (
    <motion.div className="gi" onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      style={{ gridColumn:large?'span 2':'span 1', borderRadius:22, overflow:'hidden', position:'relative', aspectRatio:large?'16/7':'1/1', background:bg, border:'1px solid rgba(255,255,255,0.05)', cursor:'default' }}>
      <motion.div animate={{ opacity:hov?0:1 }} style={{ position:'absolute', bottom:12, left:14 }}>
        <p style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'0.72rem', color:'rgba(255,255,255,0.42)', margin:0 }}>{event.name} · {event.date}</p>
      </motion.div>
      <motion.div animate={{ opacity:hov?1:0 }} transition={{ duration:0.25 }} style={{ position:'absolute', inset:0, background:'rgba(4,5,10,0.72)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
        <p style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'clamp(0.95rem,2vw,1.35rem)', fontWeight:800, color:'#fff', margin:0 }}>{event.name}</p>
        <Pill>{event.date}</Pill>
      </motion.div>
    </motion.div>
  )
}

/* ─── RELEASES ──────────────────────────────────────────────────────────────── */
function ReleasesSection() {
  return (
    <section id="releases" style={{ padding:'clamp(5rem,9vw,8rem) clamp(1.5rem,7vw,7rem)', position:'relative', background:C.bg3 }}>
      <FadeUp><SecLabel tKey="rel_label"/><SecTitle tKey="rel_title"/><DrawLine color={`linear-gradient(to right, ${C.blue}, ${C.purple})`} glow={C.blueDim}/></FadeUp>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'1rem' }}>
        {RELEASES.map((r,i) => <FadeUp key={r.id} delay={i*0.07}><ReleaseCard release={r}/></FadeUp>)}
      </div>
    </section>
  )
}

function ReleaseCard({ release }) {
  const { t } = useLang()
  const hasCover = !!release.coverImage
  return (
    <motion.div whileHover={{ scale:1.02, boxShadow:`0 20px 60px rgba(53,82,252,0.18)` }}
      style={{ borderRadius:22, border:'1px solid rgba(255,255,255,0.055)', background:'rgba(0,0,0,0.3)', overflow:'hidden', cursor:'default' }}>
      {/* Pochette — coverImage dans src/data.js */}
      <div style={{ height:170, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:hasCover?'none':`linear-gradient(135deg, rgba(53,82,252,0.18), rgba(139,92,246,0.08))` }}>
        {hasCover
          ? <img src={asset(release.coverImage)} alt={release.title} style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }}/>
          : <motion.div animate={{ rotate:360 }} transition={{ duration:18, repeat:Infinity, ease:'linear' }} style={{ width:64, height:64, borderRadius:'50%', border:`1px solid rgba(53,82,252,0.35)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:18, height:18, borderRadius:'50%', background:C.blue, boxShadow:`0 0 16px ${C.blueGlow}` }}/>
            </motion.div>}
        <span style={{ position:'absolute', top:10, right:12, background:'rgba(0,0,0,0.6)', borderRadius:999, padding:'3px 10px', fontSize:'0.62rem', color:C.muted, fontFamily:'"Space Grotesk", sans-serif', letterSpacing:'0.08em', zIndex:1 }}>{release.bpm}</span>
      </div>
      <div style={{ padding:'1.15rem 1.35rem' }}>
        <h3 style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'1.05rem', fontWeight:700, color:'#fff', margin:'0 0 0.22rem 0', letterSpacing:'-0.01em' }}>{release.title}</h3>
        <p style={{ color:C.muted, fontSize:'0.8rem', margin:'0 0 1rem 0', fontFamily:'Inter, sans-serif' }}>{release.artist} · Shymen Records · {release.year}</p>
        {/* soundcloudUrl dans src/data.js */}
        <Btn href={release.soundcloudUrl || undefined} style={{ width:'100%', justifyContent:'center', fontSize:'0.7rem', padding:'9px 14px' }}>{t('rel_listen')}</Btn>
      </div>
    </motion.div>
  )
}

/* ─── MEMBERS ───────────────────────────────────────────────────────────────── */
function MembersSection() {
  const { t } = useLang()
  return (
    <section id="members" style={{ padding:'clamp(5rem,9vw,8rem) clamp(1.5rem,7vw,7rem)', position:'relative', background:C.bg4 }}>
      <FadeUp><SecLabel tKey="mem_label"/><SecTitle tKey="mem_title"/><DrawLine /></FadeUp>
      <FadeUp delay={0.1} style={{ maxWidth:640, marginBottom:'3.5rem' }}>
        <p style={{ fontFamily:'Inter, sans-serif', fontSize:'clamp(0.95rem,1.6vw,1.1rem)', lineHeight:1.82, color:C.text }}>{t('mem_about')}</p>
      </FadeUp>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(188px, 1fr))', gap:'0.9rem' }}>
        {MEMBERS.map((m,i) => <FadeUp key={m.name} delay={i*0.055}><MemberCard member={m}/></FadeUp>)}
      </div>
    </section>
  )
}

function MemberCard({ member }) {
  const { t } = useLang()
  const initials = member.name.replace(/'/g,'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  const hasPhoto = !!member.photoUrl
  return (
    <motion.div whileHover={{ y:-7, borderColor:C.blue, boxShadow:`0 18px 44px rgba(53,82,252,0.18)` }}
      style={{ borderRadius:22, border:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.03)', padding:'1.4rem 1.2rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.75rem', textAlign:'center', transition:'border-color 0.3s, box-shadow 0.3s' }}>
      {/* Photo — photoUrl dans src/data.js */}
      <div style={{ width:76, height:76, borderRadius:'50%', overflow:'hidden', border:`2px solid rgba(53,82,252,0.28)`, background:`linear-gradient(135deg, rgba(53,82,252,0.28), rgba(139,92,246,0.16))`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Space Grotesk", sans-serif', fontSize:'1.25rem', fontWeight:800, color:C.blue }}>
        {hasPhoto ? <img src={asset(member.photoUrl)} alt={member.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : initials}
      </div>
      <div>
        <p style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'0.98rem', fontWeight:700, color:'#fff', margin:'0 0 0.4rem 0' }}>{member.name}</p>
        <Pill color={member.soundcloudUrl !== null ? C.blue : C.purple}>{member.role}</Pill>
      </div>
      <div style={{ display:'flex', gap:'0.4rem', width:'100%' }}>
        {member.soundcloudUrl !== null
          ? <Btn href={member.soundcloudUrl || undefined} style={{ flex:1, justifyContent:'center', fontSize:'0.63rem', padding:'7px 10px' }}>{t('mem_sc')}</Btn>
          : <Btn href={`mailto:${member.contactEmail || CONTACT.email}`} style={{ flex:1, justifyContent:'center', fontSize:'0.63rem', padding:'7px 10px', borderColor:C.purple, color:C.purple }}>{t('mem_contact')}</Btn>}
        {member.instagramUrl !== null && <Btn href={member.instagramUrl || undefined} style={{ flex:1, justifyContent:'center', fontSize:'0.63rem', padding:'7px 10px' }}>{t('mem_insta')}</Btn>}
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
    const timer = setTimeout(() => {
      const ann = annotate(emailRef.current, { type:'box', color:C.blue, animationDuration:900, strokeWidth:2, padding:6 })
      const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){ ann.show(); obs.disconnect() } }, { threshold:0.8 })
      obs.observe(emailRef.current)
      return () => ann.remove()
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="contact" style={{ padding:'clamp(5rem,9vw,8rem) clamp(1.5rem,7vw,7rem)', position:'relative', textAlign:'center', background:C.bg0 }}>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 60%, rgba(53,82,252,0.055) 0%, transparent 65%)`, pointerEvents:'none' }}/>
      <FadeUp><SecLabel tKey="bk_label"/><SecTitle tKey="bk_title"/><DrawLine width={80} color={`linear-gradient(to right, transparent, ${C.blue}, transparent)`} center/></FadeUp>
      <FadeUp delay={0.15} style={{ maxWidth:520, margin:'0 auto 2.4rem auto' }}>
        <p style={{ fontFamily:'Inter, sans-serif', fontSize:'clamp(0.95rem,1.6vw,1.08rem)', color:C.text, lineHeight:1.75 }}>{t('bk_body')}</p>
      </FadeUp>
      <FadeUp delay={0.25} style={{ marginBottom:'2.8rem' }}>
        <p style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'clamp(1rem,2.5vw,1.4rem)', fontWeight:700, color:'#fff' }}>
          <a href={`mailto:${CONTACT.email}`} style={{ textDecoration:'none', color:'inherit' }}>
            <span ref={emailRef}>{CONTACT.email}</span>
          </a>
        </p>
      </FadeUp>
      <FadeUp delay={0.35}>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          {/* bk_cta1 → envoie un mail directement */}
          <Btn filled href={`mailto:${CONTACT.email}`}>{t('bk_cta1')}</Btn>
          <Btn>{t('bk_cta2')}</Btn>
        </div>
      </FadeUp>
    </section>
  )
}

/* ─── FOOTER ────────────────────────────────────────────────────────────────── */
function Footer() {
  const { t } = useLang()
  const links = [
    { label:'Instagram',       url: SOCIALS.instagram },
    { label:'SoundCloud',      url: SOCIALS.soundcloud },
    { label:'Resident Advisor',url: SOCIALS.residentAdvisor },
    { label:'Boiler Room',     url: SOCIALS.boilerRoom },
  ]
  return (
    <footer style={{ borderTop:'1px solid rgba(255,255,255,0.055)', padding:'2.2rem clamp(1.5rem,7vw,7rem)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', background:C.bg5 }}>
      <p style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'0.82rem', color:C.muted, margin:0 }}>{t('footer')}</p>
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
        {/* URLs dans src/data.js → SOCIALS */}
        {links.map(({label, url}) => (
          <motion.a key={label} href={url || '#'} onClick={!url ? e => e.preventDefault() : undefined}
            target={url ? '_blank' : undefined} rel="noopener noreferrer"
            whileHover={{ borderColor:C.blue, color:'#fff' }}
            style={{ borderRadius:999, padding:'6px 13px', border:`1px solid ${url ? 'rgba(53,82,252,0.4)' : 'rgba(255,255,255,0.12)'}`, color: url ? '#ccc' : C.muted, fontSize:'0.68rem', letterSpacing:'0.09em', textTransform:'uppercase', textDecoration:'none', fontFamily:'"Space Grotesk", sans-serif', fontWeight:600, transition:'border-color 0.3s, color 0.3s' }}>
            {label}
          </motion.a>
        ))}
      </div>
    </footer>
  )
}

/* ─── ARCHIVE PAGE (sous-page) ───────────────────────────────────────────────── */
function ArchivePage() {
  const { t } = useLang()
  useEffect(() => { window.scrollTo(0,0) }, [])
  return (
    <div style={{ minHeight:'100vh', background:C.bg0, padding:'clamp(5rem,8vw,7rem) clamp(1.5rem,6vw,6rem)' }}>
      <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }} style={{ marginBottom:'3rem' }}>
        <Link to="/" style={{ textDecoration:'none' }}><Btn style={{ fontSize:'0.75rem', padding:'9px 20px' }}>{t('arc_back')}</Btn></Link>
      </motion.div>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}>
        <p style={{ color:C.blue, fontSize:'0.7rem', letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:'"Space Grotesk", sans-serif', fontWeight:700, marginBottom:'0.9rem' }}>— {t('arc_label')}</p>
        <h1 style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:800, color:'#fff', margin:'0 0 1rem 0', letterSpacing:'-0.03em' }}>{t('arc_title')}</h1>
        <div style={{ height:2, width:100, background:`linear-gradient(to right, ${C.purple}, ${C.blue})`, borderRadius:2, boxShadow:`0 0 12px ${C.blueGlow}`, marginBottom:'3rem' }}/>
      </motion.div>
      {/* Grille toutes les soirées — photoUrl dans src/data.js */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem' }}>
        {PAST_EVENTS.map((ev,i) => (
          <motion.div key={ev.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:i*0.06, ease:[0.16,1,0.3,1] }}>
            <ArchiveFullCard event={ev}/>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ArchiveFullCard({ event }) {
  const [hov, setHov] = useState(false)
  const hasPhoto = !!event.photoUrl
  return (
    <motion.div onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      whileHover={{ scale:1.02, boxShadow:`0 20px 50px rgba(53,82,252,0.2)` }}
      style={{ borderRadius:20, overflow:'hidden', position:'relative', aspectRatio:'4/3', background:`linear-gradient(135deg, rgba(53,82,252,0.15), rgba(139,92,246,0.08))`, border:'1px solid rgba(255,255,255,0.06)', cursor:'default' }}>
      {hasPhoto
        ? <img src={asset(event.photoUrl)} alt={event.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
        : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.12 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          </div>}
      <motion.div animate={{ opacity:hov?1:0 }} transition={{ duration:0.25 }} style={{ position:'absolute', inset:0, background:'rgba(4,5,10,0.78)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
        <p style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'1.1rem', fontWeight:800, color:'#fff', margin:0, textAlign:'center', padding:'0 1rem' }}>{event.name}</p>
        <Pill>{event.date}</Pill>
      </motion.div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'1.5rem 1rem 0.8rem', background:'linear-gradient(to top, rgba(4,5,10,0.9), transparent)' }}>
        <p style={{ fontFamily:'"Space Grotesk", sans-serif', fontSize:'0.85rem', fontWeight:700, color:'#fff', margin:0 }}>{event.name}</p>
        <p style={{ fontFamily:'Inter, sans-serif', fontSize:'0.72rem', color:C.muted, margin:'2px 0 0 0' }}>{event.date}</p>
      </div>
    </motion.div>
  )
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────────── */
function MainPage() {
  const pageRef = useRef(null)
  const [pageH, setPageH] = useState(0)
  useEffect(() => {
    const lenis = new Lenis({ duration:1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10*t)) })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = t => lenis.raf(t*1000)
    gsap.ticker.add(raf); gsap.ticker.lagSmoothing(0)
    const measure = () => { if(pageRef.current) setPageH(pageRef.current.scrollHeight) }
    measure()
    const ro = new ResizeObserver(measure)
    if(pageRef.current) ro.observe(pageRef.current)
    setTimeout(measure, 600)
    return () => { gsap.ticker.remove(raf); lenis.destroy(); ro.disconnect(); ScrollTrigger.getAll().forEach(t=>t.kill()) }
  }, [])
  return (
    <div ref={pageRef} style={{ background:C.bg0, minHeight:'100vh', position:'relative' }}>
      <LogoLines pageH={pageH}/>
      <Hero/>
      <UpcomingSection/>
      <ArchivePreview/>
      <ReleasesSection/>
      <MembersSection/>
      <ContactSection/>
      <Footer/>
    </div>
  )
}

/* ─── APP ───────────────────────────────────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    const l = document.createElement('link')
    l.rel='stylesheet'; l.href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap'
    document.head.appendChild(l)
  }, [])
  return (
    <LangProvider>
      <HashRouter>
        <TopNav/>
        <Routes>
          <Route path="/"        element={<MainPage/>}/>
          <Route path="/archive" element={<ArchivePage/>}/>
        </Routes>
      </HashRouter>
    </LangProvider>
  )
}
