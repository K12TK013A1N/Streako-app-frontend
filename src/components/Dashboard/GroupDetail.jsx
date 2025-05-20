import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import useAuth from "../../hooks/useAuth"
import InviteModal from './InviteModal';
import LeaveModal from './LeaveModal';

export default function GroupDetail() {
  const { groupId } = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();

  const [group, setGroup]       = useState(null);
  const [members, setMembers] = useState([]);
  const [entriesMap, setEntriesMap] = useState({});
  const [show30, setShow30]     = useState(false);
  const [loading, setLoading]   = useState(true);
  const [logging, setLogging]   = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Fetch session once
  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
    }
    loadSession();
  }, []);

  // Helper to format dates as 'Mon DD'
  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

  useEffect(()=>{
    async function load() {
      setLoading(true);
      // 1) Fetch group info & current streak
      const { data: { groups } } = await supabase.functions.invoke('get_user_groups',{
        method: "GET"
      });
      const g = groups.find(g => g.id === groupId);
      setGroup(g);
      console.log(">>>group", g);

      // 2) Fetch detailed streaks for each member
      const { data: membersRes } = await supabase.functions.invoke('group_streaks', {
        body: JSON.stringify({ group_id: groupId })
      });
      setMembers(membersRes.members);
      console.log("members: ",membersRes.members);

      // 3) Build entriesMap for quick lookup
      const now = new Date();
      const lookback = show30 ? 30 : 7;
      const start = new Date(now);
      start.setDate(now.getDate() - (lookback - 1));
      const cutoff = start.toISOString().slice(0,10);

      const map = {};
      for (const m of membersRes.members) {
        const { data:rows } = await supabase
          .from('streak_entries')
          .select('entry_date')
          .eq('membership_id',m.membership_id)
          .gte('created_at', cutoff)
        map[m.membership_id] = new Set(rows.map(r => r.entry_date));
      }
      console.log(">>>map: ", map);
      setEntriesMap(map);
      setLoading(false);
    }
    load();
  },[groupId, show30])

  // Determine if the current user already logged today
  const todayStr = new Date().toISOString().slice(0, 10);
  // Find this user’s membership_id
  const myMembership = members.find(m => m.user.id === user.id);
  const mySet = myMembership
    ? entriesMap[myMembership.membership_id] || new Set()
    : new Set();
  const hasLoggedToday = mySet.has(todayStr);

  const handleLog = async () => {
    if (hasLoggedToday) return;              // guard
    setLogging(true);
    await supabase.functions.invoke('log_streak', {
      body: JSON.stringify({ group_id: groupId })
    });
    // Refresh the entriesMap
    const { data: reload } = await supabase.functions.invoke('group_streaks', {
      body: JSON.stringify({ group_id: groupId })
    });
    const newMap = {};
    for (const m of reload.members) {
      newMap[m.membership_id] = new Set(
        m.last_10_days.map(e => e.entry_date)
      );
    }
    setEntriesMap(newMap);
    setLogging(false);
  };

  if (loading) return <div className="container p-6">Loading…</div>;
  if (!group)   return <div className="container p-6">Group not found</div>;

  // build date columns
  const days = show30 ? 30 : 7;
  const today = new Date();
  const dates = Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    return d.toISOString().slice(0,10);
  });

  // If user decides to confirm the leave
  const handleLeaveConfirm = async () => {
    setLeaving(true);
    const { error } = await supabase.functions.invoke('leave_group', {
      body: JSON.stringify({ group_id: groupId }),
    });
    setLeaving(false);
    if (error) {
      alert('Failed to leave: ' + error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="container mx-auto px-6 pt-8">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-gray-800">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Groups
        </button>

        <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            <p className="mt-1 text-gray-600">{group.description}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              {group.current_streak} day streak
            </span>
            <button
              onClick={() => setShowInvite(true)}
              className="inline-flex items-center px-3 py-1 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-6-6h.01M12 6v12" />
              </svg>
              Invite Friends
            </button>
            {/* Leave Group */}
            <button
              onClick={() => setShowLeave(true)}
              disabled={leaving}
              className={`inline-flex items-center px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition ${
                leaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              Leave Group
            </button>
          </div>
        </div>

        {/* Members */}
        <p className="mt-6 font-semibold text-gray-800">Group Members ({members.length})</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {members.map(m => (
            <span key={m.user.id} className="px-3 py-1 bg-white rounded-full shadow-sm text-gray-700 text-sm">
              {m.user.name || m.user.email}
            </span>
          ))}
        </div>

        {/* Streak History */}
        <div className="mt-8 bg-white rounded-xl shadow p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Streak History</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLog}
                disabled={logging || hasLoggedToday}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {hasLoggedToday ? 'Already Logged' : logging ? 'Logging…' : 'Log Today’s Entry'}
              </button>
              <label className="flex items-center space-x-2 text-gray-700">
                <span className="text-sm">Showing {days} days</span>
                <input
                  type="checkbox"
                  checked={show30}
                  onChange={() => setShow30(s => !s)}
                  className="h-5 w-10 rounded-full bg-gray-200 checked:bg-purple-500 transition"
                />
              </label>
            </div>
          </div>

          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left text-gray-600 text-sm">
                <th className="pr-4">Member</th>
                {dates.map(d => (
                  <th key={d} className="px-2">{fmt(d)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {members.map(m => {
                const set = entriesMap[m.membership_id] || new Set();
                return (
                  <tr key={m.user.id} className="border-t">
                    <td className="py-2 pr-4 font-medium">{m.user.name || m.user.email}</td>
                    {dates.map(d => (
                      <td key={d} className="px-2 py-2">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            set.has(d) ? 'bg-purple-500' : 'bg-gray-300'
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showInvite && (
       <InviteModal
         groupId={groupId}
         groupName={group.name}
         onClose={() => setShowInvite(false)}
       />
     )}
      {/* Leave Confirmation Modal */}
      {showLeave && (
        <LeaveModal
          groupName={group?.name}
          loading={leaving}
          onCancel={() => setShowLeave(false)}
          onConfirm={handleLeaveConfirm}
        />
      )}
    </div>
  );
}