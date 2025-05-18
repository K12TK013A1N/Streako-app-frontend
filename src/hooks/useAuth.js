import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

// Custom hook to track session & user
export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    // Cleanup subscription
    return () => listener.subscription.unsubscribe()
  }, [])

  return { user, loading }
}