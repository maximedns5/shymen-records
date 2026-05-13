import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { annotate } from 'rough-notation'
import shymenLogo from './assets/shymen-logo.jpeg'
import { CONTACT, MEMBERS, EVENTS, RELEASES, PAST_EVENTS, SOCIALS, DUOS } from './data.js'

gsap.registerPlugin(ScrollTrigger)

/* ─── HELPERS ───────────────────────────────────────────────────────────────── */
const asset = (path) => path ? `${import.meta.env.BASE_URL}${path}` : ''

/* ─── TOKENS ────────────────────────────────────────────────────────────────── */
const C = {
  blue:     '#3552FC',
  blueDim:  'rgba(53,82,252,0.22)',
  blueGlow: 'rgba(53,82,252,0.45)',
  purple:   '#8b5cf6',
  purpleDim:'rgba(139,92,246,0.28)',
  muted:    '#505568',
  text:     'rgba(255,255,255,0.65)',
  bg0: '#04050a',
  bg1: '#070914',
  bg2: '#0f0c1e',
  bg3: '#0c0e1e',
  bg4: '#090b16',
  bg5: '#080a12',
}

/* ─── TRANSLATIONS ──────────────────────────────────────────────────────────── */
const S = {
  FR: {
    nav_book: 'Nous booker',
    scroll:   'Défiler',
    ev_label: 'Upcoming', ev_title: 'Upcoming', ev_tickets: 'Billets ↗', ev_info: 'Info',
    rel_label:'Releases',  rel_title:'Releases',  rel_listen: '▶ SoundCloud',
    mem_label:'L\'équipe', mem_title:'L\'équipe', mem_about: 'Shymen Records est un collectif parisien passionné de musique. Avant tout une bande de potes animés par une seule envie : faire vibrer la salle et passer des nuits qui comptent.',
    mem_cta:  'Voir l\'équipe →',
    mem_back: '← Retour',
    mem_sc:   'SoundCloud', mem_insta: 'Instagram', mem_contact: 'Contact',
    arc_label:'Archive', arc_title:'Souvenirs.', arc_cta:'Voir toutes les photos →', arc_back:'← Retour',
    bk_label: 'Booking',   bk_title:  'Nous booker',
    bk_body:  'Vous souhaitez amener l\'expérience Shymen Records dans votre club, festival ou rave ? On est basés à Paris et on tourne partout dans le monde.',
    bk_cta1:  'Envoyer un mail', bk_cta2: 'Dossier de presse',
    footer:   '© 2026 Shymen Records',
  },
  EN: {
    nav_book: 'Book us',
    scroll:   'Scroll',
    ev_label: 'Upcoming', ev_title: 'Upcoming', ev_tickets: 'Tickets ↗', ev_info: 'Info',
    rel_label:'Releases',  rel_title:'Releases',  rel_listen: '▶ SoundCloud',
    mem_label:'The Crew',  mem_title:'The Crew',  mem_about: 'Shymen Records is a Parisian music collective. First and foremost a crew of friends driven by one thing: making rooms move and creating nights worth remembering.',
    mem_cta:  'Meet the crew →',
    mem_back: '← Back',
    mem_sc:   'SoundCloud', mem_insta: 'Instagram', mem_contact: 'Contact',
    arc_label:'Archive', arc_title:'Souvenirs.', arc_cta:'View all photos →', arc_back:'← Back',
    bk_label: 'Booking',   bk_title:  'Book Us',
    bk_body:  'Looking to bring the Shymen Records experience to your club, festival, or rave? We\'re based in Paris and touring worldwide.',
    bk_cta1:  'Send an email', bk_cta2: 'Press kit',
    footer:   '© 2026 Shymen Records',
  },
}

/* ─── LANG CONTEXT ──────────────────────────────────────────────────────────── */
const LangCtx = createContext({ t: k=>k, lang:'FR', toggle:()=>{} })
function LangProvider({ children }) {
  const [lang, setLang] = useState('FR')
  const t = k => S[lang][k] ?? k
  return <LangCtx.Provider value={{ t, lang, toggle:()=>setLang(l=>l==='FR'?'EN':'FR') }}>{children}</LangCtx.Provider>
}
const useLang = () => useContext(LangCtx)

/* ─── TOP NAV ───────────────────────────────────────────────────────────────── */
function TopNav() {
  const { t, lang, toggle } = useLang()
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 22px', pointerEvents:'none' }}>
      <motion.a href={`mailto:${CONTACT.email}`} whileHover={{ scale:1.06, boxShadow:`0 0 24px ${C.blueGlow}` }} whileTap={{ scale:0.97 }}
        style={{ pointerEvents:'all', borderRadius:999, padding:'9px 20px', border:`1.5px solid ${C.blue}`, background:C.blue, color:'#fff', textDecoration:'none', fontFamily:'"Space Grotesk",sans-serif', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>
        {t('nav_book')}
      </motion.a>
      <motion.button onClick={toggle} whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }}
        style={{ pointerEvents:'all', borderRadius:999, padding:'8px 18px', border:`1.5px solid ${C.blue}`, background:'rgba(4,5,10,0.88)', backdropFilter:'blur(12px)', color:'#fff', cursor:'pointer', outline:'none', fontFamily:'"Space Grotesk",sans-serif', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ color:C.blue }}>{lang}</span>
        <span style={{ color:C.muted, fontSize:'0.6rem' }}>›</span>
        <span style={{ color:C.muted }}>{lang==='FR'?'EN':'FR'}</span>
      </motion.button>
    </div>
  )
}

