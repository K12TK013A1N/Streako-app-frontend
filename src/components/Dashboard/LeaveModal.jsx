// src/components/Dashboard/LeaveModal.jsx
import React from 'react';

export default function LeaveModal({ groupName, onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        {/* Title & Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Close</span>✕
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          Leave {groupName}?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to leave this group? You’ll lose your streak and will need to be invited back to rejoin.
        </p>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Leaving…' : 'Leave Group'}
          </button>
        </div>
      </div>
    </div>
  );
}
