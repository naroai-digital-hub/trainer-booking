import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { toDateStr, parseDateStr } from '../../lib/availability'
import type { BlockedDate } from '../../lib/types'
import { Icon } from '../../components/ui'
import { Card, CardTitle, AdminSpinner, AdminEmpty, Toast, adminInput, AdminField } from '../../components/admin/widgets'

export default function BlockedDates() {
  const [dates, setDates] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const load = async () => {
    const { data } = await supabase
      .from('blocked_dates')
      .select('*')
      .gte('blocked_date', toDateStr(new Date()))
      .order('blocked_date')
    setDates((data ?? []) as BlockedDate[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) return
    setAdding(true)
    const { error } = await supabase.from('blocked_dates').insert({
      blocked_date: date,
      reason: reason.trim() || null,
    })
    setAdding(false)
    if (error) {
      showToast('Could not add — that date may already be blocked')
      return
    }
    setDate('')
    setReason('')
    await load()
    showToast('Date blocked — no bookings allowed')
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('blocked_dates').delete().eq('id', id)
    if (!error) {
      setDates((prev) => prev.filter((d) => d.id !== id))
      showToast('Block removed')
    }
  }

  if (loading) return <AdminSpinner />

  return (
    <div className="animate-fade space-y-5">
      <Toast msg={toast} />
      <Card>
        <CardTitle title="Block a date" copy="Holidays, travel, days off — blocked dates show no booking slots." />
        <form onSubmit={add} className="flex flex-wrap items-end gap-4">
          <AdminField label="Date" className="w-[190px]">
            <input type="date" required className={adminInput} value={date}
              min={toDateStr(new Date())} onChange={(e) => setDate(e.target.value)} />
          </AdminField>
          <AdminField label="Reason (optional)" className="min-w-[220px] flex-1">
            <input className={adminInput} placeholder="e.g. Public holiday, out of town…"
              value={reason} onChange={(e) => setReason(e.target.value)} />
          </AdminField>
          <button
            type="submit"
            disabled={adding || !date}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-xs font-extrabold uppercase tracking-widest text-volt transition-all duration-300 hover:bg-smoke active:scale-95 disabled:opacity-50"
          >
            <Icon name="ban" className="h-4 w-4" />
            {adding ? 'Blocking…' : 'Block date'}
          </button>
        </form>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <CardTitle title="Upcoming blocked dates" copy={`${dates.length} date${dates.length === 1 ? '' : 's'} blocked`} />
        </div>
        {dates.length === 0 ? (
          <div className="p-6"><AdminEmpty title="No blocked dates" hint="Your schedule is fully open. Block holidays or days off above." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {dates.map((d) => {
              const dt = parseDateStr(d.blocked_date)
              return (
                <li key={d.id} className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                    <span className="font-display text-lg leading-none">{dt.getDate()}</span>
                    <span className="text-[9px] font-extrabold uppercase">{dt.toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink">
                      {dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-ink/50">{d.reason || 'No reason given'}</p>
                  </div>
                  <button
                    onClick={() => remove(d.id)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-500 transition hover:bg-red-500 hover:text-white active:scale-95"
                    title="Remove block"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}
