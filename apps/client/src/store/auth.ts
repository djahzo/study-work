import { create } from "zustand"
import { createClient, type SupabaseClient, type User as SupabaseUser } from "@supabase/supabase-js"

interface AuthStore {
  user: SupabaseUser | null
  loading: boolean
  supabase: SupabaseClient | null
  init: (supabase: SupabaseClient) => void
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string, name: string) => Promise<string | null>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,
  supabase: null,

  init(supabase) {
    set({ supabase })
    supabase.auth.getSession().then(({ data }) => {
      set({ user: data.session?.user ?? null, loading: false })
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  async signIn(email, password) {
    const { supabase } = get()
    if (!supabase) return "Supabase not initialized"
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  },

  async signUp(email, password, name) {
    const { supabase } = get()
    if (!supabase) return "Supabase not initialized"
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    return error?.message ?? null
  },

  async signOut() {
    const { supabase } = get()
    if (!supabase) return
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
