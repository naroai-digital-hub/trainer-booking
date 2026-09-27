import { Icon } from '../ui'

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-black/5 bg-white p-6 shadow-[0_10px_35px_-18px_rgba(10,11,13,0.25)] ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ title, copy, action }: { title: string; copy?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-xl uppercase tracking-wide text-ink">{title}</h2>
        {copy && <p className="mt-1 text-sm text-ink/50">{copy}</p>}
      </div>
      {action}
    </div>
  )
}

export function AdminSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <svg className="h-10 w-10 animate-spin text-ink/30" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function AdminEmpty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/[0.02] px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-volt">
        <Icon name="calendar" className="h-7 w-7" />
      </div>
      <p className="font-display text-xl uppercase tracking-wide text-ink">{title}</p>
      {hint && <p className="mt-2 max-w-sm text-sm text-ink/50">{hint}</p>}
    </div>
  )
}

export function StatCard({ icon, label, value, accent }: {
  icon: Parameters<typeof Icon>[0]['name']
  label: string
  value: number | string
  accent?: string
}) {
  return (
    <Card className="group relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      <div className={`absolute inset-y-0 left-0 w-1 ${accent ?? 'bg-volt'}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/45">{label}</p>
          <p className="font-display mt-2 text-5xl text-ink">{value}</p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-volt transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
          <Icon name={icon} className="h-6 w-6" />
        </span>
      </div>
    </Card>
  )
}

export const adminInput =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10'

export function AdminField({ label, children, className = '' }: {
  label: string; children: React.ReactNode; className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.15em] text-ink/50">{label}</span>
      {children}
    </label>
  )
}

export function SaveButton({ saving, children = 'Save changes' }: { saving: boolean; children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-xs font-extrabold uppercase tracking-widest text-volt transition-all duration-300 hover:bg-smoke active:scale-95 disabled:opacity-60"
    >
      {saving ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
          <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ) : (
        <Icon name="check" className="h-4 w-4" />
      )}
      {saving ? 'Saving…' : children}
    </button>
  )
}

export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null
  return (
    <div className="animate-pop fixed bottom-6 right-6 z-[90] flex items-center gap-3 rounded-2xl bg-ink px-5 py-4 text-sm font-semibold text-bone shadow-2xl">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-volt text-ink">
        <Icon name="check" className="h-4 w-4" />
      </span>
      {msg}
    </div>
  )
}
