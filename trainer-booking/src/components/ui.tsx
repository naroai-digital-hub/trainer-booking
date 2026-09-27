import React from 'react'

/* ---------------- Icons (inline SVG, lucide-style) ---------------- */

const PATHS: Record<string, React.ReactNode> = {
  calendar: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />,
  trash: <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />,
  chevL: <path d="m15 18-6-6 6-6" />,
  chevR: <path d="m9 18 6-6-6-6" />,
  arrowR: <path d="M5 12h14m-6-6 6 6-6 6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>,
  ban: <><circle cx="12" cy="12" r="9" /><path d="m5.5 5.5 13 13" /></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.66 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.23a2 2 0 0 1 2.11-.45c.84.32 1.72.54 2.62.66A2 2 0 0 1 22 16.92Z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  shield: <path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z" />,
  dumbbell: <path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M14.5 6.5 18 3h3v3l-3.5 3.5M5 14l-2 2M5 14l-4-4M5 14l6 6" />,
  flame: <path d="M12 22c4.4 0 8-3.6 8-8 0-4.5-3.5-7.5-6-9.5C13 3.5 12 2 12 2S7 6 6 10c-.6 2.4.4 4.5 2 6-.4-2.5.8-5.5 3-7-.5 2.5 0 5.5 2 7.5 1.2 1.2 1 3.5-1 3.5Z" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  heart: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
}

export function Icon({ name, className = 'h-5 w-5' }: { name: keyof typeof PATHS; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[name]}
    </svg>
  )
}

/* ---------------- Buttons ---------------- */

type BtnVariant = 'volt' | 'ghost' | 'dark' | 'danger' | 'light'

export function Btn({
  variant = 'volt',
  className = '',
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  const styles: Record<BtnVariant, string> = {
    volt: 'bg-volt text-ink hover:bg-white shadow-[0_8px_30px_-6px_rgba(200,245,66,0.5)]',
    ghost: 'border border-white/25 text-bone hover:border-volt hover:text-volt bg-white/5 backdrop-blur',
    dark: 'bg-ink text-bone hover:bg-smoke',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25',
    light: 'bg-white text-ink hover:bg-volt',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ---------------- Badges ---------------- */

export function Badge({ tone = 'volt', children, className = '' }: {
  tone?: 'volt' | 'muted' | 'green' | 'amber' | 'red' | 'blue'
  children: React.ReactNode
  className?: string
}) {
  const tones: Record<string, string> = {
    volt: 'bg-volt/15 text-volt border-volt/30',
    muted: 'bg-white/10 text-ash border-white/15',
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/15 text-red-400 border-red-500/30',
    blue: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function statusTone(status: string): 'amber' | 'blue' | 'red' | 'green' | 'muted' {
  switch (status) {
    case 'pending': return 'amber'
    case 'confirmed': return 'blue'
    case 'cancelled': return 'red'
    case 'completed': return 'green'
    default: return 'muted'
  }
}

/* ---------------- Form fields ---------------- */

export function Field({ label, children, className = '' }: {
  label: string; children: React.ReactNode; className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ash">{label}</span>
      {children}
    </label>
  )
}

export const inputCls =
  'w-full rounded-xl border border-white/15 bg-smoke/60 px-4 py-3 text-sm text-bone placeholder:text-ash/60 outline-none transition focus:border-volt/70 focus:ring-2 focus:ring-volt/20'

export const inputClsLight =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10'

/* ---------------- Misc ---------------- */

export function Spinner({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={`animate-spin text-volt ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function EmptyState({ icon = 'calendar', title, hint }: {
  icon?: keyof typeof PATHS; title: string; hint?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-volt/10 text-volt">
        <Icon name={icon} className="h-7 w-7" />
      </div>
      <p className="font-display text-xl uppercase tracking-wide text-bone">{title}</p>
      {hint && <p className="mt-2 max-w-sm text-sm text-ash">{hint}</p>}
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 animate-fade bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} animate-pop overflow-hidden rounded-3xl border border-white/10 bg-coal shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h3 className="font-display text-xl uppercase tracking-wide text-bone">{title}</h3>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-ash transition hover:bg-white/10 hover:text-bone" aria-label="Close">
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  )
}

export function SectionHeading({ eyebrow, title, copy, align = 'center', dark = false }: {
  eyebrow: string; title: React.ReactNode; copy?: string; align?: 'center' | 'left'; dark?: boolean
}) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start'} flex max-w-3xl flex-col`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-volt/40 bg-volt/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-volt">
        <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse-soft" />
        {eyebrow}
      </span>
      <h2 className={`font-display mt-5 text-4xl uppercase leading-[1.02] sm:text-5xl lg:text-6xl ${dark ? 'text-ink' : 'text-bone'}`}>
        {title}
      </h2>
      {copy && <p className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${dark ? 'text-ink/60' : 'text-ash'}`}>{copy}</p>}
    </div>
  )
}
