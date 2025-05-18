// src/components/Auth/SignIn.jsx

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // If URL contains `?access_token=…`, Supabase just redirected back
  // Let supabase-js pick that up and then navigate on session change
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate(redirectTo, { replace: true });
      }
    });
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [navigate, redirectTo]);

  const handleGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/accept-invite?token=` +
                    encodeURIComponent(searchParams.get('token') || '')
      }
    });
  };

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Sign In</h1>
      <button onClick={handleGoogle} style={{ marginTop: '2rem', padding: '0.75rem 1.5rem' }}>
        Sign in with Google
      </button>
    </div>
  );
}
