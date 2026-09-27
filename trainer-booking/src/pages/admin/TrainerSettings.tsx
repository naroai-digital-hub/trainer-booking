import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { TrainerSettings } from '../../lib/types'
import { Card, CardTitle, AdminSpinner, Toast, adminInput, AdminField, SaveButton } from '../../components/admin/widgets'

export default function TrainerSettingsPage() {
  const [id, setId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [form, setForm] = useState({
    trainer_name: '',
    trainer_email: '',
    trainer_phone: '',
    trainer_address: '',
    slot_interval_minutes: 30,
    booking_notice_hours: 12,
  })

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.from('trainer_settings').select('*').limit(1).maybeSingle()
      const s = data as TrainerSettings | null
      if (s) {
        setId(s.id)
        setForm({
          trainer_name: s.trainer_name ?? '',
          trainer_email: s.trainer_email ?? '',
          trainer_phone: s.trainer_phone ?? '',
          trainer_address: s.trainer_address ?? '',
          slot_interval_minutes: s.slot_interval_minutes,
          booking_notice_hours: s.booking_notice_hours,
        })
      }
      setLoading(false)
    })()
  }, [])

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      trainer_name: form.trainer_name.trim() || null,
      trainer_email: form.trainer_email.trim() || null,
      trainer_phone: form.trainer_phone.trim() || null,
      trainer_address: form.trainer_address.trim() || null,
      slot_interval_minutes: Number(form.slot_interval_minutes),
      booking_notice_hours: Number(form.booking_notice_hours),
    }
    const { error, data } = id
      ? await supabase.from('trainer_settings').update(payload).eq('id', id).select().single()
      : await supabase.from('trainer_settings').insert(payload).select().single()
    setSaving(false)
    if (error) {
      setToast('Could not save settings')
    } else {
      if (data) setId((data as TrainerSettings).id)
      setToast('Settings saved — website and booking updated')
    }
    window.setTimeout(() => setToast(null), 2600)
  }

  if (loading) return <AdminSpinner />

  return (
    <form onSubmit={save} className="animate-fade space-y-5">
      <Toast msg={toast} />

      <Card>
        <CardTitle title="Coach profile" copy="Shown on the website — about section, footer, and booking confirmations." />
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Trainer name">
            <input className={adminInput} placeholder="e.g. Alex Carter"
              value={form.trainer_name} onChange={(e) => set('trainer_name', e.target.value)} />
          </AdminField>
          <AdminField label="Email">
            <input className={adminInput} type="email" placeholder="coach@yourstudio.com"
              value={form.trainer_email} onChange={(e) => set('trainer_email', e.target.value)} />
          </AdminField>
          <AdminField label="Phone">
            <input className={adminInput} type="tel" placeholder="+1 555 010 2030"
              value={form.trainer_phone} onChange={(e) => set('trainer_phone', e.target.value)} />
          </AdminField>
          <AdminField label="Address / Studio">
            <input className={adminInput} placeholder="123 Strength Ave, Austin TX"
              value={form.trainer_address} onChange={(e) => set('trainer_address', e.target.value)} />
          </AdminField>
        </div>
      </Card>

      <Card>
        <CardTitle title="Booking rules" copy="These directly control the time slots clients see on the website." />
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Slot interval (minutes)">
            <input className={adminInput} type="number" min={5} max={120} step={5} required
              value={form.slot_interval_minutes} onChange={(e) => set('slot_interval_minutes', Number(e.target.value))} />
            <p className="mt-1.5 text-xs text-ink/45">Spacing between bookable start times. 30 = slots at :00 and :30.</p>
          </AdminField>
          <AdminField label="Booking notice (hours)">
            <input className={adminInput} type="number" min={0} max={720} step={1} required
              value={form.booking_notice_hours} onChange={(e) => set('booking_notice_hours', Number(e.target.value))} />
            <p className="mt-1.5 text-xs text-ink/45">How far ahead clients must book. 12 = no same-morning surprises.</p>
          </AdminField>
        </div>
        <div className="mt-7 flex justify-end">
          <SaveButton saving={saving} />
        </div>
      </Card>
    </form>
  )
}
