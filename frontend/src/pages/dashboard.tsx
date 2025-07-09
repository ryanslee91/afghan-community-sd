import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useRouter } from 'next/router';
import { User } from '@/types/User';

export default function Dashboard() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    api.get<User | null>('/user/me')
      .then(res => {
        if (!res.data || typeof res.data !== 'object') {
          setUser(null)
        } else {
          setUser(res.data)          
        }
  })   // logged-in user
      .catch(() => setUser(null));      // guest user
  }, []);

  const handleLogout = async () => {
  try {
    await api.post('/auth/logout'); // ← 서버에서 access_token 쿠키 삭제
    setUser(null);                  // 상태 초기화
    router.push('/login');          // 로그인 페이지로 이동
  } catch (err) {
    console.error('Logout failed', err);
  }
};


  return (
  <div>
    {user === undefined && (
      <div>
        <p>Loading...</p>
      </div>
    )} 
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
        <button onClick={handleLogout}>Logout</button>
      </div>
    )}
  </div>
)};
