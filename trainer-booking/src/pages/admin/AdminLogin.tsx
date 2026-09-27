import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { BRAND, IMAGES, imgFallback } from '../../lib/media'
import { Icon, Spinner, Field, inputCls } from '../../components/ui'

export default function AdminLogin() {
  const { user, isAdmin, loading, checkingAdmin, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && !checkingAdmin && user && isAdmin) {
    return <Navigate to="/admin/overview" replace />
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: err } = await signIn(email.trim(), password)
    setBusy(false)
    if (err) {
      setError(err)
      return
    }
    navigate('/admin/overview', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-ink">
      {/* Visual side */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img src={IMAGES.gymInterior} alt={IMAGES.gymInteriorAlt} onError={imgFallback}
          className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-ink/70 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="font-display flex h-11 w-11 items-center justify-center rounded-xl bg-volt text-2xl text-ink">
              {BRAND.studio[0]}
            </span>
            <span className="font-display text-2xl uppercase tracking-wide text-bone">{BRAND.studio}</span>
          </div>
          <div>
            <p className="font-display text-5xl uppercase leading-[1.02] text-bone">
              Coach<br />command<br /><span className="text-volt">center.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/60">
              Sessions, programs, schedule, and settings — everything you need to run
              your coaching business, in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="font-display flex h-11 w-11 items-center justify-center rounded-xl bg-volt text-2xl text-ink">
              {BRAND.studio[0]}
            </span>
            <span className="font-display text-2xl uppercase tracking-wide text-bone">{BRAND.studio}</span>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-volt/40 bg-volt/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-volt">
            <Icon name="shield" className="h-3.5 w-3.5" /> Trainer access
          </span>
          <h1 className="font-display mt-5 text-4xl uppercase tracking-wide text-bone sm:text-5xl">
            Welcome back, <span className="text-volt">coach.</span>
          </h1>
          <p className="mt-3 text-sm text-ash">Sign in to manage your bookings and programs.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <Field label="Email">
              <input type="email" required autoComplete="email" className={inputCls}
                placeholder="you@yourstudio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password">
              <input type="password" required autoComplete="current-password" className={inputCls}
                placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>

            {error && (
              <p className="animate-fade rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || checkingAdmin}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-volt py-4 text-sm font-extrabold uppercase tracking-wider text-ink shadow-[0_12px_40px_-8px_rgba(200,245,66,0.6)] transition-all duration-300 hover:bg-white active:scale-[0.98] disabled:opacity-60"
            >
              {busy || checkingAdmin ? <Spinner className="h-5 w-5 !text-ink" /> : <Icon name="arrowR" className="h-4 w-4" />}
              {busy || checkingAdmin ? 'Signing in…' : 'Sign in to dashboard'}
            </button>
          </form>

          <a href="/" className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ash transition hover:text-volt">
            <Icon name="chevL" className="h-4 w-4" /> Back to website
          </a>
        </div>
      </div>
    </div>
  )
}
