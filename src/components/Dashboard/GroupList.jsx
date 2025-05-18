import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadGroups() {
      setLoading(true);

      // Ensure user is signed in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      // Invoke the secured function
      const { data, error } = await supabase.functions.invoke('get_user_groups',{
        method: 'GET'
      });
      if (error) {
        console.error('Error fetching user groups:', error);
        setGroups([]);
      } else {
        setGroups(data.groups || []);
      }

      setLoading(false);
    }

    loadGroups();
  }, []);

  if (loading) return <p>Loading groups…</p>;

  return (
    <div>
      <h3>Your Groups</h3>
      {groups.length === 0 ? (
        <p>No groups yet. Create or join one!</p>
      ) : (
        <ul>
          {groups.map(g => (
            <li
              key={g.id}
              style={{ cursor: 'pointer', margin: '0.5rem 0' }}
              onClick={() => navigate(`/group/${g.id}`)}
            >
              {g.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
