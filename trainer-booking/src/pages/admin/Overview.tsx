import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toDateStr, parseDateStr, formatTime, combine } from '../../lib/availability'
import type { Appointment } from '../../lib/types'
import { Badge, statusTone, Icon } from '../../components/ui'
import { Card, CardTitle, AdminSpinner, AdminEmpty, StatCard } from '../../components/admin/widgets'

interface Stats {
  upcoming: number
  pending: number
  completed: number
  activeServices: number
}

export default function Overview() {
  const [stats, setStats] = useState<Stats>({ upcoming: 0, pending: 0, completed: 0, activeServices: 0 })
  const [upcoming, setUpcoming] = useState<Appointment[]>([])
  const [todayList, setTodayList] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const today = toDateStr(new Date())
      const [appts, svc] = await Promise.all([
        supabase.from('appointments').select('*, services(name)').order('appointment_date').order('start_time'),
        supabase.from('services').select('id').eq('is_active', true),
      ])
      const all = (appts.data ?? []) as Appointment[]
      const upcomingAll = all.filter(
        (a) => a.appointment_date >= today && (a.status === 'pending' || a.status === 'confirmed')
      )
      setStats({
        upcoming: upcomingAll.length,
        pending: all.filter((a) => a.status === 'pending').length,
        completed: all.filter((a) => a.status === 'completed').length,
        activeServices: (svc.data ?? []).length,
      })
      setUpcoming(upcomingAll.slice(0, 6))
      setTodayList(all.filter((a) => a.appointment_date === today && a.status !== 'cancelled'))
      setLoading(false)
    })()
  }, [])

  if (loading) return <AdminSpinner />

  return (
    <div className="animate-fade space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="bolt" label="Upcoming sessions" value={stats.upcoming} />
        <StatCard icon="clock" label="Awaiting confirmation" value={stats.pending} accent="bg-amber-400" />
        <StatCard icon="check" label="Completed" value={stats.completed} accent="bg-emerald-400" />
        <StatCard icon="dumbbell" label="Active programs" value={stats.activeServices} accent="bg-sky-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's sessions */}
        <Card>
          <CardTitle
            title="Today's sessions"
            copy={todayList.length ? `${todayList.length} on the schedule` : 'Nothing booked today'}
            action={
              <Link to="/admin/appointments" className="text-xs font-extrabold uppercase tracking-widest text-ink/60 transition hover:text-ink">
                View all →
              </Link>
            }
          />
          {todayList.length === 0 ? (
            <AdminEmpty title="A quiet day" hint="No sessions scheduled for today. Time for your own training." />
          ) : (
            <ul className="space-y-3">
              {todayList.map((a) => (
                <li key={a.id} className="flex items-center gap-4 rounded-xl border border-black/5 bg-[#f7f8f9] p-4 transition hover:border-ink/20">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink font-display text-sm text-volt">
                    {a.full_name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{a.full_name}</p>
                    <p className="text-xs text-ink/50">
                      {a.services?.name ?? 'Session'} · {formatTime(combine(a.appointment_date, a.start_time))} – {formatTime(combine(a.appointment_date, a.end_time))}
                    </p>
                  </div>
                  <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Next up */}
        <Card>
          <CardTitle
            title="Next up"
            copy="Upcoming confirmed and pending sessions"
            action={
              <Link to="/admin/appointments" className="text-xs font-extrabold uppercase tracking-widest text-ink/60 transition hover:text-ink">
                Manage →
              </Link>
            }
          />
          {upcoming.length === 0 ? (
            <AdminEmpty title="No upcoming sessions" hint="New bookings from the website will appear here." />
          ) : (
            <ul className="space-y-3">
              {upcoming.map((a) => {
                const d = parseDateStr(a.appointment_date)
                return (
                  <li key={a.id} className="flex items-center gap-4 rounded-xl border border-black/5 bg-[#f7f8f9] p-4 transition hover:border-ink/20">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-volt text-ink">
                      <span className="font-display text-lg leading-none">{d.getDate()}</span>
                      <span className="text-[9px] font-extrabold uppercase">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{a.full_name}</p>
                      <p className="text-xs text-ink/50">
                        {a.services?.name ?? 'Session'} · {formatTime(combine(a.appointment_date, a.start_time))}
                      </p>
                    </div>
                    <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardTitle title="Quick actions" copy="Common tasks, one tap away" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { to: '/admin/appointments', icon: 'calendar', label: 'Review bookings' },
            { to: '/admin/services', icon: 'plus', label: 'Add program' },
            { to: '/admin/blocked', icon: 'ban', label: 'Block a date' },
            { to: '/admin/hours', icon: 'clock', label: 'Edit hours' },
          ].map((q) => (
            <Link
              key={q.to + q.label}
              to={q.to}
              className="group flex items-center gap-3 rounded-xl bg-ink p-4 text-bone transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-volt/15 text-volt transition group-hover:bg-volt group-hover:text-ink">
                <Icon name={q.icon as 'calendar'} className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold">{q.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
