import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('PASTE_YOUR')) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing credentials. Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local (see README).'
  )
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key'
)

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('PASTE_YOUR')
)
