import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { BusinessHour } from '../../lib/types'
import { WEEKDAYS } from '../../lib/types'
import { Card, CardTitle, AdminSpinner, Toast, adminInput, SaveButton } from '../../components/admin/widgets'

interface Row extends BusinessHour {}

function short(t: string) {
  return t.slice(0, 5) // HH:MM:SS -> HH:MM
}

export default function BusinessHours() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.from('business_hours').select('*').order('weekday')
      const list = ((data ?? []) as Row[]).sort((a, b) => a.weekday - b.weekday)
      // guarantee all 7 weekdays exist locally
      const full: Row[] = WEEKDAYS.map((_, i) => {
        const found = list.find((r) => r.weekday === i)
        return found ?? ({ id: '', weekday: i, is_open: i !== 0, start_time: '07:00:00', end_time: '20:00:00' } as Row)
      })
      setRows(full)
      setLoading(false)
    })()
  }, [])

  const update = (weekday: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.weekday === weekday ? { ...r, ...patch } : r)))
    setDirty(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    for (const r of rows) {
      const payload = { weekday: r.weekday, is_open: r.is_open, start_time: r.start_time, end_time: r.end_time }
      if (r.id) {
        await supabase.from('business_hours').update(payload).eq('id', r.id)
      } else {
        await supabase.from('business_hours').insert(payload)
      }
    }
    const { data } = await supabase.from('business_hours').select('*').order('weekday')
    setRows(((data ?? []) as Row[]).sort((a, b) => a.weekday - b.weekday))
    setSaving(false)
    setDirty(false)
    setToast('Business hours updated — booking slots refresh instantly')
    window.setTimeout(() => setToast(null), 2600)
  }

  if (loading) return <AdminSpinner />

  return (
    <form onSubmit={save} className="animate-fade space-y-5">
      <Toast msg={toast} />
      <Card className="!p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <CardTitle
            title="Weekly schedule"
            copy="Toggle days open or closed and set coaching hours. Changes apply to available booking slots immediately."
          />
        </div>
        <ul className="divide-y divide-black/5">
          {rows.map((r) => (
            <li key={r.weekday} className={`flex flex-wrap items-center gap-4 p-5 transition ${r.is_open ? '' : 'bg-black/[0.02]'}`}>
              <div className="flex min-w-[140px] flex-1 items-center gap-4">
                <button
                  type="button"
                  onClick={() => update(r.weekday, { is_open: !r.is_open })}
                  className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-300 ${r.is_open ? 'bg-volt' : 'bg-black/15'}`}
                  aria-pressed={r.is_open}
                  aria-label={`Toggle ${WEEKDAYS[r.weekday]}`}
                >
                  <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all duration-300 ${r.is_open ? 'left-7' : 'left-1'}`} />
                </button>
                <div>
                  <p className={`font-bold ${r.is_open ? 'text-ink' : 'text-ink/40'}`}>{WEEKDAYS[r.weekday]}</p>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink/40">
                    {r.is_open ? 'Open' : 'Closed'}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-3 transition ${r.is_open ? '' : 'pointer-events-none opacity-30'}`}>
                <input
                  type="time"
                  className={`${adminInput} w-[130px]`}
                  value={short(r.start_time)}
                  onChange={(e) => update(r.weekday, { start_time: `${e.target.value}:00` })}
                  aria-label={`${WEEKDAYS[r.weekday]} opens`}
                />
                <span className="text-xs font-extrabold uppercase tracking-widest text-ink/40">to</span>
                <input
                  type="time"
                  className={`${adminInput} w-[130px]`}
                  value={short(r.end_time)}
                  onChange={(e) => update(r.weekday, { end_time: `${e.target.value}:00` })}
                  aria-label={`${WEEKDAYS[r.weekday]} closes`}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-4 border-t border-black/5 bg-[#f7f8f9] px-6 py-5">
          <p className={`text-sm ${dirty ? 'font-semibold text-ink' : 'text-ink/40'}`}>
            {dirty ? 'You have unsaved changes.' : 'All changes saved.'}
          </p>
          <SaveButton saving={saving} />
        </div>
      </Card>
    </form>
  )
}
