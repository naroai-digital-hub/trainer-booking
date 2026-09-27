import { BRAND, IMAGES, imgFallback } from '../lib/media'
import { Icon } from './ui'

const PILLARS = [
  { icon: 'dumbbell', title: 'Strength', copy: 'Progressive, joint-friendly programming' },
  { icon: 'target', title: 'Movement', copy: 'Quality mechanics before intensity' },
  { icon: 'flame', title: 'Conditioning', copy: 'Build a bigger, more resilient engine' },
] as const

export default function Hero() {
  return (
    <section id="top" className="grain relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Background image + layered gradients */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt={IMAGES.heroAlt}
          onError={imgFallback}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        <div className="absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-volt/15 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-40 sm:px-8 sm:pb-20">
        <div className="max-w-3xl">
          <div className="rise-1 inline-flex items-center gap-3 rounded-full border border-volt/40 bg-ink/60 py-2 pl-2 pr-5 backdrop-blur">
            <span className="rounded-full bg-volt px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-ink">
              New
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-bone">
              {BRAND.heroEyebrow} — now booking
            </span>
          </div>

          <h1 className="font-display mt-6 uppercase leading-[0.95] text-bone">
            <span className="rise-2 block text-[clamp(3.2rem,9vw,7.5rem)]">
              Train with
            </span>
            <span className="rise-3 block text-[clamp(3.2rem,9vw,7.5rem)] text-volt drop-shadow-[0_0_40px_rgba(200,245,66,0.25)]">
              intent.
            </span>
            <span className="rise-3 text-outline block text-[clamp(3.2rem,9vw,7.5rem)]">
              Perform for life.
            </span>
          </h1>

          <p className="rise-4 mt-6 max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg">
            Premium 1-on-1 coaching built around <span className="font-semibold text-bone">your</span> body,
            your schedule, and your goals. Strength, mobility, and conditioning —
            programmed with precision, coached with intent.
          </p>

          <div className="rise-4 mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#booking"
              className="group inline-flex items-center gap-3 rounded-full bg-volt px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-ink shadow-[0_12px_40px_-8px_rgba(200,245,66,0.6)] transition-all duration-300 hover:bg-white hover:shadow-[0_12px_40px_-8px_rgba(255,255,255,0.5)] active:scale-95"
            >
              <Icon name="bolt" className="h-4 w-4 transition-transform duration-300 group-hover:scale-125" />
              Book your session
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-bone backdrop-blur transition-all duration-300 hover:border-volt hover:text-volt active:scale-95"
            >
              Explore programs
              <Icon name="arrowR" className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Pillar strip */}
        <div className="rise-4 mt-14 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-md transition-all duration-300 hover:border-volt/50 hover:bg-ink/80"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-volt/15 text-volt transition-transform duration-300 group-hover:scale-110 group-hover:bg-volt group-hover:text-ink">
                <Icon name={p.icon} className="h-6 w-6" />
              </span>
              <span>
                <span className="font-display block text-lg uppercase tracking-wide text-bone">{p.title}</span>
                <span className="block text-[13px] text-ash">{p.copy}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ash">Scroll</span>
        <span className="h-10 w-[2px] overflow-hidden rounded bg-white/15">
          <span className="block h-4 w-full animate-bounce bg-volt" />
        </span>
      </div>
    </section>
  )
}
