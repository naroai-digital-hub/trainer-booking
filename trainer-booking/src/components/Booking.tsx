import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  generateSlots,
  upcomingDays,
  parseDateStr,
  formatDateLong,
  formatTime,
  toDateStr,
  toTimeStr,
  type Slot,
  type ExistingBooking,
} from '../lib/availability'
import { IMAGES, imgFallback, serviceImage } from '../lib/media'
import type { Service, BusinessHour, BlockedDate, TrainerSettings } from '../lib/types'
import { WEEKDAYS_SHORT } from '../lib/types'
import { SectionHeading, Icon, Spinner, Badge, inputCls, Field } from './ui'

const STEPS = ['Service', 'Date & Time', 'Your Details', 'Confirmed'] as const

function money(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

interface Props {
  preselected: Service | null
  resetKey: number
  settings: TrainerSettings | null
}

export default function Booking({ preselected, resetKey, settings }: Props) {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [service, setService] = useState<Service | null>(null)
  const [hours, setHours] = useState<BusinessHour[]>([])
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set())
  const [bookings, setBookings] = useState<Record<string, ExistingBooking[]>>({})
  const [loading, setLoading] = useState(true)

  const [dateStr, setDateStr] = useState<string | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<{ ref: string } | null>(null)

  const days = useMemo(() => upcomingDays(42), [])

  /* ---------- load everything ---------- */
  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      const today = toDateStr(new Date())
      const end = days[days.length - 1]
      const [svc, hrsRes, blk, appts] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true).order('price'),
        supabase.from('business_hours').select('*'),
        supabase.from('blocked_dates').select('blocked_date').gte('blocked_date', today).lte('blocked_date', end),
        supabase.from('appointments').select('appointment_date,start_time,end_time,status').gte('appointment_date', today).lte('appointment_date', end),
      ])
      if (!alive) return
      const list = (svc.data ?? []) as Service[]
      setServices(list)
      setHours(((hrsRes.data ?? []) as BusinessHour[]))
      setBlockedDates(new Set(((blk.data ?? []) as BlockedDate[]).map((b) => b.blocked_date)))
      const map: Record<string, ExistingBooking[]> = {}
      for (const a of (appts.data ?? []) as Array<ExistingBooking & { appointment_date: string }>) {
        ;(map[a.appointment_date] ||= []).push(a)
      }
      setBookings(map)
      setLoading(false)
    })()
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  /* ---------- preselect service ---------- */
  useEffect(() => {
    if (preselected && services.some((s) => s.id === preselected.id)) {
      setService(preselected)
    }
  }, [preselected, services, resetKey])

  /* ---------- per-day availability ---------- */
  const dayInfo = useMemo(() => {
    const info: Record<string, { open: boolean; blocked: boolean; slots: Slot[] }> = {}
    const interval = settings?.slot_interval_minutes ?? 30
    const notice = settings?.booking_notice_hours ?? 12
    for (const d of days) {
      const weekday = parseDateStr(d).getDay()
      const h = hours.find((x) => x.weekday === weekday)
      const open = Boolean(h?.is_open)
      const blocked = blockedDates.has(d)
      let slots: Slot[] = []
      if (service && open && !blocked && h) {
        slots = generateSlots({
          dateStr: d,
          isOpen: true,
          openTime: h.start_time,
          closeTime: h.end_time,
          isBlocked: false,
          serviceDurationMinutes: service.duration_minutes,
          slotIntervalMinutes: interval,
          bookingNoticeHours: notice,
          existing: bookings[d] ?? [],
        })
      }
      info[d] = { open, blocked, slots }
    }
    return info
  }, [days, hours, blockedDates, bookings, service, settings])

  const slotsForDate = dateStr ? dayInfo[dateStr]?.slots ?? [] : []

  /* ---------- actions ---------- */
  const pickService = (s: Service) => {
    setService(s)
    setSlot(null)
    setStep(2)
  }

  const pickDate = (d: string) => {
    setDateStr(d)
    setSlot(null)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!fullName.trim()) e.fullName = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Please enter a valid email.'
    if (!phone.trim()) e.phone = 'Please enter your phone number.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!service || !dateStr || !slot || !validate()) return
    setSubmitting(true)
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service_id: service.id,
        appointment_date: dateStr,
        start_time: toTimeStr(slot.start),
        end_time: toTimeStr(slot.end),
        status: 'pending',
        notes: notes.trim() || null,
      })
      .select('id')
      .single()
    setSubmitting(false)
    if (error) {
      setErrors({ form: 'Something went wrong saving your booking. Please try again.' })
      return
    }
    setConfirmation({ ref: (data.id as string).slice(0, 8).toUpperCase() })
    setStep(4)
    window.scrollTo({ top: document.getElementById('booking')?.offsetTop ?? 0, behavior: 'smooth' })
  }

  const resetAll = () => {
    setStep(1)
    setService(null)
    setDateStr(null)
    setSlot(null)
    setFullName('')
    setEmail('')
    setPhone('')
    setNotes('')
    setErrors({})
    setConfirmation(null)
  }

  /* ---------- render ---------- */
  return (
    <section id="booking" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full bg-volt/10 blur-[160px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Reserve your training session"
          title={<>Book in <span className="text-volt">under a minute</span></>}
          copy="Pick your program, choose a time that suits you, and you're in. Your coach confirms every session personally."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Wizard card */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-coal shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
            {/* Step indicator */}
            <div className="flex items-center gap-1 border-b border-white/10 bg-ink/40 px-6 py-5 sm:gap-2 sm:px-8">
              {STEPS.map((label, i) => {
                const n = i + 1
                const active = step === n
                const done = step > n
                return (
                  <div key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition-all duration-300 ${
                        done ? 'bg-volt text-ink' : active ? 'bg-volt text-ink shadow-[0_0_20px_rgba(200,245,66,0.5)]' : 'bg-white/10 text-ash'
                      }`}
                    >
                      {done ? <Icon name="check" className="h-4 w-4" /> : n}
                    </span>
                    <span className={`hidden text-[11px] font-bold uppercase tracking-widest sm:block ${active ? 'text-bone' : 'text-ash'}`}>
                      {label}
                    </span>
                    {n < STEPS.length && <span className={`mx-1 h-px flex-1 ${done ? 'bg-volt/60' : 'bg-white/10'}`} />}
                  </div>
                )
              })}
            </div>

            <div className="p-6 sm:p-8">
              {loading ? (
                <div className="flex items-center justify-center py-24"><Spinner className="h-10 w-10" /></div>
              ) : (
                <>
                  {/* STEP 1 — service */}
                  {step === 1 && (
                    <div className="animate-fade">
                      <h3 className="font-display text-2xl uppercase tracking-wide text-bone">Choose your program</h3>
                      <p className="mt-1 text-sm text-ash">What do you want to work on?</p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {services.map((s) => {
                          const img = serviceImage(s.name, 600)
                          const selected = service?.id === s.id
                          return (
                            <button
                              key={s.id}
                              onClick={() => pickService(s)}
                              className={`group overflow-hidden rounded-2xl border text-left transition-all duration-300 active:scale-[0.98] ${
                                selected
                                  ? 'border-volt shadow-[0_0_30px_-6px_rgba(200,245,66,0.5)]'
                                  : 'border-white/10 hover:border-volt/50'
                              }`}
                            >
                              <div className="relative h-32 overflow-hidden">
                                <img src={img.src} alt={img.alt} loading="lazy" onError={imgFallback}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
                                {selected && (
                                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-volt text-ink">
                                    <Icon name="check" className="h-4 w-4" />
                                  </span>
                                )}
                                <span className="absolute bottom-3 left-4 font-display text-2xl text-white">{money(s.price)}</span>
                              </div>
                              <div className="bg-smoke/60 p-4">
                                <p className="font-display text-lg uppercase tracking-wide text-bone">{s.name}</p>
                                <p className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ash">
                                  <Icon name="clock" className="h-3.5 w-3.5 text-volt" />
                                  {s.duration_minutes} min session
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — date & time */}
                  {step === 2 && service && (
                    <div className="animate-fade">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-2xl uppercase tracking-wide text-bone">Pick a date & time</h3>
                          <p className="mt-1 text-sm text-ash">
                            {service.name} · {service.duration_minutes} min · {money(service.price)}
                          </p>
                        </div>
                        <button onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-widest text-volt hover:underline">
                          Change program
                        </button>
                      </div>

                      <p className="mb-3 mt-7 text-xs font-bold uppercase tracking-widest text-ash">Available days</p>
                      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                        {days.map((d) => {
                          const info = dayInfo[d]
                          const dt = parseDateStr(d)
                          const disabled = !info || !info.open || info.blocked || info.slots.length === 0
                          const active = dateStr === d
                          return (
                            <button
                              key={d}
                              disabled={disabled}
                              onClick={() => pickDate(d)}
                              className={`flex w-[68px] shrink-0 flex-col items-center rounded-2xl border py-3 transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${
                                active
                                  ? 'border-volt bg-volt text-ink shadow-[0_0_24px_-4px_rgba(200,245,66,0.6)]'
                                  : 'border-white/10 bg-white/[0.03] text-bone hover:border-volt/50'
                              }`}
                            >
                              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${active ? 'text-ink/70' : 'text-ash'}`}>
                                {WEEKDAYS_SHORT[dt.getDay()]}
                              </span>
                              <span className="font-display mt-1 text-2xl">{dt.getDate()}</span>
                              <span className={`text-[10px] font-bold uppercase ${active ? 'text-ink/70' : 'text-ash'}`}>
                                {dt.toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              {!disabled && info && (
                                <span className={`mt-1 text-[10px] font-bold ${active ? 'text-ink' : 'text-volt'}`}>
                                  {info.slots.length} open
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {dateStr && (
                        <div className="animate-fade mt-7">
                          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ash">
                            Open slots — {formatDateLong(dateStr)}
                          </p>
                          {slotsForDate.length === 0 ? (
                            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-ash">
                              No open slots that day — try another date.
                            </p>
                          ) : (
                            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                              {slotsForDate.map((s) => {
                                const active = slot?.start.getTime() === s.start.getTime()
                                return (
                                  <button
                                    key={s.start.getTime()}
                                    onClick={() => setSlot(s)}
                                    className={`rounded-xl border px-2 py-3.5 text-sm font-bold transition-all duration-200 active:scale-95 ${
                                      active
                                        ? 'border-volt bg-volt text-ink shadow-[0_0_24px_-4px_rgba(200,245,66,0.6)]'
                                        : 'border-white/10 bg-white/[0.03] text-bone hover:border-volt/60 hover:bg-volt/10'
                                    }`}
                                  >
                                    {s.label}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-8 flex items-center justify-between">
                        <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ash transition hover:text-bone">
                          <Icon name="chevL" className="h-4 w-4" /> Back
                        </button>
                        <button
                          disabled={!slot}
                          onClick={() => setStep(3)}
                          className="inline-flex items-center gap-2 rounded-full bg-volt px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-ink transition-all duration-300 hover:bg-white active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                        >
                          Continue <Icon name="chevR" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 — details */}
                  {step === 3 && service && slot && dateStr && (
                    <div className="animate-fade">
                      <h3 className="font-display text-2xl uppercase tracking-wide text-bone">Your details</h3>
                      <p className="mt-1 text-sm text-ash">We'll confirm your session personally.</p>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <Field label="Full name">
                          <input className={inputCls} placeholder="Alex Johnson" value={fullName}
                            onChange={(e) => setFullName(e.target.value)} />
                          {errors.fullName && <p className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>}
                        </Field>
                        <Field label="Email">
                          <input className={inputCls} type="email" placeholder="alex@email.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                        </Field>
                        <Field label="Phone">
                          <input className={inputCls} type="tel" placeholder="+1 555 010 2030" value={phone}
                            onChange={(e) => setPhone(e.target.value)} />
                          {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
                        </Field>
                        <Field label="Notes (optional)">
                          <input className={inputCls} placeholder="Goals, injuries, questions…" value={notes}
                            onChange={(e) => setNotes(e.target.value)} />
                        </Field>
                      </div>
                      {errors.form && <p className="mt-4 text-sm text-red-400">{errors.form}</p>}
                      <div className="mt-8 flex items-center justify-between">
                        <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ash transition hover:text-bone">
                          <Icon name="chevL" className="h-4 w-4" /> Back
                        </button>
                        <button
                          onClick={submit}
                          disabled={submitting}
                          className="inline-flex items-center gap-2 rounded-full bg-volt px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-ink transition-all duration-300 hover:bg-white active:scale-95 disabled:opacity-60"
                        >
                          {submitting ? <Spinner className="h-4 w-4 !text-ink" /> : <Icon name="check" className="h-4 w-4" />}
                          {submitting ? 'Booking…' : 'Confirm booking'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4 — success */}
                  {step === 4 && confirmation && service && slot && dateStr && (
                    <div className="animate-pop py-6 text-center">
                      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-volt text-ink shadow-[0_0_50px_rgba(200,245,66,0.5)]">
                        <Icon name="check" className="h-10 w-10" />
                      </span>
                      <h3 className="font-display mt-6 text-4xl uppercase tracking-wide text-bone">
                        You're <span className="text-volt">booked in</span>
                      </h3>
                      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ash">
                        Your request is in — <span className="text-bone font-semibold">{settings?.trainer_name || 'your coach'}</span> will
                        confirm your session shortly. Booking ref <span className="font-mono font-bold text-volt">{confirmation.ref}</span>
                      </p>
                      <div className="mx-auto mt-7 max-w-md rounded-2xl border border-volt/30 bg-volt/[0.06] p-6 text-left">
                        <SummaryRows service={service} dateStr={dateStr} slot={slot} />
                      </div>
                      <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <button onClick={resetAll} className="rounded-full bg-volt px-7 py-3 text-xs font-extrabold uppercase tracking-widest text-ink transition hover:bg-white active:scale-95">
                          Book another session
                        </button>
                        <a href="#top" className="rounded-full border border-white/20 px-7 py-3 text-xs font-extrabold uppercase tracking-widest text-bone transition hover:border-volt hover:text-volt">
                          Back to top
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Summary rail */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-coal">
              <div className="relative h-40 overflow-hidden">
                <img src={IMAGES.bookingAccent} alt={IMAGES.bookingAccentAlt} loading="lazy" onError={imgFallback}
                  className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/30 to-transparent" />
                <p className="font-display absolute bottom-4 left-5 text-xl uppercase tracking-wide text-bone">
                  Your session
                </p>
              </div>
              <div className="p-6">
                {service && slot && dateStr ? (
                  <div className="animate-fade">
                    <SummaryRows service={service} dateStr={dateStr} slot={slot} />
                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-volt/10 px-4 py-3 text-xs leading-relaxed text-volt">
                      <Icon name="shield" className="h-4 w-4 shrink-0" />
                      Free cancellation up to 12h before your session.
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <Badge tone="muted">Awaiting selection</Badge>
                    <p className="mt-3 text-sm leading-relaxed text-ash">
                      Choose a program{service ? '' : ', a date'} and time — your summary appears here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function SummaryRows({ service, dateStr, slot }: { service: Service; dateStr: string; slot: Slot }) {
  const rows: Array<[string, string]> = [
    ['Program', service.name],
    ['Date', formatDateLong(dateStr)],
    ['Time', `${slot.label} – ${formatTime(slot.end)}`],
    ['Duration', `${service.duration_minutes} minutes`],
    ['Total', money(service.price)],
  ]
  return (
    <dl className="space-y-3">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-start justify-between gap-4 text-sm">
          <dt className="shrink-0 text-xs font-bold uppercase tracking-widest text-ash">{k}</dt>
          <dd className={`text-right font-semibold ${k === 'Total' ? 'font-display text-xl text-volt' : 'text-bone'}`}>{v}</dd>
        </div>
      ))}
    </dl>
  )
}
