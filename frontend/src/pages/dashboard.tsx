import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Logout from '@/components/Logout/Logout';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Dashboard() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);

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
        <Logout />
      </div>
    )}
  </div>
)};
