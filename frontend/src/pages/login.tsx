// src/pages/login.tsx
import { useRouter } from 'next/router';
import api from '../utils/api';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const router = useRouter();

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