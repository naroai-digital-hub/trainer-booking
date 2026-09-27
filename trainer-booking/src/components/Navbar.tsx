import { useEffect, useState } from 'react'
import { BRAND } from '../lib/media'
import { Icon } from './ui'

const LINKS = [
  { href: '#services', label: 'Programs' },
  { href: '#about', label: 'Coaching' },
  { href: '#booking', label: 'Schedule' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-ink/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-volt font-display text-xl text-ink shadow-[0_0_24px_rgba(200,245,66,0.35)] transition-transform duration-300 group-hover:rotate-[-8deg]">
            {BRAND.studio[0]}
          </span>
          <span className="leading-none">
            <span className="font-display block text-xl uppercase tracking-wide text-bone">{BRAND.studio}</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-ash">Training Co.</span>
          </span>
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-[13px] font-bold uppercase tracking-[0.18em] text-ash transition hover:text-bone"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-volt transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#booking"
            className="hidden items-center gap-2 rounded-full bg-volt px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-ink shadow-[0_8px_30px_-6px_rgba(200,245,66,0.55)] transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_-6px_rgba(255,255,255,0.4)] active:scale-95 md:inline-flex"
          >
            <Icon name="bolt" className="h-4 w-4" />
            Book a session
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone md:hidden"
            aria-label="Menu"
          >
            <Icon name={open ? 'x' : 'menu'} className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="animate-fade border-t border-white/10 bg-ink/95 px-6 pb-6 pt-2 backdrop-blur-xl md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-4 font-display text-2xl uppercase tracking-wide text-bone"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setOpen(false)}
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-volt px-6 py-4 text-sm font-extrabold uppercase tracking-wider text-ink"
          >
            <Icon name="bolt" className="h-4 w-4" />
            Book a session
          </a>
        </div>
      )}
    </header>
  )
}
