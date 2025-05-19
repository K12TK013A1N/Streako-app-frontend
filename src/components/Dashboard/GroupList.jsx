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
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Your Groups
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {groups.length === 0 ? (
          <p className="mt-1 text-gray-600">No groups yet. Create or join one!</p>
        ) : (
          <>
            {groups.map(g => (
              <div key={g.id}
                style={{ cursor: 'pointer', margin: '0.5rem 0' }}
                onClick={() => navigate(`/group/${g.id}`)}
                className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-bold text-gray-800">
                    {g.name}
                  </h3>
                  <p className="mt-1 text-gray-600 text-sm">
                    {g.description || 'No description provided.'}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          fillRule="evenodd"
                          d="M5.216 14.37A7 7 0 1114.37 5.216 7 7 0 015.216 14.37zm1.414-1.414a5 5 0 107.07-7.07 5 5 0 00-7.07 7.07z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {g.member_count || "0x00"} members
                    </span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      {g.current_streak ? g.current_streak + " days streak" : "please log today"}
                    </span>
                  </div>
              </div>                
            ))}
          </>
        )}
      </div>
    </div>
  );
}
