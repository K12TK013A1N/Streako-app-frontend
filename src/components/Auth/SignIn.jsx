import { supabase } from '../../services/supabaseClient'
import TextCarousel from '../Dashboard/TextCarousel'

export default function SignIn() {
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
      {/* Rotating banner moved here */}
      <TextCarousel />
      <h1>Sign In</h1>
      <button
        onClick={handleGoogle}
        style={{ marginTop: '2rem', padding: '0.75rem 1.5rem' }}
      >
        Sign in with Google
      </button>
    </div>
  )
}