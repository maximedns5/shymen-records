// ╔══════════════════════════════════════════════════════════════════════════╗
// ║              SHYMEN RECORDS — FICHIER DE CONFIGURATION                  ║
// ║  Modifie ce fichier pour mettre à jour tout le contenu du site.         ║
// ║  Pas besoin de toucher au reste du code.                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─── CONTACT ─────────────────────────────────────────────────────────────────
// Adresse email de booking (apparaît dans la section contact + bouton en haut)
export const CONTACT = {
  email: 'booking@shymenrecords.com',
  city:  'Paris, France',
}

// ─── MEMBRES ─────────────────────────────────────────────────────────────────
// photoUrl   → mets la photo dans  public/assets/members/  puis écris  "assets/members/fleche.jpg"
// soundcloudUrl → lien complet vers le profil SoundCloud, ex: "https://soundcloud.com/fleche"
// instagramUrl  → lien Instagram, ex: "https://instagram.com/fleche"
export const MEMBERS = [
  {
    name: "Flèche",
    role: "DJ",
    soundcloudUrl: '',          // ← ex: "https://soundcloud.com/fleche"
    instagramUrl:  '',
    photoUrl:      '',          // ← ex: "assets/members/fleche.jpg"
  },
  {
    name: "K'gnard",
    role: "DJ & Producer",
    soundcloudUrl: '',
    instagramUrl:  '',
    photoUrl:      '',
  },
  {
    name: "Jeff Pesos",
    role: "DJ",
    soundcloudUrl: '',
    instagramUrl:  '',
    photoUrl:      '',
  },
  {
    name: "Youpi",
    role: "DJ",
    soundcloudUrl: '',
    instagramUrl:  '',
    photoUrl:      '',
  },
  {
    name: "K'rcher",
    role: "DJ",
    soundcloudUrl: '',
    instagramUrl:  '',
    photoUrl:      '',
  },
  {
    name: "Haled",
    role: "DJ",
    soundcloudUrl: '',
    instagramUrl:  '',
    photoUrl:      '',
  },
  {
    name: "Padrino",
    role: "DJ",
    soundcloudUrl: '',
    instagramUrl:  '',
    photoUrl:      '',
  },
  {
    name: "Jee",
    role: "DJ",
    soundcloudUrl: '',
    instagramUrl:  '',
    photoUrl:      '',
  },
  {
    name: "Choco",
    role: "DJ",
    soundcloudUrl: '',
    instagramUrl:  '',
    photoUrl:      '',
  },
  {
    name: "BouBou",
    role: "Producer",
    soundcloudUrl: '',
    instagramUrl:  '',
    photoUrl:      '',
  },
  {
    name: "Capu",
    role: "Comms",
    soundcloudUrl: null,        // null = pas de SoundCloud → bouton "Contact" à la place
    instagramUrl:  '',
    photoUrl:      '',
    contactEmail:  '',          // ← email direct pour Capu si différent du booking général
  },
]

// ─── PROCHAINES SOIRÉES ───────────────────────────────────────────────────────
// ticketUrl → lien billetterie, ex: "https://shotgun.live/events/..."
// infoUrl   → lien Facebook Event ou page info
// flyer     → image du flyer dans  public/assets/events/  ex: "assets/events/infinite-voltage.jpg"
export const EVENTS = [
  {
    id: 1,
    date: "SAT · 24 MAY 2026",
    name: "INFINITE VOLTAGE",
    venue: "Warehouse 23",
    city: "Paris",
    lineup: ["Flèche b2b K'gnard", "Jeff Pesos", "BouBou"],
    tags: ["All night", "Indoor"],
    ticketUrl: '',              // ← ex: "https://shotgun.live/events/infinite-voltage"
    infoUrl:   '',              // ← ex: "https://facebook.com/events/123456"
    flyer:     '',              // ← ex: "assets/events/infinite-voltage.jpg"
  },
  {
    id: 2,
    date: "FRI · 13 JUN 2026",
    name: "ACID FREQUENCIES",
    venue: "Le Bataclan",
    city: "Paris",
    lineup: ["Youpi", "K'rcher b2b Haled", "Padrino"],
    tags: ["All night", "Techno"],
    ticketUrl: '',
    infoUrl:   '',
    flyer:     '',
  },
  {
    id: 3,
    date: "SAT · 5 JUL 2026",
    name: "SUMMER RAVE OPEN AIR",
    venue: "Bois de Vincennes",
    city: "Paris",
    lineup: ["Flèche", "Jee · Choco", "K'gnard b2b BouBou"],
    tags: ["Open air", "Hard House"],
    ticketUrl: '',
    infoUrl:   '',
    flyer:     '',
  },
]

