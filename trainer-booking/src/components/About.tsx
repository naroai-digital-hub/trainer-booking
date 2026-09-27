import { IMAGES, imgFallback } from '../lib/media'
import type { TrainerSettings } from '../lib/types'
import { Icon } from './ui'

const PRINCIPLES = [
  {
    icon: 'shield',
    title: 'Safe progression',
    copy: 'Load and intensity are earned. Every block builds on clean, pain-free movement — never at the cost of your joints.',
  },
  {
    icon: 'target',
    title: 'Movement quality first',
    copy: 'We coach mechanics before chasing numbers, so strength transfers to real life — and stays with you.',
  },
  {
    icon: 'flame',
    title: 'Consistency over intensity',
    copy: 'Sustainable programming you can actually repeat. Small wins, stacked weekly, beat heroic one-offs.',
  },
  {
    icon: 'heart',
    title: 'Coaching, not shouting',
    copy: 'Clear cues, honest feedback, and a plan that adapts to your energy, schedule, and recovery.',
  },
] as const

export default function About({ settings }: { settings: TrainerSettings | null }) {
  const coach = settings?.trainer_name?.trim() || 'Your Coach'
  return (
    <section id="about" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-volt/10 blur-[160px]" />
      <span aria-hidden className="font-display pointer-events-none absolute bottom-6 left-0 select-none whitespace-nowrap text-[16vw] uppercase leading-none text-white/[0.025]">
        Coach — Coach — Coach
      </span>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Layered visual */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
            <img
              src={IMAGES.aboutMain}
              alt={IMAGES.aboutMainAlt}
              loading="lazy"
              onError={imgFallback}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-4 w-48 overflow-hidden rounded-2xl border-4 border-ink shadow-2xl sm:-right-8 sm:w-64">
            <img
              src={IMAGES.aboutSecondary}
              alt={IMAGES.aboutSecondaryAlt}
              loading="lazy"
              onError={imgFallback}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="absolute -left-3 top-8 -rotate-90 sm:-left-6">
            <span className="rounded-full bg-volt px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.25em] text-ink shadow-lg">
              1-on-1 Coaching
            </span>
          </div>
        </div>

        {/* Copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-volt/40 bg-volt/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-volt">
            <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse-soft" />
            Meet your coach
          </span>
          <h2 className="font-display mt-5 text-4xl uppercase leading-[1.02] text-bone sm:text-5xl lg:text-6xl">
            Train with <span className="text-volt">{coach}</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ash sm:text-lg">
            Great coaching isn't about pushing harder — it's about training
            <span className="text-bone font-semibold"> smarter</span>. Every program starts with
            understanding how you move, then builds strength, mobility, and conditioning
            around your life. No guesswork, no gimmicks, no burnout.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="group rounded-2xl border border-white/10 bg-coal/70 p-5 transition-all duration-300 hover:border-volt/40 hover:bg-smoke"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-volt/15 text-volt transition-all duration-300 group-hover:bg-volt group-hover:text-ink">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-4 text-lg uppercase tracking-wide text-bone">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ash">{p.copy}</p>
              </div>
            ))}
          </div>

          <a
            href="#booking"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-volt px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-ink shadow-[0_12px_40px_-8px_rgba(200,245,66,0.6)] transition-all duration-300 hover:bg-white active:scale-95"
          >
            <Icon name="calendar" className="h-4 w-4" />
            Reserve your training session
          </a>
        </div>
      </div>
    </section>
  )
}
