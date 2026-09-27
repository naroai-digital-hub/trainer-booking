import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { Spinner, Icon } from './components/ui'
import Home from './pages/Home'
import AdminLogin from './pages/admin/AdminLogin'
import DashboardLayout from './components/admin/DashboardLayout'
import Overview from './pages/admin/Overview'
import Appointments from './pages/admin/Appointments'
import ServicesAdmin from './pages/admin/ServicesAdmin'
import BusinessHours from './pages/admin/BusinessHours'
import BlockedDates from './pages/admin/BlockedDates'
import TrainerSettings from './pages/admin/TrainerSettings'

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ink">
      <Spinner className="h-10 w-10" />
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-ash">Checking access…</p>
    </div>
  )
}

function Unauthorized() {
  const { signOut } = useAuth()
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="animate-pop w-full max-w-md rounded-3xl border border-white/10 bg-coal p-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
          <Icon name="shield" className="h-8 w-8" />
        </span>
        <h1 className="font-display mt-6 text-3xl uppercase tracking-wide text-bone">Not authorized</h1>
        <p className="mt-3 text-sm leading-relaxed text-ash">
          You are signed in, but you are not authorized as an admin.
        </p>
        <button
          onClick={() => signOut()}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-volt px-7 py-3 text-xs font-extrabold uppercase tracking-widest text-ink transition hover:bg-white active:scale-95"
        >
          <Icon name="logout" className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  )
}

/** Protects every /admin/* route. Never redirects before the admin check finishes. */
function ProtectedAdmin() {
  const { user, isAdmin, loading, checkingAdmin } = useAuth()
  if (loading || checkingAdmin) return <LoadingScreen />
  if (!user) return <Navigate to="/admin" replace />
  if (!isAdmin) return <Unauthorized />
  return <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<ProtectedAdmin />}>
          <Route path="/admin/overview" element={<DashboardLayout><Overview /></DashboardLayout>} />
          <Route path="/admin/appointments" element={<DashboardLayout><Appointments /></DashboardLayout>} />
          <Route path="/admin/services" element={<DashboardLayout><ServicesAdmin /></DashboardLayout>} />
          <Route path="/admin/hours" element={<DashboardLayout><BusinessHours /></DashboardLayout>} />
          <Route path="/admin/blocked" element={<DashboardLayout><BlockedDates /></DashboardLayout>} />
          <Route path="/admin/settings" element={<DashboardLayout><TrainerSettings /></DashboardLayout>} />
          <Route path="/admin/*" element={<Navigate to="/admin/overview" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