// ─── RELEASES ────────────────────────────────────────────────────────────────
// soundcloudUrl → lien direct vers le track/EP sur SoundCloud
//   ex: "https://soundcloud.com/shymenrecords/flux-absolu"
// coverImage    → pochette dans  public/assets/releases/
//   ex: "assets/releases/flux-absolu.jpg"
export const RELEASES = [
  {
    id: 1,
    title: "Flux Absolu",
    artist: "K'gnard",
    year: "2026",
    bpm: "148 BPM",
    soundcloudUrl: '',          // ← lien SoundCloud du track
    coverImage:    '',          // ← ex: "assets/releases/flux-absolu.jpg"
  },
  {
    id: 2,
    title: "Pressure Drop",
    artist: "BouBou",
    year: "2025",
    bpm: "145 BPM",
    soundcloudUrl: '',
    coverImage:    '',
  },
  {
    id: 3,
    title: "Maldito Groove",
    artist: "Flèche",
    year: "2025",
    bpm: "152 BPM",
    soundcloudUrl: '',
    coverImage:    '',
  },
  {
    id: 4,
    title: "Overdrive EP",
    artist: "K'gnard & BouBou",
    year: "2025",
    bpm: "150 BPM",
    soundcloudUrl: '',
    coverImage:    '',
  },
  {
    id: 5,
    title: "Acid Rain Vol. 2",
    artist: "Jeff Pesos",
    year: "2024",
    bpm: "147 BPM",
    soundcloudUrl: '',
    coverImage:    '',
  },
  {
    id: 6,
    title: "Circuit Breaker",
    artist: "Padrino",
    year: "2024",
    bpm: "144 BPM",
    soundcloudUrl: '',
    coverImage:    '',
  },
]

// ─── ARCHIVE — SOIRÉES PASSÉES ────────────────────────────────────────────────
// photoUrl → photo de la soirée dans  public/assets/archive/
//   ex: "assets/archive/midnight-surge.jpg"
//   → mets autant de photos que tu veux, ajoute des entrées dans le tableau
export const PAST_EVENTS = [
  { id: 1, name: "MIDNIGHT SURGE",    date: "Dec 2024", photoUrl: '' },
  { id: 2, name: "HARD BOUNCE VOL.3", date: "Oct 2024", photoUrl: '' },
  { id: 3, name: "TRANCE ODYSSEY",    date: "Aug 2024", photoUrl: '' },
  { id: 4, name: "UNDERGROUND RAVE",  date: "Jun 2024", photoUrl: '' },
  { id: 5, name: "ACID NIGHTS",       date: "Apr 2024", photoUrl: '' },
  { id: 6, name: "ELECTRIC CHURCH",   date: "Feb 2024", photoUrl: '' },
  { id: 7, name: "BOUNCE FACTORY",    date: "Jan 2024", photoUrl: '' },
  { id: 8, name: "HYPERDRIVE",        date: "Nov 2023", photoUrl: '' },
  { id: 9, name: "NEON CATHEDRAL",    date: "Sep 2023", photoUrl: '' },
]

// ─── RÉSEAUX SOCIAUX ──────────────────────────────────────────────────────────
export const SOCIALS = {
  instagram:      '',   // ← ex: "https://instagram.com/shymenrecords"
  soundcloud:     '',   // ← ex: "https://soundcloud.com/shymenrecords"
  residentAdvisor:'',   // ← ex: "https://ra.co/promoters/shymenrecords"
  boilerRoom:     '',   // ← ex: "https://boilerroom.tv/..."
}
