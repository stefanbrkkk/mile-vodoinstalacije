/**
 * Single source of truth for all business data shown on the site.
 * Change values here; every component and the build-time SEO tags read from this file.
 * Fields marked with `// DEMO` hold illustrative sample values, not verified business facts.
 */

export type NavLink = { label: string; href: `#${string}` }

export type Stat = {
  /** Numeric end value for the count-up animation. */
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export type ServiceIcon = 'emergency' | 'drain' | 'leak' | 'boiler' | 'sanitary' | 'bathroom'

export type Service = {
  id: string
  title: string
  description: string
  icon: ServiceIcon
  /** Bento grid emphasis: 'wide' spans two columns, 'tall' spans two rows. */
  size?: 'wide' | 'tall'
}

export type AnatomyPartId = 'gasket' | 'pipe' | 'valve' | 'trap' | 'union'

export type AnatomyStep = {
  id: AnatomyPartId
  name: string
  problem: string
  symptom: string
  fix: string
}

export type ProcessStep = { title: string; description: string }

export type FaqItem = { question: string; answer: string }

export type Testimonial = {
  name: string
  area: string
  text: string
  /** 1–5 stars. Demo data only; never emitted as structured-data ratings. */
  rating: 1 | 2 | 3 | 4 | 5
}

export const site = {
  name: 'Vodoinstalater Mile',
  wordmark: 'Mile',
  city: 'Beograd',
  email: 'stefanbrkk@gmail.com',
  /** Leave empty to hide every call button; a value enables `tel:` buttons across the site. */
  phone: '',
  hours: 'Pon–Sub 07–20, hitni pozivi 0–24',
  /** Production URL, e.g. 'https://example.com'. Empty until known; omitted from metadata when empty. */
  url: '',
  description:
    'Vodoinstalater u Beogradu za hitne intervencije 0–24, odgušenje odvoda, sanaciju curenja, zamenu bojlera i ugradnju sanitarija. Brz dolazak, čist rad i garancija na posao.',

  nav: [
    { label: 'Usluge', href: '#usluge' },
    { label: 'Kako radim', href: '#kako-radim' },
    { label: 'Utisci', href: '#utisci' },
    { label: 'Pitanja', href: '#pitanja' },
    { label: 'Kontakt', href: '#kontakt' },
  ] satisfies NavLink[],

  cta: {
    primary: { label: 'Pošalji upit', href: '#kontakt' },
    secondary: { label: 'Pogledaj usluge', href: '#usluge' },
  },

  hero: {
    words: ['Curi?', 'Kaplje?', 'Zapušeno?'],
    punchline: 'Mile rešava.',
    subtitle:
      'Dolazim brzo, radim čisto i ostavljam garanciju na svaki posao. Od kapanja ispod lavaboa do cele nove instalacije u kupatilu.',
    scrollHint: 'Prati vodu',
  },

  // DEMO — illustrative sample numbers, not verified business figures
  stats: [
    { value: 15, suffix: '+', label: 'godina iskustva' },
    { value: 3200, suffix: '+', label: 'intervencija' },
    { value: 45, prefix: '~', suffix: ' min', label: 'prosečan dolazak' },
  ] satisfies Stat[],

  demoNote: 'Demo podaci',

  services: [
    {
      id: 'hitne-intervencije',
      title: 'Hitne intervencije 0–24',
      description:
        'Pukla cev, voda ne staje ili se stan puni usred noći? Javite se u bilo koje doba, krećem odmah.',
      icon: 'emergency',
      size: 'wide',
    },
    {
      id: 'odgusenje-odvoda',
      title: 'Odgušenje odvoda',
      description:
        'Sudopera, kada, WC šolja ili vertikala. Mehaničko i spiralno odgušenje bez razbijanja pločica.',
      icon: 'drain',
    },
    {
      id: 'sanacija-curenja',
      title: 'Sanacija curenja',
      description:
        'Tražim uzrok, ne samo mesto gde kaplje. Popravka spoja, ventila ili cevi, uz proveru pod pritiskom.',
      icon: 'leak',
      size: 'tall',
    },
    {
      id: 'zamena-bojlera',
      title: 'Zamena bojlera',
      description:
        'Skidam stari, montiram novi i povezujem sigurnosni ventil. Stari bojler odnosim sa sobom.',
      icon: 'boiler',
    },
    {
      id: 'ugradnja-sanitarija',
      title: 'Ugradnja sanitarija',
      description:
        'Lavaboi, WC šolje, tuš kabine, baterije i mašine za pranje. Montaža bez improvizacije.',
      icon: 'sanitary',
    },
    {
      id: 'adaptacija-kupatila',
      title: 'Adaptacija kupatila',
      description:
        'Nova instalacija od vertikale do slavine, u dogovoru sa keramičarem i po vašem rasporedu.',
      icon: 'bathroom',
      size: 'wide',
    },
  ] satisfies Service[],

  anatomy: {
    title: 'Anatomija kvara',
    intro: 'Pet delova koji najčešće zakažu. Pomerajte stranicu nadole i pogledajte šta se dešava iznutra.',
    finale: 'Sastavljeno. Bez kapi.',
    labels: { problem: 'Problem', symptom: 'Simptom', fix: 'Šta Mile radi' },
    steps: [
      {
        id: 'gasket',
        name: 'Dihtung',
        problem: 'Curenje na spoju',
        symptom: 'Kapanje ispod lavaboa',
        fix: 'Menjam dihtung i proveravam spoj pod pritiskom, da ispod lavaboa ostane suvo.',
      },
      {
        id: 'pipe',
        name: 'Cev',
        problem: 'Kamenac i korozija',
        symptom: 'Slab pritisak, mutna voda',
        fix: 'Zamenjujem korodiranu deonicu novom cevi i ispiram instalaciju, da se pritisak i bistra voda vrate.',
      },
      {
        id: 'valve',
        name: 'Ventil',
        problem: 'Ne zatvara do kraja',
        symptom: 'Slavina kaplje, veći račun',
        fix: 'Ugrađujem nov ventil koji zatvara do kraja, pa slavina prestaje da kaplje, a račun da raste.',
      },
      {
        id: 'trap',
        name: 'Sifon',
        problem: 'Začepljenje',
        symptom: 'Voda sporo otiče, neprijatan miris',
        fix: 'Rastavljam i čistim sifon ili ga menjam, pa voda ponovo otiče bez zadržavanja i mirisa.',
      },
      {
        id: 'union',
        name: 'Holender',
        problem: 'Olabavljen spoj',
        symptom: 'Vlaga na zidu',
        fix: 'Pritežem ili menjam holender i dihtung, pa proveravam spoj i sušim zid pre nego što vlaga napravi štetu.',
      },
    ] satisfies AnatomyStep[],
  },

  process: {
    title: 'Kako radim',
    steps: [
      {
        title: 'Javite se',
        description:
          'Pošaljite kratak opis kvara i gde se nalazite. Odgovaram brzo i dogovaramo termin, hitno i isti dan.',
      },
      {
        title: 'Dijagnoza',
        description:
          'Dolazim sa alatom i rezervnim delovima. Pregledam instalaciju i kažem vam uzrok, predlog i koliko traje.',
      },
      {
        title: 'Popravka',
        description:
          'Radim uredno, zaštitim prostor i sve pospremim za sobom. Bez skrivenih troškova i improvizacije.',
      },
      {
        title: 'Garancija',
        description: 'Na urađen posao dajem garanciju. Ako se problem vrati, vratiću se i ja.',
      },
    ] satisfies ProcessStep[],
  },

  beforeAfter: {
    title: 'Pre i posle',
    intro: 'Ilustracija tipične sanacije: zarđala cev koja curi i nova, čista instalacija na istom mestu.',
    beforeLabel: 'Pre',
    afterLabel: 'Posle',
    sliderLabel: 'Poređenje pre i posle',
    note: 'Ilustracija, ne fotografija izvedenog posla.',
  },

  // DEMO — fictional sample reviews for the template; never emitted as structured-data ratings
  testimonials: [
    {
      name: 'Jelena M.',
      area: 'Vračar',
      text: 'Curilo je ispod sudopere danima, a Mile je došao istog popodneva. Za sat vremena sve suvo i pospremljeno.',
      rating: 5,
    },
    {
      name: 'Nenad P.',
      area: 'Zvezdara',
      text: 'Zamenio bojler bez ijedne ogrebotine na pločicama. Stari odneo, novi radi kao sat.',
      rating: 5,
    },
    {
      name: 'Milica S.',
      area: 'Novi Beograd',
      text: 'Zapušena vertikala u nedelju uveče. Javio se odmah i rešio bez razbijanja zida.',
      rating: 5,
    },
    {
      name: 'Dragan V.',
      area: 'Voždovac',
      text: 'Retko ko danas radi ovako uredno. Objasnio šta je problem i zašto, pa tek onda popravio.',
      rating: 5,
    },
    {
      name: 'Ana K.',
      area: 'Banovo brdo',
      text: 'Slavina je kapala mesecima. Novi ventil, deset minuta posla, račun za vodu odmah manji.',
      rating: 5,
    },
    {
      name: 'Marko T.',
      area: 'Zemun',
      text: 'Adaptacija kupatila od nule. Sve instalacije na vreme, keramičar nije čekao ni dan.',
      rating: 5,
    },
    {
      name: 'Ivana R.',
      area: 'Palilula',
      text: 'Vlaga na zidu ispod kade. Našao olabavljen holender koji su dvojica pre njega promašila.',
      rating: 5,
    },
    {
      name: 'Petar J.',
      area: 'Čukarica',
      text: 'Došao noću, zaustavio vodu, sutradan zamenio cev. Miran čovek, pošten dogovor.',
      rating: 5,
    },
  ] satisfies Testimonial[],

  faq: {
    title: 'Pitanja',
    items: [
      {
        question: 'Koliko brzo izlazite na teren?',
        answer:
          'Za hitne slučajeve krećem odmah, u bilo koje doba dana ili noći. Za redovne popravke dogovaramo termin, najčešće isti ili sledeći dan.',
      },
      {
        question: 'Radite li vikendom i praznicima?',
        answer:
          'Da. Redovno radno vreme je od ponedeljka do subote, od 7 do 20 časova, a hitne pozive primam 0–24, uključujući nedelju i praznike.',
      },
      {
        question: 'Dajete li garanciju na posao?',
        answer:
          'Da, na svaki urađen posao i ugrađeni deo. Ako se isti problem vrati, dolazim ponovo i rešavam ga bez rasprave.',
      },
      {
        question: 'Kako se plaća?',
        answer:
          'Gotovinom ili prenosom na račun, posle završenog posla. Cenu čujete pre početka rada, a ne posle.',
      },
      {
        question: 'Koliko traje popravka?',
        answer:
          'Većinu kvarova rešavam u jednoj poseti, obično za sat do dva. Za veće radove unapred kažem realan rok i držim ga se.',
      },
    ] satisfies FaqItem[],
  },

  contact: {
    title: 'Hajde da zatvorimo slavinu.',
    lead: 'Opišite kvar u par rečenica i pošaljite na mejl. Odgovaram brzo, a za hitne slučajeve i noću.',
    copyLabel: 'Kopiraj',
    copiedLabel: 'Kopirano ✓',
    copyFailed: 'Kopiranje nije dozvoljeno u ovom pregledaču. Označite adresu i kopirajte je ručno.',
    hoursLabel: 'Radno vreme',
    emailLabel: 'Mejl',
    callLabel: 'Pozovi',
  },

  footer: {
    backToTop: 'Nazad na vrh',
    rights: 'Sva prava zadržana.',
  },
} as const

export type SiteConfig = typeof site

/** Page title, e.g. "Vodoinstalater Mile | Beograd". */
export const seoTitle = `${site.name} | ${site.city}`
export const seoDescription = site.description

/** Schema.org Plumber. Empty optional fields are omitted; demo reviews are never included. */
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Plumber',
  name: site.name,
  description: site.description,
  email: site.email,
  ...(site.phone ? { telephone: site.phone } : {}),
  ...(site.url ? { url: site.url } : {}),
  areaServed: { '@type': 'City', name: site.city },
  address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'RS' },
  openingHours: ['Mo-Sa 07:00-20:00'],
  availableLanguage: 'sr',
}
