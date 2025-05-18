import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './components/Auth/SignIn'
import Dashboard from './components/Dashboard/Dashboard'
import useAuth from './hooks/useAuth'
import CreateGroup from './components/Dashboard/CreateGroup'
import GroupDetail from './components/Dashboard/GroupDetail'

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div className="container">Loading…</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/signin" />}
        />
        <Route
          path="/create-group"
          element={user ? <CreateGroup /> : <Navigate to="/signin" />}
        />
        <Route
          path="/group/:groupId"
          element={user ? <GroupDetail /> : <Navigate to="/signin" />}
        />
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/signin'} />} />
      </Routes>
    </BrowserRouter>
  )
}