// ╔══════════════════════════════════════════════════════════════════════════╗
// ║              SHYMEN RECORDS — FICHIER DE CONFIGURATION                  ║
// ║  Modifie ce fichier pour mettre à jour tout le contenu du site.         ║
// ║  Pas besoin de toucher au reste du code.                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─── CONTACT ─────────────────────────────────────────────────────────────────
// Adresse email de booking (apparaît dans la section contact + bouton en haut)
export const CONTACT = {
  email: 'records.shymen@gmail.com',
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
    soundcloudUrl: 'https://soundcloud.com/fleche10ch221',          // ← ex: "https://soundcloud.com/fleche"
    instagramUrl:  'https://www.instagram.com/th0mas_g/',
    photoUrl:      'assets/members/fleche.jpg',          // ← ex: "assets/members/fleche.jpg"
  },
  {
    name: "K'gnard",
    role: "DJ & Producer",
    soundcloudUrl: 'https://soundcloud.com/kilian-kiki-481422387',
    instagramUrl:  'https://www.instagram.com/kilian_ignt/',
    photoUrl:      'assets/members/kgnard.jpg',
  },
  {
    name: "Jeff Pesos",
    role: "DJ",
    soundcloudUrl: 'https://soundcloud.com/maxime-pariente',
    instagramUrl:  'https://www.instagram.com/maximepariznte/',
    photoUrl:      'assets/members/jeffpesos-youpi.jpg',
  },
  {
    name: "Youpi",
    role: "DJ",
    soundcloudUrl: 'https://soundcloud.com/user-962284911',
    instagramUrl:  'https://www.instagram.com/romain_stephan18/',
    photoUrl:      '',
  },
  {
    name: "K'rcher",
    role: "DJ",
    soundcloudUrl: 'https://soundcloud.com/axel-759106801',
    instagramUrl:  'https://www.instagram.com/axel.ganne/',
    photoUrl:      'assets/members/krcher-haled.jpg',
  },
  {
    name: "Haled",
    role: "DJ",
    soundcloudUrl: 'https://soundcloud.com/max-denis-317961011',
    instagramUrl:  'https://www.instagram.com/maximm_dnis/',
    photoUrl:      '',
  },
  {
    name: "Padrino",
    role: "DJ",
    soundcloudUrl: 'https://soundcloud.com/padrino11',
    instagramUrl:  'https://www.instagram.com/sacha_gllnt/',
    photoUrl:      'assets/members/padrino.jpg',
  },
  {
    name: "Jee",
    role: "DJ",
    soundcloudUrl: 'https://soundcloud.com/mehdi-salhi-702868723',
    instagramUrl:  'https://www.instagram.com/mehdi_salh1/',
    photoUrl:      'assets/members/jee.jpg',
  },
  {
    name: "Choco",
    role: "DJ",
    soundcloudUrl: '',
    instagramUrl:  'https://www.instagram.com/antoine_tonio_/',
    photoUrl:      'assets/members/choco.jpg',
  },
  {
    name: "BouBou",
    role: "Producer",
    soundcloudUrl: 'https://soundcloud.com/mathieu-gallet-798254857',
    instagramUrl:  'https://www.instagram.com/mathieu__gllt/',
    photoUrl:      'assets/members/boubou.jpg',
  },
  {
    name: "Capu",
    role: "Comms",
    soundcloudUrl: null,        // null = pas de SoundCloud → bouton "Contact" à la place
    instagramUrl:  'https://www.instagram.com/capu_hub/',
    photoUrl:      'assets/members/capu.jpg',
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
    date: "SAM · 18 JUILLET 2026",
    name: "PANIC ROOM",
    venue: "Warehouse 23",
    city: "Paris",
    lineup: ["Flèche b2b K'gnard", "Jeff Pesos", "BouBou"],
    tags: ["All night", "Indoor"],
    ticketUrl: 'https://shotgun.live/fr/events/shymen?utm_source=collectif-shymen-records&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0DMTAwAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp4VbexcEmCQ6_zBbfre2n477w5c6bh22HeY9Sx4vEDNGHOPcXwgjOSLFAgEL_aem_u5jhqbeE4XtAPXim3XLGYw',              // ← ex: "https://shotgun.live/events/infinite-voltage"
    infoUrl:   'https://shotgun.live/fr/events/shymen?utm_source=collectif-shymen-records&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0DMTAwAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp4VbexcEmCQ6_zBbfre2n477w5c6bh22HeY9Sx4vEDNGHOPcXwgjOSLFAgEL_aem_u5jhqbeE4XtAPXim3XLGYw',              // ← ex: "https://facebook.com/events/123456"
    flyer:     'assets/events/panic-room-flyer.jpeg',              // ← ex: "assets/events/infinite-voltage.jpg"
  },
]

