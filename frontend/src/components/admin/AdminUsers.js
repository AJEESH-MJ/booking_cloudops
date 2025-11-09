import React, { useEffect, useState } from 'react';
import api from '../../utils/api.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get('/admin/users').then(r => setUsers(r.data)).catch(console.error); }, []);
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Users</h2>
      <div className="space-y-2">
        {users.map(u => (
          <div key={u._id} className="p-3 border rounded flex justify-between">
            <div>
              <div className="font-medium">{u.name || u.email}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </div>
            <div className="text-sm text-gray-500">{u.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
