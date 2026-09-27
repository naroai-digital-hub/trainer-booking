/**
 * Brand + imagery config.
 * Swap any URL here to re-skin the whole site — every image on the public
 * website flows through these constants.
 */

export const BRAND = {
  studio: 'FORGE',
  tagline: 'Personal Training & Coaching',
  heroEyebrow: '1-on-1 Personal Training',
} as const

const u = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`

export const IMAGES = {
  hero: u('1571019613454-1cb2f99b2d8b', 2000),
  heroAlt: 'Dumbbell rack in a dark premium gym',

  aboutMain: u('1567013127542-490d757e51fc', 1200),
  aboutMainAlt: 'Personal trainer coaching a client one-on-one',
  aboutSecondary: u('1574680096145-d05b474e2155', 800),
  aboutSecondaryAlt: 'Focused training moment with a coach',

  bookingAccent: u('1605296867304-46d5465a13f1', 1200),
  bookingAccentAlt: 'Athlete performing a deadlift with strong form',

  gymInterior: u('1534438327276-14e5300c3a48', 1600),
  gymInteriorAlt: 'Modern training facility interior',
} as const

/** Niche-specific service imagery, matched by keyword in the service name. */
const SERVICE_IMAGE_MAP: Array<{ match: RegExp; id: string; alt: string }> = [
  {
    match: /strength|powerlift|power\b/i,
    id: '1526506118085-60ce8714f8c5',
    alt: 'Athlete pressing a barbell overhead with strong form',
  },
  {
    match: /mobil|movement|stretch|flexib|yoga|recovery/i,
    id: '1544367567-0f2fcb009e0b',
    alt: 'Controlled mobility and movement training',
  },
  {
    match: /assess|screen|consult/i,
    id: '1517836357463-d25dfeac3438',
    alt: 'Trainer guiding a client through a fitness assessment',
  },
  {
    match: /group|partner|duo/i,
    id: '1518310383802-640c2de311b2',
    alt: 'Small group training session in progress',
  },
  {
    match: /condition|hiit|cardio|metcon|sprint|engine/i,
    id: '1541534741688-6078c6bfb5c5',
    alt: 'Dynamic conditioning work with battle ropes',
  },
  {
    match: /box|combat|kick/i,
    id: '1571731956672-f2b94d7dd0cb',
    alt: 'Boxing-based conditioning training',
  },
]

const DEFAULT_SERVICE_IMAGE = {
  id: '1581009146145-b5ef050c2e1e',
  alt: 'Personal trainer coaching a client one-on-one',
}

/** Resolve a niche-relevant image for any service (incl. ones added later in the dashboard). */
export function serviceImage(serviceName: string, w = 900): { src: string; alt: string } {
  const hit = SERVICE_IMAGE_MAP.find((m) => m.match.test(serviceName))
  const img = hit ?? DEFAULT_SERVICE_IMAGE
  return { src: u(img.id, w), alt: img.alt }
}

/** Fallback styling if an image fails: keep the layout premium. */
export function imgFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  const el = e.currentTarget
  el.style.display = 'none'
  const parent = el.parentElement
  if (parent && !parent.dataset.fbk) {
    parent.dataset.fbk = '1'
    parent.classList.add('bg-gradient-to-br', 'from-smoke', 'to-ink')
  }
}