// ─── RELEASES ────────────────────────────────────────────────────────────────
//
// ▶ POCHETTES : mets les images dans  public/assets/releases/
//   puis renseigne le chemin dans coverImage, ex: "assets/releases/release-1.jpg"
//   Format recommandé : carré, 800×800px minimum, JPG ou PNG
//
// ▶ SOUNDCLOUD : lien direct vers le track/EP
//   ex: "https://soundcloud.com/shymenrecords/nom-du-track"
//
export const RELEASES = [
  {
    id: 1,
    title: "Pacman",          // ← nom du track/EP
    artist: "BouBou",         // ← artiste(s)
    year: "2026",           // ← année de sortie, ex: "2025"
    bpm: "",            // ← ex: "148 BPM"  (laisser vide pour masquer)
    soundcloudUrl: 'https://soundcloud.com/mathieu-gallet-798254857/pacman',  // ← lien SoundCloud
    coverImage:    'assets/releases/pacman-boubou.png',  // ← "assets/releases/release-1.jpg"
  },
  {
    id: 2,
    title: "Experimental Race",
    artist: "K'gnard",
    year: "2026",
    bpm: "",
    soundcloudUrl: 'https://soundcloud.com/kilian-kiki-481422387/techno-pure-2',
    coverImage:    'assets/releases/experimental-race-kgnard.png',  // ← "assets/releases/release-2.jpg"
  },
  {
    id: 3,
    title: "To You",
    artist: "BouBou",
    year: "2026",
    bpm: "",
    soundcloudUrl: 'https://soundcloud.com/mathieu-gallet-798254857/to-you',
    coverImage:    'assets/releases/to-you-boubou.png',  // ← "assets/releases/release-3.jpg"
  },
  {
    id: 4,
    title: "House Of The Underground",
    artist: "K'gnard",
    year: "2025",
    bpm: "",
    soundcloudUrl: 'https://soundcloud.com/kilian-kiki-481422387/house-of-the-underground',
    coverImage:    'assets/releases/house-of-the-underground-kgnard.png',  // ← "assets/releases/release-4.jpg"
  },
]

// ─── ARCHIVE — SOIRÉES PASSÉES ────────────────────────────────────────────────
//
// Structure : chaque événement a un tableau "photos" avec jusqu'à N photos.
//
// ▶ OÙ METTRE LES PHOTOS :
//
//   Pour "La Java" → public/assets/archive/la-java/
//     photo-1.jpg, photo-2.jpg, photo-3.jpg, photo-4.jpg, photo-5.jpg
//
//   Pour "No Scrum No Win" → public/assets/archive/no-scrum-no-win/
//     photo-1.jpg, photo-2.jpg, photo-3.jpg, photo-4.jpg, photo-5.jpg
//
//   Format recommandé : paysage 16/9 ou carré, JPG, 1200px min de large
//
// ▶ NOMMAGE : peu importe le nom du fichier, tant que tu l'écris
//   exactement pareil dans le champ "photos" ci-dessous.
//
// ▶ AJOUTER UN NOUVEL EVENT : copie/colle un bloc et incrémente l'id.
//
export const PAST_EVENTS = [
  {
    id: 1,
    name: "La Java",
    date: "",           // ← ex: "Mar 2025"
    photos: [
      'assets/archive/la-java/photo-1.jpg',   // ← mets le fichier ici
      'assets/archive/la-java/photo-2.jpg',
      'assets/archive/la-java/photo-3.jpg',
    ],
  },
  {
    id: 2,
    name: "No Scrum No Win",
    date: "",           // ← ex: "Jan 2025"
    photos: [
      'assets/archive/no-scrum/photo-1.jpg',
      'assets/archive/no-scrum/photo-2.jpeg',
      'assets/archive/no-scrum/photo-3.jpeg',
      'assets/archive/no-scrum/photo-4.jpg',
    ],
  },
]

// ─── DUOS ─────────────────────────────────────────────────────────────────────
// Les duos ont une photo partagée et s'affichent ensemble sur la page membres.
// members : noms EXACTEMENT comme dans le tableau MEMBERS ci-dessus
// photoUrl : photo de groupe dans  public/assets/members/
//   ex: "assets/members/fleche-kgnard.jpg"
// Sur la page membres, le duo prend toute la largeur avec photo à gauche/droite.
export const DUOS = [
  {
    id: 'd1',
    label: "K'rcher b2b Haled",
    members: ["K'rcher", "Haled"],
    photoUrl: 'assets/members/krcher-haled.jpg',
  },
  {
    id: 'd2',
    label: "Jeff Pesos b2b Youpi",
    members: ["Jeff Pesos", "Youpi"],
    photoUrl: 'assets/members/jeffpesos-youpi.jpg',
  },
]

// ─── RÉSEAUX SOCIAUX ──────────────────────────────────────────────────────────
export const SOCIALS = {
  instagram:      'https://www.instagram.com/shymen_records',   // ← ex: "https://instagram.com/shymenrecords"
  soundcloud:     'https://soundcloud.com/shymen-records',   // ← ex: "https://soundcloud.com/shymenrecords"
}
