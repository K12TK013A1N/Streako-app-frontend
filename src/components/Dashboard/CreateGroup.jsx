// src/components/Dashboard/CreateGroup.jsx

import React, { useState } from 'react';
import { useNavigate }       from 'react-router-dom';
import { supabase }          from '../../services/supabaseClient';

export default function CreateGroup() {
  const [name, setName]             = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const navigate                    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError('You must be signed in');
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase.functions.invoke('create_group', {
      body: JSON.stringify({ name, description }),
    });

    setLoading(false);
    if (dbError) {
      setError(dbError.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center px-4">
      {/* Blurred background blobs */}
      <div className="absolute top-[-10%] left-1/4 w-72 h-72 bg-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 right-[-10%] w-96 h-96 bg-purple-200 rounded-full filter blur-2xl opacity-30 animate-pulse"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        {/* Back arrow & title */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            {/* Left arrow icon */}
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="ml-4 text-xl font-semibold text-purple-600">
            Create New Group
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter group name"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What will your group be streaking? (e.g., Morning workout, Daily meditation)"
              rows={4}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium
              bg-purple-600 hover:bg-purple-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Creating…' : 'Create Group'}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
