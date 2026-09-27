/**
 * Availability engine — generates bookable time slots for a given date.
 *
 * Inputs: business_hours, services.duration_minutes,
 * trainer_settings.slot_interval_minutes, trainer_settings.booking_notice_hours,
 * blocked_dates, existing appointments (cancelled ignored).
 *
 * Overlap rule: new_start < existing_end AND new_end > existing_start
 */

export interface Slot {
  start: Date
  end: Date
  label: string
}

export interface ExistingBooking {
  start_time: string // HH:MM:SS
  end_time: string // HH:MM:SS
  status: string
}

/* ---------- date helpers (always real Date objects, never string formats) ---------- */

export function toDateStr(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Combine a YYYY-MM-DD date and an HH:MM(:SS) time into a real Date. */
export function combine(dateStr: string, timeStr: string): Date {
  const [y, mo, d] = dateStr.split('-').map(Number)
  const [h, mi, s] = timeStr.split(':').map(Number)
  return new Date(y, mo - 1, d, h, mi || 0, s || 0)
}

export function toTimeStr(d: Date): string {
  const h = `${d.getHours()}`.padStart(2, '0')
  const m = `${d.getMinutes()}`.padStart(2, '0')
  const s = `${d.getSeconds()}`.padStart(2, '0')
  return `${h}:${m}:${s}`
}

export function formatTime(d: Date): string {
  let h = d.getHours()
  const m = `${d.getMinutes()}`.padStart(2, '0')
  const suffix = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m} ${suffix}`
}

export function formatDateLong(dateStr: string): string {
  return parseDateStr(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function minutesOf(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + (m || 0)
}

/* ---------- slot generation ---------- */

export interface GenerateSlotsInput {
  dateStr: string
  isOpen: boolean
  openTime: string // HH:MM:SS
  closeTime: string // HH:MM:SS
  isBlocked: boolean
  serviceDurationMinutes: number
  slotIntervalMinutes: number
  bookingNoticeHours: number
  existing: ExistingBooking[]
  now?: Date
}

export function generateSlots(input: GenerateSlotsInput): Slot[] {
  const {
    dateStr,
    isOpen,
    openTime,
    closeTime,
    isBlocked,
    serviceDurationMinutes,
    slotIntervalMinutes,
    bookingNoticeHours,
    existing,
    now = new Date(),
  } = input

  if (!isOpen || isBlocked) return []
  const duration = Math.max(15, serviceDurationMinutes)
  const interval = Math.max(5, slotIntervalMinutes)

  const openMin = minutesOf(openTime)
  const closeMin = minutesOf(closeTime)
  if (closeMin <= openMin) return []

  const earliest = new Date(now.getTime() + bookingNoticeHours * 3_600_000)

  const active = existing
    .filter((b) => b.status !== 'cancelled')
    .map((b) => ({
      start: combine(dateStr, b.start_time),
      end: combine(dateStr, b.end_time),
    }))

  const slots: Slot[] = []
  for (let t = openMin; t + duration <= closeMin; t += interval) {
    const start = combine(dateStr, `${`${Math.floor(t / 60)}`.padStart(2, '0')}:${`${t % 60}`.padStart(2, '0')}:00`)
    const end = new Date(start.getTime() + duration * 60_000)
    if (start < earliest) continue
    const overlaps = active.some((b) => start < b.end && end > b.start)
    if (overlaps) continue
    slots.push({ start, end, label: formatTime(start) })
  }
  return slots
}

/** Days the date picker should offer (default: next 42 days). */
export function upcomingDays(count = 42): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
    days.push(toDateStr(d))
  }
  return days
}