/* ─── SHARED ────────────────────────────────────────────────────────────────── */
function Btn({ children, filled=false, href, onClick, style={} }) {
  const base = { borderRadius:999, padding:'11px 26px', border:`1.5px solid ${C.blue}`, background:filled?C.blue:'transparent', color:'#fff', cursor:'pointer', fontFamily:'"Space Grotesk",sans-serif', fontSize:'0.76rem', letterSpacing:'0.11em', textTransform:'uppercase', fontWeight:700, outline:'none', display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', transition:'box-shadow 0.3s', ...style }
  const hover = { scale:1.04, boxShadow:`0 0 28px ${C.blueGlow}` }
  if (href) return <motion.a href={href} target={href.startsWith('http')?'_blank':undefined} rel="noopener noreferrer" whileHover={hover} whileTap={{ scale:0.97 }} style={base}>{children}</motion.a>
  return <motion.button onClick={onClick||(()=>{})} whileHover={hover} whileTap={{ scale:0.97 }} style={base}>{children}</motion.button>
}

function Pill({ children, color=C.blue }) {
  const p = color===C.purple
  return <span style={{ borderRadius:999, padding:'4px 11px', background:p?'rgba(139,92,246,0.1)':'rgba(53,82,252,0.1)', border:`1px solid ${p?'rgba(139,92,246,0.28)':'rgba(53,82,252,0.28)'}`, color, fontSize:'0.67rem', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700, fontFamily:'"Space Grotesk",sans-serif', whiteSpace:'nowrap' }}>{children}</span>
}

function FadeUp({ children, delay=0, y=36, style={} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px 0px' })
  return <motion.div ref={ref} initial={{ opacity:0, y }} animate={inView?{ opacity:1, y:0 }:{}} transition={{ duration:0.75, delay, ease:[0.16,1,0.3,1] }} style={style}>{children}</motion.div>
}

function SecLabel({ text }) {
  return <p style={{ color:C.blue, fontSize:'0.7rem', letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, marginBottom:'0.9rem' }}>— {text}</p>
}

function SecTitle({ text }) {
  return <h2 style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'clamp(2rem,5vw,3.8rem)', fontWeight:800, color:'#fff', margin:'0 0 1.1rem 0', letterSpacing:'-0.025em', lineHeight:1.05 }}>{text}</h2>
}

function DrawLine({ color=C.blue, width=130, glow, center=false }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    gsap.set(ref.current, { scaleX:0, transformOrigin:center?'center center':'left center' })
    const trig = ScrollTrigger.create({ trigger:ref.current, start:'top 78%', onEnter:()=>gsap.to(ref.current,{ scaleX:1, duration:1.1, ease:'power3.out' }) })
    return () => trig.kill()
  }, [])
  return <div ref={ref} style={{ height:2, width, background:color, borderRadius:2, boxShadow:glow?`0 0 12px ${glow}`:`0 0 10px ${C.blueGlow}`, marginBottom:'2.8rem', ...(center?{ margin:'0 auto 2.8rem auto' }:{}) }} />
}

