import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

export default function GroupDetail() {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [session, setSession] = useState(null);

  const [inviteLink, setInviteLink] = useState(null);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  // Fetch session once
  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    }
    loadSession();
  }, []);

  // Fetch members when session or groupId changes
  useEffect(() => {
    if (!session) return;
    async function fetchData() {
      const { data, error } = await supabase.functions.invoke('group_streaks', {
        body: JSON.stringify({ group_id: groupId })
      });
      console.log('[group_streaks] data:', data);
      console.log('[group_streaks] error:', error);
      if (error) console.error(error);
      else setMembers(data.members || []);
      setLoading(false);
    }
    fetchData();
  }, [groupId, session]);

  // Handler to log today
  const handleLogToday = async () => {
    if (!session) return;
    setLoading(true);
    await supabase.functions.invoke('log_streak', {
      body: JSON.stringify({ group_id: groupId })
    });
    // Refresh
    const { data } = await supabase.functions.invoke('group_streaks', {
      body: JSON.stringify({ group_id: groupId })
    });
    setMembers(data.members || []);
    setLoading(false);
  };

  //handler for invite button
  const handleInvite = async () =>{
    setInviting(true);
    setInviteError(null);

    const {data,error} = await supabase.functions.invoke('invite_user', {
      body: JSON.stringify({"group_id":groupId})
    })

    setInviting(false);

    if(error){
      console.error('invite_user error', error);
      setInviteError(error.message)
    }else{
      const fullUrl = `${window.location.origin}${data.invite_link}`;
      setInviteLink(fullUrl);
    }
  };

  //copy to clipboard
  const copyLink = ()=>{
    navigator.clipboard.writeText(fullUrl);
  }

  if (loading) return <div className="container">Loading members…</div>;

  const userId = session.user.id;
  const todayStr = new Date().toISOString().slice(0,10);

  return (
    <div className="container">
      <h2>Group Members & Streaks</h2>
      {/*Invite section*/}
      <div style={{ margin: '1rem 0', border: '1px solid #ddd', padding: '0.75rem' }}>
        <button
          onClick={handleInvite}
          disabled={inviting}
          style={{ padding: '0.5rem 1rem' }}
        >
          {inviting ? 'Generating Link…' : 'Invite Member'}
        </button>

        {inviteError && (
          <p style={{ color: 'red', marginTop: '0.5rem' }}>{inviteError}</p>
        )}

        {inviteLink && (
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              value={inviteLink}
              style={{ flex: 1, marginRight: '0.5rem', padding: '0.5rem' }}
            />
            <button onClick={copyLink} style={{ padding: '0.5rem' }}>
              Copy
            </button>
          </div>
        )}
      </div>

      <button onClick={() => setShowAll(!showAll)} style={{ margin: '1rem 0' }}>
        {showAll ? 'Show Last 10 Days Only' : 'Show Full History'}
      </button>
      {members.map(m => {
        const dates = m.last_10_days.map(e => e.entry_date);
        const loggedDates = new Set(dates);
        const hasLoggedToday = loggedDates.has(todayStr);
        return (
          <div key={m.user.id} style={{ marginBottom: '1.5rem' }}>
            <strong>{m.user.name || m.user.email}</strong>
            <p>Current Streak: {m.current_streak} days</p>
            {!hasLoggedToday && m.user.id === userId && (
              <button onClick={handleLogToday} style={{ marginBottom: '0.5rem' }}>
                Log Today's Entry
              </button>
            )}
            <ul>
              {(showAll ? m.last_10_days : m.last_10_days).map(e => (
                <li key={e.entry_date}>
                  {e.entry_date}: {e.completed ? '✓' : '—'}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}