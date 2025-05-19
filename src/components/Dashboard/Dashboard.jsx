import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import TextCarousel from './TextCarousel'
import GroupList from './GroupList'
import StreakHistory from './StreakHistory'

export default function Dashboard() {
  const { user } = useAuth()
  const [selectedGroup, setSelectedGroup] = useState(null)
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-1/3 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-1/4 w-80 h-80 bg-purple-200 rounded-full filter blur-2xl opacity-30 animate-pulse"></div>
      {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-purple-600">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </h1>
              <p className="mt-1 text-gray-600">
                Track your streaks and achieve your goals together.
              </p>
            </div>
            <button onClick={() => navigate('/create-group')}
            className="mt-4 md:mt-0 inline-flex items-center bg-purple-600 text-white font-medium px-4 py-2 rounded-md hover:bg-purple-700 transition">
              + Create New Group
            </button>
          </div>
        <GroupList onSelect={setSelectedGroup} />
        {selectedGroup && <StreakHistory groupId={selectedGroup.id} />}
      </div>
    </div> 
  )
}