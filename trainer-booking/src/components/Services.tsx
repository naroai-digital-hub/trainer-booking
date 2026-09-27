import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { serviceImage, imgFallback } from '../lib/media'
import type { Service } from '../lib/types'
import { SectionHeading, Icon, Spinner } from './ui'

function money(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function Services({ onBook }: { onBook: (s: Service) => void }) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })
      .then(({ data }) => {
        setServices((data ?? []) as Service[])
        setLoading(false)
      })
  }, [])

  return (
    <section id="services" className="relative bg-bone py-24 sm:py-32">
      {/* faint watermark */}
      <span aria-hidden className="font-display pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[18vw] uppercase leading-none text-ink/[0.04]">
        Programs
      </span>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          dark
          eyebrow="Training programs"
          title={<>Coaching built <span className="text-volt-deep">around you</span></>}
          copy="Every session is 1-on-1, fully coached, and programmed for where you are today — not a template. Pick your focus and book in seconds."
        />

        {loading ? (
          <div className="mt-16 flex justify-center py-20">
            <Spinner className="h-10 w-10 !text-ink/40" />
          </div>
        ) : services.length === 0 ? (
          <p className="mt-16 text-center text-ink/50">Programs are being updated — check back soon.</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const img = serviceImage(s.name)
              const featured = i === 0
              return (
                <article
                  key={s.id}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl bg-ink text-bone shadow-[0_20px_60px_-20px_rgba(10,11,13,0.45)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_-20px_rgba(10,11,13,0.6)] ${
                    featured ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      onError={imgFallback}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-volt px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-ink">
                      {s.duration_minutes} min
                    </span>
                    <span className="absolute bottom-4 left-5 font-display text-4xl text-white drop-shadow-lg">
                      {money(s.price)}
                      <span className="ml-1 align-middle font-sans text-xs font-bold uppercase tracking-widest text-white/70">/ session</span>
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-2xl uppercase leading-tight tracking-wide">
                      {s.name}
                    </h3>
                    {s.description && (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">{s.description}</p>
                    )}
                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ash">
                        <Icon name="clock" className="h-4 w-4 text-volt" />
                        {s.duration_minutes} minutes
                      </span>
                      <button
                        onClick={() => onBook(s)}
                        className="group/btn inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest text-ink transition-all duration-300 hover:bg-white active:scale-95"
                      >
                        Book
                        <Icon name="arrowR" className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
