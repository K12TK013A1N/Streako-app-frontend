// src/components/Dashboard/InviteModal.jsx
import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function InviteModal({ groupId, groupName, onClose }) {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateLink = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fnErr } = await supabase.functions.invoke(
      'invite_user',
      { body: JSON.stringify({ group_id: groupId }) }
    );
    setLoading(false);

    if (fnErr) {
      setError(fnErr.message);
    } else {
      setLink(`${window.location.origin}${data.invite_link}`);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Close</span>
          ✕
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-900">
          Invite friends to <span className="font-bold">{groupName}</span>
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Share this link with friends to invite them to your group.
        </p>

        <div className="mt-6">
          {link ? (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share an invite link
              </label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={link}
                  className="flex-1 px-4 py-2 border-2 border-purple-500 rounded-l-md focus:outline-none text-sm"
                />
                <button
                  onClick={copyLink}
                  className="flex-shrink-0 px-4 py-2 bg-white border-2 border-l-0 border-purple-500 rounded-r-md hover:bg-purple-50 transition"
                >
                  Copy
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </>
          ) : (
            <button
              onClick={generateLink}
              disabled={loading}
              className={`w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Generating…' : 'Generate Invite Link'}
            </button>
          )}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
