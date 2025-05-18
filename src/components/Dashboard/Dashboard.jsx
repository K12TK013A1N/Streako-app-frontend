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
    <div className="container">
      <h1 style={{ margin: '1rem 0' }}>
        Hey {user?.user_metadata?.full_name || user?.email} 👋
      </h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
        <h1>Hey {user?.user_metadata?.full_name || user?.email} 👋</h1>
        <button onClick={() => navigate('/create-group')} style={{ padding: '0.5rem 1rem' }}>
          Create Group
        </button>
      </div>
      <TextCarousel />
      <GroupList onSelect={setSelectedGroup} />
      {selectedGroup && <StreakHistory groupId={selectedGroup.id} />}
    </div>
  )
}