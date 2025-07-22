// src/components/Logout/Logout.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { logout } from '@/utils/api';
import { clearUser } from '@/store/authSlice';
import type { AppDispatch } from '@/store';

export default function Logout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) 서버에 로그아웃 요청 (쿠키 삭제)
      await logout();

      // 2) 전역 상태 초기화
      dispatch(clearUser());

      // 3) 로그인 페이지로 이동
      router.push('/login');
    } catch (err) {
      // axios 혹은 JS 에러 메시지를 화면에 표시
      setError((err as Error).message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logout-container">
      <button onClick={handleLogout} disabled={loading}>
        {loading ? 'Logging out…' : 'Logout'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}