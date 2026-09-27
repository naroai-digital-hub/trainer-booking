import { BRAND } from '../lib/media'
import type { TrainerSettings } from '../lib/types'
import { Icon } from './ui'

export default function Footer({ settings }: { settings: TrainerSettings | null }) {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/10 bg-[#07080a]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="font-display flex h-10 w-10 items-center justify-center rounded-xl bg-volt text-xl text-ink">
                {BRAND.studio[0]}
              </span>
              <span className="leading-none">
                <span className="font-display block text-xl uppercase tracking-wide text-bone">{BRAND.studio}</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-ash">{BRAND.tagline}</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ash">
              Premium 1-on-1 personal training. Strength, mobility, and conditioning —
              coached with intent, programmed for your life.
            </p>
            <a
              href="#booking"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 text-xs font-extrabold uppercase tracking-widest text-ink transition hover:bg-white active:scale-95"
            >
              <Icon name="bolt" className="h-4 w-4" />
              Book your session
            </a>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-[0.25em] text-ash">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ['#services', 'Training programs'],
                ['#about', 'Your coach'],
                ['#booking', 'Book a session'],
                ['/admin', 'Trainer login'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-bone/70 transition hover:text-volt">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-[0.25em] text-ash">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm text-bone/70">
              {settings?.trainer_name && (
                <li className="flex items-center gap-2.5">
                  <Icon name="users" className="h-4 w-4 text-volt" /> {settings.trainer_name}
                </li>
              )}
              {settings?.trainer_email && (
                <li>
                  <a href={`mailto:${settings.trainer_email}`} className="flex items-center gap-2.5 transition hover:text-volt">
                    <Icon name="mail" className="h-4 w-4 text-volt" /> {settings.trainer_email}
                  </a>
                </li>
              )}
              {settings?.trainer_phone && (
                <li>
                  <a href={`tel:${settings.trainer_phone}`} className="flex items-center gap-2.5 transition hover:text-volt">
                    <Icon name="phone" className="h-4 w-4 text-volt" /> {settings.trainer_phone}
                  </a>
                </li>
              )}
              {settings?.trainer_address && (
                <li className="flex items-start gap-2.5">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-volt" />
                  <span>{settings.trainer_address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-ash">© {year} {BRAND.studio} Training Co. All rights reserved.</p>
          <p className="text-xs uppercase tracking-[0.25em] text-ash">
            Train with intent <span className="text-volt">•</span> Perform for life
          </p>
        </div>
      </div>
    </footer>
  )
}
