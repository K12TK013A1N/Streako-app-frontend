import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'

export default function CreateGroup() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('You must be signed in')
      setLoading(false)
      return
    }

    const { data, error: dbError } = await supabase.functions.invoke('create_group', {
      body: JSON.stringify({ name })
    })

    setLoading(false)
    if (dbError) {
      setError(dbError.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '2rem' }}>
      <h2>Create New Group</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Group name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          disabled={loading}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }} disabled={loading}>
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  )
}