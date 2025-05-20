// src/components/Auth/AcceptInvite.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import useAuth from '../../hooks/useAuth';

export default function AcceptInvite() {
  const location = useLocation();             // gives us pathname + search
  const currentUrl = location.pathname + location.search; 
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'success'
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: If not logged in, redirect to signin, preserving this token
  useEffect(() => {
    if (!authLoading && !user) {
      // urlencode entire path+search
      const redirectParam = encodeURIComponent(currentUrl);
      navigate(`/signin?redirect=${redirectParam}`, { replace: true });
    }
  }, [authLoading, user, navigate, currentUrl]);

  // Step 2: Once logged in and token present, call accept_invite
  useEffect(() => {
    if (authLoading || !user) return;
    if (!token) {
      setStatus('error');
      setErrorMsg('Missing invite token.');
      return;
    }

    async function accept() {
      setStatus('loading');
      const { data, error } = await supabase.functions.invoke('accept_invite', {
        body: JSON.stringify({ token }),
      });
      if (error) {
        console.error('accept_invite error', error);
        setStatus('error');
        setErrorMsg(error.message);
      } else {
        setStatus('success');
        // Give user a moment to read success
        setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
      }
    }

    accept();
  }, [authLoading, user, token, navigate]);

  if (authLoading || status === 'loading') {
    return <div className="container">Processing invite…</div>;
  }

  if (status === 'error') {
    return (
      <div className="container" style={{ color: 'red' }}>
        <h2>Invite Error</h2>
        <p>{errorMsg}</p>
      </div>
    );
  }

  // success
  return (
    <div className="container">
      <h2>Invite Accepted!</h2>
      <p>You’ll be redirected to your dashboard shortly…</p>
    </div>
  );
}
