import { Fragment, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDateLong, formatTime, combine } from '../../lib/availability'
import type { Appointment } from '../../lib/types'
import { Badge, statusTone, Icon } from '../../components/ui'
import { Card, AdminSpinner, AdminEmpty, Toast } from '../../components/admin/widgets'

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const
type Filter = (typeof FILTERS)[number]

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const

export default function Appointments() {
  const [all, setAll] = useState<Appointment[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, services(name)')
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: false })
    setAll((data ?? []) as Appointment[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(
    () => (filter === 'all' ? all : all.filter((a) => a.status === filter)),
    [all, filter]
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length }
    for (const s of STATUSES) c[s] = all.filter((a) => a.status === s).length
    return c
  }, [all])

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
    if (error) {
      setToast('Could not update status')
    } else {
      setAll((prev) => prev.map((a) => (a.id === id ? { ...a, status: status as Appointment['status'] } : a)))
      setToast(`Marked as ${status}`)
    }
    window.setTimeout(() => setToast(null), 2200)
  }

  if (loading) return <AdminSpinner />

  return (
    <div className="animate-fade space-y-5">
      <Toast msg={toast} />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest transition-all duration-200 active:scale-95 ${
              filter === f
                ? 'bg-ink text-volt shadow-md'
                : 'bg-white text-ink/55 hover:bg-white hover:text-ink border border-black/5'
            }`}
          >
            {f}
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${filter === f ? 'bg-volt/20 text-volt' : 'bg-black/5 text-ink/50'}`}>
              {counts[f] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-6"><AdminEmpty title={`No ${filter} appointments`} hint="Bookings from the website will show up here." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-[#f7f8f9] text-[11px] uppercase tracking-[0.15em] text-ink/45">
                  <th className="px-6 py-4 font-extrabold">Client</th>
                  <th className="px-4 py-4 font-extrabold">Session</th>
                  <th className="px-4 py-4 font-extrabold">When</th>
                  <th className="px-4 py-4 font-extrabold">Contact</th>
                  <th className="px-4 py-4 font-extrabold">Status</th>
                  <th className="px-4 py-4 font-extrabold text-right">Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <Fragment key={a.id}>
                    <tr className="border-b border-black/5 transition hover:bg-[#fafbfc]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink font-display text-xs text-volt">
                            {a.full_name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                          </span>
                          <div>
                            <p className="font-bold text-ink">{a.full_name}</p>
                            <button
                              onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                              className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink/40 transition hover:text-ink"
                            >
                              {a.notes ? (expanded === a.id ? 'Hide notes' : 'View notes') : 'No notes'}
                              {a.notes && <Icon name={expanded === a.id ? 'chevL' : 'chevR'} className="h-3 w-3 rotate-90" />}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-ink">{a.services?.name ?? '—'}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <p className="font-semibold text-ink">
                          {formatTime(combine(a.appointment_date, a.start_time))} – {formatTime(combine(a.appointment_date, a.end_time))}
                        </p>
                        <p className="text-xs text-ink/50">{formatDateLong(a.appointment_date)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-ink/80">{a.email}</p>
                        <p className="text-xs text-ink/50">{a.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <select
                          value={a.status}
                          onChange={(e) => setStatus(a.id, e.target.value)}
                          className="cursor-pointer rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink outline-none transition hover:border-ink focus:border-ink"
                          aria-label={`Update status for ${a.full_name}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expanded === a.id && a.notes && (
                      <tr className="border-b border-black/5 bg-volt/[0.07]">
                        <td colSpan={6} className="px-6 py-3 text-sm text-ink/70">
                          <span className="font-extrabold uppercase tracking-widest text-[10px] text-ink/40">Client notes — </span>
                          {a.notes}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
