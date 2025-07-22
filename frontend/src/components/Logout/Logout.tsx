import { useState } from 'react';
import { useRouter } from 'next/router';
import { logout } from '@/utils/api';

export default function Logout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      await logout();
      // 필요하다면 전역 상태 관리(store, context)도 초기화
      router.push('/login');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logout-container">
      <button onClick={handleLogout} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}