import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthState {
  user: User | null
  isAdmin: boolean
  loading: boolean
  /** While true, the admin check has not finished — do not redirect yet. */
  checkingAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

async function checkAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return false
  return Boolean(data)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checkingAdmin, setCheckingAdmin] = useState(false)

  useEffect(() => {
    let alive = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return
      setSession(data.session)
      if (data.session?.user) {
        setCheckingAdmin(true)
        const admin = await checkAdmin(data.session.user.id)
        if (!alive) return
        setIsAdmin(admin)
        setCheckingAdmin(false)
      }
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
      setSession(sess)
      if (sess?.user) {
        setCheckingAdmin(true)
        const admin = await checkAdmin(sess.user.id)
        setIsAdmin(admin)
        setCheckingAdmin(false)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setCheckingAdmin(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setCheckingAdmin(false)
      return { error: error.message }
    }
    if (data.user) {
      const admin = await checkAdmin(data.user.id)
      setIsAdmin(admin)
    }
    setCheckingAdmin(false)
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setIsAdmin(false)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{
      user: session?.user ?? null,
      isAdmin,
      loading,
      checkingAdmin,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
