import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useRouter } from 'next/router';
import { User } from '@/types/User';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    api.get<User | null>('/user/me')
      .then(res => setUser(res.data))   // logged-in user
      .catch(() => setUser(null));      // guest user
  }, []);

  return (
  <div>
    {user == null && (
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
