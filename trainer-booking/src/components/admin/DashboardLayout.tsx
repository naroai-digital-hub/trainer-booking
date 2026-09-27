import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { BRAND } from '../../lib/media'
import { Icon } from '../../components/ui'

const NAV = [
  { to: '/admin/overview', label: 'Overview', icon: 'grid' },
  { to: '/admin/appointments', label: 'Appointments', icon: 'calendar' },
  { to: '/admin/services', label: 'Services', icon: 'dumbbell' },
  { to: '/admin/hours', label: 'Business Hours', icon: 'clock' },
  { to: '/admin/blocked', label: 'Blocked Dates', icon: 'ban' },
  { to: '/admin/settings', label: 'Trainer Settings', icon: 'settings' },
] as const

const TITLES: Record<string, { title: string; copy: string }> = {
  '/admin/overview': { title: 'Overview', copy: 'Your coaching business at a glance.' },
  '/admin/appointments': { title: 'Appointments', copy: 'Review, confirm, and manage every session.' },
  '/admin/services': { title: 'Services', copy: 'Programs clients can book — pricing, duration, visibility.' },
  '/admin/hours': { title: 'Business Hours', copy: 'When clients can book. Changes apply to slots instantly.' },
  '/admin/blocked': { title: 'Blocked Dates', copy: 'Holidays and days off — no bookings allowed.' },
  '/admin/settings': { title: 'Trainer Settings', copy: 'Your public profile and booking rules.' },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const meta = TITLES[pathname] ?? { title: 'Dashboard', copy: '' }

  const sidebar = (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex items-center gap-3 px-6 pb-6 pt-7">
        <span className="font-display flex h-10 w-10 items-center justify-center rounded-xl bg-volt text-xl text-ink">
          {BRAND.studio[0]}
        </span>
        <span className="leading-none">
          <span className="font-display block text-lg uppercase tracking-wide text-bone">{BRAND.studio}</span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-ash">Coach Console</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-volt text-ink shadow-[0_8px_24px_-8px_rgba(200,245,66,0.6)]'
                  : 'text-ash hover:bg-white/5 hover:text-bone'
              }`
            }
          >
            <Icon name={n.icon} className="h-5 w-5 shrink-0" />
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-4">
        <a href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-ash transition hover:bg-white/5 hover:text-bone">
          <Icon name="arrowR" className="h-5 w-5 rotate-180" />
          View website
        </a>
        <button onClick={() => signOut()} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-ash transition hover:bg-red-500/10 hover:text-red-300">
          <Icon name="logout" className="h-5 w-5" />
          Sign out
        </button>
        <p className="truncate px-4 pt-2 text-[11px] text-ash/60">{user?.email}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#eef0f2]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="animate-pop absolute inset-y-0 left-0 w-[280px]">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-[260px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-black/5 bg-[#eef0f2]/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ink shadow-sm lg:hidden"
                aria-label="Open menu"
              >
                <Icon name="menu" className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-2xl uppercase leading-none tracking-wide text-ink sm:text-3xl">
                  {meta.title}
                </h1>
                <p className="mt-1 hidden text-sm text-ink/50 sm:block">{meta.copy}</p>
              </div>
            </div>
            <span className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest text-volt sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-volt animate-pulse-soft" />
              Live
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  )
}
