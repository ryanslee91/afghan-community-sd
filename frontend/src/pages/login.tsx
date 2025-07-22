import { useRouter } from 'next/router';
import api, { getCurrentUser } from '../utils/api';
import LoginForm from '../components/LoginForm/LoginForm';
import { useEffect, useState } from 'react';
import { User } from '@/types/User';

export default function LoginPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(data => {
        if (data) router.replace('/dashboard');
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, [router]);



  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    try {
      await api.post('/auth/login', { email, password }, { withCredentials: true });
      router.push('/dashboard');
    } catch {
      alert('Login Failed');
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}