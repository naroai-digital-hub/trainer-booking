import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { serviceImage } from '../../lib/media'
import type { Service } from '../../lib/types'
import { Icon } from '../../components/ui'
import { Card, CardTitle, AdminSpinner, AdminEmpty, Toast, adminInput, AdminField, SaveButton } from '../../components/admin/widgets'

function money(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const EMPTY = { name: '', description: '', duration_minutes: 60, price: 80, is_active: true }

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<null | { mode: 'add' | 'edit'; service: Service | null }>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const load = async () => {
    const { data } = await supabase.from('services').select('*').order('created_at')
    setServices((data ?? []) as Service[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  const openAdd = () => {
    setForm(EMPTY)
    setModal({ mode: 'add', service: null })
  }
  const openEdit = (s: Service) => {
    setForm({
      name: s.name,
      description: s.description ?? '',
      duration_minutes: s.duration_minutes,
      price: Number(s.price),
      is_active: s.is_active,
    })
    setModal({ mode: 'edit', service: s })
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      duration_minutes: Number(form.duration_minutes),
      price: Number(form.price),
      is_active: form.is_active,
    }
    const { error } = modal?.mode === 'add'
      ? await supabase.from('services').insert(payload)
      : await supabase.from('services').update(payload).eq('id', modal!.service!.id)
    setSaving(false)
    if (error) {
      showToast('Could not save — try again')
      return
    }
    setModal(null)
    await load()
    showToast(modal?.mode === 'add' ? 'Program added' : 'Program updated')
  }

  const toggleActive = async (s: Service) => {
    const { error } = await supabase.from('services').update({ is_active: !s.is_active }).eq('id', s.id)
    if (!error) {
      setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_active: !x.is_active } : x)))
      showToast(s.is_active ? 'Program deactivated' : 'Program activated')
    }
  }

  if (loading) return <AdminSpinner />

  return (
    <div className="animate-fade space-y-5">
      <Toast msg={toast} />
      <Card className="!p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <CardTitle
            title="Programs"
            copy="Add, edit, and control which programs clients can book. Deactivating hides a program from the website without deleting its history."
            action={
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-extrabold uppercase tracking-widest text-volt transition-all duration-300 hover:bg-smoke active:scale-95"
              >
                <Icon name="plus" className="h-4 w-4" /> Add program
              </button>
            }
          />
        </div>

        {services.length === 0 ? (
          <div className="p-6"><AdminEmpty title="No programs yet" hint="Add your first training program to start taking bookings." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {services.map((s) => {
              const img = serviceImage(s.name, 400)
              return (
                <li key={s.id} className={`flex items-center gap-4 p-5 transition ${s.is_active ? '' : 'opacity-60 grayscale-[0.4]'}`}>
                  <img src={img.src} alt={img.alt} loading="lazy"
                    className="hidden h-16 w-16 shrink-0 rounded-xl object-cover sm:block" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-ink">{s.name}</p>
                      {s.is_active
                        ? <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">Active</span>
                        : <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-ink/40">Hidden</span>}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-ink/50">{s.description || 'No description'}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-ink/40">
                      {s.duration_minutes} min · {money(Number(s.price))}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {/* Active toggle */}
                    <button
                      onClick={() => toggleActive(s)}
                      title={s.is_active ? 'Deactivate' : 'Activate'}
                      className={`relative h-8 w-14 rounded-full transition-colors duration-300 ${s.is_active ? 'bg-volt' : 'bg-black/15'}`}
                      aria-pressed={s.is_active}
                    >
                      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all duration-300 ${s.is_active ? 'left-7' : 'left-1'}`} />
                    </button>
                    <button
                      onClick={() => openEdit(s)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-volt transition hover:bg-smoke active:scale-95"
                      title="Edit program"
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      {/* Add / Edit modal (light theme) */}
      {modal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal>
          <div className="absolute inset-0 animate-fade bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="animate-pop relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
              <h3 className="font-display text-xl uppercase tracking-wide text-ink">
                {modal.mode === 'add' ? 'Add program' : 'Edit program'}
              </h3>
              <button onClick={() => setModal(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-ink/60 transition hover:bg-black/10" aria-label="Close">
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={save} className="space-y-5 px-6 py-6">
              <AdminField label="Program name">
                <input className={adminInput} required placeholder="1-on-1 Personal Training"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </AdminField>
              <AdminField label="Description">
                <textarea className={`${adminInput} min-h-[96px] resize-y`} placeholder="What makes this program special…"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </AdminField>
              <div className="grid grid-cols-2 gap-4">
                <AdminField label="Duration (minutes)">
                  <input className={adminInput} type="number" min={15} max={240} step={5} required
                    value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })} />
                </AdminField>
                <AdminField label="Price (USD)">
                  <input className={adminInput} type="number" min={0} step={1} required
                    value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </AdminField>
              </div>
              <label className="flex cursor-pointer items-center justify-between rounded-xl bg-[#f4f5f6] px-4 py-3.5">
                <span className="text-sm font-bold text-ink">Visible on website</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`relative h-8 w-14 rounded-full transition-colors duration-300 ${form.is_active ? 'bg-volt' : 'bg-black/15'}`}
                  aria-pressed={form.is_active}
                >
                  <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all duration-300 ${form.is_active ? 'left-7' : 'left-1'}`} />
                </button>
              </label>
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setModal(null)}
                  className="rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-widest text-ink/50 transition hover:text-ink">
                  Cancel
                </button>
                <SaveButton saving={saving}>{modal.mode === 'add' ? 'Add program' : 'Save changes'}</SaveButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
