// src/components/Auth/SignIn.jsx

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import TextCarousel from '../Dashboard/TextCarousel';

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/dashboard';
  const redirectTo = window.location.origin + rawRedirect;

  // If URL contains `?access_token=…`, Supabase just redirected back
  // Let supabase-js pick that up and then navigate on session change
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.href = redirectTo;    // force full reload so the hash fragment is preserved
      }
    });
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [navigate, redirectTo]);

    const handleGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-1/4 w-72 h-72 bg-purple-300 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-1/3 left-[-10%] w-96 h-96 bg-purple-200 rounded-full filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-1/3 w-80 h-80 bg-purple-300 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>

      {/* Card */}
      <div className="relative z-10 max-w-md w-full bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 text-center">
        {/* Brand */}
        <div className="flex items-center justify-center">
          <h1 className="text-5xl font-extrabold text-purple-500 animate-pulse">streako</h1>
          <div className="ml-2 w-4 h-4 border-2 border-purple-500 rounded-full animate-spin-slow"></div>
        </div>

        {/* Tagline */}
        <p className="mt-4 text-xl font-semibold text-gray-700">
          Streak together. Achieve together.
        </p>

        {/* Description */}
        <p className="mt-2 text-gray-600">
          Track daily habits and build consistency with friends.<br/>
          Stay accountable and celebrate each other’s progress.
        </p>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          className="mt-6 flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          <span className="text-gray-700 font-medium">
            Sign in with Google
          </span>
        </button>

        {/* Terms Footer */}
        <p className="mt-6 text-xs text-gray-500">
          By signing in, you agree to our&nbsp;
          <a href="#" className="underline">Terms of Service</a>&nbsp;and&nbsp;
          <a href="#" className="underline">Privacy Policy</a>. <br/>
          We’ll never post without your permission.
          <br/>Developed with ❤️ by Shashwat.
        </p>
      </div>
    </div>
  );
}
