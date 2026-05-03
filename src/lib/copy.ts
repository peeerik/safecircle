/**
 * Centralised Norwegian (Bokmål) string constants for the SafeCircle demo.
 *
 * All screens share this object so wording stays consistent across parallel
 * agent work. Access pattern: `copy.fire.title`, `copy.nav.home`, etc.
 */
export const copy = {
  brand: {
    name: "SafeCircle",
    tagline: "Nabolaget ditt. Skjoldet ditt.",
  },

  statusBar: {
    time: "14:30",
    carrier: "5G",
  },

  nav: {
    home: "Hjem",
    map: "Kart",
    sos: "SOS",
    pets: "Dyr",
    profile: "Profil",
  },

  home: {
    title: "Nabolaget ditt",
    subtitle: "14 naboer i SafeCircle",
    awayMode: "Borte-modus",
    awayModeDescription: "Gi betrodde naboer utvidet varsling",
    neighborsHeading: "Dine naboer",
  },

  fire: {
    title: "BRANNALARM UTLØST",
    location: "Parkveien 12, 2. etg — 45m fra deg",
    timestamp: "Kl 14:32 · For 30 sekunder siden",
    pet: {
      heading: "Hjemme alene:",
      name: "Dino",
      breed: "Chihuahua, 4 år",
      location: "Stue / ved sofaen",
      tempStatus: "Redd for høye lyder",
    },
    actions: {
      callFire: "📞 Ring 110 Brannvesen",
      checking: "✅ Jeg sjekker",
      capture: "📸 Ta bilde / video",
    },
    footer: "Varslet: 14 naboer i SafeCircle · 3 betrodde",
  },

  burglary: {
    title: "MISTENKELIG AKTIVITET",
    description:
      "Thomas K. rapporterer: Ukjent person prøver dører i Parkveien",
    timestamp: "Kl 13:48 · For 2 minutter siden",
    suspect: {
      heading: "Beskrivelse",
      details: "Mann, ca 30 år, mørk hettegenser, blå sekk",
      photoLabel: "Foto delt av Thomas K.",
    },
    actions: {
      document: "📸 Dokumenter (foto/video)",
      callPolice: "📞 Ring 112",
      confirm: "⚠️ Bekreft observasjon",
    },
    footer: "4 naboer har bekreftet · Politiet er varslet",
  },

  panic: {
    title: "🆘 SOS AKTIV",
    description: "Din posisjon deles nå med betrodde kontakter",
    cancel: "Avbryt SOS",
    cancelDialog: {
      title: "Avbryt SOS?",
      description:
        "Dine betrodde kontakter vil få beskjed om at du har avbrutt nødvarselet.",
      confirm: "Ja, avbryt",
      cancel: "Behold aktiv",
    },
    contacts: [
      { name: "Mamma", distance: "Ringer nå…", status: "calling" as const },
      { name: "Thomas K.", distance: "120m unna", status: "near" as const },
      { name: "Anne Lise H.", distance: "180m unna", status: "near" as const },
      { name: "Nabo Storgata 8", distance: "240m unna", status: "near" as const },
      { name: "Nabo Brugata 3", distance: "320m unna", status: "near" as const },
      { name: "Nabo Tøyengata 12", distance: "410m unna", status: "near" as const },
    ],
    footer: "Varslet: 3 betrodde kontakter + 9 SafeCircle-brukere i nærheten",
  },

  pets: {
    title: "Mine kjæledyr",
    subtitle: "Naboene dine ser denne infoen ved brannvarsling",
    homeAloneToggle: "🏠 Hjemme alene-status",
    editProfile: "✏️ Rediger profil",
    dino: {
      name: "Dino",
      breed: "Chihuahua, 4 år",
      status: "🏠 Hjemme alene nå",
      location: "Stue / ved sofaen",
      temperament: "Redd for høye lyder",
      vet: "Hamar Dyreklinikk",
      keyShared: "Ja — kode delt med betrodde",
      meds: "Ingen",
      labels: {
        location: "Vanlig oppholdssted",
        temperament: "Atferd",
        vet: "Veterinær",
        keyShared: "Nøkkel delt",
        meds: "Medisiner",
      },
    },
  },

  map: {
    title: "Kart",
    radiusLabel: "500m",
    filters: {
      all: "Alle",
      trusted: "Betrodde",
      online: "Online nå",
    },
  },

  dashcam: {
    title: "📹 DASHCAM-FORESPØRSEL",
    description: "Innbrudd rapportert i Parkveien kl 13:45",
    window: "Du var i området mellom 13:20 og 13:50",
    question: "Har du dashcam-opptak eller observerte du noe?",
    actions: {
      upload: "📹 Last opp dashcam-klipp",
      report: "✍️ Rapporter observasjon",
      nothing: "❌ Ingenting å melde",
    },
    footer: "Politiet etterforsker · Forespørsel sendt til 23 SafeCircle-brukere",
  },

  badges: {
    trusted: "Betrodd",
    active: "Aktiv",
  },
} as const;

export type Copy = typeof copy;