/* ─── LOGO LINES — 8 fils torsadés, 4 par côté ──────────────────────────────── */
function LogoLines({ pageH }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current || pageH === 0) return
    const paths = Array.from(svgRef.current.querySelectorAll('.lp'))
    const ctx = gsap.context(() => {
      paths.forEach((path, i) => {
        const len = path.getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: `${1.2 + i * 0.6}% top`,
            end:   '90% top',
            scrub: 1.8 + (i % 4) * 0.08,
          },
        })
      })
    }, svgRef)
    return () => ctx.revert()
  }, [pageH])

  if (pageH === 0) return null
  const W = 1440, H = pageH

  /*
   * mkBraid — génère un fil qui suit le zigzag ET tourne autour du chemin central.
   *
   * right      : direction du premier virage
   * margin     : distance du bord pour les virages
   * startY     : Y de départ (près du logo)
   * phase      : décalage angulaire (rad) — différent pour chaque fil du même groupe
   * braidR     : rayon de la torsade en pixels SVG (~50px dans un repère 1440px)
   * twists     : nombre de rotations complètes sur toute la hauteur de la page
   */
  const mkBraid = (right, margin, startY, phase, braidR = 52, twists = 3) => {
    const L = margin, R = W - margin
    const anchors = [0.13, 0.26, 0.39, 0.52, 0.65, 0.78, 0.92].map(p => H * p)
    const mainXs  = right ? [R,L,R,L,R,L,R] : [L,R,L,R,L,R,L]
    const totalY  = anchors[anchors.length - 1] - startY
    const SUB     = 8   // sous-points par jambe pour une courbe lisse

    // Accumule les points (x, y) en appliquant l'offset de torsade en x
    const pts = [[720 + braidR * Math.cos(phase), startY]]

    for (let leg = 0; leg < anchors.length; leg++) {
      const prevX = leg === 0 ? 720      : mainXs[leg - 1]
      const prevY = leg === 0 ? startY   : anchors[leg - 1]
      const nextX = mainXs[leg]
      const nextY = anchors[leg]

      for (let s = 1; s <= SUB; s++) {
        const t   = s / SUB
        const x   = prevX + (nextX - prevX) * t
        const y   = prevY + (nextY - prevY) * t
        const prg = (y - startY) / totalY            // 0 → 1 sur toute la page
        const ang = phase + prg * twists * Math.PI * 2
        pts.push([x + braidR * Math.cos(ang), y])
      }
    }

    // Spline quadratique lisse : on passe par les mid-points
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = ((pts[i][0] + pts[i+1][0]) / 2).toFixed(1)
      const my = ((pts[i][1] + pts[i+1][1]) / 2).toFixed(1)
      d += ` Q ${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${mx},${my}`
    }
    const last = pts[pts.length - 1]
    d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`
    return d
  }

  const PI = Math.PI
  /*
   * Groupe bleu  : 4 fils qui torsadent autour du zigzag droite-premier
   * Groupe violet: 4 fils qui torsadent autour du zigzag gauche-premier
   * Phases espacées de π/2 (90°) → croisements tous les demi-tours
   */
  const LINES = [
    // ── Groupe bleu (zigzag droite) ────────────────────────────────────
    { d: mkBraid(true,  20, 355, 0          ), sw:4, op:0.88, color:C.blue   },
    { d: mkBraid(true,  20, 355, PI*0.5     ), sw:3, op:0.58, color:C.blue   },
    { d: mkBraid(true,  20, 355, PI         ), sw:2, op:0.32, color:C.blue   },
    { d: mkBraid(true,  20, 355, PI*1.5     ), sw:1, op:0.16, color:C.blue   },
    // ── Groupe violet (zigzag gauche) ──────────────────────────────────
    { d: mkBraid(false, 26, 368, PI*0.25    ), sw:4, op:0.75, color:C.purple },
    { d: mkBraid(false, 26, 368, PI*0.75    ), sw:3, op:0.48, color:C.purple },
    { d: mkBraid(false, 26, 368, PI*1.25    ), sw:2, op:0.26, color:C.purple },
    { d: mkBraid(false, 26, 368, PI*1.75    ), sw:1, op:0.13, color:C.purple },
  ]

  return (
    <svg ref={svgRef} aria-hidden="true"
      style={{
        position:'absolute', top:0, left:0, width:'100%', height:'100%',
        pointerEvents:'none', zIndex:1, overflow:'visible',
        filter:'drop-shadow(0 0 7px rgba(53,82,252,0.55))',
        transform:'translateZ(0)',
      }}
      viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
    >
      {LINES.map(({ d, sw, op, color }, i) => (
        <path key={i} className="lp" d={d} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round" opacity={op}/>
      ))}
    </svg>
  )
}

/* ─── HERO ──────────────────────────────────────────────────────────────────── */
function Hero() {
  const { t } = useLang()
  const wrapRef  = useRef(null)
  const logoRef  = useRef(null)
  const glowRef  = useRef(null)

  useEffect(() => {
    /* Glow pulse — simple GSAP repeat, pas de scroll */
    gsap.to(glowRef.current, { scale:1.18, opacity:0.65, duration:3, ease:'sine.inOut', yoyo:true, repeat:-1 })

    /* Logo flottement — GSAP, pas de Framer Motion scroll */
    gsap.to(logoRef.current, { y:-10, rotation:1.2, duration:3.5, ease:'sine.inOut', yoyo:true, repeat:-1 })

    /* Parallax hero au scroll — GSAP ScrollTrigger, pas de useTransform */
    const ctx = gsap.context(() => {
      gsap.to(wrapRef.current, {
        y: -60, ease:'none',
        scrollTrigger: { trigger:'#hero', start:'top top', end:'bottom top', scrub:1 },
      })
      gsap.to(logoRef.current, {
        scale: 0.65, opacity: 0, ease:'none',
        scrollTrigger: { trigger:'#hero', start:'top top', end:'40% top', scrub:1 },
      })
    })
    return () => ctx.revert()
  }, [])

  const stg = { hidden:{}, visible:{ transition:{ staggerChildren:0.13 } } }
  const itm = { hidden:{ opacity:0, y:44 }, visible:{ opacity:1, y:0, transition:{ duration:0.9, ease:[0.16,1,0.3,1] } } }

  return (
    <section id="hero" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', padding:'0 2rem', overflow:'hidden', background:C.bg0 }}>
      <div ref={glowRef} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:640, height:640, borderRadius:'50%', background:`radial-gradient(circle, ${C.blueGlow} 0%, transparent 68%)`, opacity:0.28, pointerEvents:'none' }}/>
      <motion.div ref={wrapRef} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1.8rem', position:'relative', zIndex:2 }} variants={stg} initial="hidden" animate="visible">
        <motion.div variants={itm}>
          <img ref={logoRef} src={shymenLogo} alt="Shymen Records"
            style={{ width:'clamp(180px,30vw,360px)', height:'auto', borderRadius:20, display:'block', filter:`drop-shadow(0 0 30px ${C.blueGlow})` }}/>
        </motion.div>
        <motion.h1 variants={itm} style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'clamp(2.4rem,7vw,6rem)', fontWeight:800, color:'#fff', margin:0, letterSpacing:'-0.03em', lineHeight:1, textTransform:'uppercase', textAlign:'center' }}>
          Shymen Records
        </motion.h1>
        <motion.div variants={itm} style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', justifyContent:'center' }}>
          {['Hard House','Trance','Hard Bounce','Techno'].map(g => <Pill key={g}>{g}</Pill>)}
        </motion.div>
        <motion.div variants={itm} style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
          <Btn filled onClick={() => document.getElementById('events')?.scrollIntoView({ behavior:'smooth' })}>{t('ev_title')}</Btn>
          <Btn onClick={() => document.getElementById('releases')?.scrollIntoView({ behavior:'smooth' })}>{t('rel_title')}</Btn>
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}
        style={{ position:'absolute', bottom:'2.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <span style={{ color:C.muted, fontSize:'0.62rem', letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:'"Space Grotesk",sans-serif' }}>{t('scroll')}</span>
        <motion.div animate={{ y:[0,10,0] }} transition={{ duration:1.5, repeat:Infinity, ease:'easeInOut' }} style={{ width:1, height:36, background:`linear-gradient(to bottom, ${C.blue}, transparent)` }}/>
      </motion.div>
    </section>
  )
}

/* ─── UPCOMING ──────────────────────────────────────────────────────────────── */
function UpcomingSection() {
  const { t } = useLang()
  return (
    <section id="events" style={{ padding:'clamp(5rem,9vw,8rem) clamp(1.5rem,7vw,7rem)', position:'relative', background:C.bg1 }}>
      <FadeUp><SecLabel text={t('ev_label')}/><SecTitle text={t('ev_title')}/><DrawLine /></FadeUp>
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
      {event.flyer && <div style={{ gridColumn:'1/-1', height:120, borderRadius:14, overflow:'hidden', marginBottom:'0.5rem' }}><img src={asset(event.flyer)} alt={event.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/></div>}
      <div>
        <p style={{ color:C.blue, fontSize:'0.7rem', letterSpacing:'0.16em', textTransform:'uppercase', fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, marginBottom:'0.35rem' }}>{event.date}</p>
        <h3 style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'clamp(1.15rem,2.8vw,1.9rem)', fontWeight:800, color:'#fff', margin:'0 0 0.35rem 0', letterSpacing:'-0.015em' }}>{event.name}</h3>
        <p style={{ color:C.muted, fontSize:'0.83rem', margin:'0 0 0.7rem 0', fontFamily:'Inter,sans-serif' }}>{event.venue} · {event.city}</p>
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'0.7rem' }}>{event.tags.map(tag=><Pill key={tag}>{tag}</Pill>)}</div>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', margin:0, fontFamily:'Inter,sans-serif' }}>{event.lineup.join(' · ')}</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem', alignItems:'flex-end' }}>
        <Btn filled href={event.ticketUrl||undefined} onClick={!event.ticketUrl?()=>{}:undefined} style={{ fontSize:'0.7rem', padding:'9px 18px' }}>{t('ev_tickets')}</Btn>
        <Btn href={event.infoUrl||undefined} onClick={!event.infoUrl?()=>{}:undefined} style={{ fontSize:'0.7rem', padding:'9px 18px' }}>{t('ev_info')}</Btn>
      </div>
    </motion.div>
  )
}

/* ─── ARCHIVE PREVIEW ────────────────────────────────────────────────────────── */
function ArchivePreview() {
  const { t } = useLang()
  const gridRef = useRef(null)
  // Parallax supprimé — trop coûteux sur mobile/low-end GPU
  useEffect(() => {}, [])

  return (
    <section id="archive" style={{ padding:'clamp(5rem,9vw,8rem) clamp(1.5rem,7vw,7rem)', position:'relative', background:C.bg2 }}>
      <FadeUp><SecLabel text={t('arc_label')}/><SecTitle text={t('arc_title')}/><DrawLine color={`linear-gradient(to right, ${C.purple}, ${C.blue})`} glow={C.purpleDim}/></FadeUp>
      <div ref={gridRef} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.9rem', marginBottom:'2.5rem' }}>
        {PAST_EVENTS.slice(0,6).map((ev,i) => (
          <FadeUp key={ev.id} delay={i*0.07}>
            <motion.div className="gi" style={{ gridColumn:i===0||i===3?'span 2':'span 1', borderRadius:22, overflow:'hidden', position:'relative', aspectRatio:i===0||i===3?'16/7':'1/1', background:ev.photoUrl?`url(${asset(ev.photoUrl)}) center/cover`:`linear-gradient(135deg, rgba(53,82,252,0.12),rgba(139,92,246,0.08))`, border:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ position:'absolute', bottom:12, left:14 }}><p style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'0.72rem', color:'rgba(255,255,255,0.42)', margin:0 }}>{ev.name} · {ev.date}</p></div>
            </motion.div>
          </FadeUp>
        ))}
      </div>
      <FadeUp style={{ display:'flex', justifyContent:'center' }}>
        <Link to="/archive" style={{ textDecoration:'none' }}><Btn filled>{t('arc_cta')}</Btn></Link>
      </FadeUp>
    </section>
  )
}

/* ─── RELEASES ──────────────────────────────────────────────────────────────── */
function ReleasesSection() {
  const { t } = useLang()
  return (
    <section id="releases" style={{ padding:'clamp(5rem,9vw,8rem) clamp(1.5rem,7vw,7rem)', position:'relative', background:C.bg3 }}>
      <FadeUp><SecLabel text={t('rel_label')}/><SecTitle text={t('rel_title')}/><DrawLine color={`linear-gradient(to right, ${C.blue},${C.purple})`} glow={C.blueDim}/></FadeUp>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem' }}>
        {RELEASES.map((r,i) => <FadeUp key={r.id} delay={i*0.07}><ReleaseCard release={r}/></FadeUp>)}
      </div>
    </section>
  )
}

function ReleaseCard({ release }) {
  const { t } = useLang()
  return (
    <motion.div whileHover={{ scale:1.02, boxShadow:`0 20px 60px rgba(53,82,252,0.18)` }}
      style={{ borderRadius:22, border:'1px solid rgba(255,255,255,0.055)', background:'rgba(0,0,0,0.3)', overflow:'hidden' }}>
      <div style={{ height:170, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:release.coverImage?'none':`linear-gradient(135deg,rgba(53,82,252,0.18),rgba(139,92,246,0.08))` }}>
        {release.coverImage
          ? <img src={asset(release.coverImage)} alt={release.title} style={{ width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0 }}/>
          : <motion.div animate={{ rotate:360 }} transition={{ duration:18, repeat:Infinity, ease:'linear' }}
              style={{ width:64, height:64, borderRadius:'50%', border:`1px solid rgba(53,82,252,0.35)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:18, height:18, borderRadius:'50%', background:C.blue, boxShadow:`0 0 16px ${C.blueGlow}` }}/>
            </motion.div>}
        <span style={{ position:'absolute', top:10, right:12, background:'rgba(0,0,0,0.6)', borderRadius:999, padding:'3px 10px', fontSize:'0.62rem', color:C.muted, fontFamily:'"Space Grotesk",sans-serif', letterSpacing:'0.08em', zIndex:1 }}>{release.bpm}</span>
      </div>
      <div style={{ padding:'1.15rem 1.35rem' }}>
        <h3 style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'1.05rem', fontWeight:700, color:'#fff', margin:'0 0 0.22rem 0' }}>{release.title}</h3>
        <p style={{ color:C.muted, fontSize:'0.8rem', margin:'0 0 1rem 0', fontFamily:'Inter,sans-serif' }}>{release.artist} · Shymen Records · {release.year}</p>
        <Btn href={release.soundcloudUrl||undefined} style={{ width:'100%', justifyContent:'center', fontSize:'0.7rem', padding:'9px 14px' }}>{t('rel_listen')}</Btn>
      </div>
    </motion.div>
  )
}

