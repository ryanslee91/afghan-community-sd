import { useEffect, useState } from 'react';
import api from '../utils/api';
import router from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState<{ id: number; email: string; nickname?: string } | null>(null);

  useEffect(() => {
    api.get('/user/me')
      .then(res => setUser(res.data))   // logged-in user
      .catch(() => setUser(null));      // guest user
  }, []);

  return (
  <div>
    {user === undefined && <p>Loading...</p>}

    {user === null && (
      <div>
        <h2>👋 Welcome!</h2>
        <p>Please log in for more actions.</p>
        <button onClick={() => router.push('/login')}>Log In</button>
      </div>
    )}

    {user && (
      <div>
        <h2>🎉 {user.nickname ?? user.email}, Welcome!</h2>
      </div>
    )}
  </div>
)};