/* ─── MEMBERS TEASER (home page) ─────────────────────────────────────────────── */
function MembersTeaser() {
  const { t } = useLang()
  return (
    <section id="members" style={{ padding:'clamp(5rem,9vw,8rem) clamp(1.5rem,7vw,7rem)', background:C.bg4 }}>
      <FadeUp><SecLabel text={t('mem_label')}/><SecTitle text={t('mem_title')}/><DrawLine /></FadeUp>
      <FadeUp delay={0.1} style={{ maxWidth:640, marginBottom:'3rem' }}>
        <p style={{ fontFamily:'Inter,sans-serif', fontSize:'clamp(0.95rem,1.6vw,1.1rem)', lineHeight:1.82, color:C.text }}>{t('mem_about')}</p>
      </FadeUp>
      <FadeUp delay={0.2}>
        <Link to="/members" style={{ textDecoration:'none' }}><Btn filled>{t('mem_cta')}</Btn></Link>
      </FadeUp>
    </section>
  )
}

/* ─── CONTACT ───────────────────────────────────────────────────────────────── */
function ContactSection() {
  const { t } = useLang()
  const emailRef = useRef(null)
  useEffect(() => {
    if (!emailRef.current) return
    const timer = setTimeout(() => {
      const ann = annotate(emailRef.current, { type:'box', color:C.blue, animationDuration:800, strokeWidth:2, padding:6 })
      const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){ ann.show(); obs.disconnect() } }, { threshold:0.8 })
      obs.observe(emailRef.current)
    }, 600)
    return () => clearTimeout(timer)
  }, [])
  return (
    <section id="contact" style={{ padding:'clamp(5rem,9vw,8rem) clamp(1.5rem,7vw,7rem)', position:'relative', textAlign:'center', background:C.bg0 }}>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 60%, rgba(53,82,252,0.05) 0%, transparent 65%)`, pointerEvents:'none' }}/>
      <FadeUp><SecLabel text={t('bk_label')}/><SecTitle text={t('bk_title')}/><DrawLine width={80} color={`linear-gradient(to right, transparent, ${C.blue}, transparent)`} center/></FadeUp>
      <FadeUp delay={0.15} style={{ maxWidth:520, margin:'0 auto 2.4rem auto' }}>
        <p style={{ fontFamily:'Inter,sans-serif', fontSize:'clamp(0.95rem,1.6vw,1.08rem)', color:C.text, lineHeight:1.75 }}>{t('bk_body')}</p>
      </FadeUp>
      <FadeUp delay={0.25} style={{ marginBottom:'2.8rem' }}>
        <a href={`mailto:${CONTACT.email}`} style={{ textDecoration:'none' }}>
          <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'clamp(1rem,2.5vw,1.4rem)', fontWeight:700, color:'#fff', margin:0 }}>
            <span ref={emailRef}>{CONTACT.email}</span>
          </p>
        </a>
      </FadeUp>
      <FadeUp delay={0.35}>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
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
  return (
    <footer style={{ borderTop:'1px solid rgba(255,255,255,0.055)', padding:'2.2rem clamp(1.5rem,7vw,7rem)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', background:C.bg5 }}>
      <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'0.82rem', color:C.muted, margin:0 }}>{t('footer')}</p>
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
        {[['Instagram',SOCIALS.instagram],['SoundCloud',SOCIALS.soundcloud],['Resident Advisor',SOCIALS.residentAdvisor],['Boiler Room',SOCIALS.boilerRoom]].map(([label,url]) => (
          <motion.a key={label} href={url||'#'} onClick={!url?e=>e.preventDefault():undefined}
            target={url?'_blank':undefined} rel="noopener noreferrer" whileHover={{ borderColor:C.blue, color:'#fff' }}
            style={{ borderRadius:999, padding:'6px 13px', border:`1px solid ${url?'rgba(53,82,252,0.4)':'rgba(255,255,255,0.12)'}`, color:url?'#ccc':C.muted, fontSize:'0.68rem', letterSpacing:'0.09em', textTransform:'uppercase', textDecoration:'none', fontFamily:'"Space Grotesk",sans-serif', fontWeight:600, transition:'border-color 0.3s, color 0.3s' }}>
            {label}
          </motion.a>
        ))}
      </div>
    </footer>
  )
}

/* ─── MEMBERS PAGE — pleine largeur, alternance gauche/droite ───────────────── */
function MembersPage() {
  const { t } = useLang()
  useEffect(() => { window.scrollTo(0,0) }, [])

  // Construit la liste d'affichage : duos regroupés, solos individuels
  const inDuo = new Set(DUOS.flatMap(d => d.members))
  const rendered = new Set()
  const rows = []

  MEMBERS.forEach(member => {
    if (rendered.has(member.name)) return
    const duo = DUOS.find(d => d.members.includes(member.name))
    if (duo) {
      const mems = duo.members.map(n => MEMBERS.find(m => m.name === n)).filter(Boolean)
      rows.push({ type:'duo', duo, members:mems })
      duo.members.forEach(n => rendered.add(n))
    } else {
      rows.push({ type:'solo', member })
      rendered.add(member.name)
    }
  })

  return (
    <div style={{ minHeight:'100vh', background:C.bg0 }}>
      {/* Header */}
      <div style={{ padding:'clamp(5rem,8vw,7rem) clamp(1.5rem,7vw,7rem) 0' }}>
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }} style={{ marginBottom:'3rem' }}>
          <Link to="/" style={{ textDecoration:'none' }}><Btn style={{ fontSize:'0.75rem', padding:'9px 20px' }}>{t('mem_back')}</Btn></Link>
        </motion.div>
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}>
          <SecLabel text={t('mem_label')}/>
          <h1 style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:800, color:'#fff', margin:'0 0 1rem 0', letterSpacing:'-0.03em' }}>{t('mem_title')}</h1>
          <div style={{ height:2, width:100, background:`linear-gradient(to right, ${C.blue}, ${C.purple})`, borderRadius:2, boxShadow:`0 0 12px ${C.blueGlow}` }}/>
        </motion.div>
      </div>

      {/* Rows */}
      <div>
        {rows.map((row, idx) =>
          row.type === 'duo'
            ? <DuoRow key={row.duo.id} duo={row.duo} members={row.members} rowIndex={idx}/>
            : <SoloRow key={row.member.name} member={row.member} rowIndex={idx}/>
        )}
      </div>
    </div>
  )
}

function SoloRow({ member, rowIndex }) {
  const { t } = useLang()
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-100px 0px' })
  const photoLeft = rowIndex % 2 === 0
  const hasPhoto = !!member.photoUrl

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:40 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
      style={{ display:'flex', flexDirection:photoLeft?'row':'row-reverse', flexWrap:'wrap', alignItems:'stretch', borderBottom:'1px solid rgba(255,255,255,0.06)', minHeight:'50vh' }}
    >
      {/* Photo */}
      <div style={{ flex:'0 0 min(45%, 100%)', minWidth:'min(320px,100%)', background:hasPhoto?'none':`linear-gradient(135deg, rgba(53,82,252,0.18), rgba(139,92,246,0.1))`, position:'relative', overflow:'hidden', minHeight:320 }}>
        {hasPhoto
          ? <img src={asset(member.photoUrl)} alt={member.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }}/>
          : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
              <div style={{ width:80, height:80, borderRadius:'50%', background:`rgba(53,82,252,0.2)`, border:`2px solid rgba(53,82,252,0.3)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Space Grotesk",sans-serif', fontSize:'1.8rem', fontWeight:800, color:C.blue }}>
                {member.name.replace(/'/g,'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <p style={{ color:C.muted, fontSize:'0.7rem', fontFamily:'"Space Grotesk",sans-serif', letterSpacing:'0.1em', textTransform:'uppercase' }}>Photo à venir</p>
            </div>}
        {/* Overlay gradient sur la photo */}
        {hasPhoto && <div style={{ position:'absolute', inset:0, background:photoLeft?'linear-gradient(to right, transparent 60%, rgba(4,5,10,0.6))':'linear-gradient(to left, transparent 60%, rgba(4,5,10,0.6))' }}/>}
      </div>

      {/* Info */}
      <div style={{ flex:1, minWidth:'min(280px,100%)', padding:'clamp(2.5rem,5vw,4rem) clamp(2rem,5vw,5rem)', display:'flex', flexDirection:'column', justifyContent:'center', gap:'1.5rem', background:C.bg0 }}>
        <div>
          <p style={{ color:C.blue, fontSize:'0.68rem', letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, marginBottom:'0.6rem' }}>
            {member.role}
          </p>
          <h2 style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'clamp(2rem,4vw,3.5rem)', fontWeight:800, color:'#fff', margin:0, letterSpacing:'-0.02em', lineHeight:1 }}>
            {member.name}
          </h2>
        </div>
        <div style={{ display:'flex', gap:'0.8rem', flexWrap:'wrap' }}>
          {member.soundcloudUrl !== null &&
            <Btn href={member.soundcloudUrl||undefined} style={{ fontSize:'0.72rem', padding:'10px 22px' }}>{t('mem_sc')}</Btn>}
          {member.instagramUrl !== undefined &&
            <Btn href={member.instagramUrl||undefined} style={{ fontSize:'0.72rem', padding:'10px 22px' }}>{t('mem_insta')}</Btn>}
          {member.soundcloudUrl === null &&
            <Btn href={`mailto:${member.contactEmail||CONTACT.email}`} style={{ fontSize:'0.72rem', padding:'10px 22px', borderColor:C.purple, color:C.purple }}>{t('mem_contact')}</Btn>}
        </div>
      </div>
    </motion.div>
  )
}

function DuoRow({ duo, members, rowIndex }) {
  const { t } = useLang()
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-100px 0px' })
  const photoLeft = rowIndex % 2 === 0
  const hasPhoto = !!duo.photoUrl

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:40 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
      style={{ display:'flex', flexDirection:photoLeft?'row':'row-reverse', flexWrap:'wrap', alignItems:'stretch', borderBottom:'1px solid rgba(255,255,255,0.06)', minHeight:'55vh' }}
    >
      {/* Photo partagée */}
      <div style={{ flex:'0 0 min(50%, 100%)', minWidth:'min(320px,100%)', background:hasPhoto?'none':`linear-gradient(135deg, rgba(139,92,246,0.18), rgba(53,82,252,0.1))`, position:'relative', overflow:'hidden', minHeight:360 }}>
        {hasPhoto
          ? <img src={asset(duo.photoUrl)} alt={duo.label} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }}/>
          : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
              <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'clamp(1rem,2vw,1.4rem)', fontWeight:700, color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'0 2rem' }}>{duo.label}</p>
              <p style={{ color:C.muted, fontSize:'0.7rem', fontFamily:'"Space Grotesk",sans-serif', letterSpacing:'0.1em', textTransform:'uppercase' }}>Photo à venir</p>
            </div>}
        {hasPhoto && <div style={{ position:'absolute', inset:0, background:photoLeft?'linear-gradient(to right, transparent 60%, rgba(4,5,10,0.6))':'linear-gradient(to left, transparent 60%, rgba(4,5,10,0.6))' }}/>}
        {/* Badge DUO */}
        <div style={{ position:'absolute', top:20, left:20, borderRadius:999, padding:'5px 14px', background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.4)', color:C.purple, fontSize:'0.65rem', fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>
          b2b
        </div>
      </div>

      {/* Infos des 2 membres */}
      <div style={{ flex:1, minWidth:'min(280px,100%)', padding:'clamp(2.5rem,5vw,4rem) clamp(2rem,5vw,5rem)', display:'flex', flexDirection:'column', justifyContent:'center', gap:'2.5rem', background:C.bg0 }}>
        {members.map((member, mi) => (
          <div key={member.name} style={{ paddingTop:mi>0?'2.5rem':0, borderTop:mi>0?'1px solid rgba(255,255,255,0.07)':undefined }}>
            <p style={{ color:C.purple, fontSize:'0.68rem', letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, marginBottom:'0.5rem' }}>
              {member.role}
            </p>
            <h2 style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'clamp(1.6rem,3vw,2.8rem)', fontWeight:800, color:'#fff', margin:'0 0 1rem 0', letterSpacing:'-0.02em', lineHeight:1 }}>
              {member.name}
            </h2>
            <div style={{ display:'flex', gap:'0.7rem', flexWrap:'wrap' }}>
              {member.soundcloudUrl !== null &&
                <Btn href={member.soundcloudUrl||undefined} style={{ fontSize:'0.7rem', padding:'9px 18px' }}>{t('mem_sc')}</Btn>}
              {member.instagramUrl !== undefined &&
                <Btn href={member.instagramUrl||undefined} style={{ fontSize:'0.7rem', padding:'9px 18px' }}>{t('mem_insta')}</Btn>}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── ARCHIVE PAGE ───────────────────────────────────────────────────────────── */
function ArchivePage() {
  const { t } = useLang()
  useEffect(() => { window.scrollTo(0,0) }, [])
  return (
    <div style={{ minHeight:'100vh', background:C.bg0, padding:'clamp(5rem,8vw,7rem) clamp(1.5rem,6vw,6rem)' }}>
      <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }} style={{ marginBottom:'3rem' }}>
        <Link to="/" style={{ textDecoration:'none' }}><Btn style={{ fontSize:'0.75rem', padding:'9px 20px' }}>{t('arc_back')}</Btn></Link>
      </motion.div>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}>
        <SecLabel text={t('arc_label')}/>
        <h1 style={{ fontFamily:'"Space Grotesk",sans-serif', fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:800, color:'#fff', margin:'0 0 1rem 0', letterSpacing:'-0.03em' }}>{t('arc_title')}</h1>
        <div style={{ height:2, width:100, background:`linear-gradient(to right, ${C.purple},${C.blue})`, borderRadius:2, boxShadow:`0 0 12px ${C.blueGlow}`, marginBottom:'3rem' }}/>
      </motion.div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
        {PAST_EVENTS.map((ev,i) => (
          <motion.div key={ev.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:i*0.05, ease:[0.16,1,0.3,1] }}>
            <ArchiveCard event={ev}/>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ArchiveCard({ event }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      whileHover={{ scale:1.02, boxShadow:`0 20px 50px rgba(53,82,252,0.2)` }}
      style={{ borderRadius:20, overflow:'hidden', position:'relative', aspectRatio:'4/3', background:`linear-gradient(135deg,rgba(53,82,252,0.15),rgba(139,92,246,0.08))`, border:'1px solid rgba(255,255,255,0.06)' }}>
      {event.photoUrl && <img src={asset(event.photoUrl)} alt={event.name} style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover' }}/>}
      {!event.photoUrl && <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',opacity:0.1 }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>}
      <motion.div animate={{ opacity:hov?1:0 }} transition={{ duration:0.25 }} style={{ position:'absolute',inset:0,background:'rgba(4,5,10,0.78)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10 }}>
        <p style={{ fontFamily:'"Space Grotesk",sans-serif',fontSize:'1.1rem',fontWeight:800,color:'#fff',margin:0,textAlign:'center',padding:'0 1rem' }}>{event.name}</p>
        <Pill>{event.date}</Pill>
      </motion.div>
      <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:'1.5rem 1rem 0.8rem',background:'linear-gradient(to top,rgba(4,5,10,0.9),transparent)' }}>
        <p style={{ fontFamily:'"Space Grotesk",sans-serif',fontSize:'0.85rem',fontWeight:700,color:'#fff',margin:0 }}>{event.name}</p>
        <p style={{ fontFamily:'Inter,sans-serif',fontSize:'0.72rem',color:C.muted,margin:'2px 0 0 0' }}>{event.date}</p>
      </div>
    </motion.div>
  )
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────────── */
function MainPage() {
  const pageRef = useRef(null)
  const [pageH, setPageH] = useState(0)
  useEffect(() => {
    const lenis = new Lenis({ duration:1.1, easing: t=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel:true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = t => lenis.raf(t*1000)
    gsap.ticker.add(raf); gsap.ticker.lagSmoothing(0)
    const measure = () => { if(pageRef.current) setPageH(pageRef.current.scrollHeight) }
    measure()
    const ro = new ResizeObserver(measure)
    if(pageRef.current) ro.observe(pageRef.current)
    setTimeout(measure, 500)
    return () => { gsap.ticker.remove(raf); lenis.destroy(); ro.disconnect(); ScrollTrigger.getAll().forEach(t=>t.kill()) }
  }, [])
  return (
    <div ref={pageRef} style={{ background:C.bg0, minHeight:'100vh', position:'relative' }}>
      <LogoLines pageH={pageH}/>
      <Hero/>
      <UpcomingSection/>
      <ArchivePreview/>
      <ReleasesSection/>
      <MembersTeaser/>
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
          <Route path="/members" element={<MembersPage/>}/>
          <Route path="/archive" element={<ArchivePage/>}/>
        </Routes>
      </HashRouter>
    </LangProvider>
  )
}
